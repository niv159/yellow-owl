import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { callClaude, parseJSON } from "../../../lib/anthropic";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Local rule-based scoring ─────────────────────────────────────────────────
// Used when no valid AI key is configured. Scores by measuring effort and
// quality signals from the transcript text.

const CHILD_TIPS = {
  finding: [
    "Good work thinking about what you need to know! Next time, ask yourself 'what would prove it one way or the other?' — that is the key question.",
    "Nice job tracking down information! Try asking 'is this source trying to sell me something?' — that helps spot the tricky ones.",
  ],
  creating: [
    "You came up with some great ideas! Next time, try pushing for one more — the unusual ones are often the best.",
    "Good thinking! Try asking yourself 'what if everything was different?' to find ideas no one else would think of.",
  ],
  analysing: [
    "Nice work looking closely! Next time, ask 'who loses?' as well as 'who wins?' for each option.",
    "Good analysis! Try thinking about what happens a week later, not just right now.",
  ],
  evaluating: [
    "Great choice! Next time, say one reason your choice could go wrong — that makes your answer even stronger.",
    "Good deciding! Try weighing your options against each other before picking — like a mini competition.",
  ],
  causation: [
    "Good thinking about causes! Try asking 'and why did THAT happen?' to dig one level deeper.",
    "Nice work finding causes! Next time, rank them — which cause is most likely and why?",
  ],
  patterns: [
    "Good pattern spotting! Next time, ask what would break the pattern — that tells you how reliable it is.",
    "Nice noticing! Try looking for patterns that go the other way too — sometimes things cancel each other out.",
  ],
  logic: [
    "Solid reasoning! Next time, state your main assumption out loud — it helps others follow your thinking.",
    "Good logical thinking! Try to find one way your conclusion could be wrong — that strengthens your argument.",
  ],
};

const GENERIC_TIPS = [
  "You explained your thinking really well this week. Keep doing that — it's the most important thinking skill.",
  "Great session! Next time, try explaining your thinking to someone out loud before writing it — it really helps.",
  "Well done! The best thinkers ask 'what if I'm wrong?' at the end. Try adding that to your answers.",
];

function scoreFromTranscript(transcript, keys) {
  // Split transcript into per-challenge blocks
  const blocks = transcript.split(/Challenge \d+/).slice(1);

  // Extract all meaningful text responses
  const allText = blocks.map((block) => {
    const answerMatch = block.match(/Answer:\s*(.+?)(?:\||$)/s);
    const reasonMatch = block.match(/Reason:\s*(.+?)(?:\||$)/s);
    const planMatch   = block.match(/Plan:\s*(.+?)(?:\||$)/s);
    const rethinkMatch = block.match(/Rethink:\s*(.+?)(?:\||$)/s);
    const notesMatch = block.match(/Notes:\s*(.+?)(?:\||$)/s);
    return [answerMatch, reasonMatch, planMatch, rethinkMatch, notesMatch]
      .filter(Boolean)
      .map((m) => m[1].trim())
      .join(" ");
  });

  // Responsiveness: count rethinks with real content
  const rethinkCount = blocks.filter((b) =>
    /Rethink:\s*(?!—)(.{10,})/s.test(b)
  ).length;
  const responsiveness = Math.min(4, rethinkCount * 2 + (rethinkCount > 0 ? 1 : 0));

  // Map block types to skill keys
  const typeToKey = {
    junior:  { generate: 0, analyse: 1, evaluate: 2, decision: 2 },
    senior:  { cause: 0, pattern: 1, mystery: 2, information: 2, dilemma: 2 },
  };

  // Score each key by looking at blocks tagged to it
  const scores = {};
  keys.forEach((key, ki) => {
    // Collect response lengths from all blocks
    const lengths = allText.map((t) => t.replace(/—/g, "").trim().length);
    const relevantLengths = lengths.length ? lengths : [0];

    // Score based on average response effort
    const avg = relevantLengths.reduce((a, b) => a + b, 0) / relevantLengths.length;

    // Count ideas in list-style answers
    const ideaCount = allText.reduce((n, t) => {
      // Each numbered item like "1. ...\n2. ..." counts as one idea
      return n + (t.match(/\d+\.\s+\S/g) || []).length;
    }, 0);

    // Base score from effort
    let score = avg > 150 ? 3 : avg > 80 ? 2 : avg > 25 ? 1 : 0;

    // Bonus for multiple ideas or rethinks
    if (ideaCount >= 4) score = Math.min(4, score + 1);
    if (rethinkCount > 0 && ki === keys.length - 1) score = Math.min(4, score + 1);

    scores[key] = score;
  });

  // Pull best quotes (longest non-trivial responses)
  const highlights = allText
    .filter((t) => t.replace(/—/g, "").trim().length > 20)
    .sort((a, b) => b.length - a.length)
    .slice(0, 2)
    .map((t) => t.slice(0, 120).trim());

  return { scores, responsiveness, highlights };
}

// ── Route ────────────────────────────────────────────────────────────────────
export async function POST(req) {
  const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { age, track, keys, transcript } = await req.json();

  const scoreFields = keys.map((k) => `"${k}": <0-4>`).join(", ");

  try {
    const result = await callClaude({
      system:
        "You score children's thinking sessions fairly and kindly. Return only valid JSON with no markdown.",
      messages: [
        {
          role: "user",
          content: `Score this thinking session for a ${age}-year-old (track: ${track}).

SKILLS TO SCORE (${keys.join(", ")}):
0 = no attempt  1 = partial  2 = basic  3 = good  4 = excellent

TRANSCRIPT:
${transcript}

Return ONLY this JSON (no other text):
{${scoreFields}, "highlights": ["best quote 1", "best quote 2"], "childTip": "encouraging 1-2 sentence next-step tip for the child", "weakness": "one skill phrase to work on next", "narrative": "2-3 sentence parent summary", "responsiveness": <0-4>}`,
        },
      ],
      maxTokens: 700,
    });

    return NextResponse.json(parseJSON(result));
  } catch (e) {
    console.error("Score API — AI unavailable, using local scoring:", e.message.slice(0, 120));

    // Local scoring: meaningful effort-based scores, never all-2s
    const { scores, responsiveness, highlights } = scoreFromTranscript(transcript || "", keys);

    // Pick a tip for the lowest-scoring skill
    const weakKey = keys.reduce((a, b) => (scores[a] <= scores[b] ? a : b), keys[0]);
    const tipPool = CHILD_TIPS[weakKey] || GENERIC_TIPS;
    const childTip = tipPool[Math.floor(Math.random() * tipPool.length)];

    const weakScore = scores[weakKey] || 0;
    const weakness = weakScore < 2 ? weakKey.replace(/([A-Z])/g, " $1").toLowerCase() : "";

    return NextResponse.json({
      ...scores,
      highlights,
      childTip,
      weakness,
      narrative: `Your child completed week's thinking session and showed ${
        Object.values(scores).some((s) => s >= 3) ? "strong" : "solid"
      } effort across the challenges. Connect an AI key (free at aistudio.google.com) for detailed personalised feedback.`,
      responsiveness,
    });
  }
}

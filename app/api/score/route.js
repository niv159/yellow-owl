import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { callClaude, parseJSON } from "../../../lib/anthropic";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Per-skill rubrics ─────────────────────────────────────────────────────────
// Embedded verbatim in the AI prompt. Each level describes observable behaviour,
// not abstract quality labels like "good" or "excellent".

const RUBRICS = {
  finding:
    "4=chose the most decision-relevant piece of information AND explained why it outweighs the alternatives; 3=correct choice with partial reasoning that doesn't contrast alternatives; 2=plausible but secondary choice (e.g. social or aesthetic factor over a functional one); 1=poor choice but some reasoning exists; 0=blank or off-topic",
  creating:
    "4=4+ distinct ideas spanning genuinely different approaches, not just variations on one theme; 3=3-4 ideas, mostly varied; 2=2-3 ideas that are all obvious or all similar; 1=one idea or placeholder text; 0=blank",
  analysing:
    "4=names a criterion explicitly, applies it to BOTH options, and acknowledges a trade-off; 3=both sides addressed but the criterion is implicit; 2=only one option discussed, or preference expressed without any comparison; 1=preference stated with no comparison at all; 0=blank",
  evaluating:
    "4=clear choice + criteria-based reasoning + acknowledges the strongest counter-argument + curveball rethink shows genuine reconsideration (not a restatement); 3=clear choice + solid reasoning but limited trade-off awareness; 2=choice made but reasoning is purely preference-based ('I just think…'); 1=choice stated without any reasoning; 0=blank",
  causation:
    "4=identifies the root or systemic cause AND explains the mechanism (why this cause produces this specific effect), distinguishes cause from symptoms; 3=correct cause identified but mechanism only partially explained; 2=surface-level or symptomatic cause chosen — a what, not a why; 1=spurious or coincidental factor cited as the cause; 0=blank",
  patterns:
    "4=names the pattern, explains the mechanism behind it, and identifies what would confirm or falsify it; 3=pattern named with partial explanation of why it exists; 2=describes what they observe without naming the underlying pattern; 1=vague observation with no pattern identified; 0=blank",
  logic:
    "4=valid reasoning chain with no logical gaps, correctly identifies what CAN and CANNOT be concluded from the given premises; 3=mostly valid reasoning with one minor gap; 2=reasoning present but contains a clear logical error (over-generalising, false equivalence, affirming the consequent, etc.); 1=assertion with no reasoning chain; 0=blank",
};

// Step number → skill key (matches TRACKS in page.jsx)
const STEP_TO_KEY = {
  4: "finding", 5: "creating", 6: "analysing", 7: "evaluating",
  9: "causation", 10: "patterns", 12: "logic",
};

// Format one challenge + response block for the AI prompt
function formatChallenge(c, i) {
  const r = c.response || {};
  const parts = [];
  if (r.choice) parts.push(`Chose: ${r.choice}`);
  if (r.reason?.trim()) parts.push(`Reason: ${r.reason.trim()}`);
  if (r.answer?.trim()) parts.push(`Answer: ${r.answer.trim()}`);
  if (r.ideas?.some(Boolean)) parts.push(`Ideas: ${r.ideas.filter(Boolean).join(" / ")}`);
  if (r.curveball?.trim()) parts.push(`Curveball shown: ${r.curveball.trim()}`);
  if (r.revised?.trim()) parts.push(`Rethink: ${r.revised.trim()}`);
  const skillKey = STEP_TO_KEY[c.step] || "evaluating";
  return `Challenge ${i + 1} [skill: ${skillKey} · step ${c.step} · type: ${c.type}]
Scenario: ${c.scenario}
Task: ${c.prompt}
Response: ${parts.join(" | ") || "(no response given)"}`;
}

// ── Local fallback scoring ────────────────────────────────────────────────────
// Used when the AI key is absent or the call fails.

const CHILD_TIPS = {
  finding: [
    "Good work thinking about what you need to know! Next time, ask yourself: 'what would prove it one way or the other?' — that is the key question.",
    "Nice job tracking down information! Try asking 'is this source trying to sell me something?' — that helps spot the tricky ones.",
  ],
  creating: [
    "You came up with some good ideas! Next time, push for one more — the unusual ones are often the best.",
    "Good thinking! Try asking yourself 'what if everything was completely different?' to find ideas no one else would think of.",
  ],
  analysing: [
    "Nice work looking closely! Next time, ask 'who loses?' as well as 'who wins?' for each option.",
    "Good analysis! Try thinking about what happens a week later, not just right now.",
  ],
  evaluating: [
    "Great choice! Next time, name one reason your choice could go wrong — that makes your answer even stronger.",
    "Good deciding! Try weighing your options against each other before picking — like a mini competition.",
  ],
  causation: [
    "Good thinking about causes! Try asking 'and why did THAT happen?' to dig one level deeper.",
    "Nice work finding causes! Next time, rank them — which cause is most likely, and why?",
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

function localScore(challenges, keys) {
  const scores = {};
  keys.forEach((key) => {
    const relevant = challenges.filter((c) => (STEP_TO_KEY[c.step] || "evaluating") === key);
    if (!relevant.length) { scores[key] = 2; return; }
    let best = 0;
    for (const c of relevant) {
      const r = c.response || {};
      const textLen = [r.reason, r.answer, r.revised, ...(r.ideas || [])]
        .filter(Boolean).join(" ").trim().length;
      const hasCurveball = r.curveball && r.revised?.trim().length > 10;
      const ideaCount = (r.ideas || []).filter(Boolean).length;
      let s = textLen > 180 ? 3 : textLen > 80 ? 2 : textLen > 20 ? 1 : 0;
      if (ideaCount >= 4) s = Math.min(4, s + 1);
      if (hasCurveball) s = Math.min(4, s + 1);
      best = Math.max(best, s);
    }
    scores[key] = best;
  });

  const rethinkCount = challenges.filter(
    (c) => c.response?.revised?.trim().length > 10
  ).length;
  const responsiveness = Math.min(4, rethinkCount * 2);

  const allText = challenges.flatMap((c) => {
    const r = c.response || {};
    return [r.reason, r.answer, r.revised, ...(r.ideas || [])].filter(Boolean);
  });
  const highlights = allText
    .filter((t) => t.trim().length > 20)
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

  const { age, track, keys, challenges, transcript } = await req.json();

  const scoreFields = keys.map((k) => `"${k}": <0-4>`).join(", ");

  // Only include rubrics for the skills present in this session
  const rubricLines = keys
    .map((k) => `${k}: ${RUBRICS[k] || "0=blank, 1=minimal, 2=partial, 3=good, 4=excellent"}`)
    .join("\n");

  // Structured challenges are preferred; fall back to raw transcript
  const challengeSection = Array.isArray(challenges) && challenges.length
    ? challenges.map(formatChallenge).join("\n\n")
    : `Transcript:\n${transcript || "(empty)"}`;

  const prompt = `Score this thinking session for a ${age}-year-old (${track} track).
Assess each challenge response strictly against the rubric for its skill. A weak response should score 0-1 even if the child showed effort.

RUBRICS:
${rubricLines}

CHALLENGES:
${challengeSection}

RESPONSIVENESS: How many curveball rethinks showed genuine reconsideration — not just restating the original?
0=none engaged, 1=one partial attempt, 2=one genuine change of mind, 3=two genuine, 4=multiple thoughtful rethinks.

Return ONLY valid JSON, no markdown:
{${scoreFields}, "highlights": ["most insightful quote from any response (max 120 chars)", "second best quote or empty string"], "childTip": "1-2 sentence tip written directly to the child — encouraging and specific to what they did this week", "weakness": "one short skill phrase to work on next", "narrative": "2-3 sentences for parents summarising the quality of thinking shown this week", "responsiveness": <0-4>}`;

  try {
    const result = await callClaude({
      system:
        "You score children's thinking sessions fairly and precisely. Apply rubrics exactly as given — do not inflate scores for effort alone. Return only valid JSON with no markdown.",
      messages: [{ role: "user", content: prompt }],
      maxTokens: 700,
    });
    return NextResponse.json(parseJSON(result));
  } catch (e) {
    console.error("Score API — AI unavailable, using local scoring:", e.message.slice(0, 120));

    const { scores, responsiveness, highlights } = localScore(challenges || [], keys);
    const weakKey = keys.reduce((a, b) => (scores[a] <= scores[b] ? a : b), keys[0]);
    const tipPool = CHILD_TIPS[weakKey] || [];
    const childTip =
      tipPool[Math.floor(Math.random() * tipPool.length)] ||
      "You explained your thinking really well this week. Keep doing that — it is the most important thinking skill.";
    const weakness = (scores[weakKey] || 0) < 2 ? weakKey : "";

    return NextResponse.json({
      ...scores,
      highlights,
      childTip,
      weakness,
      narrative: `Your child completed this week's thinking session and showed ${
        Object.values(scores).some((s) => s >= 3) ? "strong" : "solid"
      } effort across the challenges. Connect an AI key for detailed personalised feedback.`,
      responsiveness,
    });
  }
}

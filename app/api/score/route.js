import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { callClaude, parseJSON } from "../../../lib/anthropic";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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
    console.error("Score API error:", e.message);
    // Return a safe fallback so the app never hangs
    const fallback = {};
    (keys || []).forEach((k) => (fallback[k] = 2));
    return NextResponse.json({
      ...fallback,
      highlights: [],
      childTip: "Great effort this week! Keep explaining your thinking out loud — that is the best way to grow.",
      weakness: "explaining reasoning",
      narrative: "Your child completed their thinking session this week. Detailed AI feedback will be available once a valid Gemini API key is configured.",
      responsiveness: 2,
      _fallback: true,
    });
  }
}

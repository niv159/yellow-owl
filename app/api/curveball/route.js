import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { callClaude, parseJSON } from "../../../lib/anthropic";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const FALLBACKS = [
  "What if one of the facts you used turned out to be wrong — would you still choose the same thing?",
  "What if the most important person affected by this disagreed with you?",
  "What if you only had half the time or resources you assumed — does your answer still work?",
  "What if the opposite happened instead — what would you do then?",
];

export async function POST(req) {
  const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { age, scenario, prompt, options, answer } = await req.json();

  try {
    const result = await callClaude({
      system:
        "You write follow-up challenges for children that make them think harder. Keep it short, friendly, and age-appropriate. Return only valid JSON.",
      messages: [
        {
          role: "user",
          content: `Child age ${age}.
Scenario: "${scenario}"
Prompt: "${prompt}"${options ? `\nOptions: ${JSON.stringify(options)}` : ""}
Their answer: "${answer}"

Write ONE short friendly sentence that introduces a new fact or twist making their answer less certain. Simple words. Don't reveal the right answer.

Return ONLY JSON: {"curveball": "your one sentence here"}`,
        },
      ],
      maxTokens: 150,
    });

    return NextResponse.json(parseJSON(result));
  } catch (e) {
    console.error("Curveball API error:", e.message);
    const cb = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return NextResponse.json({ curveball: cb });
  }
}

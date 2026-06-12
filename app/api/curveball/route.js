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

  const { age, scenario, prompt, options, answer } = await req.json();

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
}

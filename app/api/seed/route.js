import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateBank } from "../../../lib/bankgen";

// Vercel Pro allows up to 60s; Hobby plan is limited to 10s.
// If this times out on Hobby, just call the URL again — it picks up where it left off.
export const maxDuration = 60;

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await generateBank(admin);
  return NextResponse.json({ ok: true, ...result });
}

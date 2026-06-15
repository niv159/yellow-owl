import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePasscode() {
  let code = "";
  for (let i = 0; i < 4; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const { phone } = body;
  const cleanPhone = (phone || "").trim();

  if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  const { data: family } = await admin.from("families").select("*").eq("phone", cleanPhone).maybeSingle();
  if (!family) {
    return NextResponse.json({ error: "No account found for this number." }, { status: 404 });
  }

  // Generate a new unique passcode
  let newPasscode;
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = generatePasscode();
    const { data: taken } = await admin.from("families").select("id").eq("passcode", candidate).maybeSingle();
    if (!taken || taken.id === family.id) { newPasscode = candidate; break; }
  }
  if (!newPasscode) {
    return NextResponse.json({ error: "Could not generate a passcode. Please try again." }, { status: 500 });
  }

  // Update the Supabase auth user's email and password to match the new passcode
  const { error: authErr } = await admin.auth.admin.updateUserById(family.user_id, {
    email: `${newPasscode.toLowerCase()}@yellowowl.app`,
    password: newPasscode,
  });
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 500 });

  // Update the families record
  await admin.from("families").update({ passcode: newPasscode }).eq("id", family.id);

  // TODO: send SMS via Twilio
  // await sendSMS(cleanPhone, `Your new Yellow Owl passcode is: ${newPasscode}\nYour old passcode no longer works.`);

  return NextResponse.json({ passcode: newPasscode });
}

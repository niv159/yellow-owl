import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Letters/digits chosen to avoid look-alike characters (I/O/0/1)
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const DIGITS  = "23456789";

function generatePasscode() {
  const chars = [];
  for (let i = 0; i < 3; i++) chars.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  for (let i = 0; i < 3; i++) chars.push(DIGITS[Math.floor(Math.random() * DIGITS.length)]);
  // Fisher-Yates shuffle
  for (let i = 5; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const { phone, parentName } = body;
  const cleanPhone = (phone || "").trim();

  if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  // Return existing passcode if this phone is already registered
  const { data: existing } = await admin.from("families").select("passcode").eq("phone", cleanPhone).single();
  if (existing) {
    return NextResponse.json({ passcode: existing.passcode, existing: true });
  }

  // Generate a unique passcode (collisions are astronomically unlikely but handled)
  let passcode;
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = generatePasscode();
    const { data: taken } = await admin.from("families").select("id").eq("passcode", candidate).maybeSingle();
    if (!taken) { passcode = candidate; break; }
  }
  if (!passcode) {
    return NextResponse.json({ error: "Could not generate a passcode. Please try again." }, { status: 500 });
  }

  // Create a Supabase auth user whose email encodes the passcode
  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email: `${passcode.toLowerCase()}@yellowowl.app`,
    password: passcode,
    email_confirm: true,
    user_metadata: { phone: cleanPhone, parent_name: parentName || "" },
  });
  if (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: 500 });
  }

  // Record the mapping so we can look up by phone later
  await admin.from("families").insert({
    phone: cleanPhone,
    passcode,
    parent_name: parentName || "",
    user_id: created.user.id,
  });

  // TODO: send SMS via Twilio or similar
  // await sendSMS(cleanPhone, `Your Yellow Owl passcode is: ${passcode}\nUse it every time you log in.`);

  return NextResponse.json({ passcode });
}

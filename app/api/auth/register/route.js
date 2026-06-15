import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// 32-char alphabet — no look-alike characters (I, O, 0, 1)
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePasscode() {
  let code = "";
  for (let i = 0; i < 4; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const { phone, childName, childAge, childInterest } = body;
  const cleanPhone = (phone || "").trim();

  if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (!childName || !String(childName).trim()) {
    return NextResponse.json({ error: "Please enter the child's name." }, { status: 400 });
  }

  // Return existing passcode if this phone is already registered
  const { data: existing } = await admin.from("families").select("passcode").eq("phone", cleanPhone).maybeSingle();
  if (existing) {
    return NextResponse.json({ passcode: existing.passcode, existing: true });
  }

  // Generate a unique 4-character passcode
  let passcode;
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = generatePasscode();
    const { data: taken } = await admin.from("families").select("id").eq("passcode", candidate).maybeSingle();
    if (!taken) { passcode = candidate; break; }
  }
  if (!passcode) {
    return NextResponse.json({ error: "Could not generate a passcode. Please try again." }, { status: 500 });
  }

  // Create Supabase auth user — email encodes the passcode so login only needs the code
  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email: `${passcode.toLowerCase()}@yellowowl.app`,
    password: passcode,
    email_confirm: true,
    user_metadata: { phone: cleanPhone },
  });
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 500 });

  const userId = created.user.id;
  const track = Number(childAge) <= 11 ? "junior" : "senior";

  // Create the child record immediately at registration
  const { data: childRecord, error: childErr } = await admin
    .from("children")
    .insert({
      parent_id: userId,
      name: String(childName).trim(),
      age: Number(childAge) || 11,
      track,
      interest: childInterest || "Space",
    })
    .select()
    .single();

  if (childErr) {
    await admin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Could not create child profile." }, { status: 500 });
  }

  // Record consent
  await admin.from("consent").insert({
    parent_id: userId,
    child_id: childRecord.id,
    agreed: true,
    terms_version: "v1",
  });

  // Record the phone → passcode → user mapping
  await admin.from("families").insert({ phone: cleanPhone, passcode, user_id: userId });

  // TODO: send SMS via Twilio
  // await sendSMS(cleanPhone, `Your Yellow Owl passcode is: ${passcode}`);

  return NextResponse.json({ passcode });
}

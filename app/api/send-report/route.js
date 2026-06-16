import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { formatWhatsAppMessage } from "../../../lib/formatReport";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://yellowowl.app";

// A session is "complete enough" to send if at least 3/5 challenges have real responses.
function isMeaningfulResponse(r) {
  return !!(
    (r.choice && r.choice.trim()) ||
    (r.reason && r.reason.trim().length > 5) ||
    (r.answer && r.answer.trim().length > 5) ||
    (r.ideas && r.ideas.some((i) => i && i.trim()))
  );
}

export async function POST(req) {
  const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
  const { data: { user }, error: authErr } = await admin.auth.getUser(token);
  if (authErr || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { sessionId, childId, childName, week, challenges } = await req.json();

  if (!sessionId || !challenges || !Array.isArray(challenges)) {
    return NextResponse.json({ error: "missing data" }, { status: 400 });
  }

  // Completion guard: need at least 3 challenges with real responses
  const meaningfulCount = challenges.filter((c) =>
    isMeaningfulResponse(c.response || {})
  ).length;

  if (meaningfulCount < 3) {
    return NextResponse.json({
      sent: false,
      reason: `only ${meaningfulCount}/5 challenges answered`,
    });
  }

  // Look up parent phone number via families table
  const { data: family } = await admin
    .from("families")
    .select("phone")
    .eq("user_id", user.id)
    .maybeSingle();

  const shareUrl = `${APP_URL}/share/${sessionId}`;

  // Get child_tip from the saved session
  const { data: session } = await admin
    .from("sessions")
    .select("child_tip")
    .eq("id", sessionId)
    .maybeSingle();

  const message = formatWhatsAppMessage({
    childName,
    week,
    challenges,
    childTip: session?.child_tip || "",
    shareUrl,
  });

  // ── Twilio WhatsApp send (stubbed until credentials are configured) ──────────
  const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"

  if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM && family?.phone) {
    const to = `whatsapp:${family.phone.replace(/\s/g, "")}`;
    try {
      const body = new URLSearchParams({ From: TWILIO_FROM, To: to, Body: message });
      const resp = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64"),
          },
          body: body.toString(),
        }
      );
      const result = await resp.json();
      if (result.error_code) {
        console.error("Twilio error:", result.error_message);
        return NextResponse.json({ sent: false, reason: "twilio error", shareUrl });
      }
      return NextResponse.json({ sent: true, shareUrl });
    } catch (e) {
      console.error("Twilio send failed:", e.message);
      return NextResponse.json({ sent: false, reason: "twilio exception", shareUrl });
    }
  }

  // No Twilio credentials — log the message for development visibility
  console.log("\n══════════ WhatsApp (STUB) ══════════");
  console.log("To:", family?.phone || "(phone not found)");
  console.log("Share URL:", shareUrl);
  console.log("────────────────────────────────────");
  console.log(message);
  console.log("════════════════════════════════════\n");

  return NextResponse.json({ sent: false, reason: "twilio not configured", shareUrl });
}

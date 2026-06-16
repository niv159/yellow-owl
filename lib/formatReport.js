// Helpers for building the parent portfolio / WhatsApp message.

const TYPE_LABEL = {
  research: "Finding information", generate: "Ideas explosion", analyse: "Looking closely",
  evaluate: "Big decision", decision: "Your call", cause: "Why though?",
  pattern: "Spot it", mystery: "Crack the case", information: "Who to trust?", dilemma: "Real or not?",
};

function hasResponse(ch) {
  const r = ch.response || {};
  return !!(
    (r.choice && (r.choice + "").trim()) ||
    (r.reason && r.reason.trim().length > 5) ||
    (r.answer && r.answer.trim().length > 5) ||
    (r.ideas && r.ideas.some((i) => i && i.trim()))
  );
}

function hasCurveball(ch) {
  const r = ch.response || {};
  return !!(r.curveball && r.revised && r.revised.trim().length > 5);
}

// Score a challenge's interest level for highlight selection.
function score(ch) {
  let s = 0;
  if (hasCurveball(ch)) s += 4;                          // curveball + rethink = most compelling
  const r = ch.response || {};
  const reason = (r.reason || "").trim();
  const answer = (r.answer || "").trim();
  const ideaLen = (r.ideas || []).filter((i) => i && i.trim()).length;
  if (reason.length > 60) s += 2;
  if (answer.length > 60) s += 2;
  if (ideaLen >= 4) s += 2;
  if (ideaLen >= 3) s += 1;
  if (["generate", "cause", "pattern"].includes(ch.type)) s += 1; // open-ended > MCQ
  return s;
}

// Return the 1-2 best challenges to feature in the WhatsApp preview.
export function pickHighlights(challenges) {
  const withData = challenges.filter(hasResponse);
  const sorted = [...withData].sort((a, b) => score(b) - score(a));
  return sorted.slice(0, 2);
}

// Format the WhatsApp text message (plain text, WhatsApp markdown: *bold*, _italic_).
export function formatWhatsAppMessage({ childName, week, challenges, childTip, shareUrl }) {
  const highlights = pickHighlights(challenges);
  const typeLabels = [...new Set(challenges.map((c) => TYPE_LABEL[c.type]).filter(Boolean))].slice(0, 3);

  const lines = [];
  lines.push(`🦉 *${childName} finished Week ${week}!*`);
  lines.push("");
  lines.push(`This week on Yellow Owl, ${childName} worked through 5 thinking challenges on *${typeLabels.join("*, *")}* and more.`);

  highlights.forEach((ch) => {
    const r = ch.response || {};
    lines.push("");
    lines.push(`📌 *${ch.title}* _(Step ${ch.step} · ${TYPE_LABEL[ch.type] || ch.type})_`);
    lines.push(`_"${ch.scenario}"_`);

    if (r.choice) {
      lines.push(`${childName} picked: *${r.choice}*`);
      if (r.reason) lines.push(`> "${r.reason.trim()}"`);
    } else if (r.answer) {
      lines.push(`> "${r.answer.trim().slice(0, 200)}${r.answer.trim().length > 200 ? "…" : ""}"`);
    } else if (r.ideas && r.ideas.filter((i) => i && i.trim()).length) {
      const ideaList = r.ideas.filter((i) => i && i.trim()).slice(0, 3);
      lines.push(ideaList.map((idea, i) => `${i + 1}. "${idea.trim()}"`).join("\n"));
    }

    if (hasCurveball(ch)) {
      lines.push("");
      lines.push(`🌀 _The owl asked: "${r.curveball}_"`);
      lines.push(`${childName} reconsidered: > "${r.revised.trim()}"`);
    }
  });

  if (childTip) {
    lines.push("");
    lines.push(`💡 *The owl's tip:* _"${childTip}"_`);
  }

  lines.push("");
  lines.push(`See ${childName}'s full portfolio:`);
  lines.push(shareUrl);
  lines.push("");
  lines.push("— 🦉 Yellow Owl · weekly thinking adventures for curious kids");

  return lines.join("\n");
}

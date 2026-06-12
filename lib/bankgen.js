// The AI generation pipeline.
// The model writes every challenge, curveball, and baseline.
// Runs occasionally (not per user), so runtime cost stays near zero.
// Re-run the /api/seed endpoint any time to refresh the content bank.

import { callClaude, parseJSON } from "./anthropic.js";

const INTERESTS = ["Space", "Sports", "Animals", "Video games", "Nature", "Art"];

const TRACKS = {
  junior: {
    repAge: 10,
    steps: "5 (creating options), 6 (analysing options), 7 (evaluating options)",
    types: `"generate" (step 5 — think up lots of different ideas), "analyse" (step 6 — weigh 2-3 given choices; include "options"), "evaluate" (step 7 — pick the best of 2-3 choices and say why; include "options"), "decision" (step 7 — choose when the outcome is uncertain; include "options")`,
  },
  senior: {
    repAge: 12,
    steps: "9 (exploring causation), 10 (recognising patterns), 12 (logical reasoning)",
    types: `"cause" (step 9 — work out why something keeps happening), "pattern" (step 10 — spot the pattern in a few facts), "mystery" (step 12 — use clues to deduce the answer; include 3-4 "options"), "information" (step 12 — pick the most trustworthy of 3 sources; include them as "options"), "dilemma" (step 12 — explain how to verify a claim; NO options), "decision" (step 12 — reason an if-then choice; include "options")`,
  },
};

const GEN_SYSTEM = `You design short problem-solving challenges for children, aligned to the Skills Builder Problem Solving steps. Use only simple, everyday words — short sentences, no jargon. Write as if explaining to a 9-year-old even for the senior track. Keep scenarios kind and age-appropriate. Never include anything frightening, violent, sexual, commercial, or unsafe. Return strictly valid JSON and nothing else.`;

function genUser(track, interest) {
  const t = TRACKS[track];
  const readingAge = t.repAge - 2;
  return `Write 3 short challenges for a child who loves ${interest}. Track steps: ${t.steps}.
Use a spread of these types: ${t.types}.
Reading level: about a ${readingAge}-year-old — very short sentences, only simple everyday words. Theme every scenario around ${interest}, friendly and playful.
For "generate" and "cause" types, write a prompt that invites the child to list multiple ideas or reasons (e.g. "Can you think of 5 ways…?" or "List as many reasons as you can").
For any type that asks the child to commit to an answer (evaluate, decision, mystery, information, dilemma), also write a "curveball": one short sentence that adds a new fact making the answer less obvious, in very simple words, never revealing the right answer.
Return ONLY a JSON array of 3 objects:
{"step":<number>,"type":"<one allowed type>","title":"short fun title","scenario":"1-2 short sentences","prompt":"1 short instruction","options":["..",".."],"curveball":"..."}
Include "options" only for analyse, evaluate, decision, mystery, information. Omit "curveball" for generate, cause, pattern.`;
}

function baseUser(track, form) {
  const t = TRACKS[track];
  const readingAge = t.repAge - 2;
  const other =
    form === "endline"
      ? " Use a DIFFERENT everyday situation from a school playground or a school club, but the same three-part structure and difficulty."
      : "";
  return `Write one staged warm-up quiz for a child, reading level about ${readingAge}. Use only simple, short words. Track steps: ${t.steps}.${other}
It has one short scenario and exactly 3 parts, each part exercising one of the track's steps in order.
For each part, write 4 answer options ordered from BEST thinking (option 0) to WEAKEST thinking (option 3). The best option should show genuine problem-solving skill. The other options should be plausible but weaker — like things a less careful thinker might say. Do NOT make the wrong options obviously silly. Use simple words for all options.
Return ONLY JSON:
{"scenario":"1-2 short sentences","stages":[{"step":<n>,"label":"2-3 word label","q":"one short question","options":["best answer","ok answer","weak answer","poorest answer"]},{"step":<n>,"label":"...","q":"...","options":["...","...","...","..."]},{"step":<n>,"label":"...","q":"...","options":["...","...","...","..."]}]}`;
}

async function safetyFilter(items) {
  if (!items.length) return items;
  const list = items
    .map((it, i) => `${i}: ${it.title} — ${it.scenario} ${it.prompt}`)
    .join("\n");
  try {
    const txt = await callClaude({
      system:
        "You check whether short text is suitable for children aged 9-13. Flag anything frightening, violent, sexual, hateful, commercial, or that encourages unsafe behaviour.",
      messages: [
        {
          role: "user",
          content: `Here are items by index:\n${list}\nReturn ONLY JSON: {"unsafe":[indices]}`,
        },
      ],
      maxTokens: 200,
    });
    const bad = new Set((parseJSON(txt).unsafe || []).map(Number));
    return items.filter((_, i) => !bad.has(i));
  } catch {
    return items;
  }
}

export async function generateBank(db, { wipe = true } = {}) {
  const challengeTasks = [];
  for (const track of Object.keys(TRACKS)) {
    for (const interest of INTERESTS) {
      challengeTasks.push(
        (async () => {
          const txt = await callClaude({
            system: GEN_SYSTEM,
            messages: [{ role: "user", content: genUser(track, interest) }],
            maxTokens: 1400,
          });
          let items = parseJSON(txt);
          if (!Array.isArray(items)) return [];
          items = await safetyFilter(items);
          return items.map((it) => ({
            track,
            interest,
            step: it.step,
            type: it.type,
            title: String(it.title || "").slice(0, 80),
            scenario: it.scenario,
            prompt: it.prompt,
            options: it.options || null,
            curveball: it.curveball || null,
            reading_age: TRACKS[track].repAge - 2,
            active: true,
          }));
        })()
      );
    }
  }

  const baselineTasks = [];
  for (const track of Object.keys(TRACKS)) {
    for (const form of ["baseline", "endline"]) {
      baselineTasks.push(
        (async () => {
          const txt = await callClaude({
            system: GEN_SYSTEM,
            messages: [{ role: "user", content: baseUser(track, form) }],
            maxTokens: 500,
          });
          const b = parseJSON(txt);
          return { track, form, scenario: b.scenario, stages: b.stages, active: true };
        })()
      );
    }
  }

  const [cRes, bRes] = await Promise.all([
    Promise.allSettled(challengeTasks),
    Promise.allSettled(baselineTasks),
  ]);
  const challenges = cRes
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);
  const baselines = bRes
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  if (wipe) {
    await db.from("content_bank").delete().not("id", "is", null);
    await db.from("baselines").delete().not("id", "is", null);
  }
  if (challenges.length) await db.from("content_bank").insert(challenges);
  if (baselines.length) await db.from("baselines").insert(baselines);

  return { challenges: challenges.length, baselines: baselines.length };
}

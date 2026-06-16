import { createClient } from "@supabase/supabase-js";

// ── Design tokens (mirrors the main app) ──────────────────────────────────────
const C = {
  ink: "#1B2A45", navy: "#2A4368", teal: "#0FA890", cyan: "#22B8CF",
  sun: "#FFC23C", coral: "#F4845F", grape: "#7A6BE0", cream: "#FBF7EF",
  paper: "#FFFFFF", slate: "#67738A", line: "#EBE4D6",
};
const ACCENT = {
  Space: "#5B6CD9", Sports: "#2BA36B", Animals: "#E08A3C",
  "Video games": "#7A5BD9", Nature: "#3DA35D", Art: "#E0639E",
};
const TYPE_META = {
  research:    { label: "Find it out",    color: "#7A6BE0" },
  generate:    { label: "Brain blast",    color: "#0FA890" },
  analyse:     { label: "Look closely",   color: "#2A4368" },
  evaluate:    { label: "Big decision",   color: "#F4845F" },
  decision:    { label: "Your call",      color: "#F4845F" },
  cause:       { label: "Why though?",    color: "#22B8CF" },
  pattern:     { label: "Spot it",        color: "#0FA890" },
  mystery:     { label: "Crack the case", color: "#7A6BE0" },
  information: { label: "Who to trust?",  color: "#2A4368" },
  dilemma:     { label: "Real or not?",   color: "#F4845F" },
};
const STEP_DESC = {
  4: "Finding information", 5: "Creating options", 6: "Analysing options",
  7: "Evaluating options",  9: "Causation",         10: "Recognising patterns",
  12: "Logical reasoning",
};
const TRACK_LABEL = { junior: "Explorer", senior: "Navigator" };

// ── Mock data shown at /share/mock ────────────────────────────────────────────
const MOCK = {
  child: { name: "Arjun", age: 11, interest: "Space", track: "junior" },
  week: 3,
  childTip: "You explained your thinking really clearly this week! Next time, try asking \"what would prove me wrong?\" — that makes your arguments even stronger.",
  createdAt: "16 Jun 2026",
  challenges: [
    {
      type: "research", step: 4,
      title: "Science Project Websites",
      scenario: "You are researching a topic for your science project and find three different websites with very different information.",
      prompt: "What would you check first to decide if a website is reliable?",
      response: {
        choice: "Who wrote it and whether they are an expert on that subject",
        reason: "If the person who wrote it doesn't actually know about the topic they could easily get things wrong or just copy stuff from somewhere else. An expert is way less likely to make things up.",
        curveball: "The most detailed website is run by a company that sells products related to your topic. Does that change your answer?",
        revised: "Yes — I'd still check who wrote it but now I'd also look at whether they're trying to sell me something. Even if the person is an expert, I'd trust them less if they benefit from me believing them.",
      },
    },
    {
      type: "generate", step: 5,
      title: "Hot Classroom",
      scenario: "The classroom gets very hot every afternoon and it is hard to concentrate on work.",
      prompt: "Think of 5 ways to cool the room down without using air conditioning.",
      response: {
        ideas: [
          "Open all the windows on opposite sides to get a cross breeze through the room",
          "Pull the blinds down on the sunny side to stop the sun heating everything up",
          "Use big desk fans pointing at the doorway so hot air gets pushed out",
          "Give everyone a cold water bottle to keep on their desk so they stay cool",
          "Move afternoon lessons to the library which is on the shady side of school",
        ],
      },
    },
    {
      type: "generate", step: 5,
      title: "Playground Litter",
      scenario: "The school playground is covered in litter after every lunch break.",
      prompt: "Think of 5 different ways to stop the litter problem.",
      response: {
        ideas: [
          "Put way more bins around the playground, not just at the edges where no one walks",
          "Have a Year 6 litter-picking team who earn house points for their class",
          "Show the whole school a short video about how litter hurts animals and the environment",
          "Run a class competition — the class with the least litter outside their door wins",
          "Make recycling bins a different bright colour so it's obvious which one to use",
        ],
      },
    },
    {
      type: "analyse", step: 6,
      title: "Lunch Menu Change",
      scenario: "The canteen is changing its menu. Two plans are on the table.",
      prompt: "Look at both plans. Who do they help? What could go wrong with each?",
      options: [
        "Healthy only — no chips or sweets on the menu at all",
        "Free choice — children pick anything they want every day",
      ],
      response: {
        choice: "Free choice — children pick anything they want every day",
        reason: "The healthy-only plan helps kids who don't make great food choices on their own, but it could cause problems for kids with allergies or different cultural diets if the options aren't varied. Free choice helps kids who already know what they like, but some kids would eat junk every day and their parents wouldn't know. I think free choice is more realistic as long as the healthy options are made the most obvious and appealing ones.",
      },
    },
    {
      type: "evaluate", step: 7,
      title: "One School Trip",
      scenario: "Your class can afford only one school trip this year.",
      prompt: "Pick the trip you think is best and say why.",
      options: [
        "Science museum — hands-on experiments all day",
        "Working farm — see real animals and grow food",
        "Live theatre — watch a professional play",
        "Sports centre — swimming, climbing, and team challenges",
      ],
      response: {
        choice: "Science museum — hands-on experiments all day",
        reason: "You actually get to do the experiments yourself instead of just reading about them. I learn loads better when I can actually touch things and see what happens, not just be told about it.",
        curveball: "The science museum has no spaces left for your year group. Does that change your answer?",
        revised: "Then I'd pick the working farm — that's still hands-on and completely different from anything we do in school. Most people my age have no idea where food actually comes from and I think that's pretty important to understand.",
      },
    },
  ],
};

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getPortfolioData(sessionId) {
  if (sessionId === "mock") return MOCK;

  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    const { data: session } = await admin
      .from("sessions")
      .select("id, week, child_tip, challenges, created_at, children(name, age, interest, track)")
      .eq("id", sessionId)
      .maybeSingle();

    if (!session || !session.challenges || !session.challenges.length) return null;

    const d = new Date(session.created_at);
    const createdAt = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    return {
      child: session.children,
      week: session.week,
      childTip: session.child_tip,
      createdAt,
      challenges: session.challenges,
    };
  } catch {
    return null;
  }
}

// ── Small render helpers ──────────────────────────────────────────────────────
function Badge({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 12px", borderRadius: 20,
      background: color, color: "#fff", fontFamily: "Fredoka, sans-serif",
      fontWeight: 700, fontSize: 12, letterSpacing: 0.3,
    }}>{label}</span>
  );
}

function StepTag({ step }) {
  if (!step || !STEP_DESC[step]) return null;
  return (
    <span style={{
      fontSize: 12, color: C.slate, fontFamily: "Fredoka, sans-serif",
      fontWeight: 600, whiteSpace: "nowrap",
    }}>Step {step} · {STEP_DESC[step]}</span>
  );
}

function ResponseBox({ children, accent = C.teal }) {
  return (
    <div style={{
      marginTop: 14, padding: "14px 16px", borderRadius: 16,
      background: C.cream, border: `1px solid ${C.line}`,
      borderLeft: `4px solid ${accent}`,
    }}>
      {children}
    </div>
  );
}

function Quote({ text, childName }) {
  return (
    <p style={{
      margin: "6px 0 0", fontSize: 15, lineHeight: 1.65,
      color: C.ink, fontStyle: "italic",
    }}>
      <span style={{ color: C.slate, fontStyle: "normal", fontWeight: 600, fontSize: 12 }}>{childName} said: </span>
      "{text}"
    </p>
  );
}

function CurveballBox({ curveball, revised, childName }) {
  if (!curveball || !revised || !revised.trim()) return null;
  return (
    <div style={{
      marginTop: 14, padding: "14px 16px", borderRadius: 16,
      background: "#FFF8E8", border: `2px solid ${C.sun}`,
    }}>
      <div style={{
        fontFamily: "Fredoka, sans-serif", fontWeight: 700,
        color: C.coral, fontSize: 13, marginBottom: 6,
      }}>
        🌀 The owl threw a twist
      </div>
      <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.6, color: C.navy, fontStyle: "italic" }}>
        "{curveball}"
      </p>
      <div style={{
        fontSize: 12, fontWeight: 700, color: C.slate,
        textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4,
      }}>
        {childName} reconsidered
      </div>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: C.ink, fontStyle: "italic" }}>
        "{revised}"
      </p>
    </div>
  );
}

function IdeaList({ ideas, childName }) {
  const filled = (ideas || []).filter((i) => i && i.trim());
  if (!filled.length) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{
        fontSize: 12, fontWeight: 700, color: C.slate,
        textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8,
      }}>
        {childName}'s ideas
      </div>
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {filled.map((idea, i) => (
          <li key={i} style={{ fontSize: 15, lineHeight: 1.65, color: C.ink, marginBottom: 4, fontStyle: "italic" }}>
            "{idea.trim()}"
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChallengeCard({ ch, childName, accentColor }) {
  const r = ch.response || {};
  const tm = TYPE_META[ch.type] || { label: ch.type, color: C.teal };
  const hasMeaningfulResponse = !!(
    r.choice || r.reason || r.answer ||
    (r.ideas && r.ideas.some((i) => i && i.trim()))
  );

  return (
    <div style={{
      background: C.paper, borderRadius: 22, padding: "22px 20px",
      border: `1px solid ${C.line}`, borderTop: `5px solid ${tm.color}`,
      boxShadow: "0 4px 20px rgba(27,42,69,.07)",
    }}>
      {/* Type badge + step */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <Badge label={tm.label} color={tm.color} />
        <StepTag step={ch.step} />
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: "Fredoka, sans-serif", fontWeight: 700,
        fontSize: 22, color: C.ink, margin: "0 0 12px", lineHeight: 1.2,
      }}>
        {ch.title}
      </h2>

      {/* Situation */}
      <div style={{
        padding: "10px 14px", borderRadius: 12,
        background: "#F0F4FA", border: "1px solid #D8E2F0", marginBottom: 10,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 0.8, color: "#7A8FA8", marginBottom: 4,
        }}>
          The situation
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: C.navy }}>{ch.scenario}</p>
      </div>

      {/* Mission */}
      <div style={{
        padding: "10px 14px", borderRadius: 12,
        borderLeft: `3px solid ${tm.color}`, background: `${tm.color}10`, marginBottom: 2,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 0.8, color: tm.color, marginBottom: 4,
        }}>
          The mission
        </div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.6, color: C.navy }}>{ch.prompt}</p>
      </div>

      {/* Response */}
      {hasMeaningfulResponse && (
        <ResponseBox accent={tm.color}>
          {/* MCQ pick */}
          {r.choice && (
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: C.slate,
                textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6,
              }}>
                {childName} picked
              </div>
              <div style={{
                display: "flex", gap: 8, alignItems: "flex-start",
                padding: "8px 12px", borderRadius: 10,
                background: `${tm.color}15`, border: `1px solid ${tm.color}40`,
              }}>
                <span style={{ color: "#2BA36B", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy, lineHeight: 1.5 }}>{r.choice}</span>
              </div>
            </div>
          )}

          {/* Reason */}
          {r.reason && r.reason.trim() && (
            <Quote text={r.reason.trim()} childName={childName} />
          )}

          {/* Open text answer */}
          {!r.choice && r.answer && r.answer.trim() && (
            <Quote text={r.answer.trim()} childName={childName} />
          )}

          {/* Ideas list */}
          {!r.choice && !r.answer && r.ideas && (
            <IdeaList ideas={r.ideas} childName={childName} />
          )}
        </ResponseBox>
      )}

      {/* Curveball */}
      <CurveballBox curveball={r.curveball} revised={r.revised} childName={childName} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { sessionId } = await params;
  const data = await getPortfolioData(sessionId);
  const name = data?.child?.name || "Your child";
  return { title: `${name}'s Yellow Owl Portfolio · Week ${data?.week || ""}` };
}

export default async function SharePage({ params }) {
  const { sessionId } = await params;
  const data = await getPortfolioData(sessionId);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream, padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🦉</div>
          <h1 style={{ fontFamily: "Fredoka, sans-serif", color: C.ink, fontSize: 26 }}>Portfolio not found</h1>
          <p style={{ color: C.slate }}>This link may have expired or the session wasn't fully completed.</p>
        </div>
      </div>
    );
  }

  const { child, week, childTip, createdAt, challenges } = data;
  const accentColor = ACCENT[child?.interest] || C.teal;
  const shown = challenges.filter((ch) => {
    const r = ch.response || {};
    return !!(r.choice || r.reason || r.answer || (r.ideas && r.ideas.some((i) => i && i.trim())));
  });

  return (
    <div style={{ background: C.cream, minHeight: "100vh", padding: "0 0 48px" }}>

      {/* ── Header ── */}
      <div style={{
        background: C.ink, color: C.paper,
        padding: "28px 24px 24px",
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.ink} 100%)`,
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 28 }}>🦉</span>
            <span style={{
              fontFamily: "Fredoka, sans-serif", fontWeight: 700,
              fontSize: 18, color: C.sun, letterSpacing: 0.5,
            }}>Yellow Owl</span>
          </div>
          <h1 style={{
            fontFamily: "Fredoka, sans-serif", fontWeight: 700,
            fontSize: 34, margin: "0 0 6px", lineHeight: 1.15, color: C.paper,
          }}>
            {child?.name}'s Week {week} Adventure
          </h1>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <span style={{
              display: "inline-block", padding: "4px 12px", borderRadius: 20,
              background: accentColor, color: "#fff",
              fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 13,
            }}>
              {TRACK_LABEL[child?.track] || child?.track}
            </span>
            {child?.interest && (
              <span style={{
                display: "inline-block", padding: "4px 12px", borderRadius: 20,
                background: "rgba(255,255,255,.15)", color: "#fff",
                fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 13,
              }}>
                {child.interest}
              </span>
            )}
            <span style={{
              display: "inline-block", padding: "4px 12px", borderRadius: 20,
              background: "rgba(255,255,255,.15)", color: "#fff",
              fontFamily: "Fredoka, sans-serif", fontSize: 13,
            }}>
              {createdAt}
            </span>
          </div>
          <p style={{
            margin: "14px 0 0", fontSize: 14, color: "rgba(255,255,255,.7)", lineHeight: 1.5,
          }}>
            {shown.length} thinking challenge{shown.length !== 1 ? "s" : ""} · Skills Builder framework
          </p>
        </div>
      </div>

      {/* ── Challenge cards ── */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 0" }}>
        <div style={{ display: "grid", gap: 18 }}>
          {shown.map((ch, i) => (
            <ChallengeCard
              key={i}
              ch={ch}
              childName={child?.name || "They"}
              accentColor={accentColor}
            />
          ))}
        </div>

        {/* ── Owl's tip ── */}
        {childTip && (
          <div style={{
            marginTop: 24, padding: "20px 20px",
            background: C.paper, borderRadius: 22,
            border: `1px solid ${C.line}`, borderTop: `5px solid ${C.sun}`,
            boxShadow: "0 4px 20px rgba(27,42,69,.07)",
          }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 34, flexShrink: 0, lineHeight: 1 }}>🦉</span>
              <div>
                <div style={{
                  fontFamily: "Fredoka, sans-serif", fontWeight: 700,
                  color: C.coral, fontSize: 14, marginBottom: 6,
                }}>
                  The owl says
                </div>
                <p style={{
                  margin: 0, fontSize: 16, lineHeight: 1.65,
                  color: C.navy, fontStyle: "italic",
                }}>
                  "{childTip}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{
          marginTop: 32, paddingTop: 20, borderTop: `1px solid ${C.line}`,
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "Fredoka, sans-serif", fontWeight: 700,
            fontSize: 15, color: C.slate, marginBottom: 4,
          }}>
            🦉 Yellow Owl
          </div>
          <p style={{ margin: 0, fontSize: 13, color: C.slate, lineHeight: 1.5 }}>
            Weekly thinking adventures for curious kids.<br />
            Skills Builder Universal Framework · Problem Solving
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseBrowser";
import { buildSessionFromBank } from "../lib/questionBank";

// ── Brand ─────────────────────────────────────────────────────────────────────
const C = { ink: "#1B2A45", navy: "#2A4368", teal: "#0FA890", cyan: "#22B8CF", sun: "#FFC23C", coral: "#F4845F", grape: "#7A6BE0", cream: "#FBF7EF", paper: "#FFFFFF", slate: "#67738A", line: "#EBE4D6" };
const INTERESTS = ["Space", "Sports", "Animals", "Video games", "Nature", "Art"];
const ACCENT = { Space: "#5B6CD9", Sports: "#2BA36B", Animals: "#E08A3C", "Video games": "#7A5BD9", Nature: "#3DA35D", Art: "#E0639E" };
const TERMS_VERSION = "v1";

const TRACKS = {
  junior: { label: "Explorer", keys: ["creating", "analysing", "evaluating"], keyLabel: { creating: "Coming up with ideas", analysing: "Looking at options", evaluating: "Choosing wisely" }, childLabel: { creating: "My ideas", analysing: "Looking closer", evaluating: "Best choice" }, keyStep: { creating: 5, analysing: 6, evaluating: 7 } },
  senior: { label: "Navigator", keys: ["causation", "patterns", "logic"], keyLabel: { causation: "Finding causes", patterns: "Spotting patterns", logic: "Logical thinking" }, childLabel: { causation: "Finding the why", patterns: "Spotting patterns", logic: "Clear thinking" }, keyStep: { causation: 9, patterns: 10, logic: 12 } },
};
const trackFor = (age) => (Number(age) <= 10 ? "junior" : "senior");
const INTERACTION = { generate: "text", cause: "text", pattern: "text", analyse: "grid", evaluate: "choose", decision: "choose", mystery: "choose", information: "choose", dilemma: "verify" };
const committing = (t) => INTERACTION[t] === "choose" || INTERACTION[t] === "verify";
const TYPE_META = { generate: { eb: "Idea storm", accent: "#0FA890" }, analyse: { eb: "Look closer", accent: "#2A4368" }, evaluate: { eb: "Big choice", accent: "#F4845F" }, decision: { eb: "Tricky choice", accent: "#F4845F" }, cause: { eb: "Why is this?", accent: "#22B8CF" }, pattern: { eb: "Spot the pattern", accent: "#0FA890" }, mystery: { eb: "Mystery time!", accent: "#F4845F" }, information: { eb: "Who do you trust?", accent: "#2A4368" }, dilemma: { eb: "True or not?", accent: "#F4845F" } };

// Fallback content shown when the AI bank has not been seeded yet
const EMERGENCY = {
  junior: [
    { id: "e1", type: "generate", step: 5, title: "So many ways", scenario: "The school library is too noisy to read in.", prompt: "Think of as many ways to fix it as you can." },
    { id: "e2", type: "evaluate", step: 7, title: "One pipe", scenario: "Three villages need water but you can only build one pipe first.", prompt: "Pick which village and say why.", options: ["Big village — most people", "Far village — no water at all", "Near village — easiest to build"], curveball: "The village you picked already has a backup well. Does that change your mind?" },
  ],
  senior: [
    { id: "e1", type: "cause", step: 9, title: "The 6pm crash", scenario: "Your game's server crashes every day at 6pm.", prompt: "What could be causing it? Which is most likely?" },
    { id: "e2", type: "mystery", step: 12, title: "Missing cup", scenario: "A cup is gone from a locked room. Only three people had keys. One was away all week.", prompt: "Who took it, and what clue tells you?", options: ["Maya (away all week)", "Jonas (last to leave)", "Priya (lost her key)"], curveball: "What if the person you suspect had no reason to want it?" },
  ],
};

// MCQ fallback for the baseline warm-up
// Options are ordered best thinking → weakest thinking (scoring: 4, 3, 1, 0)
const EMERGENCY_BASE = {
  junior: {
    scenario: "At break time the playground gets very crowded and kids keep bumping into each other.",
    stages: [
      { step: 5, label: "Lots of ideas", q: "What are different ways you could fix this?", options: ["Make two areas — one for running, one for quiet play", "Tell everyone to walk slowly", "Close the playground", "Do nothing"] },
      { step: 6, label: "Look closer", q: "You have two ideas. What is the best way to compare them?", options: ["Think about who each idea helps and what could go wrong", "Pick the one that sounds most fun", "Ask one friend what they think", "Go with the first idea you thought of"] },
      { step: 7, label: "Pick one", q: "You have to choose one idea to try first. What is the best way to decide?", options: ["Pick the one that helps the most people and has the fewest problems", "Pick the one your best friend likes", "Pick the cheapest one no matter what", "Pick whichever is easiest to explain"] },
    ],
  },
  senior: {
    scenario: "Fewer and fewer children are coming to the after-school science club. The day changed to Friday, two members left, and the room was moved.",
    stages: [
      { step: 9, label: "Find the cause", q: "What is most likely causing fewer children to come?", options: ["The Friday change clashes with other activities most children have", "Children have stopped liking science", "The new room is too far away", "The two members who left were the only interesting ones"] },
      { step: 10, label: "Spot the link", q: "The drop started the same week the day changed. What does this pattern suggest?", options: ["The day change is probably the main cause because the timing matches", "It is just a coincidence — the day does not matter", "The room change must be the cause because rooms matter more", "You cannot tell anything from this pattern"] },
      { step: 12, label: "What next", q: "What can you conclude, and what would you test first?", options: ["The day is the main problem — try moving back and see if numbers recover", "Do nothing — clubs always go up and down", "Change the room back first, then wait a full year", "Ask only the two members who left what they think"] },
    ],
  },
};

// ── Data layer ────────────────────────────────────────────────────────────────
async function token() { const { data } = await supabase.auth.getSession(); return data?.session?.access_token || ""; }
async function authedPost(path, body) { const res = await fetch(path, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${await token()}` }, body: JSON.stringify(body) }); return res.json(); }
function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }
// Parse how many list items a prompt is asking for, e.g. "think of 5 ways" → 5
function listCount(prompt = "") {
  const byUnit = (prompt || "").match(/\b([2-8])\s+(?:ideas?|ways?|reasons?|things?|examples?|causes?|points?|arguments?|solutions?)\b/i);
  if (byUnit) return Math.min(parseInt(byUnit[1]), 8);
  const byVerb = (prompt || "").match(/\b(?:list|think of|come up with)\s+(?:at\s+least\s+)?([2-8])\b/i);
  if (byVerb) return Math.min(parseInt(byVerb[1]), 8);
  return 0;
}

async function assembleSession(track, interest) {
  // Try the AI-generated database first — only use it if it has enough content
  try {
    let { data: rows } = await supabase.from("content_bank").select("*").eq("track", track).eq("interest", interest).eq("active", true);
    if (!rows || rows.length < 4) {
      const { data: wider } = await supabase.from("content_bank").select("*").eq("track", track).eq("active", true);
      rows = (wider && wider.length >= 5) ? wider : rows;
    }
    if (rows && rows.length >= 5) {
      const picked = shuffle(rows).slice(0, 5);
      if (!picked.some((r) => committing(r.type))) {
        const c = rows.find((r) => committing(r.type));
        if (c) picked[picked.length - 1] = c;
      }
      return picked.map((r) => ({ id: r.id, type: r.type, step: r.step, title: r.title, scenario: r.scenario, prompt: r.prompt, options: r.options || undefined, curveball: r.curveball || undefined }));
    }
  } catch { /* fall through */ }

  // Use the built-in question bank — 6 questions per step, randomised each session
  return buildSessionFromBank(track);
}
async function loadBaseline(track) {
  try { const { data } = await supabase.from("baselines").select("*").eq("track", track).eq("form", "baseline").eq("active", true).limit(1); if (data && data[0]) return data[0]; } catch {}
  return EMERGENCY_BASE[track];
}

// ── Icons / scenes ────────────────────────────────────────────────────────────
const Star = ({ on, size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 22l-5.2 2.9 1-5.9L3.5 9.2l5.9-.8z" fill={on ? C.sun : "none"} stroke={on ? C.sun : C.line} strokeWidth="1.4" strokeLinejoin="round" /></svg>;
const Stars = ({ n, max = 4 }) => <div style={{ display: "flex", gap: 3 }}>{Array.from({ length: max }).map((_, i) => <Star key={i} on={i < n} />)}</div>;
const SCENES = {
  Space: (a) => <g><circle cx="60" cy="30" r="2" fill="#fff" /><circle cx="250" cy="26" r="2" fill="#fff" /><circle cx="245" cy="56" r="20" fill={a} /><ellipse cx="245" cy="56" rx="30" ry="7" fill="none" stroke="#fff" strokeWidth="2" opacity=".7" /><path d="M70 60l8-22 8 22-8-5z" fill="#fff" /></g>,
  Sports: (a) => <g><rect x="0" y="58" width="320" height="26" fill={a} opacity=".25" /><circle cx="250" cy="48" r="16" fill="#fff" stroke={a} strokeWidth="2" /><path d="M250 32v32M234 48h32" stroke={a} strokeWidth="1.6" /><path d="M70 24v34M70 26h16l-3 4 3 4H70" fill={a} stroke={a} strokeWidth="1.4" strokeLinejoin="round" /></g>,
  Animals: (a) => <g><path d="M0 70q80-30 160 0t160 0v14H0z" fill={a} opacity=".25" /><circle cx="58" cy="30" r="11" fill={a} opacity=".5" /><g fill={a}><circle cx="246" cy="54" r="6" /><circle cx="238" cy="44" r="3" /><circle cx="246" cy="42" r="3" /><circle cx="254" cy="44" r="3" /></g></g>,
  "Video games": (a) => <g><rect x="210" y="34" width="70" height="34" rx="14" fill={a} opacity=".85" /><circle cx="266" cy="46" r="3.5" fill="#fff" /><path d="M226 51h12M232 45v12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /><g fill={a}><rect x="50" y="30" width="10" height="10" rx="2" /><rect x="64" y="30" width="10" height="10" rx="2" opacity=".6" /></g></g>,
  Nature: (a) => <g><path d="M0 66q80-34 160 0t160 0v18H0z" fill={a} opacity=".22" /><circle cx="58" cy="28" r="12" fill={C.sun} /><path d="M248 64V44" stroke={a} strokeWidth="3" /><circle cx="248" cy="36" r="14" fill={a} opacity=".75" /></g>,
  Art: (a) => <g><path d="M232 34c18 0 30 12 30 26 0 8-8 9-12 9-6 0-6 6-12 6-14 0-24-12-24-24s8-23 18-23z" fill={a} opacity=".7" /><circle cx="240" cy="40" r="3" fill={C.sun} /><path d="M58 64l16-30" stroke={a} strokeWidth="3" strokeLinecap="round" /></g>,
};
const Scene = ({ interest }) => { const a = ACCENT[interest] || C.teal; return <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 4, lineHeight: 0 }}><svg viewBox="0 0 320 84" width="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block", background: `linear-gradient(135deg, ${a}14, ${a}05)` }}>{(SCENES[interest] || SCENES.Nature)(a)}</svg></div>; };
function Owl({ size = 64, mood = "calm" }) { const brow = mood === "think" ? 1 : 0, happy = mood === "cheer"; return (<svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="58" rx="34" ry="36" fill={C.sun} /><path d="M22 30 L34 44 L20 46 Z" fill={C.sun} /><path d="M78 30 L66 44 L80 46 Z" fill={C.sun} /><ellipse cx="50" cy="60" rx="22" ry="24" fill="#FFF3D6" /><circle cx="38" cy="52" r="13" fill={C.paper} /><circle cx="62" cy="52" r="13" fill={C.paper} /><circle cx={38 + (happy ? 0 : 1)} cy="53" r={happy ? 3 : 5.5} fill={C.ink} /><circle cx={62 - (happy ? 0 : 1)} cy="53" r={happy ? 3 : 5.5} fill={C.ink} /><path d="M46 62 L54 62 L50 69 Z" fill={C.coral} /><path d={`M28 ${40 - brow * 3} Q38 ${34 - brow * 4} 49 ${40 - brow * 2}`} stroke={C.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" /><path d={`M51 ${40 - brow * 2} Q62 ${34 - brow * 4} 72 ${40 - brow * 3}`} stroke={C.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>); }

// ── UI atoms ──────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, disabled, kind = "primary", style }) => { const map = { primary: { bg: C.teal, lip: "#0A7B68", fg: "#fff" }, warm: { bg: C.coral, lip: "#D2613C", fg: "#fff" }, ghost: { bg: C.paper, lip: "#DCD3C1", fg: C.ink } }; const m = disabled ? { bg: "#CDD5DF", lip: "#AEB7C4", fg: "#8A94A3" } : map[kind]; const press = (e, on) => { if (disabled) return; e.currentTarget.style.transform = on ? "translateY(5px)" : "none"; e.currentTarget.style.boxShadow = on ? `0 1px 0 ${m.lip}` : `0 6px 0 ${m.lip}`; }; return (<button onClick={onClick} disabled={disabled} style={{ background: m.bg, color: m.fg, border: kind === "ghost" ? `2px solid ${C.line}` : "none", padding: "14px 26px", borderRadius: 18, fontWeight: 600, fontSize: 17, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "Fredoka, system-ui", boxShadow: `0 6px 0 ${m.lip}`, transition: "transform .08s, box-shadow .08s", ...style }} onMouseDown={(e) => press(e, true)} onMouseUp={(e) => press(e, false)} onMouseLeave={(e) => press(e, false)} onTouchStart={(e) => press(e, true)} onTouchEnd={(e) => press(e, false)}>{children}</button>); };
const Eyebrow = ({ children, color = C.teal }) => <div style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: 13, letterSpacing: .5, textTransform: "uppercase", color }}>{children}</div>;
const H = ({ children, size = 30 }) => <h1 style={{ fontFamily: "Fredoka, system-ui", fontWeight: 600, fontSize: size, margin: 0, color: C.ink, lineHeight: 1.1 }}>{children}</h1>;
const Input = (p) => <input {...p} style={{ width: "100%", padding: 14, borderRadius: 14, border: `2px solid ${C.line}`, borderBottom: `5px solid #E4DCCB`, boxShadow: "inset 0 3px 6px rgba(27,42,69,.07)", fontSize: 16, fontFamily: "Andika", boxSizing: "border-box", ...p.style }} />;

// Simple text area — no voice
const SmallText = ({ value, onChange, placeholder, disabled, minHeight = 80 }) => (
  <textarea value={value} disabled={disabled} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
    style={{ width: "100%", minHeight, padding: "12px 14px", borderRadius: 14, border: `2px solid ${C.line}`, borderBottom: `5px solid #E4DCCB`, boxShadow: "inset 0 3px 6px rgba(27,42,69,.07)", fontSize: 16, fontFamily: "Andika, system-ui", lineHeight: 1.6, resize: "vertical", outline: "none", background: disabled ? C.cream : C.paper, color: C.ink, boxSizing: "border-box" }} />
);

// Numbered list of short text boxes — for idea/reason list inputs
function IdeaList({ count, values, onChange, label = "Idea" }) {
  return (
    <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontFamily: "Fredoka", fontWeight: 700, color: C.teal, minWidth: 22, fontSize: 16 }}>{i + 1}.</span>
          <Input value={values[i] || ""} onChange={(e) => onChange(i, e.target.value)} placeholder={`${label} ${i + 1}`} style={{ margin: 0 }} />
        </div>
      ))}
    </div>
  );
}

// MCQ option button
const MCQOption = ({ label, selected, onClick, disabled }) => (
  <div role="button" tabIndex={disabled ? -1 : 0} onClick={disabled ? undefined : onClick}
    onKeyDown={(e) => !disabled && e.key === "Enter" && onClick()}
    style={{ padding: "12px 16px", borderRadius: 14, cursor: disabled ? "default" : "pointer", fontSize: 15, lineHeight: 1.5, border: `2px solid ${selected ? C.teal : C.line}`, background: selected ? "#E7F6F2" : C.paper, fontWeight: selected ? 700 : 400, color: C.ink, transition: "border-color .12s, background .12s" }}>
    {label}
  </div>
);

function Bars({ tk, scores, base }) { const T = TRACKS[tk]; return (<div style={{ display: "grid", gap: 14 }}>{T.keys.map((k) => (<div key={k}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 5 }}><span style={{ fontWeight: 600 }}>{T.keyLabel[k]} <span style={{ color: C.slate, fontWeight: 400 }}>· step {T.keyStep[k]}</span></span><span style={{ color: C.slate, fontFamily: "Fredoka" }}>{scores[k]}/4</span></div><div style={{ position: "relative", height: 11, borderRadius: 8, background: C.line }}><div style={{ width: `${(scores[k] / 4) * 100}%`, height: "100%", borderRadius: 8, background: C.teal }} />{base && typeof base[k] === "number" ? <div title="where you started" style={{ position: "absolute", top: -3, left: `calc(${(base[k] / 4) * 100}% - 1px)`, width: 2, height: 17, background: C.navy }} /> : null}</div></div>))}</div>); }

const Shell = ({ children, max = 720 }) => (<div style={{ minHeight: "100vh", background: C.cream, backgroundImage: "radial-gradient(circle at 9% 5%, rgba(255,194,60,.16), transparent 36%), radial-gradient(circle at 92% 96%, rgba(55,198,219,.12), transparent 42%)", backgroundAttachment: "fixed", color: C.ink, padding: "26px 16px" }}><div style={{ maxWidth: max, margin: "0 auto", animation: "pop .35s ease" }}>{children}</div></div>);
const Card = ({ children, accent = C.line, style }) => (<div style={{ background: C.paper, borderRadius: 24, padding: 26, border: `1px solid ${C.line}`, borderTop: `6px solid ${accent}`, boxShadow: "0 10px 26px rgba(27,42,69,.08)", ...style }}>{children}</div>);
const TrackChip = ({ tk }) => (<span style={{ display: "inline-flex", padding: "5px 13px", borderRadius: 16, background: "#E7F6F2", color: C.teal, fontFamily: "Fredoka", fontWeight: 700, fontSize: 13 }}>{TRACKS[tk].label}</span>);

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("boot");
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false);
  const [children, setChildren] = useState([]);
  const [child, setChild] = useState(null); const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({ name: "", age: "11", interest: "Space", consent: false });
  const [baseDef, setBaseDef] = useState(null); const [baseAns, setBaseAns] = useState({}); const [baseStage, setBaseStage] = useState("answer"); const [baseline, setBaseline] = useState(null);
  const [session, setSession] = useState([]); const [idx, setIdx] = useState(0); const [resp, setResp] = useState({});
  const [phase, setPhase] = useState("answer"); const [busy, setBusy] = useState(false); const [report, setReport] = useState(null); const [grown, setGrown] = useState(false); const [msg, setMsg] = useState("");

  useEffect(() => { supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user || null)); const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null)); return () => sub.subscription.unsubscribe(); }, []);
  useEffect(() => { if (user === undefined) return; if (!user) { setScreen("login"); return; } loadChildren(); }, [user]);
  useEffect(() => { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {} }, [idx, screen, baseStage]);

  async function loadChildren() { const { data } = await supabase.from("children").select("*").order("created_at"); setChildren(data || []); setScreen(data && data.length ? "picker" : "newchild"); }
  async function sendLink() { setBusy(true); setMsg(""); const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined } }); setBusy(false); if (error) setMsg(error.message); else setSent(true); }
  async function resume(c) { setChild(c); setBaseline(c.baseline_scores || null); const { data } = await supabase.from("sessions").select("*").eq("child_id", c.id).order("week"); setSessions(data || []); setScreen("home"); }
  async function createChild(goBaseline) {
    setBusy(true); const track = trackFor(form.age);
    const { data, error } = await supabase.from("children").insert({ parent_id: user.id, name: form.name.trim(), age: Number(form.age), interest: form.interest, track }).select().single();
    if (error) { setBusy(false); setMsg(error.message); return; }
    await supabase.from("consent").insert({ parent_id: user.id, child_id: data.id, agreed: true, terms_version: TERMS_VERSION });
    setChild(data); setSessions([]); setBaseline(null); setBusy(false);
    if (goBaseline) { const b = await loadBaseline(track); setBaseDef(b); setBaseAns({}); setBaseStage("answer"); setScreen("baseline"); } else startSession(data);
  }
  const tk = child ? child.track : trackFor(form.age); const T = TRACKS[tk];
  const latest = sessions.length ? sessions[sessions.length - 1].scores : null;
  const lastEntry = sessions.length ? sessions[sessions.length - 1] : null;

  // Instant local scoring: option 0 = best thinking (4★), option 3 = weakest (0★)
  function scoreBaseline() {
    const keys = T.keys;
    const scoreMap = [4, 3, 1, 0];
    const v = {};
    keys.forEach((k, i) => { v[k] = scoreMap[baseAns[i] ?? 3]; });
    setBaseline(v);
    supabase.from("children").update({ baseline_scores: v }).eq("id", child.id);
    setChild({ ...child, baseline_scores: v });
    setBaseStage("result");
  }

  async function startSession(c) {
    const useChild = c || child; setBusy(true); setScreen("loading");
    const s = await assembleSession(useChild.track, useChild.interest);
    setSession(s); setIdx(0); setResp({}); setPhase("answer"); setReport(null); setGrown(false); setBusy(false); setScreen("session");
  }
  const ch = session[idx];
  const setField = (id, f, v) => setResp((r) => ({ ...r, [id]: { ...r[id], [f]: v } }));
  // Update one idea in a numbered list and keep r.answer in sync for scoring
  const updateIdea = (id, i2, val, count) => {
    setResp((r) => {
      const prev = r[id] || {};
      const ideas = [...(prev.ideas || Array(count).fill(""))];
      ideas[i2] = val;
      return { ...r, [id]: { ...prev, ideas, answer: ideas.filter((s) => s.trim()).join("\n") } };
    });
  };

  async function lockCommit() {
    const r = resp[ch.id] || {}; const answer = INTERACTION[ch.type] === "choose" ? `Chose: ${r.choice || "(none)"}. Because: ${r.reason || ""}` : (r.answer || ""); setBusy(true);
    let cb; try { cb = (await authedPost("/api/curveball", { childId: child.id, age: child.age, scenario: ch.scenario, prompt: ch.prompt, options: ch.options, answer })).curveball; } catch { cb = null; }
    setField(ch.id, "curveball", cb || ch.curveball || "Wait — what if one key fact changed? Would you still pick the same thing?"); setBusy(false); setPhase("rethink");
  }
  function transcript() { return session.map((c, i) => { const r = resp[c.id] || {}, it = INTERACTION[c.type]; let s = `Challenge ${i + 1} [${c.type}, step ${c.step}] ${c.scenario} ${c.prompt}`; if (it === "grid") s += ` | Notes: ${(c.options || []).map((o, j) => `${o}: ${(r.notes || {})[j] || "—"}`).join(" / ")}`; else if (it === "choose") s += ` | Chose: ${r.choice || "—"} | Reason: ${r.reason || "—"}` + (r.curveball ? ` | Coach: ${r.curveball} | Rethink: ${r.revised || "—"}` : ""); else if (it === "verify") s += ` | Plan: ${r.answer || "—"}` + (r.curveball ? ` | Coach: ${r.curveball} | Rethink: ${r.revised || "—"}` : ""); else s += ` | Answer: ${r.answer || "—"}`; return s; }).join("\n"); }
  async function finish() {
    setBusy(true); setScreen("loading");
    const keys = T.keys;
    let d = {};
    try {
      d = await authedPost("/api/score", { childId: child.id, age: child.age, track: tk, keys, transcript: transcript() });
    } catch (e) {
      console.error("Scoring failed:", e);
    }
    const scores = {}; keys.forEach((k) => (scores[k] = Number(d[k]) || 2));
    let highlights = d.highlights; if (!highlights || !highlights.length) highlights = session.map((c) => (resp[c.id] || {}).answer || (resp[c.id] || {}).reason).filter(Boolean).slice(0, 2);
    const entry = { child_id: child.id, week: sessions.length + 1, scores, responsiveness: d.responsiveness ?? 2, child_tip: d.childTip || "Great work — keep explaining your thinking!", weakness: d.weakness || "", narrative: d.narrative || "", highlights, transcript: transcript() };
    try {
      const { data: saved } = await supabase.from("sessions").insert(entry).select().single();
      setSessions([...sessions, saved || entry]);
    } catch (e) {
      console.error("Session save failed:", e);
      setSessions([...sessions, entry]);
    }
    setReport({ ...entry, scores }); setBusy(false); setScreen("summary");
  }
  const next = () => { if (idx + 1 < session.length) { setIdx(idx + 1); setPhase("answer"); } else finish(); };
  const answered = (() => {
    if (!ch) return false;
    const r = resp[ch.id] || {}, it = INTERACTION[ch.type];
    if (it === "choose") return phase === "rethink" ? true : !!r.choice && (r.reason || "").trim().length > 2;
    if (it === "verify") return phase === "rethink" ? true : (r.answer || "").trim().length > 2;
    if (it === "grid") return Object.values(r.notes || {}).some((v) => (v || "").trim().length > 2);
    return (r.answer || "").trim().length > 2;
  })();
  async function deleteChild() { if (!confirm(`Delete ${child.name} and all their data? This cannot be undone.`)) return; await supabase.from("children").delete().eq("id", child.id); setChild(null); loadChildren(); }
  function exportChild() { const blob = new Blob([JSON.stringify({ child, sessions }, null, 2)], { type: "application/json" }); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = `${child.name}-yellowowl.json`; a.click(); URL.revokeObjectURL(u); }

  // ── BOOT / LOADING ──
  if (screen === "boot" || screen === "loading") return (<Shell max={520}><div style={{ textAlign: "center", paddingTop: 70 }}><div style={{ animation: "bob 1.6s ease infinite", display: "inline-block" }}><Owl size={92} mood={screen === "loading" ? "think" : "calm"} /></div><H size={24}>{screen === "boot" ? "Waking the owl…" : report === null && session.length ? "Hmm, let me see how you think…" : "Getting your adventure ready…"}</H></div></Shell>);

  // ── LOGIN ──
  if (screen === "login") return (<Shell max={460}><div style={{ textAlign: "center", marginBottom: 20 }}><Owl size={92} /><H size={34}>Yellow Owl</H><p style={{ color: C.slate, fontSize: 16, marginTop: 6 }}>A weekly thinking adventure for curious kids. Parents sign in here.</p></div>
    <Card accent={C.sun}>{sent ? <div style={{ textAlign: "center" }}><Eyebrow>Check your email</Eyebrow><p style={{ marginTop: 8 }}>We sent a link to <b>{email}</b>. Tap it to sign in.</p></div> : <><Eyebrow>Parent sign in</Eyebrow><p style={{ color: C.slate, fontSize: 14, margin: "6px 0 10px" }}>No password needed — we email you a one-tap link.</p><Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} /><div style={{ marginTop: 16 }}><Btn onClick={sendLink} disabled={busy || !email.includes("@")} style={{ width: "100%" }}>{busy ? "Sending…" : "Email me a link →"}</Btn></div>{msg ? <p style={{ color: C.coral, fontSize: 13, marginTop: 10 }}>{msg}</p> : null}</>}</Card></Shell>);

  // ── PICKER ──
  if (screen === "picker") return (<Shell max={520}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}><div><H size={28}>Welcome back!</H><p style={{ color: C.slate }}>Who's playing today?</p></div><button onClick={() => supabase.auth.signOut()} style={{ background: "none", border: "none", color: C.slate, cursor: "pointer", fontFamily: "Fredoka", fontWeight: 600 }}>Sign out</button></div>
    <div style={{ display: "grid", gap: 10 }}>{children.map((c) => (<button key={c.id} onClick={() => resume(c)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 18, border: `2px solid ${C.line}`, background: C.paper, cursor: "pointer", fontSize: 18, fontFamily: "Fredoka", fontWeight: 700, color: C.ink }}><span>{c.name}</span><span style={{ color: C.slate, fontWeight: 500, fontSize: 14 }}>{TRACKS[c.track].label}</span></button>))}</div>
    <div style={{ textAlign: "center", marginTop: 18 }}><Btn kind="ghost" onClick={() => { setForm({ name: "", age: "11", interest: "Space", consent: false }); setMsg(""); setScreen("newchild"); }}>+ Add a child</Btn></div></Shell>);

  // ── NEW CHILD ──
  if (screen === "newchild") return (<Shell max={560}><div style={{ textAlign: "center", marginBottom: 18 }}><Owl size={84} /><H size={30}>Add a child</H></div>
    <Card accent={C.sun}>
      <Eyebrow>Their details</Eyebrow>
      <div style={{ marginTop: 8 }}><Input placeholder="First name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", marginTop: 14 }}>
        <div style={{ width: 130 }}><Eyebrow color={C.slate}>Age</Eyebrow><select value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} style={{ width: "100%", padding: 13, borderRadius: 14, border: `2px solid ${C.line}`, fontSize: 16, marginTop: 8, fontFamily: "Andika", background: C.paper }}>{[9, 10, 11, 12, 13].map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
        <div style={{ paddingBottom: 6 }}><TrackChip tk={trackFor(form.age)} /></div>
      </div>
      <div style={{ marginTop: 14 }}><Eyebrow color={C.slate}>What they love</Eyebrow><div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 10 }}>{INTERESTS.map((it) => (<button key={it} onClick={() => setForm({ ...form, interest: it })} style={{ padding: "9px 16px", borderRadius: 20, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Fredoka", border: `2px solid ${form.interest === it ? C.teal : C.line}`, background: form.interest === it ? C.teal : C.paper, color: form.interest === it ? C.paper : C.slate }}>{it}</button>))}</div></div>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 20, fontSize: 14, color: C.slate, cursor: "pointer" }}><input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} style={{ marginTop: 3 }} /><span>I am this child's parent or guardian and I agree to them using Yellow Owl. Their answers are saved privately — I can export or delete them any time.</span></label>
      {msg ? <p style={{ color: C.coral, fontSize: 13, marginTop: 10 }}>{msg}</p> : null}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
        <Btn onClick={() => createChild(true)} disabled={busy || !form.name.trim() || !form.consent} style={{ flex: 1, minWidth: 180 }}>Start with a warm-up →</Btn>
        <Btn kind="ghost" onClick={() => createChild(false)} disabled={busy || !form.name.trim() || !form.consent} style={{ flex: 1, minWidth: 130 }}>Skip to session</Btn>
      </div>
    </Card></Shell>);

  // ── BASELINE (MCQ) ──
  if (screen === "baseline" && baseDef) {
    if (baseStage === "result") return (
      <Shell max={600}>
        <div style={{ textAlign: "center", marginBottom: 18 }}><Owl size={80} mood="cheer" /><H size={28}>You're all set!</H><p style={{ color: C.slate }}>This is where {child.name} starts. The owl will watch them grow!</p></div>
        <Card accent={C.navy}><Eyebrow color={C.navy}>Starting stars</Eyebrow><div style={{ display: "grid", gap: 12, marginTop: 14 }}>{T.keys.map((k) => (<div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: 600 }}>{T.childLabel[k]}</span><Stars n={baseline[k]} /></div>))}</div></Card>
        <div style={{ textAlign: "center", marginTop: 22 }}><Btn onClick={() => startSession()}>Start week 1 →</Btn></div>
      </Shell>
    );
    const allPicked = baseDef.stages.every((st, i) => (st.options || []).length > 0 ? baseAns[i] !== undefined : (baseAns[i] || "").trim().length > 1);
    return (
      <Shell max={680}>
        <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}><Eyebrow>Warm-up quiz</Eyebrow><TrackChip tk={tk} /></div>
        <Card accent={C.cyan}>
          <Scene interest={child.interest} />
          <H size={24}>Quick warm-up</H>
          <p style={{ fontSize: 17, lineHeight: 1.6, marginTop: 10 }}>{baseDef.scenario}</p>
          <p style={{ color: C.slate, fontSize: 14, marginTop: 4 }}>Pick the best answer for each question.</p>
          <div style={{ display: "grid", gap: 22, marginTop: 16 }}>
            {baseDef.stages.map((st, i) => (
              <div key={i}>
                <Eyebrow color={C.slate}>{i + 1}. {st.label}</Eyebrow>
                <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, margin: "6px 0 10px" }}>{st.q}</p>
                {(st.options || []).length > 0 ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    {st.options.map((opt, j) => (
                      <MCQOption key={j} label={opt} selected={baseAns[i] === j} onClick={() => setBaseAns({ ...baseAns, [i]: j })} />
                    ))}
                  </div>
                ) : (
                  <SmallText value={baseAns[i] || ""} onChange={(v) => setBaseAns({ ...baseAns, [i]: v })} placeholder="Write your answer here…" />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
            <Btn onClick={scoreBaseline} disabled={!allPicked}>See where I start! →</Btn>
          </div>
        </Card>
      </Shell>
    );
  }

  // ── HOME / DEN ──
  if (screen === "home" && child) {
    const show = latest || baseline;
    return (<Shell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Owl size={54} /><div><H size={26}>{child.name}'s den</H><div style={{ color: C.slate, fontSize: 14 }}>Week {sessions.length + 1} · {child.interest}</div></div></div>
        <button onClick={() => { setChild(null); setScreen("picker"); }} style={{ background: "none", border: "none", color: C.teal, fontFamily: "Fredoka", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Switch player</button>
      </div>
      <Card accent={C.sun}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}><Eyebrow>Your stars so far</Eyebrow><TrackChip tk={tk} /></div>
        {show ? <>
          <div style={{ display: "grid", gap: 12 }}>{T.keys.map((k) => (<div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: 600 }}>{T.childLabel[k]}</span><Stars n={show[k]} /></div>))}</div>
          {sessions.length ? (<div style={{ marginTop: 18 }}><Eyebrow color={C.slate}>Your trail</Eyebrow><div style={{ display: "flex", alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>{sessions.map((s, i) => (<React.Fragment key={i}>{i > 0 ? <div style={{ width: 24, height: 3, background: C.teal, opacity: .5 }} /> : null}<div style={{ width: 32, height: 32, borderRadius: 16, background: C.teal, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fredoka", fontWeight: 700, fontSize: 14 }}>{s.week}</div></React.Fragment>))}<div style={{ width: 24, height: 3, background: C.line }} /><div style={{ width: 32, height: 32, borderRadius: 16, background: C.sun, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fredoka", fontWeight: 700, animation: "bob 1.8s ease infinite" }}>★</div></div></div>) : null}
        </> : <p style={{ color: C.slate }}>No stars yet — start your first adventure!</p>}
      </Card>
      {lastEntry ? (<><div style={{ height: 14 }} /><Card accent={C.coral}><Eyebrow color={C.coral}>Try next time</Eyebrow><p style={{ fontSize: 17, lineHeight: 1.6, marginTop: 8 }}>{lastEntry.child_tip}</p></Card></>) : null}
      <div style={{ textAlign: "center", margin: "22px 0" }}>
        {!baseline ? <Btn kind="ghost" onClick={async () => { const b = await loadBaseline(tk); setBaseDef(b); setBaseAns({}); setBaseStage("answer"); setScreen("baseline"); }} style={{ marginRight: 10 }}>Warm-up first</Btn> : null}
        <Btn onClick={() => startSession()}>Start week {sessions.length + 1} →</Btn>
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}><button onClick={() => setGrown(!grown)} style={{ background: "none", border: "none", color: C.slate, cursor: "pointer", fontFamily: "Fredoka", fontWeight: 600, fontSize: 14 }}>{grown ? "▾ Hide grown-up view" : "▸ Grown-up view"}</button></div>
      {grown ? <Card accent={C.navy}><Eyebrow color={C.navy}>For grown-ups</Eyebrow>
        {show ? <div style={{ marginTop: 14 }}><Bars tk={tk} scores={show} base={baseline} /></div> : null}
        {sessions.length ? <div style={{ marginTop: 16 }}><Eyebrow color={C.slate}>Past sessions</Eyebrow><div style={{ display: "grid", gap: 12, marginTop: 10 }}>{[...sessions].reverse().map((s) => (<div key={s.week} style={{ borderLeft: `3px solid ${C.line}`, paddingLeft: 14 }}><div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 14 }}>Week {s.week} <span style={{ color: C.slate, fontWeight: 400 }}>· work on: {s.weakness}</span></div>{(s.highlights || []).map((h, i) => <div key={i} style={{ fontSize: 14, fontStyle: "italic", color: C.slate, marginTop: 4 }}>"{h}"</div>)}</div>))}</div></div> : null}
        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}><Btn kind="ghost" onClick={exportChild}>Export data</Btn><Btn kind="ghost" onClick={deleteChild} style={{ color: C.coral, borderColor: "#F3C9BC" }}>Delete child</Btn></div>
      </Card> : null}
    </Shell>);
  }

  // ── SESSION ──
  if (screen === "session" && ch) {
    const r = resp[ch.id] || {}, it = INTERACTION[ch.type], meta = TYPE_META[ch.type] || { eb: ch.type, accent: C.teal }, remaining = session.length - idx - 1;
    const ghost = (dy, sc, op) => ({ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, transform: `translateY(${dy}px) scale(${sc})`, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 24, opacity: op, zIndex: 1 });
    // How many list boxes to show: parse from prompt text, fall back to per-type defaults
    const ideaCount = ch.type === "generate"
      ? (listCount(ch.prompt) || 5)
      : ch.type === "cause"
      ? (listCount(ch.prompt) || 3)
      : listCount(ch.prompt);
    return (<Shell>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
        {session.map((_, i) => (<React.Fragment key={i}>{i > 0 ? <div style={{ width: 22, height: 3, background: i <= idx ? C.teal : C.line }} /> : null}<div style={{ width: 26, height: 26, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", background: i < idx ? C.teal : i === idx ? C.sun : C.paper, border: `2px solid ${i <= idx ? "transparent" : C.line}`, color: i < idx ? C.paper : C.ink, fontFamily: "Fredoka", fontWeight: 700, fontSize: 13 }}>{i < idx ? "✓" : i + 1}</div></React.Fragment>))}
        <span style={{ marginLeft: "auto", fontFamily: "Fredoka", fontWeight: 700, color: C.slate, fontSize: 14 }}>Stop {idx + 1} of {session.length}</span>
      </div>
      <div style={{ position: "relative" }}>
        {remaining > 0 ? <div style={ghost(10, .97, .7)} /> : null}
        {remaining > 1 ? <div style={ghost(20, .94, .45)} /> : null}
        <div key={idx} style={{ position: "relative", zIndex: 2, animation: "deal .4s ease" }}>
          <Card accent={meta.accent}>
            <Scene interest={child.interest} />
            <Eyebrow color={meta.accent}>{meta.eb}</Eyebrow>
            <H size={26}>{ch.title}</H>
            <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 10 }}>{ch.scenario}</p>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: C.navy, fontWeight: 500 }}>{ch.prompt}</p>

            {/* Numbered list boxes when prompt asks for multiple items, plain text otherwise */}
            {it === "text" && ideaCount > 0 ? (
              <IdeaList
                count={ideaCount}
                values={r.ideas || []}
                label={ch.type === "generate" ? "Idea" : ch.type === "cause" ? "Reason" : "Point"}
                onChange={(i2, val) => updateIdea(ch.id, i2, val, ideaCount)}
              />
            ) : null}
            {it === "text" && ideaCount === 0 ? (
              <SmallText value={r.answer || ""} onChange={(v) => setField(ch.id, "answer", v)} placeholder="Write your thinking here…" />
            ) : null}

            {/* Grid of notes for analyse challenges */}
            {it === "grid" ? (
              <div style={{ display: "grid", gap: 12, marginTop: 6 }}>
                {(ch.options || []).map((o, j) => (
                  <div key={j}>
                    <div style={{ fontFamily: "Fredoka", fontWeight: 700, color: C.navy, marginBottom: 6 }}>{o}</div>
                    <SmallText minHeight={60} value={(r.notes || {})[j] || ""} onChange={(v) => setField(ch.id, "notes", { ...(r.notes || {}), [j]: v })} placeholder="Who does it help? What could go wrong?" />
                  </div>
                ))}
              </div>
            ) : null}

            {/* MCQ for evaluate, decision, mystery, information */}
            {it === "choose" ? (
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "grid", gap: 8 }}>
                  {(ch.options || []).map((o, j) => (
                    <MCQOption key={j} label={o} selected={r.choice === o} disabled={phase === "rethink"} onClick={() => setField(ch.id, "choice", o)} />
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>
                  <Eyebrow color={C.slate}>{ch.type === "mystery" ? "How do you know?" : "Why did you pick that?"}</Eyebrow>
                  <SmallText value={r.reason || ""} onChange={(v) => setField(ch.id, "reason", v)} disabled={phase === "rethink"} placeholder="Tell the owl why." minHeight={70} />
                </div>
              </div>
            ) : null}

            {/* Text for dilemma (verify) */}
            {it === "verify" ? (
              <SmallText value={r.answer || ""} onChange={(v) => setField(ch.id, "answer", v)} disabled={phase === "rethink"} placeholder="How would you check if it's true?" minHeight={80} />
            ) : null}

            {/* Curveball / rethink */}
            {phase === "rethink" && r.curveball ? (
              <div style={{ marginTop: 16, padding: 18, borderRadius: 18, background: "#FFF6E8", border: `2px solid ${C.sun}`, animation: "slidein .4s ease" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0 }}><Owl size={46} mood="think" /></div>
                  <div><div style={{ fontFamily: "Fredoka", fontWeight: 700, color: C.coral, fontSize: 14 }}>Wait a sec…</div><p style={{ margin: "4px 0 0", fontSize: 17, lineHeight: 1.55 }}>{r.curveball}</p></div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <SmallText minHeight={70} value={r.revised || ""} onChange={(v) => setField(ch.id, "revised", v)} placeholder="Does this change your mind? Say why." />
                </div>
              </div>
            ) : null}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 22 }}>
              {committing(ch.type) && phase === "answer"
                ? <Btn kind="warm" onClick={lockCommit} disabled={!answered || busy}>{busy ? "Thinking…" : "That's my answer →"}</Btn>
                : <Btn onClick={next} disabled={!answered || busy}>{idx + 1 < session.length ? "Next →" : "Finish! →"}</Btn>}
            </div>
          </Card>
        </div>
      </div>
    </Shell>);
  }

  // ── SUMMARY ──
  if (screen === "summary" && report) return (<Shell>
    <div style={{ textAlign: "center", marginBottom: 18 }}><div style={{ animation: "bob 1.6s ease infinite", display: "inline-block" }}><Owl size={88} mood="cheer" /></div><H size={32}>You did it, {child.name}!</H><p style={{ color: C.slate, fontSize: 16 }}>Week {report.week} done — saved to your den.</p></div>
    <Card accent={C.sun}><Eyebrow>What you showed this week</Eyebrow><div style={{ display: "grid", gap: 14, marginTop: 14 }}>{T.keys.map((k) => (<div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: 600, fontSize: 16 }}>{T.childLabel[k]}</span><Stars n={report.scores[k]} /></div>))}</div></Card>
    <div style={{ height: 16 }} /><Card accent={C.teal}><Eyebrow>Try next time</Eyebrow><p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 8 }}>{report.child_tip}</p></Card>
    <div style={{ textAlign: "center", margin: "22px 0 10px" }}><Btn onClick={() => setScreen("home")}>Back to your den →</Btn></div>
    <div style={{ textAlign: "center", marginBottom: 8 }}><button onClick={() => setGrown(!grown)} style={{ background: "none", border: "none", color: C.slate, cursor: "pointer", fontFamily: "Fredoka", fontWeight: 600, fontSize: 14 }}>{grown ? "▾ Hide grown-up view" : "▸ Grown-up view"}</button></div>
    {grown ? <Card accent={C.navy}><Eyebrow color={C.navy}>For grown-ups</Eyebrow>
      <div style={{ marginTop: 14 }}><Bars tk={tk} scores={report.scores} base={baseline} /></div>
      <div style={{ marginTop: 14, display: "inline-flex", padding: "8px 14px", borderRadius: 20, background: "#E7F6F2", color: C.teal, fontWeight: 700, fontSize: 13, fontFamily: "Fredoka" }}>Changed mind when challenged: {report.responsiveness}/4</div>
      <p style={{ fontSize: 15, lineHeight: 1.7, marginTop: 14, color: C.slate }}>{report.narrative}</p>
      {report.weakness ? <p style={{ fontSize: 13, color: C.slate, marginTop: 8 }}><b>Work on next:</b> {report.weakness}</p> : null}
      {report.highlights && report.highlights.length ? <div style={{ marginTop: 14, display: "grid", gap: 10 }}>{report.highlights.map((h, i) => (<div key={i} style={{ padding: "12px 16px", borderLeft: `4px solid ${C.sun}`, background: C.cream, borderRadius: "0 12px 12px 0", fontSize: 14, fontStyle: "italic" }}>"{h}"</div>))}</div> : null}
    </Card> : null}
  </Shell>);

  return <Shell><div style={{ textAlign: "center", paddingTop: 60 }}><Owl size={70} /><p style={{ color: C.slate }}>Loading…</p></div></Shell>;
}

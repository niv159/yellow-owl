# Yellow Owl — Product Requirements Document

**Version:** Prototype v2  
**Last updated:** June 2026  
**Live URL:** https://yellow-owl-self.vercel.app  
**Repository:** https://github.com/niv159/yellow-owl

---

## 1. What Is Yellow Owl?

Yellow Owl is a weekly thinking-skills app for children aged 9–13. Each week a child works through five short problem-solving challenges, picks up feedback on how they are thinking, and builds a visible record of progress over time.

The app is aimed at parents who want structured, low-screen-time mental exercise for their child — closer to a coached activity than a game. Sessions are designed to take 10–15 minutes.

The app is built on the **Skills Builder Problem Solving** framework, which breaks critical thinking into numbered steps. Yellow Owl covers:

| Track | Ages | Steps covered |
|-------|------|---------------|
| Explorer (Junior) | 9–11 | Step 5 — creating options, Step 6 — analysing options, Step 7 — evaluating options |
| Navigator (Senior) | 12–13 | Step 9 — causation, Step 10 — patterns, Step 12 — logical reasoning |

---

## 2. Who Uses the App

**Parent** — registers with a phone number, sets up one child profile during registration, and receives a 4-character passcode to log in.

**Child** — logs in using the family passcode and is taken directly to their den. The child never needs their own account.

One phone number = one child. There is no multi-child or family account concept. There is no school or teacher-facing view in this prototype.

---

## 3. Key User Journeys

### 3.1 First-time Registration

1. Parent opens the app and sees the login screen.
2. Taps **"Register now"**.
3. A modal opens with a single form that collects:
   - Child's first name
   - Child's age (9–13, a dropdown — the matching track label updates live)
   - What the child loves (one interest from a fixed list of 6, shown as chips)
   - Parent's phone number
   - Consent checkbox (parent confirms they are the guardian)
4. Parent taps **"Get my passcode →"**.
5. The app generates a unique 4-character alphanumeric passcode (e.g. `W3K7`), creates the child's profile, and displays the passcode in large text.
6. *(Production)* The passcode is also sent to the parent's phone via SMS.
7. Parent taps **"Use it now →"** — the passcode is auto-filled and the modal closes.
8. Parent taps **"Let me in →"** and is taken directly to the child's den.

**The passcode is permanent.** It is reused every login. It is the only credential — there is no username or email.

### 3.2 Returning Login

1. Parent (or child) opens the app and types the 4-character passcode.
2. Taps **"Let me in →"** and is taken directly to the child's den.

### 3.3 Forgot Passcode

1. Parent taps **"Forgot passcode?"** on the login screen.
2. A modal opens asking for the parent's phone number.
3. Parent taps **"Get new passcode →"**.
4. The app generates a fresh 4-character passcode, invalidates the old one, and displays the new one on screen.
5. *(Production)* The new passcode is also sent to the parent's phone via SMS.
6. Parent taps **"Use it now →"** to log in immediately.

The old passcode stops working immediately when a new one is generated.

### 3.4 Warm-up Baseline Quiz

Offered on the home screen before the first session.

1. Three MCQ questions drawn from a pre-set quiz matching the child's track.
2. Each question has 4 options ordered from best to weakest thinking.
3. Child picks one answer per question, then taps **"See where I start!"**.
4. Scores are calculated instantly (no AI needed): option 0 = 4 stars, 1 = 3 stars, 2 = 1 star, 3 = 0 stars.
5. Result screen shows "Starting stars" per skill — three rows with star ratings.
6. Child then taps **"Start week 1 →"** to begin their first session.

The warm-up is optional — the home screen also offers a **"Skip to session"** path.

### 3.5 Weekly Session

A session contains **5 challenges**, assembled from the built-in question bank:
- 2 from Group 1 (Step 5 junior / Step 9 senior)
- 1 from Group 2 (Step 6 junior / Step 10 senior)
- 2 from Group 3 (Step 7 junior / Step 12 senior)

Questions are randomised each login from a bank of 36 (6 per step per track).

Each challenge card shows:
- A **scene illustration** (SVG) themed around the child's chosen interest
- A **scenario** (2–3 short sentences)
- A **prompt** — what the child should think about
- An **input area** appropriate to the question type (see Section 5)

After answering, the child taps **"That's my answer →"** (for MCQ types) or **"Next →"** (for text types). For MCQ types, a **curveball** follow-up is shown — a short question that adds a new fact or twist to make the child reconsider. The child types a short rethink response, then taps **"Next →"**.

Progress is shown as a breadcrumb bar at the top (challenge 1 of 5, etc.).

### 3.6 Session Summary

After challenge 5 the app scores the session and shows:
- A star rating (0–4) per skill
- A short personalised tip ("Try next time")
- A **"Back to your den →"** button

A collapsible **"Grown-up view"** shows bar charts comparing this session against the baseline, plus quotes pulled from the child's responses.

### 3.7 Child's Den (Home Screen)

Between sessions the child lands on their den, which shows:
- Star ratings from the most recent session
- A trail of numbered circles, one per completed week
- The "Try next time" tip from the last session
- A **"Start week N →"** button
- A **"Sign out"** link (top right)
- A toggle for the grown-up view (export data, delete child, past sessions list)

---

## 4. Interests System

During registration the parent picks one interest from:

`Space · Sports · Animals · Video games · Nature · Art`

The chosen interest:
- Themes the SVG scene illustration on every challenge card
- Is used to filter AI-generated content from the database (if present)
- Does **not** change the built-in question bank (which is interest-neutral)

---

## 5. Question Types and Interactions

### 5.1 Type Map

| Type | Track / Step | Interaction | Description |
|------|-------------|-------------|-------------|
| `generate` | Junior / Step 5 | Numbered text boxes | Brainstorm a list of ideas |
| `analyse` | Junior / Step 6 | MCQ pick-one + reason + curveball | Pick the better of two options and explain why |
| `evaluate` | Junior / Step 7 | MCQ pick-one + reason + curveball | Choose best of 3 options, defend it |
| `decision` | Junior / Step 7 | MCQ pick-one + reason + curveball | Same as evaluate |
| `cause` | Senior / Step 9 | Numbered text boxes | Rank possible causes of a problem |
| `pattern` | Senior / Step 10 | Plain text | Describe a pattern in data |
| `mystery` | Senior / Step 12 | MCQ pick-one + reason + curveball | Use clues to identify who/what |
| `information` | Senior / Step 12 | MCQ pick-one + reason + curveball | Pick the most trustworthy source |
| `dilemma` | Senior / Step 12 | Plain text + curveball | Reason through a claim |

**MCQ is preferred for ages 9–11.** All junior question types use clickable option buttons wherever the question has pre-defined options. Free-text inputs are only used for `generate` (brainstorming requires open input) and senior `cause`/`pattern` types.

### 5.2 MCQ Curveball Flow

For types that require the child to commit to an answer (`analyse`, `evaluate`, `decision`, `mystery`, `information`, `dilemma`), the flow has two phases:

**Phase 1 — Answer:**
- Child picks an option and writes a short reason.
- Taps **"That's my answer →"** to lock in.

**Phase 2 — Rethink:**
- A curveball question appears (generated by Gemini AI, or a hardcoded fallback if AI is unavailable).
- The curveball adds one new fact that makes the original answer less certain.
- Child writes a short rethink (does this change your mind?).
- Selected option and reason input are locked (greyed out) — child can no longer change them.
- Taps **"Next →"** to proceed.

### 5.3 List Box Interaction

For `generate` and `cause` types where the prompt asks for multiple items (e.g. "Think of 5 ways…"), the app renders a numbered list of individual text inputs rather than one large textarea.

The number of boxes is parsed from the prompt text (e.g. "Think of 5 ways" → 5 boxes). Defaults: `generate` = 5, `cause` = 3.

---

## 6. Built-in Question Bank

Located in `lib/questionBank.js`. 36 questions total — 6 per step, across 3 steps per track.

**Junior bank (18 questions)**
- Group 1 (generate, step 5): Noisy Library, Playground Litter, Rainy Break, Broken Bench, New Student, Hot Classroom
- Group 2 (analyse, step 6): Sports Day, Lunch Menu, Reading Challenge, Walk to School, After-School Club, Helper Role
- Group 3 (evaluate/decision, step 7): School Trip, Playground Upgrade, Class Pet, Friday Lesson, Fundraiser, Community Project

**Senior bank (18 questions)**
- Group 1 (cause, step 9): Empty Bus, Maths Results Drop, Empty Lunch Hall, Late Arrivals, Chess Club Dropout, Library Decline
- Group 2 (pattern, step 10): Breakfast Club, Reading Test Scores, Playground Accidents, Canteen Queue Times, School Water Use, Weekly Absences
- Group 3 (mystery/information/dilemma, step 12): Copied Project, Missing Money, Is It Healthy, Homework Debate, Cramming Claim, Reading Programme

The database (`content_bank` table) can hold AI-generated questions as a supplement. The app prefers the database if it has ≥ 5 rows for the given track; otherwise it falls back to the built-in bank.

---

## 7. Scoring

### 7.1 Baseline (Warm-up Quiz)

Scored instantly, locally, no AI required.

| Option position | Stars |
|----------------|-------|
| 0 (best thinking) | 4 ★ |
| 1 | 3 ★ |
| 2 | 1 ★ |
| 3 (weakest thinking) | 0 ★ |

### 7.2 Weekly Session Scoring

**Primary (AI):** The full session transcript is sent to the Gemini API (`gemini-1.5-flash`). The API returns a star score (0–4) per skill, a child tip, a weakness phrase, a parent narrative, and up to 2 highlight quotes.

**Fallback (local):** If no valid Gemini API key is configured, or if the API call fails, a local rule-based scorer runs instead. It measures:
- Average response length across all challenges
- Number of distinct ideas in list answers
- Whether the child engaged with rethink questions

This produces meaningful, differentiated scores rather than a flat default.

### 7.3 Responsiveness Score

Separately tracks how much the child engaged with the curveball rethink questions (0–4). Stored alongside session scores.

### 7.4 Skill Keys by Track

| Track | Skill keys |
|-------|-----------|
| Junior | `creating`, `analysing`, `evaluating` |
| Senior | `causation`, `patterns`, `logic` |

---

## 8. Technical Architecture

### 8.1 Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.3 (App Router), React 18 |
| Hosting | Vercel (auto-deploys on push to `main`) |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| AI | Google Gemini 1.5 Flash (free tier) |
| Styling | Inline styles only — no CSS framework |
| Fonts | Fredoka (headings), Andika (body) — loaded from Google Fonts |

### 8.2 Module Type

The project uses `"type": "module"` (ESM throughout). All imports must use ESM syntax. No CommonJS `require()`.

### 8.3 Deployment

Vercel is connected to the GitHub repo. Every push to `main` triggers an automatic production deployment. There is no staging environment in this prototype.

### 8.4 Environment Variables

All variables must be set in Vercel project settings (Settings → Environment Variables).

| Variable | Where to get it | Used by |
|----------|----------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Client |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API | Server only (never exposed to client) |
| `GEMINI_API_KEY` | aistudio.google.com → Get API key (free, starts with `AIza`) | Server only |
| `ADMIN_SECRET` | Anything long and random | Seed endpoint guard |

---

## 9. Database Schema

### `families`
Maps a parent's phone number to their passcode and Supabase auth user. One row per registered family.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `phone` | text UNIQUE | Parent's phone number |
| `passcode` | text UNIQUE | 4-char alphanumeric, e.g. `W3K7`. Replaced entirely on forgot-passcode. |
| `user_id` | uuid FK → auth.users | Created at registration time |
| `created_at` | timestamptz | |

No RLS policies — service role access only. The passcode is the sole login credential; `user_id` links it to Supabase's JWT auth system.

### `children`
One row per child. Created at registration — one child per family account.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `parent_id` | uuid FK → auth.users | Links to the Supabase auth user |
| `name` | text | First name, entered at registration |
| `age` | integer | 9–13, entered at registration |
| `track` | text | `junior` (ages 9–11) or `senior` (ages 12–13), set from age at registration |
| `interest` | text | One of 6 fixed options, selected at registration |
| `baseline_scores` | jsonb | `{ creating: 3, analysing: 2, evaluating: 1 }` etc. Null until warm-up is completed. |
| `created_at` | timestamptz | |

RLS: parent can only read/write their own child (`parent_id = auth.uid()`).

### `sessions`
One row per completed weekly session.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `child_id` | uuid FK → children | |
| `week` | integer | Sequential (1, 2, 3…) |
| `scores` | jsonb | `{ creating: 3, analysing: 2, evaluating: 4 }` |
| `responsiveness` | integer | 0–4, curveball engagement |
| `child_tip` | text | Personalised next-step tip |
| `weakness` | text | One skill phrase to work on |
| `narrative` | text | 2–3 sentence parent summary |
| `highlights` | jsonb | Array of up to 2 quote strings |
| `transcript` | text | Full session text for audit/re-scoring |
| `created_at` | timestamptz | |

RLS: parent can only read/write sessions for their child.

### `content_bank`
AI-generated supplementary questions (optional — app works without them).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `track` | text | `junior` / `senior` |
| `interest` | text | One of 6 interests |
| `step` | integer | Skills Builder step number |
| `type` | text | Question type (see Section 5.1) |
| `title` | text | Short display title |
| `scenario` | text | 1–2 sentence setup |
| `prompt` | text | What the child is asked to do |
| `options` | jsonb | Array of strings (null for text types) |
| `curveball` | text | Follow-up twist (null for non-committing types) |
| `reading_age` | integer | |
| `active` | boolean | |

### `baselines`
Pre-generated warm-up quiz content. Seeded via `/api/seed`.

### `consent`
Records parent consent per child at registration. Stores `agreed = true` and terms version string.

---

## 10. API Endpoints

### `POST /api/auth/register`
Registers a new family. No authentication required.

**Request body:**
```json
{
  "phone": "+44 7700 123456",
  "childName": "Maya",
  "childAge": 10,
  "childInterest": "Space"
}
```

**Behaviour:**
- If phone already exists: returns existing passcode without modifying anything
- Otherwise: generates 4-char passcode → creates Supabase auth user → creates child record → inserts into `families` and `consent` tables
- SMS sending is stubbed out (TODO comment) — passcode is shown on screen

**Response:**
```json
{ "passcode": "W3K7" }
```
or
```json
{ "error": "Please enter a valid phone number." }
```

---

### `POST /api/auth/forgot-passcode`
Generates a new passcode for an existing account. No authentication required.

**Request body:**
```json
{ "phone": "+44 7700 123456" }
```

**Behaviour:**
- Looks up the family by phone number
- Generates a new 4-char passcode
- Updates the Supabase auth user (email and password both change to encode the new passcode)
- Updates the `families` table
- Old passcode is immediately invalidated
- SMS sending is stubbed out (TODO comment)

**Response:**
```json
{ "passcode": "K8MB" }
```
or
```json
{ "error": "No account found for this number." }
```

---

### `POST /api/score`
Scores a completed session. Requires Bearer token (Supabase session JWT).

**Request body:**
```json
{
  "childId": "uuid",
  "age": 10,
  "track": "junior",
  "keys": ["creating", "analysing", "evaluating"],
  "transcript": "Challenge 1 [generate, step 5] ..."
}
```

**Behaviour:**
1. Validates JWT via `admin.auth.getUser(token)`
2. Calls Gemini API with the transcript
3. If Gemini fails or key is invalid → falls back to local `scoreFromTranscript()` function

**Response:**
```json
{
  "creating": 3,
  "analysing": 2,
  "evaluating": 4,
  "highlights": ["Great idea about...", "Good point on..."],
  "childTip": "Next time, try...",
  "weakness": "analysing",
  "narrative": "Parent-facing 2-3 sentence summary.",
  "responsiveness": 2
}
```

---

### `POST /api/curveball`
Generates a curveball follow-up question. Requires Bearer token.

**Request body:**
```json
{
  "age": 10,
  "scenario": "...",
  "prompt": "...",
  "options": ["Option A", "Option B"],
  "answer": "Chose: Option A. Because: ..."
}
```

**Behaviour:** Calls Gemini. If Gemini fails → returns one of 4 hardcoded fallback curveballss.

**Response:** `{ "curveball": "What if Option A was no longer available?" }`

---

### `POST /api/seed`
Seeds the `content_bank` and `baselines` tables with AI-generated content. Protected by `ADMIN_SECRET` header.

**Header:** `Authorization: Bearer <ADMIN_SECRET>`

This endpoint is called once to populate the AI-generated question bank. The built-in question bank in `lib/questionBank.js` means this is optional.

---

## 11. Key Design Decisions (Rationale)

**4-character passcode, not email/password.** The target user (parent) shares the login with their child. A short passcode is easy to say out loud, write on a sticky note, or type on a phone. Email magic-links don't work when a child needs to log in independently.

**One phone number = one child.** Simplifies the registration flow, eliminates the profile-picker screen, and makes the login journey as short as possible. A family with multiple children creates separate accounts with separate phone numbers if needed.

**Child profile created at registration.** The old flow required login → child picker → add child → enter details. The new flow collapses this: registration captures everything at once and the child's den is available immediately after first login.

**Supabase auth as the backend for passcodes.** Each passcode maps to a Supabase auth user (email = `passcode@yellowowl.app`, password = passcode). This preserves JWT-based auth, Row Level Security, and all Supabase client SDK features without any custom session management.

**Built-in question bank.** The app is fully functional with zero database content. 36 pre-written questions mean the prototype works immediately for any new deployment. AI-generated content from the `content_bank` table is additive, not required.

**Local scoring fallback.** The Gemini API is optional. The app scores by measuring effort from the transcript (response length, idea count, curveball engagement) when no API key is present. This prevents the loading screen from hanging and gives meaningful feedback.

**MCQ preference for ages 9–11.** All junior question types with pre-defined options use clickable buttons. Free-text inputs are only used where brainstorming is the point (`generate`) or where no options exist (`cause`, `pattern`).

---

## 12. What Still Needs to Be Built (Production Gaps)

### High Priority

| # | Item | Detail |
|---|------|--------|
| 1 | **SMS delivery** | Both `/api/auth/register` and `/api/auth/forgot-passcode` have TODO stubs for SMS. Integrate Twilio (or similar) to send the passcode to the parent's phone. Without SMS, parents must copy the passcode from the screen. |
| 2 | **Session locking** | Nothing prevents pressing "Start week 2" immediately after finishing week 1. Add a cooldown (e.g. 5 days between sessions) or a manual unlock by the parent. |
| 3 | **Valid Gemini API key** | The current key in `.env.deploy` is an invalid OAuth token. Replace with a key from aistudio.google.com (free, starts with `AIza`). Without this, all scoring uses the local fallback. |

### Medium Priority

| # | Item | Detail |
|---|------|--------|
| 4 | **Parent notifications** | No way to notify parents that a session was completed or remind them weekly. Consider adding email at registration for weekly digests. |
| 5 | **Track change on birthday** | A child's track is set from their age at registration. There is no mechanism to move from junior to senior when they turn 12. |
| 6 | **Mobile testing** | The app uses responsive max-widths and works on mobile, but has not been tested across real devices and screen sizes. |
| 7 | **Accessibility** | Custom interactive elements (MCQ buttons, passcode input) need ARIA roles, keyboard navigation, and focus management reviewed. |

### Low Priority / Future

| # | Item | Detail |
|---|------|--------|
| 8 | **Endline assessment** | The `baselines` table supports a `form = 'endline'` row. An endline quiz (run after several weeks to measure growth against the baseline) is not yet triggered from the UI. |
| 9 | **AI content bank seeding UI** | The `/api/seed` endpoint can only be called via curl. A simple admin page would make content regeneration more accessible. |
| 10 | **Question variety** | 36 built-in questions is enough for a prototype, but a child doing 6+ sessions will see repeats. The AI content bank (interest-matched, unlimited) is the long-term solution — it needs a valid Gemini key. |
| 11 | **Progress sharing** | Parents can export raw JSON from the grown-up view. A formatted, printable or shareable progress report would be more useful. |
| 12 | **Offline support** | No offline capability. If connectivity is lost mid-session, the session is lost. |

---

## 13. File Structure (Key Files)

```
app/
  page.jsx                            — entire single-page app (login → session → summary)
  api/
    auth/
      register/route.js               — registration: generates passcode, creates child profile
      forgot-passcode/route.js        — forgot flow: generates new passcode, invalidates old one
    score/route.js                    — session scoring (AI + local fallback)
    curveball/route.js                — curveball question generation
    seed/route.js                     — AI content bank seeding (admin only)
  layout.js                           — font loading, global styles

lib/
  supabaseBrowser.js                  — Supabase client (anon key, browser-side)
  questionBank.js                     — 36 built-in questions + buildSessionFromBank()
  anthropic.js                        — Gemini API client wrapper
  bankgen.js                          — AI generation pipeline for content_bank seeding

supabase/
  schema.sql                          — full DB schema, idempotent, run once

deploy.js                             — one-command deployment script (GitHub + Supabase + Vercel)
```

---

## 14. Running Locally

```bash
# 1. Clone and install
git clone https://github.com/niv159/yellow-owl.git
cd yellow-owl
npm install

# 2. Create .env.local (copy from .env.local.example and fill in values)
cp .env.local.example .env.local

# 3. Run the schema once in Supabase SQL Editor
# (paste the contents of supabase/schema.sql and run)

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

To run a full automated deployment to Vercel from scratch, fill in `.env.deploy` and run `node deploy.js`.

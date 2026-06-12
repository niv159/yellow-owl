# Yellow Owl — build notes

This folder is **Stage 1 of 2**: the foundation. It is code, not yet a running
website. You don't need to understand any of it — the steps below are all
copy-paste. Stage 2 adds the screens kids and parents see, plus the one-hour
deploy walkthrough.

## What's in here

- `supabase/schema.sql` — the database (tables + privacy rules so each parent
  only ever sees their own child's data).
- `lib/` and `app/api/` — the **secure backend**. Your Anthropic key lives here,
  on the server, never in a child's browser.
- `lib/bankgen.js` + `app/api/seed/route.js` — the **AI generation pipeline**.
  The model writes the entire content bank itself. Nothing is hand-written.
- The two AI calls that cost money — `curveball` (reacts to the child's answer)
  and `score` (grades a finished session) — each tiny, each capped per child
  per day so the bill can never run away.

## What you can do now (≈10 minutes)

1. Create a free Supabase account and a new project.
2. In Supabase: **SQL Editor → New query →** paste all of `supabase/schema.sql`
   → **Run**. That builds the database.

That's the only part that runs today. The backend and the generation pipeline
go live in Stage 2 when we deploy the site to Vercel — at which point you'll
visit one protected URL once, and the AI fills the content bank by itself.

## What's coming in Stage 2

- The child app (the journey you've been testing) and the parent dashboard.
- A parental-consent step at sign-up, plus export/delete buttons.
- The numbered, screenshot-level deploy guide (GitHub → Vercel → keys → live link).

## Honest notes

- I write all the code; you create the accounts and paste the keys. No coding.
- I can't run this from here, so when something errors on deploy, paste the
  message back and I'll fix it — expect one or two rounds, that's normal.
- This handles **children's data**. Before 200 real kids use it, have someone
  technical/legal glance at the consent wording and data handling for your
  region (India DPDP / COPPA / GDPR-K). I'm not a lawyer.
- Costs: hosting is free; AI is roughly **$10–20 for the whole 200-child pilot**.
  Set a spend cap in the Anthropic dashboard for peace of mind.

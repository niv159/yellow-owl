# Deploy Yellow Owl — the one-hour, no-coding guide

You will create four free accounts and paste some values. You won't write code.
Do the steps in order. Where it says **copy this**, keep it somewhere safe for a moment.

---

## 1. Supabase (your database) — ~10 min

1. Go to supabase.com → sign up → **New project**. Pick any name and a strong
   database password (you won't need it again). Wait for it to finish setting up.
2. Left menu → **SQL Editor** → **New query**. Open the file `supabase/schema.sql`
   from this folder, copy ALL of it, paste, and press **Run**. You should see
   "Success". That built your tables.
3. Left menu → **Project Settings → API**. Copy these three and keep them:
   - **Project URL**
   - **anon public** key
   - **service_role** key (secret — never share)

> Email login is on by default. We'll point it at your live site in step 5.

## 2. Anthropic (the AI) — ~5 min

1. Go to console.anthropic.com → sign up.
2. **Settings → Billing** → add a small amount of credit (e.g. $5) and set a
   **monthly spend limit** (e.g. $20) for total peace of mind.
3. **API Keys → Create key** → copy it (starts with `sk-ant-`).

## 3. Put the code on GitHub — ~10 min

1. Go to github.com → sign up → **New repository** → name it `yellow-owl` →
   **Create**.
2. On the new repo page click **uploading an existing file**.
3. Drag in **everything inside this `yellow-owl` folder** (the `app`, `lib`,
   `supabase` folders and the loose files like `package.json`). Click
   **Commit changes**.

> Tip: keep the folder structure — `app/` and `lib/` must stay as folders.

## 4. Vercel (hosting) — ~10 min

1. Go to vercel.com → **Sign up with GitHub**.
2. **Add New → Project** → import your `yellow-owl` repo.
3. Before deploying, open **Environment Variables** and add these five
   (names exactly as shown; values from steps 1 and 2):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
   | `SUPABASE_SERVICE_KEY` | Supabase service_role key |
   | `ANTHROPIC_API_KEY` | your Anthropic key |
   | `ADMIN_SECRET` | make up a long random password |

4. Click **Deploy**. After a minute you'll get a live link like
   `https://yellow-owl-xxxx.vercel.app`. **Copy it.**

## 5. Point login at your site — ~2 min

1. Back in Supabase → **Authentication → URL Configuration**.
2. Set **Site URL** to your Vercel link. Add the same link under **Redirect URLs**.
   Save. (This makes the email magic-link return to your site.)

## 6. Let the AI write the content — ~1 min, once

1. In your browser, visit:
   `https://YOUR-VERCEL-LINK/api/seed?key=YOUR_ADMIN_SECRET`
   (use your real link and the `ADMIN_SECRET` you chose in step 4).
2. Wait a few seconds. You should see something like
   `{"ok":true,"challenges":40,"baselines":4}`. The AI just wrote the whole
   content bank. Re-run this anytime to refresh it.

## 7. Try it

Open your Vercel link → enter your email → click the link in your inbox →
add a child → do a session. The parent dashboard ("Grown-up view") shows the
growth and the saved answers.

---

## If something goes wrong

- A red error on Vercel during deploy, or a blank page → copy the error text
  (Vercel shows build logs) and send it to me; I'll give you the one-line fix.
- The seed link shows `unauthorized` → the `key=` doesn't match your
  `ADMIN_SECRET`. Check for typos.
- Login email doesn't arrive → check spam, and confirm step 5 (Site URL).

## Before 200 real kids

- Have someone glance at the consent wording for your region (India DPDP /
  COPPA / GDPR-K). I'm not a lawyer.
- Do one human skim of the generated bank (Supabase → Table editor →
  `content_bank`) — about 30 minutes, once.
- Costs stay around $10–20 of AI for the whole pilot; hosting is free.

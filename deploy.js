#!/usr/bin/env node
// Yellow Owl — one-command deployer
// Usage:
//   1. Copy .env.deploy.example → .env.deploy and fill in the 4 tokens
//   2. node deploy.js
//
// What this does automatically:
//   GitHub   → creates repo, pushes code
//   Supabase → creates project, runs schema, gets API keys
//   Vercel   → creates project, sets all env vars, deploys
//   Supabase → configures magic-link redirect URL
//   Yellow Owl → seeds the AI content bank

import { spawnSync, execSync } from "child_process";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const DIR = dirname(fileURLToPath(import.meta.url));

// ── Load .env.deploy ──────────────────────────────────────────────────────────

function loadFile(name) {
  try {
    return readFileSync(join(DIR, name), "utf8");
  } catch {
    return null;
  }
}

function parseEnv(text) {
  const out = {};
  for (const line of (text || "").split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0 && !line.trim().startsWith("#")) {
      out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
  }
  return out;
}

const creds = parseEnv(loadFile(".env.deploy"));
const { GITHUB_TOKEN, SUPABASE_TOKEN, VERCEL_TOKEN, GEMINI_API_KEY } = creds;
const ADMIN_SECRET =
  creds.ADMIN_SECRET ||
  "yo-admin-" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);

const MISSING = ["GITHUB_TOKEN", "SUPABASE_TOKEN", "VERCEL_TOKEN", "GEMINI_API_KEY"].filter(
  (k) => !creds[k]
);
if (MISSING.length) {
  console.error("\n❌  Missing in .env.deploy:", MISSING.join(", "));
  console.error("   Copy .env.deploy.example → .env.deploy and fill it in.\n");
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function api(url, { method = "GET", headers = {}, body, okIfStatus } = {}) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok && res.status !== okIfStatus) {
    throw new Error(`${method} ${url} → ${res.status}\n${text.slice(0, 400)}`);
  }
  try { return JSON.parse(text); } catch { return text; }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function step(n, msg) { console.log(`\n[${n}/5] ${msg}`); }

// ── 1. GitHub ─────────────────────────────────────────────────────────────────

async function setupGitHub() {
  step(1, "📦  GitHub — creating repo and pushing code");

  const me = await api("https://api.github.com/user", {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "User-Agent": "yellow-owl-deploy" },
  });
  const username = me.login;
  console.log(`    user: ${username}`);

  // Create repo (ignore 422 = already exists)
  await api("https://api.github.com/user/repos", {
    method: "POST",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "User-Agent": "yellow-owl-deploy" },
    body: { name: "yellow-owl", private: false, auto_init: false },
    okIfStatus: 422,
  });

  // Set remote and push
  const remote = `https://x-access-token:${GITHUB_TOKEN}@github.com/${username}/yellow-owl.git`;
  const env = { ...process.env, GIT_TERMINAL_PROMPT: "0" };

  spawnSync("git", ["remote", "add", "origin", remote], { cwd: DIR, env, stdio: "pipe" });
  spawnSync("git", ["remote", "set-url", "origin", remote], { cwd: DIR, env, stdio: "pipe" });

  const push = spawnSync("git", ["push", "-u", "origin", "main", "--force"], {
    cwd: DIR, env, stdio: "pipe", encoding: "utf8",
  });
  if (push.status !== 0) throw new Error("git push failed:\n" + push.stderr);

  console.log(`    https://github.com/${username}/yellow-owl ✓`);
  return username;
}

// ── 2. Supabase ───────────────────────────────────────────────────────────────

async function setupSupabase() {
  step(2, "🗄️   Supabase — creating project and running schema");

  const supa = (path, opts = {}) =>
    api(`https://api.supabase.com${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${SUPABASE_TOKEN}`, ...(opts.headers || {}) },
    });

  // Get org
  const orgs = await supa("/v1/organizations");
  if (!orgs?.length) throw new Error("No Supabase org found. Create one at supabase.com first.");
  const orgId = orgs[0].id;
  console.log(`    org: ${orgs[0].name}`);

  // Find or create project
  const allProjects = await supa("/v1/projects");
  let proj = allProjects.find((p) => p.name === "yellow-owl");

  if (!proj) {
    const dbPass =
      "YO_" +
      Math.random().toString(36).slice(2, 10).toUpperCase() +
      Math.random().toString(36).slice(2, 6) +
      "!1";
    proj = await supa("/v1/projects", {
      method: "POST",
      body: {
        name: "yellow-owl",
        organization_id: orgId,
        db_pass: dbPass,
        region: "ap-south-1",
        plan: "free",
      },
    });
    console.log(`    project created: ${proj.id}`);
  } else {
    console.log(`    using existing project: ${proj.id}`);
  }

  const ref = proj.id;

  // Wait until ACTIVE_HEALTHY
  console.log("    waiting for database to start (up to 3 min)...");
  let ready = false;
  for (let i = 0; i < 40; i++) {
    const status = await supa(`/v1/projects/${ref}`);
    if (status.status === "ACTIVE_HEALTHY") { ready = true; break; }
    process.stdout.write(".");
    await sleep(5000);
  }
  if (!ready) throw new Error("Database startup timed out. Run deploy.js again.");
  console.log("\n    database ready ✓");

  // Run schema
  console.log("    running schema...");
  const schema = readFileSync(join(DIR, "supabase/schema.sql"), "utf8");
  try {
    await supa(`/v1/projects/${ref}/database/query`, {
      method: "POST",
      body: { query: schema },
    });
    console.log("    schema applied ✓");
  } catch (e) {
    // If the management API query endpoint isn't available, surface a clear message
    if (e.message.includes("404") || e.message.includes("Not Found")) {
      console.warn(
        "\n    ⚠️  Could not apply schema automatically.\n" +
        "    Please do it manually:\n" +
        "    Supabase → SQL Editor → New query → paste supabase/schema.sql → Run\n" +
        "    Then run deploy.js again (it will skip this step).\n"
      );
    } else {
      throw e;
    }
  }

  // Get API keys
  const keys = await supa(`/v1/projects/${ref}/api-keys`);
  const anonKey = keys.find((k) => k.name === "anon")?.api_key;
  const serviceKey = keys.find((k) => k.name === "service_role")?.api_key;
  const projectUrl = `https://${ref}.supabase.co`;

  console.log(`    project URL: ${projectUrl} ✓`);
  return { projectUrl, anonKey, serviceKey, ref };
}

// ── 3. Vercel ─────────────────────────────────────────────────────────────────

async function setupVercel(supabase) {
  step(3, "🚀  Vercel — deploying app");

  const verc = (path, opts = {}) =>
    api(`https://api.vercel.com${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, ...(opts.headers || {}) },
    });

  // Get account ID for .vercel/project.json
  const me = await verc("/v2/user");
  const orgId = me.user.id;

  // Create or find project
  let projectId;
  try {
    const proj = await verc("/v9/projects", {
      method: "POST",
      body: { name: "yellow-owl", framework: "nextjs" },
    });
    projectId = proj.id;
    console.log("    Vercel project created ✓");
  } catch (e) {
    if (e.message.includes("already exists") || e.message.includes("A project with")) {
      const proj = await verc("/v9/projects/yellow-owl");
      projectId = proj.id;
      console.log("    using existing Vercel project ✓");
    } else throw e;
  }

  // Set env vars — delete any existing ones first, then recreate
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: supabase.projectUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabase.anonKey,
    SUPABASE_SERVICE_KEY: supabase.serviceKey,
    GEMINI_API_KEY,
    ADMIN_SECRET,
  };

  console.log("    setting environment variables...");
  const existing = await verc(`/v9/projects/${projectId}/env?limit=100`);
  for (const ev of existing.envs || []) {
    if (Object.keys(envVars).includes(ev.key)) {
      await verc(`/v9/projects/${projectId}/env/${ev.id}`, { method: "DELETE" });
    }
  }
  for (const [key, value] of Object.entries(envVars)) {
    await verc(`/v9/projects/${projectId}/env`, {
      method: "POST",
      body: { key, value, type: "encrypted", target: ["production", "preview", "development"] },
    });
  }
  console.log("    env vars set ✓");

  // Link project so CLI knows where to deploy
  mkdirSync(join(DIR, ".vercel"), { recursive: true });
  writeFileSync(
    join(DIR, ".vercel/project.json"),
    JSON.stringify({ projectId, orgId })
  );

  // Deploy via npx (no global install needed)
  console.log("    deploying to Vercel (takes ~1 min, progress shown below)...");
  execSync(`npx --yes vercel@latest deploy --prod --token "${VERCEL_TOKEN}" --yes`, {
    cwd: DIR,
    stdio: "inherit",
    env: { ...process.env, VERCEL_TOKEN },
  });

  // Fetch the production URL from the API
  await sleep(3000);
  const deployments = await verc(
    `/v9/projects/${projectId}/deployments?limit=1&state=READY&target=production`
  );
  const latest = deployments.deployments?.[0];
  if (!latest) throw new Error("Could not find a completed Vercel deployment.");

  const siteUrl = `https://${latest.url}`;
  console.log(`\n    live at: ${siteUrl} ✓`);
  return { siteUrl, projectId };
}

// ── 4. Configure Supabase auth redirect ───────────────────────────────────────

async function configureAuth(ref, siteUrl) {
  step(4, "🔐  Configuring magic-link login redirect");

  await api(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${SUPABASE_TOKEN}` },
    body: { site_url: siteUrl, uri_allow_list: `${siteUrl}/**` },
  });
  console.log(`    redirect → ${siteUrl} ✓`);
}

// ── 5. Seed content bank ──────────────────────────────────────────────────────

async function seedContent(siteUrl) {
  step(5, "🦉  Generating AI content bank");
  console.log("    (AI writing all challenges — ~20 seconds)");

  await sleep(8000); // let the deployment fully warm up

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(
        `${siteUrl}/api/seed?key=${encodeURIComponent(ADMIN_SECRET)}`
      );
      const data = await res.json();
      if (data.ok) {
        console.log(`    ${data.challenges} challenges + ${data.baselines} baselines ✓`);
        return;
      }
      if (data.error === "unauthorized") {
        throw new Error("ADMIN_SECRET mismatch — check your .env.deploy file.");
      }
      throw new Error(JSON.stringify(data));
    } catch (e) {
      if (e.message.includes("unauthorized")) throw e;
      if (attempt < 4) {
        console.log(`    attempt ${attempt} failed (${e.message.slice(0, 60)}), retrying in 15s...`);
        await sleep(15000);
      } else {
        throw new Error("Seeding failed after 4 attempts: " + e.message);
      }
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log("\n🟡 Yellow Owl — automated deployment\n" + "─".repeat(46));

  try {
    await setupGitHub();
    const supabase = await setupSupabase();
    const { siteUrl } = await setupVercel(supabase);
    await configureAuth(supabase.ref, siteUrl);
    await seedContent(siteUrl);

    // Save outputs for reference
    writeFileSync(
      join(DIR, ".deploy-output.txt"),
      `App URL: ${siteUrl}\nAdmin secret: ${ADMIN_SECRET}\nSupabase project: ${supabase.ref}\n`
    );

    console.log("\n" + "─".repeat(46));
    console.log("✅  Yellow Owl is live!\n");
    console.log(`   🌐  App:   ${siteUrl}`);
    console.log(`   📊  DB:    https://supabase.com/dashboard/project/${supabase.ref}`);
    console.log("\n   Open the app URL, enter your email, and start!\n");
  } catch (err) {
    console.error("\n❌  Deployment failed:", err.message);
    console.error("\nPaste this error back to Claude Code — it will fix it.\n");
    process.exit(1);
  }
})();

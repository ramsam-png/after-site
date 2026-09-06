# After Form — deploy notes

Your admin edits now save to the server instead of the browser, so every
visitor sees the same data. This only needs **Vercel Blob** — it stores
both the shared product/category/review data (as a JSON file) and any
uploaded photos/videos. (Note: Vercel's old "KV" product was discontinued
in late 2024 — that's why it no longer shows up under Storage. Blob covers
everything this site needs, so there's nothing else to set up.)

## Deploy steps

1. Push this folder to a GitHub repo.
2. Go to vercel.com → **Add New Project** → import the repo. Framework
   preset: "Other" (it's a static site + serverless functions, no build step
   needed).
3. Once the project exists, open it → **Storage** tab → **Create Database**
   → **Blob**. Connect it to the project — Vercel adds the
   `BLOB_READ_WRITE_TOKEN` environment variable automatically.
4. Project → **Settings → Environment Variables**, add:
   - `ADMIN_PASSWORD` = a real password of your choosing. (This replaces the
     old `adminPassword` that used to sit in plain text inside
     `site-config.js` — it's now checked on the server only.)
   - `SITE_PASSWORD` = the password visitors need to unlock the site gate.
     (This replaces the old `sitePassword` — same idea, now server-side, so
     you can change either password anytime from this dashboard without
     touching code or waiting on a code redeploy.)
   - `DISCORD_URL` = your Discord invite link (e.g.
     `https://discord.gg/yourcode`).
   - `TELEGRAM_URL` = your Telegram link (e.g. `https://t.me/yourhandle`).
     These aren't secret — set their **Type** to "Config" rather than
     "Secret" when adding them, since there's no need to hide a public link.
5. Redeploy (Vercel does this automatically after you add storage / env
   vars, or trigger it manually from the Deployments tab).

That's it — visit the live URL, unlock the site gate with `SITE_PASSWORD`,
press **Ctrl+Shift+A**, log in with `ADMIN_PASSWORD`, and any change you make
(products, categories, reviews, photos) now saves centrally and shows up for
every visitor. The Discord/Telegram buttons in the support popup, and the
"Ask on Discord" button on each product, now open `DISCORD_URL` /
`TELEGRAM_URL`.

## Notes / things worth knowing

- To change any of the four values later (both passwords, both links), just
  edit them in Settings → Environment Variables and redeploy (or use
  "Redeploy" from the Deployments tab) — no code changes needed.
- The site gate is still a soft lock meant to keep casual visitors out, not
  a real security boundary — treat it the same way you would a "coming
  soon" page password.
- Local preview (e.g. VS Code Live Preview) won't have `/api/*` available,
  so the page falls back to its built-in defaults / your browser's local
  cache when it can't reach the server — that's expected, it's only the
  deployed Vercel version that's shared.
- Uploaded images/videos and the shared data file all live in your Blob
  store's public storage — anyone with a direct link can view a file, same
  as any other CDN-hosted asset.

# Handover — moving from Windows to MacBook

<!-- Created 2026-08-15. Update this file whenever you change machines or hand
     the project to someone else — it's meant to stay current, not be a
     one-time snapshot. -->

## Status right now

- **Repo:** [github.com/digheshravan/shravan-portfolio](https://github.com/digheshravan/shravan-portfolio) — **public**, `main` branch.
- **Deployed:** [shravandige.dev](https://shravandige.dev), via Vercel, auto-deploys on every push to `main`.
- **Verified before writing this file:** `git fetch origin` then `git status` showed `main` and `origin/main` in sync, and `git push` returned "Everything up-to-date". Every commit from this machine is already on GitHub — there was nothing new to push.
- **Tracked files:** 55, including all source, `docs/adr/*` (9 architecture decisions), `DESIGN.md`, `PRODUCT.md`, and the résumé at `public/Shravan-Dige-CV.pdf`.

## Getting running on the MacBook

```bash
git clone https://github.com/digheshravan/shravan-portfolio.git
cd shravan-portfolio
npm install
npm run dev      # http://localhost:5173
```

That's the whole setup — no `.env` file, no secrets, no platform-specific install step.

**Node.** This machine ran **Node v22.14.0 / npm 11.10.1**. There's no `.nvmrc` pinning a version, so `npm install` will work with any reasonably current Node — but installing v22 on the Mac keeps the two machines identical rather than merely compatible.

**Why this project doesn't need a compatibility pass.** I checked rather than assumed:

- `package.json` scripts (`vite`, `vite build`, `vite preview`) are plain CLI invocations — no `rmdir`, `del`, `set VAR=`, or other shell syntax that differs between `cmd.exe` and `bash`/`zsh`.
- No hardcoded Windows paths anywhere in tracked source (`grep`'d for `C:\`, `C:/Users`, and this machine's username across `src/` — nothing).
- `vite.config.js` already normalises path separators before matching (`id.replace(/\\/g, '/')`) — written for exactly this move, so `manualChunks` behaves identically on both OSes.
- Every dependency (`react`, `three`, `gsap`, `lenis`, `@react-three/*`) is pure JS. The only platform-specific pieces are Rollup/esbuild's native binaries, and those are `node_modules`-local optional dependencies that `npm install` resolves correctly per-OS on its own — nothing to configure.
- `.gitignore` already excludes `.DS_Store`, so macOS Finder won't dirty `git status` once you start working there.

Net: this is a static Vite/React app with zero OS-coupling. It will run on the Mac exactly as it does here.

## Files ignored by git — what exists locally right now

These are on this Windows machine but **not in the GitHub repo**, so `git clone` on the Mac will not bring them. Verified via `git status --ignored`, not from memory.

| Path | Size | What it is | Bring it to the Mac? |
|---|---|---|---|
| `node_modules/` | 220M | Installed dependencies | **No** — `npm install` regenerates it, and doing so is what gets you macOS-native binaries instead of Windows ones. |
| `dist/` | 1.5M | Production build output | **No** — `npm run build` regenerates it. |
| `Shravan_CV 1.pdf` | 116K | Source file the résumé was made from | **Yes, if you still edit from it.** The file the *site* actually serves is `public/Shravan-Dige-CV.pdf`, which is tracked and will arrive with the clone. This one carries a phone number, which is why it's deliberately kept out of the public repo. |
| `N130 Shravan Dige Final Report TIP.pdf` | 1.1M | Tyrannix internship report | **Yes, if you'll reference it again** — it's the source material `PRODUCT.md`'s Experience section was written from. Contains a former employer's internal strategy, mentor names, your SAP/roll numbers, and an unresolved security item in a still-live product, which is exactly why it's gitignored rather than published. |
| `.claude/settings.local.json` | 4K | Local Claude Code settings | No — machine-specific, regenerate as needed. |
| `.impeccable/config.local.json` | 1K | Local config for the impeccable design skill | No — regenerates on first use. |
| `.impeccable/hook.cache.json` | 4K | Cache for the design-review git hook | No — regenerates automatically. |

**Practical move:** copy the two PDFs by hand (AirDrop, USB, cloud drive — whatever you'd normally use) if you still need them as source material. Everything else in that table should simply be regenerated on the new machine, not copied.

## Not part of the portfolio repo at all

Three more things are untracked, but deliberately **outside** `.gitignore`'s job — they were never candidates for this repo in the first place, so I left them alone rather than adding ignore rules for them:

- **`.claude/skills/impeccable/`** (147 files, 3.3M) — the local install of the Impeccable design-review skill, used this session for `document`, `polish`, and the section-head cleanup.
- **`.agents/skills/web-design-guidelines/SKILL.md`** — another installed skill (from `vercel-labs/agent-skills`).
- **`skills-lock.json`** — the lockfile tracking that second install.

These are Claude Code tooling, not portfolio source — a public portfolio repo isn't the right home for someone else's skill-package internals. If you want them on the Mac, reinstall them there through whatever command installed them here (the lockfile records the source as `vercel-labs/agent-skills` on GitHub), rather than copying the raw files across.

## One thing to actually do, not just carry over

`git config core.autocrlf` is `true` on this machine (the normal Windows default). macOS's default is different, but this is **not a problem to fix** — Git already stores every tracked file as LF internally regardless of that setting, so a fresh clone on the Mac checks out clean LF files with nothing to reconcile. Leave `autocrlf` at whatever the Mac's Git defaults to; don't set it to `true` there.

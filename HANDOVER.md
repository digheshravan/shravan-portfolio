# Handover — moving from Windows to MacBook

<!-- Created 2026-08-15, last re-verified 2026-08-16. Update this file whenever
     you change machines or hand the project to someone else — it's meant to
     stay current, not be a one-time snapshot. -->

## Status right now

- **Repo:** [github.com/digheshravan/shravan-portfolio](https://github.com/digheshravan/shravan-portfolio) — **public**, `main` branch.
- **Deployed:** [shravandige.dev](https://shravandige.dev), via Vercel, auto-deploys on every push to `main`.
- **Re-verified 2026-08-16:** `git fetch origin`, then `git status -sb` showed `main` and `origin/main` in sync, `git log origin/main..HEAD` returned nothing (no unpushed commits), and `git diff --stat HEAD` returned nothing (no uncommitted changes to any tracked file). **Everything is on GitHub. There was nothing to commit or push.**
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

## Everything not on GitHub — the complete list

Two different reasons something can be missing from the repo: git is told to ignore it (`.gitignore`), or it was never part of the portfolio to begin with (Claude Code tooling installs). Either way, `git clone` on the Mac will **not** bring it. Sizes below are exact byte counts taken directly off this machine, not estimates.

| Path | Size | Why it's not on GitHub | Bring it to the Mac? |
|---|---|---|---|
| `node_modules/` | ~202 MB | `.gitignore` — dependencies | **No.** `npm install` regenerates it and gets you macOS-native binaries instead of Windows ones. Copying it across would actively break things. |
| `dist/` | 1.5 MB | `.gitignore` — build output | **No.** `npm run build` regenerates it. |
| `Shravan_CV 1.pdf` | 112 KB | `.gitignore` — carries a phone number | **Yes, if you still edit from it.** The file the *site* serves is `public/Shravan-Dige-CV.pdf`, which is tracked and arrives with the clone — this is only the source it was made from. |
| `N130 Shravan Dige Final Report TIP.pdf` | 1.1 MB | `.gitignore` — employer strategy, mentor names, SAP/roll numbers, an unresolved security item in a still-live product | **Yes, if you'll reference it again** — it's the source material `PRODUCT.md`'s Experience section was written from. |
| `.claude/settings.local.json` | 1.2 KB | `.gitignore` — machine-local settings | No — regenerate as needed. |
| `.impeccable/config.local.json` | 46 B | `.gitignore` — local skill config | No — regenerates on first use. |
| `.impeccable/hook.cache.json` | 2 KB | `.gitignore` — design-hook cache | No — regenerates automatically. |
| `.claude/skills/impeccable/` | 2.9 MB, 147 files | Never part of the repo — Claude Code tooling, not portfolio source | **No — reinstall, don't copy.** It's the local install of the Impeccable design-review skill used this session for `document`, `polish`, and the section-head cleanup. |
| `.agents/skills/web-design-guidelines/` | 1.2 KB | Same as above | **No — reinstall.** Sourced from `vercel-labs/agent-skills` on GitHub per `skills-lock.json`. |
| `skills-lock.json` | 298 B | Same as above | Only if you want a record of what to reinstall — it's the lockfile for the item above, not something to run. |

**What that means in practice:** the only things worth physically carrying over (AirDrop, USB, cloud drive) are the two PDFs, and only if you still need them as working documents — everything else on this list is either regenerated automatically (`node_modules`, `dist`, the local config/cache files) or should be reinstalled fresh rather than copied (the two skill tooling directories). Nothing on this list is required for the site itself to build, run, or deploy; all of that lives in the 55 tracked files that already came across in the clone.

## One thing to actually do, not just carry over

`git config core.autocrlf` is `true` on this machine (the normal Windows default). macOS's default is different, but this is **not a problem to fix** — Git already stores every tracked file as LF internally regardless of that setting, so a fresh clone on the Mac checks out clean LF files with nothing to reconcile. Leave `autocrlf` at whatever the Mac's Git defaults to; don't set it to `true` there.

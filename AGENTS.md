# AGENTS.md

Tool-agnostic guidance for AI coding agents working in this repository.
`CLAUDE.md` and `GEMINI.md` are symlinks to this file — **edit `AGENTS.md` only**.

## What this project is

The **FlopCoin** website — a small, static-content marketing/info site deployed at
**flopcoin.art** (the git remote is named `flop.hr`).

A FlopCoin is a physical silver coin (~100 unique pieces, a single issuance) that
represents *one hour of its owner's claim on "Flop's" time*: holding one is a public
promise that Flop will spend one hour fulfilling the owner's request. The site simply
explains what a FlopCoin is, how to redeem one, examples, limitations, and lists owners.

It is a content site: there is no database, no auth, and no user-generated input at
runtime. Owners are maintained by editing a JSON file in the repo.

## Tech stack

- **Next.js 15.1.6** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 3.4** (+ PostCSS)
- **Yarn 4.6.0 (Berry)** via Corepack — the pinned release lives in `.yarn/releases/`.
  Do **not** use npm; `package-lock.json` is gitignored.
- **ESLint** flat config (`next/core-web-vitals` + `next/typescript`). No test framework.
- Node: the Docker image uses `node:23`; local dev works on Node 22+.

## Repository layout

```
src/app/                 App Router
  layout.tsx             Root layout: <html>, metadata (title/description/icon), Geist fonts
  page.tsx               Home page — what a FlopCoin is, how to use it, examples, limits
  owners/page.tsx        Owners list (server component; see "Owners" below)
  globals.css            Global styles / Tailwind layers
  favicon.ico
public/                  Static assets served at site root
  owners.json            Source of truth for the owners list
  coin.svg, *.svg        Icons / logo
  c1-c5.jpg, s1-s4.jpg   Photos — tracked via Git LFS (see below)
out/                     Static export produced by `yarn build` (gitignored)
.github/workflows/main.yml   CI/CD: build & upload to Cloudflare Pages on push to main
```

Path alias: `@/*` maps to `./src/*` (see `tsconfig.json`).

## Commands

```bash
yarn install --immutable   # install deps (Corepack provides yarn 4)
yarn dev                   # local dev server (next dev --turbopack)
yarn build                 # static export into out/ — run this to verify a change compiles
yarn lint                  # ESLint (next lint)
yarn preview               # serve out/ through wrangler, the way Cloudflare does
yarn deploy                # build + upload out/ to Cloudflare Pages by hand
```

There is no `yarn start`: `next start` does not apply to a static export.

There are no automated tests. **Verify changes with `yarn build` + `yarn lint`, and by
loading the affected page in `yarn dev`.**

## Owners list

`src/app/owners/page.tsx` reads `public/owners.json` from the filesystem. Since the site is
a static export this happens **at build time**, not per request.

- To add/remove an owner, edit `public/owners.json`. Shape per entry:
  `{ "name", "link_text?", "link_href?", "description?" }`.
- "Last update" is the date of the last commit touching that file (`git log -1 --format=%cs`),
  with the file mtime as fallback. That is why CI checks out with `fetch-depth: 0` —
  a shallow clone would leave the page showing the build date instead.

## Deployment

The site is a **static export** hosted on **Cloudflare Pages**, project `flopcoin`
(account `42548ca95c85a68b4ce20ad79b805334`). `flopcoin.art` is a proxied CNAME to
`flopcoin.pages.dev`, registered as a custom domain on the Pages project.

- **CI/CD:** `.github/workflows/main.yml` runs on every push to `main` on `ubuntu-latest`:
  checkout (with LFS + full history) → `yarn build` → `wrangler pages deploy out`.
  Pushing to `main` deploys to production — treat main as release.
- **By hand:** `yarn deploy` does the same from a local checkout.
- There is no server, no container and no tunnel. Anything that would need a request-time
  runtime does not belong in this project.

## Environment / secrets

Nothing is needed to build or run the site locally. Deploying needs two values:

| Var                      | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`   | API token with *Account → Cloudflare Pages → Edit*   |
| `CLOUDFLARE_ACCOUNT_ID`  | Cloudflare account id                                |

CI reads them from **GitHub repository secrets**; `yarn deploy` reads them from a local
`.env` (see `.env.example`), which wrangler loads on its own and which takes precedence
over any `wrangler login` session. Note that `next build` also loads `.env` — keep
deployment credentials un-prefixed so they never reach the client bundle.

**Never commit secrets.** The permission is account-wide: Cloudflare has no per-project
scoping for Pages tokens, so this token can touch every Pages project in the account.

## Conventions & gotchas

- **Git LFS:** all `*.jpg` are stored in Git LFS (`.gitattributes`). Have `git-lfs`
  installed; if photos look like tiny text pointer files, run `git lfs pull`. CI checks
  out with `lfs: true`. This is also why the build runs in GitHub Actions rather than on
  Cloudflare's own build system — **Pages does not support Git LFS** and would publish the
  pointer files as if they were the photos.
- **Yarn Berry only:** use `yarn`, not `npm`. The pinned yarn binary is committed under
  `.yarn/releases/`.
- **Static site:** `next.config.ts` sets `output: 'export'` and `images.unoptimized`. Server
  components, route handlers, ISR, middleware and `next/image` optimization are all
  unavailable — a change that needs any of them changes the hosting model too.
- **Domain vs repo name:** production is `flopcoin.art`; the repo/remote is `flop.hr`; the
  `package.json` `name` field (`imqu.web`) is a leftover and not meaningful.
- **Branch discipline:** one feature = one branch = one PR. `main` is the deploy branch —
  never force-push it.

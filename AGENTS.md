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
config/cloudflared/      Cloudflare Tunnel config
  config.yml             Tunnel id + ingress: flopcoin.art -> http://nextjs:3000
  dns-manager.ts         Upserts the tunnel CNAME via the Cloudflare API (`yarn dns`)
  keys/                  Tunnel credentials (gitignored; injected at deploy)
Dockerfile               Prod image: yarn install -> yarn dns -> yarn build -> yarn start
docker-compose.yml       Two services: `nextjs` (3006->3000) + `cloudflared`
.github/workflows/main.yml   CI/CD: build & deploy on push to main (self-hosted runner)
```

Path alias: `@/*` maps to `./src/*` (see `tsconfig.json`).

## Commands

```bash
yarn install --immutable   # install deps (Corepack provides yarn 4)
yarn dev                   # local dev server (next dev --turbopack)
yarn build                 # production build — run this to verify a change compiles
yarn lint                  # ESLint (next lint)
yarn start                 # serve the production build
yarn dns                   # upsert the Cloudflare DNS record (needs CF_* env; deploy-time)
```

There are no automated tests. **Verify changes with `yarn build` + `yarn lint`, and by
loading the affected page in `yarn dev`.**

## Owners list

`src/app/owners/page.tsx` is a server component that reads `public/owners.json` from the
filesystem on each request and derives the "Last update" date from that file's **mtime**.

- To add/remove an owner, edit `public/owners.json`. Shape per entry:
  `{ "name", "link_text?", "link_href?", "description?" }`.
- Because "last update" comes from the file mtime, committing an edit is what refreshes it.

## Deployment

- **Container:** `docker compose up -d` builds the Next.js image and runs it alongside
  `cloudflared`. The app is exposed on host port **3006** (container 3000); the tunnel
  reaches it internally at `nextjs:3000` and publishes it at **flopcoin.art**.
- **DNS:** the Dockerfile runs `yarn dns` during build to keep the `flopcoin.art` CNAME
  pointed at the tunnel. It needs the `CF_*` build args (below).
- **CI/CD:** `.github/workflows/main.yml` runs on every push to `main` on a **self-hosted**
  runner: it writes `.env` and `config/cloudflared/keys/key.json` from the `ENV_FILE` and
  `KEY_JSON` GitHub secrets, then `docker compose build --no-cache && docker compose up -d`.
  Pushing to `main` deploys to production — treat main as release.

## Environment / secrets

From `.env.example` (Cloudflare, used by `yarn dns` / the Dockerfile build args):

| Var             | Purpose                                             |
| --------------- | --------------------------------------------------- |
| `CF_ZONE_ID`    | Cloudflare zone id for the domain                   |
| `CF_API_TOKEN`  | Cloudflare API token (DNS edit) — **secret**        |
| `CF_TUNNEL_ID`  | Cloudflare tunnel id (must match `config.yml`)      |

Tunnel credentials live in `config/cloudflared/keys/key.json` (gitignored, provided at
deploy from the `KEY_JSON` secret). **Never commit secrets, `.env`, or `key.json`.**

## Conventions & gotchas

- **Git LFS:** all `*.jpg` are stored in Git LFS (`.gitattributes`). Have `git-lfs`
  installed; if photos look like tiny text pointer files, run `git lfs pull`. CI checks
  out with `lfs: true`.
- **Yarn Berry only:** use `yarn`, not `npm`. The pinned yarn binary is committed under
  `.yarn/releases/`.
- **Static site:** `next.config.ts` sets `images.unoptimized`. No runtime data source
  beyond `owners.json`; keep it that way unless a change explicitly calls for it.
- **Domain vs repo name:** production is `flopcoin.art`; the repo/remote is `flop.hr`; the
  `package.json` `name` field (`imqu.web`) is a leftover and not meaningful.
- **Branch discipline:** one feature = one branch = one PR. `main` is the deploy branch —
  never force-push it.

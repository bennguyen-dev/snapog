# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**SnapOG** — Next.js 14 SaaS that generates Open Graph images on demand. External sites call `/api/{apiKey}?url=...`; the service screenshots the page, stores it on S3/CloudFront, and serves it back. Credits are deducted per generation.

## Tech stack

- Next.js 14 (App Router, RSC) + TypeScript, React 18
- Prisma 5 + PostgreSQL (Neon)
- NextAuth v5 beta (GitHub + Google + email)
- Inngest for background jobs and cron
- Cloudflare R2 (S3-compatible API) for image storage; served via R2 public hostname / Cloudflare CDN
- Polar for payments (`@polar-sh/sdk`, `@polar-sh/nextjs`)
- ScreenshotOne for screenshots via `src/services/scrapeApi`; metadata is parsed directly from page HTML
- Tailwind + Radix UI, TanStack Query, React Hook Form + Zod

## Commands

```bash
npm run dev            # next dev --experimental-https (uses certs in ./certificates)
npm run build          # prisma generate && prisma migrate deploy && next build
npm run start
npm run lint           # next lint
npm run check-lint     # eslint . --ext ts,tsx,js
npm run check-types    # tsc --noEmit
npm run check-format   # prettier --check .
npm run format         # prettier --write .
```

Prisma schema lives at `src/prisma/schema-postgres.prisma` and is wired via `package.json` → `prisma.schema`, so plain `npx prisma <cmd>` works:

```bash
npx prisma migrate dev          # create + apply a local migration
npx prisma migrate deploy       # apply migrations (also runs in npm run build)
npx prisma generate
npx prisma studio
```

There is no test framework configured.

## Conventions

- **Path alias**: `@/*` → `./src/*`. All internal imports use it.
- **Service response shape**: every service method returns `IResponse<T>` from `@/types/global` — `{ status: number, message: string, data: T | null }`. API routes unwrap this and translate to HTTP. Stick to it when adding service methods.
- **Service layout**: one folder per domain under `src/services/<name>/` with `index.ts`, `<name>.service.ts`, `<name>.interface.ts`. Services are exported as singletons (`export const fooService = new FooService()`).
- **Import order is enforced by ESLint** (`import/order` rule, auto-fixable): `builtin → external → internal (@/**) → parent/sibling → index → object → type`, alphabetized, newlines between groups. `react` is forced first; `next/**` after externals.
- **No `any` rule**: `@typescript-eslint/no-explicit-any` is off, but `{}` is banned — use `object` or a concrete type.

## Architecture

### Image generation request flow

Entry: `src/app/api/[apiKey]/route.ts` → `imageService.generateOGImage` (`src/services/image/image.service.ts`).

1. Resolve user by `apiKey` (`userService.getUser`).
2. Look up `Site` by `(userId, domain)`. If absent, return 404 — sites are created from the dashboard, not implicitly.
3. Look up `Page` by `(siteId, url)`:
   - If `page.imageSrc` exists → fetch buffer from CloudFront via `getImageByImageLink` and return it.
   - Otherwise → `pageService.create({ siteId, url, headers })` which scrapes + uploads, then return the new image.
4. Route handler returns raw image bytes with `Cache-Control: public, max-age=300, s-maxage=300, stale-while-revalidate=60` and CORS `*`.

Errors bubble up as `IResponse` with non-2xx `status`; the route serializes them as JSON.

### Background jobs (Inngest)

Registered in `src/services/inngest/inngest.service.ts`, mounted at `src/app/api/inngest/route.ts`.

- `background/create.site` — fires after a site is created and creates the homepage `Page` via `pageService.create`.
- `schedule/update.ogimage.daily` — cron `0 0 * * *`. Selects `Page`s where `imageExpiresAt <= now`, re-scrapes via `scrapeService.scrapeInfo`, re-uploads to S3 reusing the same `imageSrc` key, and pushes `imageExpiresAt` forward by `cacheDurationDays`. Pages with no/infinite cache duration are excluded from auto-renewal.

### Credits

- `UserBalance` holds `freeCredits` + `paidCredits`. New users get 30 free credits.
- Deduction order: free first, then paid.
- Every change is recorded in `UserLog` with type/status enums from `src/services/userLog`.
- Credit checks live in `userService` / `userBalance` services — call those, don't touch the tables directly.

### Auth

- NextAuth v5 (`src/auth.ts`, middleware in `src/middleware.ts`) with Prisma adapter, GitHub + Google providers, and email verification.
- External API requests authenticate via `User.apiKey` (32-char unique field). Validation is done inside `userService.getUser({ apiKey })`.

### Webhooks

- `/api/webhook/polar` — Polar payment events; updates products/credits.
- `/api/inngest` — Inngest dispatcher; never call directly.

### Storage

`src/services/storage` wraps R2 (Cloudflare's S3-compatible object storage) using `@aws-sdk/client-s3` pointed at `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`. Images are keyed by `imageSrc` (stable per page) so re-uploads overwrite in place — Cloudflare CDN revalidates automatically. The image route returns `302` redirects to `https://${R2_PUBLIC_HOSTNAME}/${key}` instead of proxying bytes through Vercel.

## Layout

```
src/
├── app/
│   ├── api/                # Route handlers; thin, delegate to services
│   │   ├── [apiKey]/       # Public image endpoint
│   │   ├── inngest/        # Inngest function dispatcher
│   │   ├── webhook/polar/  # Polar payment webhook
│   │   └── ...             # auth, sites, pages, credits, api-keys, products, user, demo, get, logs
│   ├── dashboard/          # Authenticated UI
│   ├── (public)/           # Marketing, demo, blog
│   └── actions.ts          # Server actions
├── services/               # Business logic (one folder per domain)
├── modules/                # Feature UI bundles consumed by routes
├── components/{ui,customs} # Radix primitives wrapped with Tailwind + bespoke components
├── lib/                    # db (Prisma client), inngest client
├── hooks/, utils/, constants/, types/, content/, assets/
├── auth.ts, middleware.ts
└── prisma/schema-postgres.prisma
```

Domains under `services/`: `blog`, `demo`, `googleCaptcha`, `image`, `inngest`, `page`, `product`, `scrapeApi`, `site`, `stats`, `storage`, `user`, `userBalance`, `userLog`, `webhook`.

Domains under `modules/`: `api-keys`, `auth`, `credits`, `dashboard`, `logs`, `page`, `payment`, `site`.

## Deployment notes

- `vercel.json` sets every `src/app/api/**` function to **1024 MB memory, 60s max duration**. Image generation can hit the 60s ceiling when scraping cold domains — keep that in mind when adding sync work to the request path.
- `npm run build` runs `prisma migrate deploy`, so a broken or unreviewed migration will block deploys.
- `next.config.mjs` allows remote images only from `process.env.AWS_CDN_HOSTNAME`. Add new image hosts there explicitly.

## Environment

See `.example.env`. Required for local dev: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, at least one OAuth provider, R2 storage (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_HOSTNAME`), `INNGEST_*`, `SCRAPE_API_URL` + `SNAP_OG_API_KEY`, `SCREENSHOTONE_ACCESS_KEY`. Polar + reCAPTCHA + Hotjar are optional locally. `R2_PUBLIC_HOSTNAME` is whatever serves the bucket publicly — either `pub-xxxxx.r2.dev` (free, dev-tier) or a custom domain in Cloudflare DNS.

## Known sharp edges

- The image route fetches the S3 object server-side and pipes the buffer through Next.js rather than redirecting to CloudFront. Intentional today (header control, hide CDN), but doubles egress — don't "optimize" without checking the reason.
- Catch blocks across services tend to `console.error` and return a 500 `IResponse`. There is no Sentry/structured logger wired up; check Vercel logs when debugging production.
- No rate limiting on `/api/[apiKey]`. A leaked key burns credits until depleted.
- `Demo`/`DemoPage` models duplicate `Site`/`Page` shape rather than sharing tables with an `isDemo` flag.

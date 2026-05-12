# Repository Guidelines

## Project Structure & Module Organization

SnapOG is a Next.js 14 App Router application for generating Open Graph images. Source code lives in `src/`. Route handlers and pages are under `src/app/`, including public API routes in `src/app/api/` and authenticated dashboard routes in `src/app/dashboard/`. Business logic is organized by domain in `src/services/<name>/` with `index.ts`, `<name>.service.ts`, and `<name>.interface.ts`. Feature UI bundles live in `src/modules/`, reusable UI in `src/components/ui`, custom components in `src/components/customs`, and static assets in `public/` or `src/assets/`. Blog content is in `src/content/blogs/`. Prisma schema and migrations are in `src/prisma/`.

## Build, Test, and Development Commands

- `npm run dev`: starts Next.js locally with experimental HTTPS.
- `npm run build`: runs `prisma generate`, applies migrations with `prisma migrate deploy`, then builds Next.js.
- `npm run start`: serves the production build.
- `npm run lint`: runs Next lint checks.
- `npm run check-lint`: runs ESLint across `ts`, `tsx`, and `js` files.
- `npm run check-types`: runs TypeScript type checking without emitting files.
- `npm run check-format`: checks Prettier formatting.
- `npm run format`: formats the repository with Prettier.
- `npx prisma migrate dev`: creates and applies a local database migration.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Import internal modules through the `@/*` alias, which maps to `src/*`. Keep service methods returning the shared `IResponse<T>` shape from `@/types/global`. Follow the existing domain naming pattern: `site.service.ts`, `site.interface.ts`, `ListSite.tsx`, `AddSiteDialog.tsx`. Prettier with `prettier-plugin-tailwindcss` handles formatting and Tailwind class ordering; run `npm run format` before large commits.

## Testing Guidelines

No automated test framework is currently configured. Before submitting changes, run `npm run check-types`, `npm run check-lint`, and `npm run check-format`. For behavior changes, manually verify the affected route or dashboard flow in local dev and document what was checked in the PR.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit prefixes such as `feat:`, `fix:`, `chore:`, `docs:`, and `perf:`. Keep commit subjects imperative and scoped to one change. Pull requests should include a concise summary, linked issue or context, screenshots for UI changes, migration notes for Prisma changes, and the validation commands or manual checks performed.

## Security & Configuration Tips

Do not commit secrets. Local configuration should provide database, auth, R2 storage, Inngest, scraping, and payment-related environment variables as needed. Be careful with `npm run build`: it deploys Prisma migrations, so review generated migration SQL before merging.

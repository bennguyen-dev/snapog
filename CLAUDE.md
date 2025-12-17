# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SnapOG** is a Next.js 14 application that provides automated Open Graph image generation for websites. It's a SaaS platform that allows users to create dynamic OG images for their web pages without manual intervention.

**Core Functionality:**

- Dynamic Open Graph image generation for websites
- Credit-based system for image generation
- Site and page management
- API key authentication
- Integration with AWS S3 for image storage
- Webhook system for third-party integrations (Polar, etc.)

## Technology Stack

**Frontend:**

- Next.js 14 with App Router
- React 18 with Server Components
- TypeScript
- Tailwind CSS with custom design system
- Radix UI components
- TanStack Query for data fetching
- React Hook Form with Zod validation

**Backend:**

- Next.js API routes
- Prisma ORM with PostgreSQL
- NextAuth.js for authentication
- Inngest for background jobs
- AWS SDK for S3 and CloudFront

**Infrastructure:**

- Vercel deployment
- Neon PostgreSQL database
- AWS S3 + CloudFront for image CDN
- GitHub Actions for CI/CD

## Key Directories and Files

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   └── (public)/         # Public routes (demo, about)
├── components/            # React components
│   ├── ui/              # Reusable UI components
│   └── customs/         # Custom components
├── modules/              # Feature modules
│   ├── dashboard/       # Dashboard functionality
│   ├── site/           # Site management
│   ├── page/           # Page management
│   └── credits/        # Credit system
├── services/            # Business logic services
│   ├── image/          # Image generation logic
│   ├── site/           # Site operations
│   ├── page/           # Page operations
│   ├── storage/        # AWS S3 operations
│   └── user/           # User operations
├── hooks/               # Custom React hooks
├── lib/                 # Core libraries
│   ├── db.ts           # Prisma database client
│   └── inngest.ts      # Inngest client
└── prisma/             # Database schema
    └── schema-postgres.prisma
```

## Database Schema

**Key Models:**

- `User`: User accounts with API keys
- `Site`: Websites users want to generate OG images for
- `Page`: Individual pages within sites
- `UserBalance`: Credit tracking (paid + free credits)
- `UserLog`: Audit log for credit transactions
- `Product`: Credit packages for purchase
- `Demo`: Demo sites for testing

**Relationships:**

- User has many Sites
- Site has many Pages
- User has one UserBalance
- User has many UserLogs

## Authentication & Authorization

**NextAuth.js Configuration:**

- GitHub OAuth integration
- Google OAuth integration
- Email verification
- API key authentication for external requests
- Session management with database adapters

**API Authentication:**

- API keys stored in User model
- All API endpoints validate API keys
- Rate limiting and usage tracking

## Development Commands

**Essential Commands:**

```bash
npm run dev                    # Start development server with HTTPS
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint
npm run format                 # Format code with Prettier
npm run check-types            # Type checking
```

**Database Operations:**

```bash
npm run postinstall            # Generate Prisma client
npx prisma migrate dev         # Create and run migrations locally
npx prisma migrate deploy      # Deploy migrations to production
npx prisma generate            # Regenerate client
npx prisma studio              # Open database GUI
```

**Code Quality:**

```bash
npm run check-format           # Check Prettier formatting
npm run check-lint             # Run ESLint on TypeScript files
npm run prepare                # Setup Husky git hooks
```

## API Structure

**Public APIs (no authentication):**

- `/api/demo` - Demo functionality
- `/api/get` - Public image retrieval
- `/api/[apiKey]` - Image generation with API key

**Authenticated APIs:**

- `/api/auth/*` - NextAuth endpoints
- `/api/sites/*` - Site management
- `/api/pages/*` - Page management
- `/api/credits/*` - Credit system
- `/api/api-keys/*` - API key management
- `/api/user/stats` - User statistics

**Webhook Endpoints:**

- `/api/webhook/polar` - Polar payment webhooks
- `/api/inngest` - Inngest job processing

## Image Generation Flow

1. **Request**: External request to `/api/[apiKey]` with URL
2. **Validation**: Check API key and user credits
3. **Site/Page Lookup**: Find or create site and page records
4. **Cache Check**: Check if fresh image exists
5. **Screenshot**: Use external service to capture page screenshot
6. **Processing**: Apply custom template and styling
7. **Storage**: Upload to AWS S3 with CloudFront CDN
8. **Response**: Return image URL
9. **Credit Deduction**: Subtract credit from user balance

## Credit System

**Credit Types:**

- Free credits (30 for new users)
- Paid credits (purchased via Polar)
- Credit tracking in UserBalance table
- Detailed logging in UserLog table

**Credit Deductions:**

- Page creation: 1 credit
- Manual refresh: 1 credit
- Free credits used first, then paid credits

## Service Architecture

**Service Pattern:**
Each major domain has its own service:

```typescript
// Example service structure
src/services/image/
├── index.ts              # Service exports
├── image.service.ts      # Business logic
└── image.interface.ts    # TypeScript interfaces
```

**Key Services:**

- `image.service.ts` - Core image generation
- `site.service.ts` - Site management
- `page.service.ts` - Page management
- `storage.service.ts` - AWS S3 operations
- `user.service.ts` - User operations

## Component Architecture

**UI Components:**

- Located in `src/components/ui/`
- Built with Radix UI primitives
- Styled with Tailwind CSS
- Consistent design system

**Custom Components:**

- Located in `src/components/customs/`
- Feature-specific components
- Higher-level abstractions

**Modules:**

- Located in `src/modules/`
- Complete feature implementations
- Combine multiple components and services

## Testing Strategy

**No formal testing framework configured**

- Manual testing through development
- API testing via direct requests
- Component testing in development

## Deployment

**Vercel Configuration:**

- Automatic deployment from main branch
- Environment variables required:
  - Database URLs (Neon PostgreSQL)
  - AWS credentials (S3, CloudFront)
  - OAuth keys (GitHub, Google)
  - Third-party API keys
  - Inngest configuration

**Build Process:**

1. Prisma client generation
2. Database migrations
3. Next.js build
4. Environment validation

## Common Development Tasks

**Adding a new API endpoint:**

1. Create route in `src/app/api/`
2. Add service method if needed
3. Update TypeScript interfaces
4. Add authentication/authorization
5. Update API documentation

**Adding a new component:**

1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Style with Tailwind
4. Export from index file
5. Add to design system if reusable

**Database changes:**

1. Update `prisma/schema-postgres.prisma`
2. Run `npx prisma migrate dev`
3. Update service interfaces
4. Update any affected components

## Performance Considerations

**Image Optimization:**

- AWS CloudFront CDN for global distribution
- S3 for scalable storage
- Image caching with configurable TTL
- Optimized image processing pipeline

**Database Optimization:**

- Indexed foreign keys
- Efficient query patterns
- Prisma query optimization

**Frontend Optimization:**

- React Server Components where possible
- Lazy loading for heavy components
- Efficient state management with TanStack Query

## Security Considerations

**Authentication:**

- NextAuth.js with multiple providers
- API key validation for external requests
- Session management
- CSRF protection

**Data Validation:**

- Zod schemas for all data
- Input sanitization
- Rate limiting considerations

**Environment Security:**

- Environment variables for secrets
- No hardcoded credentials
- Secure headers and CORS

## Third-Party Integrations

**Payment Processing:**

- Polar integration for subscriptions
- Webhook handling for payment events
- Product management

**Image Processing:**

- External screenshot services
- AWS S3 storage
- CloudFront CDN

**Analytics:**

- Vercel Analytics
- Hotjar for user behavior
- Custom usage tracking

**Background Jobs:**

- Inngest for async processing
- Webhook event processing
- Scheduled tasks

# CosmosKids - Claude Session Manifest

## Project Summary

CosmosKids is an AI-powered educational platform that makes learning about space, astronomy, and science fun and engaging for children ages 6-12. The platform features gamification, interactive activities, personalized AI tutoring, and comprehensive parent monitoring tools.

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your actual keys

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Production Deployment

See `DEPLOYMENT.md` for complete VPS deployment instructions.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Custom components based on SmartCamp.AI branding
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State**: React Context + Zustand

### Backend
- **API**: Next.js API Routes (App Router)
- **Database**: Supabase (PostgreSQL) - Shared instance with namespace `cosmoskids_`
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (buckets: `cosmoskids-avatars`, `cosmoskids-reports`, `cosmoskids-content`)
- **Realtime**: Supabase Realtime

### Integrations
- **AI Chat**: Flowise (`https://flowise.smartcamp.ai`)
- **Automation**: n8n (`https://n8n.smartcamp.ai/webhook/*`)
- **PDF Generation**: Gotenberg (`http://gotenberg:3000`)

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest + Testing Library
- **Type Checking**: TypeScript

## Project Structure

```
cosmos-kids/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (parent)/          # Parent dashboard routes
│   │   ├── (child)/           # Child learning interface routes
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components (Button, Card, etc.)
│   │   ├── layouts/          # Layout components
│   │   ├── child/            # Child-specific components
│   │   └── parent/           # Parent-specific components
│   ├── lib/                   # Utility functions
│   │   ├── supabase/         # Supabase clients
│   │   ├── integrations/     # n8n, Flowise, Gotenberg
│   │   ├── utils/            # Helpers
│   │   └── types/            # TypeScript types
│   ├── hooks/                 # Custom React hooks
│   ├── styles/                # Global styles
│   └── config/                # Configuration files
├── public/                    # Static assets
│   ├── branding/             # Logo, backgrounds, icons
│   ├── content/              # Learning content images
│   └── avatars/              # Default avatar options
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── tests/                     # Test files
├── .env.example               # Environment variables template
├── .env.local                 # Local development variables (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── CLAUDE_MANIFEST.md         # This file
├── PROGRESS.md                # Implementation progress log
├── DECISIONS.md               # Architecture decisions
├── PRD.md                     # Product requirements
└── README.md                  # User-facing documentation
```

## Key Concepts

### Supabase Namespacing

**CRITICAL**: This project shares a Supabase instance with other SmartCamp.AI projects.

**All database resources use the `cosmoskids_` prefix**:
- Tables: `cosmoskids_users`, `cosmoskids_children`, `cosmoskids_progress`, etc.
- Buckets: `cosmoskids-avatars`, `cosmoskids-reports`, etc.
- Functions: `cosmoskids_calculate_level()`, etc.

### User Model

**Two-tier user system**:
1. **Parent/Guardian** (`cosmoskids_users`) - Authenticated via Supabase Auth
2. **Child Profile** (`cosmoskids_children`) - Associated with parent, no direct auth

Children access the platform through their parent's account. Parents can manage multiple children.

### Dual Interface

**Child Interface** (`/child/[childId]/*`):
- Playful, colorful, space-themed
- Large buttons, simple navigation
- Interactive activities, games, quizzes
- AI chatbot companion (Stella)
- Achievement celebrations

**Parent Interface** (`/parent/*`):
- Professional, clean, data-focused
- Dashboard with analytics
- Progress tracking and reports
- Account management
- Settings and controls

## Important Files & Locations

### Branding Assets
- **Branding Guide**: `/branding/SmartCampAI_branding.md`
- **Logo**: `/public/branding/SmartCampAI.png` (create)
- **Background**: `/public/branding/jungle-background.png` (create)
- **Favicon**: `/public/favicon.ico` (create)

### VPS Documentation
- **VPS Config Guide**: `/VPS_CONFIGURATION_GUIDE.md`
- **VPS Technical Docs**: `/VPS_TECHNICAL_DOCUMENTATION.md`

### Project Documentation
- **PRD**: `/PRD.md` (full product requirements)
- **Architecture**: `/docs/ARCHITECTURE.md`
- **API Docs**: `/docs/API.md`
- **Deployment**: `/docs/DEPLOYMENT.md`
- **Progress Log**: `/PROGRESS.md`
- **Decision Log**: `/DECISIONS.md`

### Configuration
- **Environment Variables**: `/.env.example` (template), `/.env.local` (actual)
- **TypeScript Config**: `/tsconfig.json`
- **Tailwind Config**: `/tailwind.config.ts`
- **Next.js Config**: `/next.config.js`

## Environment Variables

See `.env.example` for full list. Key variables:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Integrations
N8N_WEBHOOK_URL=https://n8n.smartcamp.ai/webhook
FLOWISE_URL=https://flowise.smartcamp.ai
FLOWISE_API_KEY=...
GOTENBERG_URL=http://gotenberg:3000
```

## Database Schema Overview

See `docs/ARCHITECTURE.md` for detailed schema.

### Core Tables
- `cosmoskids_users` - Parent accounts
- `cosmoskids_children` - Child profiles
- `cosmoskids_modules` - Learning modules (Solar System, Rockets, etc.)
- `cosmoskids_activities` - Individual activities within modules
- `cosmoskids_progress` - Child activity completion tracking
- `cosmoskids_badges` - Achievement definitions
- `cosmoskids_achievements` - Earned badges per child
- `cosmoskids_chat_history` - AI chat logs
- `cosmoskids_reports` - Generated progress reports

## Common Development Tasks

### Add a new component
```bash
# Create in appropriate directory
src/components/ui/NewComponent.tsx
# or
src/components/child/NewComponent.tsx
```

### Add a new API route
```bash
# Create in app/api/
src/app/api/your-endpoint/route.ts
```

### Add a new page
```bash
# For parent: src/app/(parent)/your-page/page.tsx
# For child: src/app/(child)/[childId]/your-page/page.tsx
# For public: src/app/your-page/page.tsx
```

### Run database migrations
```sql
-- Connect to Supabase Studio or psql
-- Write migration SQL
-- Execute via Supabase dashboard or CLI
```

### Test n8n webhook locally
```bash
curl -X POST http://localhost:5678/webhook/cosmoskids-welcome \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

## Coding Conventions

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` if necessary)
- Explicit return types for functions
- Interfaces for objects, types for unions

### Components
- Functional components with hooks
- Props typed with interfaces
- Use `"use client"` directive only when needed (prefer server components)

### Styling
- Tailwind utility classes for most styling
- CSS variables for brand colors (defined in `globals.css`)
- BEM-like naming for custom CSS classes (if needed)

### File Naming
- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Hooks: camelCase starting with `use` (e.g., `useAuth.ts`)
- Types: PascalCase (e.g., `User.ts`)

## Branding Requirements

**Must follow SmartCamp.AI branding**:
- Colors: Jungle green (#1a4d2e), Mint (#52b788), Warm orange (#ff9f1c)
- Typography: Jost font (all weights)
- Glassmorphism cards: `rgba(255,255,255,0.15)` + `backdrop-filter: blur(10px)`
- Jungle background with overlay
- Footer: "© Created with ❤️ by SmartCamp.AI" → https://smartcamp.ai/

**CosmosKids theme additions**:
- Space blues: #0f0f23, #1a1a3e
- Cosmic purples: #6b46c1
- Star yellows: #ffd700
- Space-themed illustrations and icons

## Testing Strategy

- **Unit Tests**: Critical business logic (XP calculation, level progression)
- **Integration Tests**: API routes, database operations
- **Component Tests**: UI components with Testing Library
- **E2E Tests** (future): Playwright for critical user flows

Run tests:
```bash
pnpm test
```

## Deployment

**Local Development**: `pnpm dev` on http://localhost:3000

**VPS Production**:
1. Build Docker image
2. Deploy to VPS at `cosmoskids.smartcamp.ai`
3. Connect to shared Supabase, n8n, Flowise
4. See `DEPLOYMENT.md` for detailed steps

## Useful Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build              # Build for production
pnpm start              # Start production server
pnpm lint               # Run ESLint
pnpm format             # Format with Prettier
pnpm type-check         # TypeScript check
pnpm test               # Run tests

# Database
pnpm db:migrate         # Run migrations (custom script)
pnpm db:seed            # Seed database (custom script)
pnpm db:reset           # Reset database (custom script)
```

## Getting Help

- **PRD**: See `PRD.md` for product context
- **Architecture**: See `docs/ARCHITECTURE.md` for technical design
- **Progress**: See `PROGRESS.md` for what's been implemented
- **Decisions**: See `DECISIONS.md` for architectural choices
- **API**: See `docs/API.md` for endpoint documentation
- **Deployment**: See `docs/DEPLOYMENT.md` for deployment process

## Next Steps for New Claude Session

1. Read this manifest
2. Read `PROGRESS.md` to see what's been completed
3. Read `DECISIONS.md` to understand key choices
4. Review relevant sections of `PRD.md` for context
5. Check current branch and git status
6. Continue implementation from where previous session left off

## Notes for Future Development

- Keep documentation in sync as you make changes
- Update `PROGRESS.md` after each major milestone
- Add new architectural decisions to `DECISIONS.md`
- Test integrations (n8n, Flowise, Gotenberg) early
- Prioritize core flows before nice-to-haves
- Remember: children's safety and age-appropriate content are paramount

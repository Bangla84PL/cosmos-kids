# CosmosKids - System Architecture

## Overview

CosmosKids is built as a modern web application using Next.js 14 with server-side rendering, static generation, and API routes. The architecture is designed for scalability, maintainability, and optimal user experience for both children and parents.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                            │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │  Parent Interface    │      │  Child Interface     │        │
│  │  (Professional UI)   │      │  (Playful UI)        │        │
│  └──────────┬───────────┘      └──────────┬───────────┘        │
│             │                               │                    │
│             └───────────────┬───────────────┘                    │
│                             │                                    │
│                    ┌────────▼────────┐                          │
│                    │  Next.js App    │                          │
│                    │  (App Router)   │                          │
│                    └────────┬────────┘                          │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    Backend Layer                                 │
│                    ┌────────▼────────┐                          │
│                    │  API Routes     │                          │
│                    │  (Next.js API)  │                          │
│                    └────────┬────────┘                          │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│    ┌────▼─────┐     ┌──────▼──────┐     ┌─────▼─────┐         │
│    │ Supabase │     │    n8n      │     │  Flowise  │         │
│    │   API    │     │  Webhooks   │     │  AI Chat  │         │
│    └────┬─────┘     └─────────────┘     └───────────┘         │
│         │                                                        │
│    ┌────▼─────┐                                                 │
│    │PostgreSQL│                                                 │
│    │    +     │                                                 │
│    │ Storage  │                                                 │
│    └──────────┘                                                 │
└──────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                   Integration Layer                              │
│                                                                  │
│    ┌──────────┐       ┌───────────┐       ┌──────────┐        │
│    │   n8n    │       │ Gotenberg │       │ External │        │
│    │ Workflows│       │    PDF    │       │   APIs   │        │
│    └──────────┘       └───────────┘       └──────────┘        │
└──────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

**Framework**: Next.js 14.0+
- App Router (not Pages Router)
- Server Components by default
- Client Components where interactivity is needed
- Server Actions for mutations
- Streaming and Suspense

**Language**: TypeScript 5.0+
- Strict mode enabled
- Path aliases configured (`@/` for `src/`)
- Shared types across client/server

**Styling**: Tailwind CSS 3.0+
- Custom configuration with brand colors
- Component-based utility classes
- Responsive design utilities
- Dark mode support (optional future)

**State Management**:
- React Context for auth state
- Zustand for complex client state (if needed)
- Server state managed by Next.js cache and Supabase Realtime

**UI Components**:
- Custom components based on SmartCamp.AI branding
- Headless UI for accessible components (modals, dropdowns)
- Lucide React for icons
- Framer Motion for animations

**Forms & Validation**:
- React Hook Form for form management
- Zod for schema validation
- Type-safe form handling

### Backend

**API**: Next.js API Routes (App Router)
- RESTful endpoints under `/api/*`
- Route handlers using new Next.js 14 syntax
- Middleware for auth, rate limiting

**Database**: Supabase (PostgreSQL 15)
- Hosted on SmartCamp.AI VPS
- Shared database with namespace isolation
- Row Level Security (RLS) for data access control
- Realtime subscriptions for live updates

**Authentication**: Supabase Auth
- Email/password authentication
- JWT-based sessions
- Secure cookie storage
- Refresh token rotation

**Storage**: Supabase Storage
- File uploads (avatars, reports, content)
- Namespaced buckets
- Access policies aligned with RLS

**Realtime**: Supabase Realtime
- Live progress updates for parents
- Real-time achievement notifications
- Activity status updates

### Integrations

**n8n** - Workflow Automation
- Endpoint: `https://n8n.smartcamp.ai`
- Use Cases:
  - Welcome email on signup
  - Weekly progress digest
  - Achievement notifications
  - Report generation triggers
  - Data aggregation cron jobs

**Flowise** - AI Chatbot
- Endpoint: `https://flowise.smartcamp.ai`
- Use Cases:
  - "Stella" the space tutor chatbot
  - Answer children's questions about space
  - Provide learning hints
  - Generate personalized recommendations
  - Analyze learning patterns

**Gotenberg** - PDF Generation
- Endpoint: `http://gotenberg:3000` (internal)
- Use Cases:
  - Monthly progress reports
  - Achievement certificates
  - Printable learning materials

### Development Tools

- **Package Manager**: pnpm (fast, efficient, monorepo-ready)
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier with Tailwind plugin
- **Testing**: Vitest + Testing Library + Playwright (future)
- **Type Checking**: TypeScript compiler
- **Git Hooks**: Husky + lint-staged (optional)

### Deployment

- **Platform**: SmartCamp.AI VPS
- **Container**: Docker
- **Reverse Proxy**: Traefik
- **Domain**: `cosmoskids.smartcamp.ai`
- **SSL**: Let's Encrypt (via Traefik)
- **CI/CD**: GitHub Actions (future)

## Application Structure

```
cosmos-kids/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx            # Auth layout (centered forms)
│   │   │
│   │   ├── (parent)/                 # Parent dashboard route group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Main parent dashboard
│   │   │   ├── children/
│   │   │   │   ├── page.tsx          # Manage children
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [childId]/
│   │   │   │       ├── page.tsx      # Child detail
│   │   │   │       ├── progress/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── reports/
│   │   │   │           └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx            # Parent layout (sidebar nav)
│   │   │
│   │   ├── (child)/                  # Child learning interface route group
│   │   │   └── child/
│   │   │       └── [childId]/
│   │   │           ├── page.tsx      # Child dashboard (Mission Control)
│   │   │           ├── explore/
│   │   │           │   └── page.tsx  # Galaxy Map (module browser)
│   │   │           ├── module/
│   │   │           │   └── [moduleId]/
│   │   │           │       ├── page.tsx
│   │   │           │       └── activity/
│   │   │           │           └── [activityId]/
│   │   │           │               └── page.tsx
│   │   │           ├── achievements/
│   │   │           │   └── page.tsx  # Achievement wall
│   │   │           ├── chat/
│   │   │           │   └── page.tsx  # AI tutor chat
│   │   │           └── layout.tsx    # Child layout (playful, colorful)
│   │   │
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   │   ├── signup/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── children/
│   │   │   │   ├── route.ts          # GET, POST
│   │   │   │   └── [childId]/
│   │   │   │       ├── route.ts      # GET, PUT, DELETE
│   │   │   │       ├── progress/
│   │   │   │       │   └── route.ts
│   │   │   │       └── achievements/
│   │   │   │           └── route.ts
│   │   │   ├── modules/
│   │   │   │   ├── route.ts
│   │   │   │   └── [moduleId]/
│   │   │   │       ├── route.ts
│   │   │   │       └── activities/
│   │   │   │           └── route.ts
│   │   │   ├── activities/
│   │   │   │   └── [activityId]/
│   │   │   │       ├── route.ts
│   │   │   │       └── complete/
│   │   │   │           └── route.ts  # POST to mark complete
│   │   │   ├── chat/
│   │   │   │   └── route.ts          # Proxy to Flowise
│   │   │   ├── reports/
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.ts      # Trigger report generation
│   │   │   │   └── [reportId]/
│   │   │   │       └── route.ts
│   │   │   ├── webhooks/
│   │   │   │   └── n8n/
│   │   │   │       └── route.ts      # Handle n8n callbacks
│   │   │   └── health/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage/landing
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── error.tsx                 # Error boundary
│   │
│   ├── components/
│   │   ├── ui/                       # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Container.tsx
│   │   ├── child/                    # Child-specific components
│   │   │   ├── MissionControl.tsx
│   │   │   ├── GalaxyMap.tsx
│   │   │   ├── AchievementCard.tsx
│   │   │   ├── LevelProgress.tsx
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── QuizComponent.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   └── ...
│   │   ├── parent/                   # Parent-specific components
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── ChildCard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── ActivityTimeline.tsx
│   │   │   ├── ReportsList.tsx
│   │   │   └── ...
│   │   └── shared/                   # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Client-side Supabase client
│   │   │   ├── server.ts             # Server-side Supabase client
│   │   │   ├── middleware.ts         # Auth middleware
│   │   │   └── types.ts              # Database types
│   │   ├── integrations/
│   │   │   ├── n8n.ts                # n8n webhook utilities
│   │   │   ├── flowise.ts            # Flowise API client
│   │   │   └── gotenberg.ts          # PDF generation utilities
│   │   ├── utils/
│   │   │   ├── format.ts             # Date, number formatting
│   │   │   ├── validation.ts         # Input validation helpers
│   │   │   ├── gamification.ts       # XP, level calculations
│   │   │   └── constants.ts          # App constants
│   │   └── types/
│   │       ├── database.ts           # Supabase types
│   │       ├── api.ts                # API request/response types
│   │       └── models.ts             # Business logic types
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                # Authentication hook
│   │   ├── useChildren.ts            # Children data hook
│   │   ├── useProgress.ts            # Progress tracking hook
│   │   ├── useAchievements.ts        # Achievements hook
│   │   ├── useChat.ts                # AI chat hook
│   │   └── useModules.ts             # Learning modules hook
│   │
│   ├── styles/
│   │   └── globals.css               # Global styles + Tailwind
│   │
│   └── config/
│       ├── site.ts                   # Site metadata
│       ├── navigation.ts             # Navigation structure
│       └── modules.ts                # Learning module definitions
│
├── public/
│   ├── branding/
│   │   ├── logo.png
│   │   ├── logo.svg
│   │   ├── jungle-background.png
│   │   └── ...
│   ├── content/
│   │   ├── planets/
│   │   ├── astronauts/
│   │   └── ...
│   ├── avatars/
│   │   ├── astronaut-1.png
│   │   ├── alien-1.png
│   │   └── ...
│   ├── favicon.ico
│   └── og-image.png
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/
```

## Database Schema

### Tables

#### cosmoskids_users

Parent/guardian accounts. Linked to Supabase Auth.

```sql
CREATE TABLE cosmoskids_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cosmoskids_users_auth_id ON cosmoskids_users(auth_id);
CREATE INDEX idx_cosmoskids_users_email ON cosmoskids_users(email);

-- RLS Policies
ALTER TABLE cosmoskids_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON cosmoskids_users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
  ON cosmoskids_users FOR UPDATE
  USING (auth.uid() = auth_id);
```

#### cosmoskids_children

Child profiles managed by parents.

```sql
CREATE TABLE cosmoskids_children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES cosmoskids_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 6 AND age <= 12),
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cosmoskids_children_user_id ON cosmoskids_children(user_id);
CREATE INDEX idx_cosmoskids_children_level ON cosmoskids_children(level);

-- RLS Policies
ALTER TABLE cosmoskids_children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own children"
  ON cosmoskids_children FOR SELECT
  USING (user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid()));

CREATE POLICY "Parents can insert own children"
  ON cosmoskids_children FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid()));

CREATE POLICY "Parents can update own children"
  ON cosmoskids_children FOR UPDATE
  USING (user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid()));

CREATE POLICY "Parents can delete own children"
  ON cosmoskids_children FOR DELETE
  USING (user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid()));
```

#### cosmoskids_modules

Learning modules (e.g., Solar System, Rockets, Astronauts).

```sql
CREATE TABLE cosmoskids_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'planets', 'missions', 'technology', etc.
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  min_age INTEGER DEFAULT 6,
  max_age INTEGER DEFAULT 12,
  image_url TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cosmoskids_modules_category ON cosmoskids_modules(category);
CREATE INDEX idx_cosmoskids_modules_published ON cosmoskids_modules(is_published);
CREATE UNIQUE INDEX idx_cosmoskids_modules_slug ON cosmoskids_modules(slug);

-- Public read access (no RLS needed, or simple policy)
ALTER TABLE cosmoskids_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published modules"
  ON cosmoskids_modules FOR SELECT
  USING (is_published = true);
```

#### cosmoskids_activities

Individual activities within modules.

```sql
CREATE TABLE cosmoskids_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES cosmoskids_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('quiz', 'video', 'reading', 'game', 'creative')),
  content JSONB NOT NULL, -- Structure depends on activity_type
  difficulty INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  estimated_duration INTEGER, -- minutes
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cosmoskids_activities_module_id ON cosmoskids_activities(module_id);
CREATE INDEX idx_cosmoskids_activities_type ON cosmoskids_activities(activity_type);
CREATE INDEX idx_cosmoskids_activities_published ON cosmoskids_activities(is_published);

-- Public read access
ALTER TABLE cosmoskids_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published activities"
  ON cosmoskids_activities FOR SELECT
  USING (is_published = true);
```

#### cosmoskids_progress

Tracks child completion of activities.

```sql
CREATE TABLE cosmoskids_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES cosmoskids_children(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES cosmoskids_activities(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER, -- Percentage or points (0-100)
  time_spent INTEGER, -- seconds
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, activity_id)
);

-- Indexes
CREATE INDEX idx_cosmoskids_progress_child_id ON cosmoskids_progress(child_id);
CREATE INDEX idx_cosmoskids_progress_activity_id ON cosmoskids_progress(activity_id);
CREATE INDEX idx_cosmoskids_progress_completed ON cosmoskids_progress(completed);

-- RLS Policies
ALTER TABLE cosmoskids_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own children's progress"
  ON cosmoskids_progress FOR SELECT
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Children progress can be inserted"
  ON cosmoskids_progress FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Children progress can be updated"
  ON cosmoskids_progress FOR UPDATE
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));
```

#### cosmoskids_badges

Achievement/badge definitions.

```sql
CREATE TABLE cosmoskids_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('completion', 'mastery', 'streak', 'special')),
  criteria JSONB NOT NULL, -- Flexible criteria definition
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cosmoskids_badges_type ON cosmoskids_badges(badge_type);
CREATE INDEX idx_cosmoskids_badges_active ON cosmoskids_badges(is_active);
CREATE UNIQUE INDEX idx_cosmoskids_badges_slug ON cosmoskids_badges(slug);

-- Public read
ALTER TABLE cosmoskids_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active badges"
  ON cosmoskids_badges FOR SELECT
  USING (is_active = true);
```

#### cosmoskids_achievements

Tracks which children earned which badges.

```sql
CREATE TABLE cosmoskids_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES cosmoskids_children(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES cosmoskids_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, badge_id)
);

-- Indexes
CREATE INDEX idx_cosmoskids_achievements_child_id ON cosmoskids_achievements(child_id);
CREATE INDEX idx_cosmoskids_achievements_badge_id ON cosmoskids_achievements(badge_id);
CREATE INDEX idx_cosmoskids_achievements_earned_at ON cosmoskids_achievements(earned_at);

-- RLS Policies
ALTER TABLE cosmoskids_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own children's achievements"
  ON cosmoskids_achievements FOR SELECT
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Achievements can be inserted for own children"
  ON cosmoskids_achievements FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));
```

#### cosmoskids_chat_history

AI chat conversation logs.

```sql
CREATE TABLE cosmoskids_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES cosmoskids_children(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cosmoskids_chat_child_id ON cosmoskids_chat_history(child_id);
CREATE INDEX idx_cosmoskids_chat_session_id ON cosmoskids_chat_history(session_id);
CREATE INDEX idx_cosmoskids_chat_created_at ON cosmoskids_chat_history(created_at);

-- RLS Policies
ALTER TABLE cosmoskids_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own children's chat history"
  ON cosmoskids_chat_history FOR SELECT
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));
```

#### cosmoskids_reports

Generated progress reports.

```sql
CREATE TABLE cosmoskids_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES cosmoskids_children(id) ON DELETE CASCADE,
  report_type TEXT DEFAULT 'monthly' CHECK (report_type IN ('weekly', 'monthly', 'custom')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report_url TEXT, -- Supabase Storage URL
  data JSONB, -- Summary data used to generate report
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cosmoskids_reports_child_id ON cosmoskids_reports(child_id);
CREATE INDEX idx_cosmoskids_reports_period ON cosmoskids_reports(period_start, period_end);
CREATE INDEX idx_cosmoskids_reports_generated_at ON cosmoskids_reports(generated_at);

-- RLS Policies
ALTER TABLE cosmoskids_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own children's reports"
  ON cosmoskids_reports FOR SELECT
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));
```

### Storage Buckets

```sql
-- Create buckets (via Supabase Dashboard or API)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('cosmoskids-avatars', 'cosmoskids-avatars', true),
  ('cosmoskids-reports', 'cosmoskids-reports', false),
  ('cosmoskids-content', 'cosmoskids-content', true);

-- Bucket policies

-- Avatars: public read, authenticated upload
CREATE POLICY "Avatar files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cosmoskids-avatars');

CREATE POLICY "Users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cosmoskids-avatars' AND
    auth.role() = 'authenticated'
  );

-- Reports: private, only parents can access own children's reports
CREATE POLICY "Parents can view own children's reports"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cosmoskids-reports' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM cosmoskids_children
      WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
    )
  );

-- Content: public read
CREATE POLICY "Content files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cosmoskids-content');
```

### Database Functions

#### Calculate Level from XP

```sql
CREATE OR REPLACE FUNCTION cosmoskids_calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Simple formula: level = floor(sqrt(xp / 100)) + 1
  -- Adjust as needed for game balance
  RETURN FLOOR(SQRT(xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

#### Update Child Level (Trigger)

```sql
CREATE OR REPLACE FUNCTION cosmoskids_update_child_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := cosmoskids_calculate_level(NEW.total_xp);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cosmoskids_children_update_level
  BEFORE UPDATE OF total_xp ON cosmoskids_children
  FOR EACH ROW
  EXECUTE FUNCTION cosmoskids_update_child_level();
```

## API Endpoints

See `docs/API.md` for full API documentation.

### Authentication

- `POST /api/auth/signup` - Register new parent account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/update-password` - Update password

### Children

- `GET /api/children` - List all children for authenticated parent
- `POST /api/children` - Create new child profile
- `GET /api/children/[childId]` - Get child details
- `PUT /api/children/[childId]` - Update child profile
- `DELETE /api/children/[childId]` - Delete child profile
- `GET /api/children/[childId]/progress` - Get child progress summary
- `GET /api/children/[childId]/achievements` - Get earned achievements

### Modules & Activities

- `GET /api/modules` - List all modules
- `GET /api/modules/[moduleId]` - Get module details
- `GET /api/modules/[moduleId]/activities` - List activities in module
- `GET /api/activities/[activityId]` - Get activity details
- `POST /api/activities/[activityId]/complete` - Mark activity complete

### Progress

- `POST /api/progress` - Record activity progress
- `PUT /api/progress/[progressId]` - Update progress record

### Chat

- `POST /api/chat` - Send message to AI tutor (proxies to Flowise)

### Reports

- `POST /api/reports/generate` - Trigger report generation
- `GET /api/reports/[reportId]` - Get report details

### Webhooks

- `POST /api/webhooks/n8n` - Handle n8n callbacks

## Integrations Architecture

### n8n Workflows

**Welcome Email**
- Trigger: HTTP Webhook (`/webhook/cosmoskids-welcome`)
- Input: `{ email, name, childName }`
- Actions:
  1. Format welcome email template
  2. Send email via SMTP/SendGrid
- Called from: Sign-up flow after first child added

**Weekly Progress Digest**
- Trigger: Cron (Every Monday 9 AM)
- Actions:
  1. Query Supabase for all active users
  2. For each user, query children and weekly progress
  3. Generate summary email
  4. Send via SMTP
- No direct app integration (runs automatically)

**Achievement Notification**
- Trigger: HTTP Webhook (`/webhook/cosmoskids-achievement`)
- Input: `{ childId, badgeId, parentEmail }`
- Actions:
  1. Fetch badge details
  2. Format congratulations email
  3. Send to parent
- Called from: API when achievement is earned

### Flowise Integration

**Space Tutor Chatbot**
- Chatflow ID: Configured in `.env`
- LLM: GPT-4 or Claude
- Memory: Conversation buffer with session ID
- System Prompt:
  ```
  You are Stella, a friendly and enthusiastic space tutor for children ages 6-12.
  Your job is to answer questions about space, astronomy, planets, astronauts, and science
  in an age-appropriate, engaging way. Use simple language, be encouraging, and celebrate
  curiosity. If a question is too advanced, gently guide them to simpler concepts.
  Always be positive and supportive.
  ```

**API Call from App**:
```typescript
const response = await fetch(`${FLOWISE_URL}/api/v1/prediction/${chatflowId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${FLOWISE_API_KEY}`
  },
  body: JSON.stringify({
    question: userMessage,
    overrideConfig: {
      sessionId: `cosmoskids-child-${childId}`
    }
  })
});

const data = await response.json();
return data.text; // AI response
```

### Gotenberg PDF Generation

**Generate Progress Report**:
```typescript
// 1. Generate HTML report
const htmlContent = await generateReportHTML(childId, periodStart, periodEnd);

// 2. Send to Gotenberg
const formData = new FormData();
formData.append('index.html', new Blob([htmlContent], { type: 'text/html' }));

const response = await fetch(`${GOTENBERG_URL}/forms/chromium/convert/html`, {
  method: 'POST',
  body: formData
});

const pdfBuffer = await response.arrayBuffer();

// 3. Upload to Supabase Storage
const fileName = `${childId}/report-${Date.now()}.pdf`;
const { data, error } = await supabase.storage
  .from('cosmoskids-reports')
  .upload(fileName, pdfBuffer, {
    contentType: 'application/pdf'
  });

// 4. Save report record to database
await supabase.from('cosmoskids_reports').insert({
  child_id: childId,
  report_type: 'monthly',
  period_start: periodStart,
  period_end: periodEnd,
  report_url: data.path
});
```

## Security Architecture

### Authentication Flow

1. User signs up via email/password
2. Supabase Auth creates `auth.users` record and sends verification email
3. App creates `cosmoskids_users` record linked to `auth.users.id`
4. On login, Supabase returns JWT with user's `auth.uid()`
5. All API requests include JWT in Authorization header or cookie
6. RLS policies verify `auth.uid()` matches resource owner

### Authorization Layers

1. **Supabase RLS** - Database-level access control
2. **API Route Guards** - Check auth before processing requests
3. **Server-Side Rendering** - Verify auth before rendering sensitive pages
4. **Client-Side Guards** - Redirect unauthenticated users

### Data Privacy

- Parents can only see their own children's data (enforced by RLS)
- Children have no direct login (accessed via parent account)
- Chat history logged but private to parent
- Reports stored in private bucket with RLS policies
- Sensitive data encrypted at rest (Supabase default)

### Input Validation

- All user inputs validated with Zod schemas
- SQL injection prevented by Supabase parameterized queries
- XSS prevention via React's default escaping
- CSRF protection via SameSite cookies

### Rate Limiting

- API routes protected with rate limiting middleware
- AI chat limited to N messages per hour per child
- Report generation throttled to prevent abuse

## Performance Optimization

### Caching Strategy

- Static pages cached at CDN (Vercel Edge)
- API responses cached with appropriate TTL
- Supabase queries cached in React Server Components
- Client-side state cached with React Query (or SWR)

### Code Splitting

- Route-based code splitting (Next.js automatic)
- Dynamic imports for heavy components
- Lazy loading for below-fold content

### Image Optimization

- Next.js Image component for automatic optimization
- WebP format with fallbacks
- Responsive images with srcset
- Lazy loading for images

### Database Optimization

- Indexes on frequently queried columns
- Efficient RLS policies (avoid N+1 queries)
- Connection pooling via Supabase
- Denormalized data where appropriate (e.g., `total_xp` on child)

## Monitoring & Logging

### Application Logs

- Server-side logs via Next.js
- Error tracking with Sentry (optional)
- Custom event logging for key actions

### Database Monitoring

- Supabase Dashboard analytics
- Query performance monitoring
- Alert on slow queries

### Integration Monitoring

- n8n execution logs
- Flowise chat logs
- Gotenberg generation logs

## Deployment Architecture

See `docs/DEPLOYMENT.md` for detailed deployment steps.

**Summary**:
1. Build Next.js app (`pnpm build`)
2. Create Docker image
3. Deploy to VPS with docker-compose
4. Traefik auto-configures SSL and routing
5. Connect to shared Supabase, n8n, Flowise, Gotenberg
6. Verify deployment and monitor logs

---

**Document Version**: 1.0
**Last Updated**: 2025-11-18

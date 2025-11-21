# Plan Integracji Nowych Serwisów - CosmosKids

## Spis treści

1. [Przegląd integracji](#1-przegląd-integracji)
2. [Upstash Redis - Caching & Session Storage](#2-upstash-redis---caching--session-storage)
3. [PostHog - Product Analytics](#3-posthog---product-analytics)
4. [Sentry - Error Tracking & Monitoring](#4-sentry---error-tracking--monitoring)
5. [Stripe - Payment Processing](#5-stripe---payment-processing)
6. [Loops - Email Marketing](#6-loops---email-marketing)
7. [Harmonogram wdrożenia](#7-harmonogram-wdrożenia)
8. [Zależności między integracjami](#8-zależności-między-integracjami)

---

## 1. Przegląd integracji

### Cele integracji

| Serwis | Cel | Priorytet | Szacowany czas |
|--------|-----|-----------|----------------|
| **Upstash Redis** | Caching, session storage, rate limiting | Wysoki | 2-3 dni |
| **PostHog** | Product analytics, feature flags, A/B testing | Wysoki | 1-2 dni |
| **Sentry** | Error tracking, performance monitoring | Wysoki | 1 dzień |
| **Stripe** | Płatności, subskrypcje Premium | Średni | 5-7 dni |
| **Loops** | Email marketing, lifecycle emails | Niski | 2-3 dni |

### Architektura po integracji

```
┌─────────────────────────────────────────────────────────────┐
│                    CosmosKids Frontend                       │
│              (Next.js 14 + React + TypeScript)               │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Middleware Layer:                                  │   │
│  │  - Upstash Redis (caching, rate limiting)          │   │
│  │  - Sentry (error tracking)                          │   │
│  │  - PostHog (event tracking)                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────┬──────────────────┬──────────────────────┐
│   Supabase       │  External APIs   │  Email & Automation  │
│  - PostgreSQL    │  - Flowise (AI)  │  - Loops (marketing) │
│  - Auth          │  - Stripe (pay)  │  - n8n (automation)  │
│  - Storage       │  - Gotenberg PDF │                      │
└──────────────────┴──────────────────┴──────────────────────┘
```

---

## 2. Upstash Redis - Caching & Session Storage

### 2.1. Cel integracji

**Problemy do rozwiązania:**
- Brak cache dla często odczytywanych danych (moduły, aktywności)
- Rate limiting obecnie w pamięci (nie działa w multi-instance)
- Session storage może być zoptymalizowany
- Slow queries do Supabase przy wysokim ruchu

**Korzyści:**
- ⚡ Szybsze ładowanie stron (cache modułów, content)
- 🔒 Skuteczny rate limiting (Redis atomic operations)
- 📊 Session storage dla temporary data (quiz progress, chat sessions)
- 💰 Reduce Supabase queries → niższe koszty

### 2.2. Przypadki użycia

1. **Cache modułów edukacyjnych**
   - TTL: 1 godzina
   - Invalidation: przy aktualizacji modułu przez admina
   - Klucz: `module:{slug}`, `modules:all`

2. **Cache aktywności**
   - TTL: 30 minut
   - Klucz: `activity:{id}`, `module:{moduleId}:activities`

3. **Rate limiting**
   - API endpoints: 100 req/min per IP
   - AI chat: 20 msg/hour per child
   - Klucz: `ratelimit:{type}:{identifier}`

4. **Session data**
   - Quiz progress (tymczasowy stan między pytaniami)
   - AI chat conversation context
   - Klucz: `session:{childId}:{type}`

5. **Leaderboards (future)**
   - Top children by XP (real-time ranking)
   - Klucz: `leaderboard:xp` (sorted set)

### 2.3. Konfiguracja

**Utworzenie konta Upstash:**
1. Załóż konto na https://upstash.com
2. Utwórz Redis database (wybierz region: EU-Central-1)
3. Skopiuj:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**Zmienne środowiskowe:**

```bash
# .env.production
UPSTASH_REDIS_REST_URL=https://eu1-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxx...

# Cache settings
REDIS_CACHE_ENABLED=true
REDIS_CACHE_TTL_MODULES=3600      # 1 godzina
REDIS_CACHE_TTL_ACTIVITIES=1800   # 30 minut
REDIS_CACHE_TTL_CONTENT=7200      # 2 godziny

# Rate limiting
REDIS_RATELIMIT_ENABLED=true
```

**Instalacja pakietów:**

```bash
npm install @upstash/redis ioredis
```

### 2.4. Implementacja

**Lokalizacja plików:**
- `/src/lib/redis/client.ts` - Redis client
- `/src/lib/redis/cache.ts` - Cache helpers
- `/src/lib/redis/ratelimit.ts` - Rate limiting
- `/src/lib/redis/session.ts` - Session storage

**Przykład: Cache helper (`/src/lib/redis/cache.ts`)**

```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  if (!process.env.REDIS_CACHE_ENABLED) {
    return fetchFn()
  }

  // Try cache first
  const cached = await redis.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Cache miss - fetch and store
  const data = await fetchFn()
  await redis.setex(key, ttl, data)
  return data
}

export async function invalidateCache(pattern: string) {
  // Invalidate by pattern (e.g., "module:*")
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

// Specific cache functions
export async function getCachedModule(slug: string) {
  return getCached(
    `module:${slug}`,
    async () => {
      // Fetch from Supabase
      const { data } = await supabase
        .from('cosmoskids_modules')
        .select('*')
        .eq('slug', slug)
        .single()
      return data
    },
    Number(process.env.REDIS_CACHE_TTL_MODULES) || 3600
  )
}
```

**Przykład: Rate limiter (`/src/lib/redis/ratelimit.ts`)**

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// API rate limiter (100 req/min per IP)
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
})

// AI chat rate limiter (20 msg/hour per child)
export const aiChatRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  analytics: true,
  prefix: 'ratelimit:aichat',
})

// Usage in API route:
// const { success } = await apiRatelimit.limit(ip)
// if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
```

### 2.5. Migracja

**Etap 1: Dodaj cache (non-breaking)**
- Wdróż Redis client
- Dodaj cache helpers
- Włącz cache tylko dla read operations (moduły, aktywności)
- Monitor performance (Sentry)

**Etap 2: Rate limiting**
- Migruj rate limiting z in-memory do Redis
- Deploy z feature flag: `REDIS_RATELIMIT_ENABLED=true`

**Etap 3: Session storage**
- Migruj quiz progress i chat sessions do Redis
- Test thoroughly (sessions nie mogą się zgubić!)

**Etap 4: Monitoring**
- Monitor Redis hit rate (Upstash dashboard)
- Monitor Supabase query reduction
- Optimize TTL values based on analytics

### 2.6. Koszty

**Upstash Redis:**
- Free tier: 10,000 commands/day
- Pay-as-you-go: $0.20 per 100K commands
- Szacowany koszt: $10-20/miesiąc (przy ~1M commands)

---

## 3. PostHog - Product Analytics

### 3.1. Cel integracji

**Problemy do rozwiązania:**
- Brak danych o użytkowaniu aplikacji (które moduły są popularne?)
- Brak analityki behavior flow (gdzie użytkownicy się zatrzymują?)
- Brak A/B testing (testowanie nowych feature'ów)
- Brak funnel analysis (signup → first activity → retention)

**Korzyści:**
- 📊 Product analytics (page views, events, user behavior)
- 🚩 Feature flags (stopniowe rollout nowych feature'ów)
- 🧪 A/B testing (optymalizacja UX dla dzieci)
- 🔍 Session replay (debug UX issues)
- 📈 Retention analysis (cohorts, churn rate)

### 3.2. Przypadki użycia

1. **Event tracking**
   - `user_signed_up`
   - `child_created`
   - `activity_started`, `activity_completed`
   - `quiz_answered`, `quiz_completed`
   - `ai_chat_message_sent`
   - `badge_earned`
   - `level_up`

2. **Page views**
   - Landing page visits
   - Dashboard views
   - Module page views
   - Activity views

3. **Funnel analysis**
   - Signup funnel: landing → signup → child creation → first activity
   - Retention funnel: Day 1 → Day 7 → Day 30
   - Activity completion funnel: started → in-progress → completed

4. **Feature flags**
   - `enable_ai_chat_v2` - Test nowej wersji AI chatbota
   - `enable_multiplayer_quiz` - Multiplayer quiz beta
   - `enable_premium_features` - Premium features dla testów

5. **A/B testing**
   - Test A/B: Gamification widgets (placement, style)
   - Test A/B: Onboarding flow (single-page vs multi-step)
   - Test A/B: AI tutor persona (Stella vs different character)

### 3.3. Konfiguracja

**Utworzenie konta PostHog:**
1. Załóż konto na https://posthog.com (EU Cloud lub self-hosted)
2. Utwórz projekt "CosmosKids"
3. Skopiuj API Key z Settings → Project API Key
4. Skopiuj Host URL (np. `https://eu.posthog.com`)

**Zmienne środowiskowe:**

```bash
# .env.production
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Feature flags
POSTHOG_FEATURE_FLAGS_ENABLED=true

# Session replay (opcjonalne - privacy concerns)
POSTHOG_SESSION_REPLAY_ENABLED=false  # Wyłączone dla dzieci (COPPA, GDPR)
```

**Instalacja pakietów:**

```bash
npm install posthog-js posthog-node
```

### 3.4. Implementacja

**Lokalizacja plików:**
- `/src/lib/posthog/client.ts` - PostHog browser client
- `/src/lib/posthog/server.ts` - PostHog server client
- `/src/lib/posthog/events.ts` - Event tracking helpers
- `/src/components/providers/PostHogProvider.tsx` - React provider

**PostHog Provider (`/src/components/providers/PostHogProvider.tsx`)**

```typescript
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        },
        capture_pageview: false, // We'll manually track page views
        disable_session_recording: true, // Privacy dla dzieci
      })
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

**Event tracking (`/src/lib/posthog/events.ts`)**

```typescript
import posthog from 'posthog-js'

export const trackEvent = {
  // User events
  userSignedUp: (userId: string, email: string) => {
    posthog.capture('user_signed_up', {
      user_id: userId,
      email,
      $set: { email, signed_up_at: new Date().toISOString() },
    })
  },

  // Child events
  childCreated: (childId: string, age: number, userId: string) => {
    posthog.capture('child_created', {
      child_id: childId,
      age,
      user_id: userId,
    })
  },

  // Activity events
  activityStarted: (activityId: string, childId: string, activityType: string) => {
    posthog.capture('activity_started', {
      activity_id: activityId,
      child_id: childId,
      activity_type: activityType,
    })
  },

  activityCompleted: (activityId: string, childId: string, score: number, timeSpent: number) => {
    posthog.capture('activity_completed', {
      activity_id: activityId,
      child_id: childId,
      score,
      time_spent_seconds: timeSpent,
    })
  },

  // AI Chat events
  aiChatMessageSent: (childId: string, messageLength: number) => {
    posthog.capture('ai_chat_message_sent', {
      child_id: childId,
      message_length: messageLength,
    })
  },

  // Gamification events
  badgeEarned: (childId: string, badgeSlug: string) => {
    posthog.capture('badge_earned', {
      child_id: childId,
      badge_slug: badgeSlug,
    })
  },

  levelUp: (childId: string, newLevel: number, xp: number) => {
    posthog.capture('level_up', {
      child_id: childId,
      new_level: newLevel,
      total_xp: xp,
    })
  },
}
```

**Feature flags usage:**

```typescript
import { useFeatureFlagEnabled } from 'posthog-js/react'

function AIChatComponent() {
  const isNewChatEnabled = useFeatureFlagEnabled('enable_ai_chat_v2')

  return isNewChatEnabled ? <NewAIChatUI /> : <LegacyAIChatUI />
}
```

### 3.5. Integracja w aplikacji

**1. Root layout (`/src/app/layout.tsx`):**
```typescript
import { PostHogProvider } from '@/components/providers/PostHogProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

**2. Track page views (middleware lub layout):**
```typescript
'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import posthog from 'posthog-js'

export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url += `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

  return null
}
```

**3. Identify users:**
```typescript
// Po zalogowaniu
posthog.identify(user.id, {
  email: user.email,
  subscription_tier: user.subscription_tier,
})

// Po wyborze dziecka
posthog.group('child', childId, {
  age: child.age,
  level: child.level,
})
```

### 3.6. Privacy & GDPR/COPPA

**WAŻNE - Aplikacja dla dzieci!**

PostHog musi być skonfigurowany zgodnie z:
- **COPPA** (Children's Online Privacy Protection Act - USA)
- **GDPR** (General Data Protection Regulation - EU)

**Wymagania:**
1. **Wyłącz session recording** - `disable_session_recording: true`
2. **Nie zbieraj PII dzieci** - Tylko anonimowe IDs
3. **Consent management** - Zgoda rodziców (nie dzieci)
4. **Data retention** - Max 90 dni dla event data
5. **Opt-out** - Rodzice mogą wyłączyć tracking

**Implementacja consent:**

```typescript
// Pytaj rodziców o zgodę w onboarding
if (parentConsent.analytics) {
  posthog.opt_in_capturing()
} else {
  posthog.opt_out_capturing()
}
```

### 3.7. Koszty

**PostHog:**
- Free tier: 1M events/miesiąc + 5K session replays
- Paid: $0.00031 per event po przekroczeniu free tier
- Szacowany koszt: $0-50/miesiąc (w zależności od traffic)

**Alternatywa:** Self-hosted PostHog (free, ale wymaga infrastruktury)

---

## 4. Sentry - Error Tracking & Monitoring

### 4.1. Cel integracji

**Problemy do rozwiązania:**
- Brak visibility na błędy produkcyjne (użytkownicy widzą błędy, my nie)
- Trudność w debug (brak stack traces z produkcji)
- Brak performance monitoring (slow pages?)
- Brak alertów (critical errors nie są wykrywane na czas)

**Korzyści:**
- 🐛 Error tracking (JavaScript, API, Database errors)
- 📊 Performance monitoring (Core Web Vitals, slow queries)
- 🔔 Alerts (email/Slack gdy critical error)
- 🔍 Context (user, session, breadcrumbs)
- 📈 Release tracking (errors per version)

### 4.2. Przypadki użycia

1. **Frontend errors**
   - React component errors
   - API call failures
   - Supabase connection errors
   - Render errors

2. **Backend errors**
   - API route exceptions
   - Database query failures
   - External API failures (Flowise, n8n, Stripe)
   - Authentication errors

3. **Performance monitoring**
   - Page load times
   - API response times
   - Database query duration
   - Third-party API latency

4. **Custom monitoring**
   - Failed AI chat requests
   - PDF generation failures
   - Rate limit exceeded events
   - Payment failures (Stripe)

### 4.3. Konfiguracja

**Utworzenie konta Sentry:**
1. Załóż konto na https://sentry.io
2. Utwórz projekt: "CosmosKids" (Next.js)
3. Skopiuj DSN z Settings → Client Keys (DSN)
4. Skopiuj Auth Token z Settings → Auth Tokens (dla source maps)

**Zmienne środowiskowe:**

```bash
# .env.production
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx...
SENTRY_ORG=your-org
SENTRY_PROJECT=cosmoskids

# Environment
SENTRY_ENVIRONMENT=production  # lub 'development'

# Release tracking
SENTRY_RELEASE=$VERCEL_GIT_COMMIT_SHA  # Lub manual version
```

**Instalacja pakietów:**

```bash
npm install @sentry/nextjs
```

**Inicjalizacja Sentry:**

```bash
npx @sentry/wizard@latest -i nextjs
```

Wizard utworzy:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `next.config.js` (modyfikacja)

### 4.4. Implementacja

**Lokalizacja plików:**
- `/sentry.client.config.ts` - Client-side config
- `/sentry.server.config.ts` - Server-side config
- `/sentry.edge.config.ts` - Edge runtime config
- `/src/lib/sentry/helpers.ts` - Custom helpers

**Client config (`/sentry.client.config.ts`):**

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'development',

  // Performance monitoring
  tracesSampleRate: 1.0, // 100% w dev, 0.1 (10%) w prod dla kosztów

  // Session replay (opcjonalne)
  replaysSessionSampleRate: 0, // Wyłączone dla dzieci (privacy)
  replaysOnErrorSampleRate: 0,

  // Ignore specific errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],

  // Custom integrations
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        'cosmoskids.smartcamp.ai',
        /^\//,
      ],
    }),
  ],

  // Before send hook (filter sensitive data)
  beforeSend(event, hint) {
    // Remove PII
    if (event.user) {
      delete event.user.email
      delete event.user.ip_address
    }
    return event
  },
})
```

**Server config (`/sentry.server.config.ts`):**

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'development',
  tracesSampleRate: 0.1, // 10% dla kosztów

  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Postgres(),
  ],
})
```

**Custom error boundaries (`/src/components/ErrorBoundary.tsx`):**

```typescript
'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div>
      <h2>Oops! Coś poszło nie tak 🚀</h2>
      <p>Nasi inżynierowie już pracują nad naprawą!</p>
      <button onClick={reset}>Spróbuj ponownie</button>
    </div>
  )
}
```

**Custom monitoring (`/src/lib/sentry/helpers.ts`):**

```typescript
import * as Sentry from '@sentry/nextjs'

export function captureAIChatError(error: Error, childId: string, message: string) {
  Sentry.captureException(error, {
    tags: {
      type: 'ai_chat_error',
      child_id: childId,
    },
    extra: {
      message_preview: message.substring(0, 100),
    },
    level: 'error',
  })
}

export function capturePDFGenerationError(error: Error, childId: string, reportType: string) {
  Sentry.captureException(error, {
    tags: {
      type: 'pdf_generation_error',
      report_type: reportType,
    },
    extra: {
      child_id: childId,
    },
    level: 'warning', // Warning bo PDF może być regenerowany
  })
}

export function capturePaymentError(error: Error, userId: string, stripeSessionId?: string) {
  Sentry.captureException(error, {
    tags: {
      type: 'payment_error',
    },
    extra: {
      user_id: userId,
      stripe_session_id: stripeSessionId,
    },
    level: 'error', // Critical - payment issues!
  })
}
```

### 4.5. Performance monitoring

**Slow API routes:**

```typescript
// /src/app/api/chat/route.ts
import * as Sentry from '@sentry/nextjs'

export async function POST(request: Request) {
  const transaction = Sentry.startTransaction({
    op: 'api.chat',
    name: 'POST /api/chat',
  })

  try {
    const span = transaction.startChild({
      op: 'flowise.request',
      description: 'Call Flowise API',
    })

    const response = await fetch(flowiseUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    span.finish()
    transaction.finish()

    return NextResponse.json(data)
  } catch (error) {
    Sentry.captureException(error)
    transaction.setStatus('internal_error')
    transaction.finish()
    throw error
  }
}
```

### 4.6. Alerts

**Konfiguracja alertów w Sentry Dashboard:**

1. **Critical errors** (instant Slack/Email)
   - Payment failures
   - Database connection errors
   - Authentication failures

2. **High error rate** (>100 errors/hour)
   - Any error spike

3. **Performance degradation** (P95 > 3s)
   - Slow page loads
   - Slow API responses

4. **New releases**
   - Track errors per release
   - Alert if new release has >10% error rate increase

### 4.7. Koszty

**Sentry:**
- Free tier: 5K errors/miesiąc, 10K transactions
- Team plan: $29/miesiąc - 50K errors, 100K transactions
- Business: $99/miesiąc - 500K errors, 1M transactions
- Szacowany koszt: $29-99/miesiąc

---

## 5. Stripe - Payment Processing

### 5.1. Cel integracji

**Model biznesowy:**
- **Free tier**: Ograniczony dostęp (podstawowe moduły)
- **Premium tier**: $9.99/miesiąc (wszystkie moduły, AI chat unlimited, raporty PDF)

**Funkcjonalności:**
- Subskrypcje miesięczne (recurring)
- Subskrypcje roczne (10% discount)
- Upgrade/downgrade flow
- Payment history
- Invoices (email)
- Failed payment handling (retry logic)

### 5.2. Przypadki użycia

1. **Checkout flow**
   - Rodzic klika "Upgrade to Premium"
   - Redirect do Stripe Checkout
   - Payment success → Update `subscription_tier` w bazie
   - Send welcome email (Loops)

2. **Subscription management**
   - View subscription status
   - Change plan (monthly ↔ yearly)
   - Cancel subscription (end of period)
   - Reactivate cancelled subscription

3. **Payment methods**
   - Add/remove payment methods
   - Update billing info
   - Set default payment method

4. **Invoicing**
   - View payment history
   - Download invoices (PDF)
   - Email receipts

5. **Webhooks**
   - `checkout.session.completed` → Activate subscription
   - `invoice.paid` → Extend subscription
   - `invoice.payment_failed` → Send dunning email
   - `customer.subscription.deleted` → Downgrade to free

### 5.3. Konfiguracja

**Utworzenie konta Stripe:**
1. Załóż konto na https://stripe.com
2. Przejdź do Test mode (podczas developmentu)
3. Skopiuj klucze z Developers → API keys:
   - Publishable key (public)
   - Secret key (server-only)
4. Utwórz produkty:
   - "CosmosKids Premium Monthly" - $9.99/month
   - "CosmosKids Premium Yearly" - $99.99/year
5. Skopiuj Price IDs dla każdego produktu

**Zmienne środowiskowe:**

```bash
# .env.production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx...
STRIPE_SECRET_KEY=sk_live_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...

# Product Price IDs
STRIPE_PRICE_ID_MONTHLY=price_xxx...
STRIPE_PRICE_ID_YEARLY=price_xxx...

# Feature flags
STRIPE_ENABLED=true
```

**Instalacja pakietów:**

```bash
npm install stripe @stripe/stripe-js
```

### 5.4. Implementacja

**Lokalizacja plików:**
- `/src/lib/stripe/client.ts` - Stripe client (server)
- `/src/lib/stripe/checkout.ts` - Checkout session helpers
- `/src/lib/stripe/webhooks.ts` - Webhook handlers
- `/src/app/api/stripe/checkout/route.ts` - Checkout API
- `/src/app/api/stripe/webhook/route.ts` - Webhook endpoint
- `/src/app/api/stripe/portal/route.ts` - Customer portal
- `/src/components/payment/UpgradeButton.tsx` - UI component

**Stripe client (`/src/lib/stripe/client.ts`):**

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})
```

**Checkout session (`/src/app/api/stripe/checkout/route.ts`):**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { priceId } = await request.json()

  // Get or create Stripe customer
  const { data: dbUser } = await supabase
    .from('cosmoskids_users')
    .select('stripe_customer_id')
    .eq('auth_id', user.id)
    .single()

  let customerId = dbUser?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: {
        user_id: user.id,
      },
    })
    customerId = customer.id

    // Save customer ID
    await supabase
      .from('cosmoskids_users')
      .update({ stripe_customer_id: customerId })
      .eq('auth_id', user.id)
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
    metadata: {
      user_id: user.id,
    },
  })

  return NextResponse.json({ url: session.url })
}
```

**Webhook handler (`/src/app/api/stripe/webhook/route.ts`):**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id

      // Activate premium subscription
      await supabase
        .from('cosmoskids_users')
        .update({
          subscription_tier: 'premium',
          stripe_subscription_id: session.subscription as string,
        })
        .eq('auth_id', userId)

      // TODO: Send welcome email via Loops
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      // TODO: Send dunning email
      // TODO: Log in Sentry
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      // Downgrade to free
      const { data: user } = await supabase
        .from('cosmoskids_users')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single()

      if (user) {
        await supabase
          .from('cosmoskids_users')
          .update({
            subscription_tier: 'free',
            stripe_subscription_id: null,
          })
          .eq('id', user.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

**Upgrade button (`/src/components/payment/UpgradeButton.tsx`):**

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function UpgradeButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })

    const { url } = await res.json()

    // Redirect to Stripe Checkout
    window.location.href = url
  }

  return (
    <Button onClick={handleUpgrade} disabled={loading}>
      {loading ? 'Loading...' : 'Upgrade to Premium'}
    </Button>
  )
}
```

### 5.5. Customer Portal

**Self-service portal** - Rodzice mogą sami:
- Zmienić plan
- Anulować subskrypcję
- Zaktualizować dane płatnicze
- Pobrać faktury

**API route (`/src/app/api/stripe/portal/route.ts`):**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: dbUser } = await supabase
    .from('cosmoskids_users')
    .select('stripe_customer_id')
    .eq('auth_id', user.id)
    .single()

  if (!dbUser?.stripe_customer_id) {
    return NextResponse.json({ error: 'No customer found' }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return NextResponse.json({ url: session.url })
}
```

### 5.6. Migracja schematu bazy danych

**Dodaj kolumny do `cosmoskids_users`:**

```sql
-- Migration: Add Stripe columns
ALTER TABLE cosmoskids_users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer
ON cosmoskids_users(stripe_customer_id);
```

### 5.7. Testing

**Test mode:**
1. Use test API keys (pk_test_xxx, sk_test_xxx)
2. Test cards:
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
   - Requires 3DS: `4000 0025 0000 3155`

**Webhook testing (local):**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# Test webhook
stripe trigger checkout.session.completed
```

### 5.8. Koszty

**Stripe:**
- Transaction fee: 2.9% + €0.30 per successful charge
- No monthly fees
- Dla $9.99 subscription: Fee ≈ $0.59 → Net revenue ≈ $9.40

---

## 6. Loops - Email Marketing

### 6.1. Cel integracji

**Problemy do rozwiązania:**
- n8n jest do automation, nie do marketing emails
- Brak segmentacji użytkowników (free vs premium, active vs churned)
- Brak lifecycle emails (onboarding sequence, re-engagement)
- Brak newsletterów (edukacyjne content dla rodziców)

**Korzyści:**
- 📧 Lifecycle emails (onboarding, activation, retention)
- 📊 Segmentation (free/premium, active/inactive, child age)
- 📈 Email analytics (open rate, click rate)
- 🎨 Beautiful email templates
- 🔄 Event-triggered emails (activity completed, badge earned)

### 6.2. Przypadki użycia

**Lifecycle emails:**

1. **Onboarding sequence** (triggered by signup)
   - Day 0: Welcome email + link to dashboard
   - Day 1: "Create your first child profile" (if not done)
   - Day 3: "Explore our learning modules" + featured module
   - Day 7: "Keep the momentum going!" + activity suggestions

2. **Activation emails**
   - First activity completed: "Great job! 🚀"
   - First badge earned: "You earned your first badge!"
   - Level 5 reached: "You're halfway to becoming a space expert!"

3. **Retention emails**
   - No activity for 7 days: "We miss you! Check out what's new"
   - No activity for 30 days: "Your space adventure is waiting!"
   - Weekly progress summary (every Monday)

4. **Monetization emails**
   - Free user, 5 activities completed: "Unlock more with Premium"
   - Free user, hit paywall: "Upgrade to continue learning"
   - Premium trial ending: "Your trial ends in 3 days"

5. **Re-engagement emails**
   - Churned users: "We've added new modules!"
   - Inactive premium: "Make the most of your Premium subscription"

**Transactional emails** (via Loops, nie n8n):
- Email verification
- Password reset
- Payment receipts
- Subscription updates

**Newsletters:**
- Monthly: New modules, featured content, tips for parents
- Seasonal: Space events (eclipses, meteor showers)

### 6.3. Konfiguracja

**Utworzenie konta Loops:**
1. Załóż konto na https://loops.so
2. Utwórz projekt "CosmosKids"
3. Skopiuj API Key z Settings → API
4. Skonfiguruj domeny (sender email):
   - Dodaj `smartcamp.ai` jako verified domain
   - Skonfiguruj DNS records (SPF, DKIM)

**Zmienne środowiskowe:**

```bash
# .env.production
LOOPS_API_KEY=loops_xxx...
LOOPS_FROM_EMAIL=hello@smartcamp.ai
LOOPS_FROM_NAME=CosmosKids

# Feature flag
LOOPS_ENABLED=true
```

**Instalacja pakietów:**

```bash
npm install loops
```

### 6.4. Implementacja

**Lokalizacja plików:**
- `/src/lib/loops/client.ts` - Loops client
- `/src/lib/loops/contacts.ts` - Contact management
- `/src/lib/loops/events.ts` - Event tracking
- `/src/lib/loops/templates.ts` - Email templates (IDs)

**Loops client (`/src/lib/loops/client.ts`):**

```typescript
import { LoopsClient } from 'loops'

export const loops = new LoopsClient(process.env.LOOPS_API_KEY!)
```

**Contact management (`/src/lib/loops/contacts.ts`):**

```typescript
import { loops } from './client'

export async function createContact(
  email: string,
  userId: string,
  subscriptionTier: 'free' | 'premium'
) {
  await loops.createContact({
    email,
    userId,
    subscriptionTier,
    signedUpAt: new Date().toISOString(),
    // Custom fields
    totalChildren: 0,
    totalActivitiesCompleted: 0,
  })
}

export async function updateContact(userId: string, updates: Record<string, any>) {
  await loops.updateContact(userId, updates)
}

export async function sendEvent(userId: string, eventName: string, properties?: Record<string, any>) {
  await loops.sendEvent({
    userId,
    eventName,
    eventProperties: properties,
  })
}
```

**Event tracking (`/src/lib/loops/events.ts`):**

```typescript
import { loops } from './client'

export const loopsEvent = {
  // User events
  userSignedUp: async (userId: string, email: string) => {
    await loops.createContact({
      email,
      userId,
      source: 'signup',
    })
  },

  // Child events
  childCreated: async (userId: string) => {
    await loops.updateContact(userId, {
      totalChildren: { $inc: 1 }, // Increment by 1
    })
    await loops.sendEvent({
      userId,
      eventName: 'child_created',
    })
  },

  // Activity events
  activityCompleted: async (userId: string, activityType: string) => {
    await loops.updateContact(userId, {
      totalActivitiesCompleted: { $inc: 1 },
      lastActivityAt: new Date().toISOString(),
    })
    await loops.sendEvent({
      userId,
      eventName: 'activity_completed',
      eventProperties: {
        activity_type: activityType,
      },
    })
  },

  // Subscription events
  upgradedToPremium: async (userId: string) => {
    await loops.updateContact(userId, {
      subscriptionTier: 'premium',
      upgradedAt: new Date().toISOString(),
    })
    await loops.sendEvent({
      userId,
      eventName: 'upgraded_to_premium',
    })
  },

  cancelledPremium: async (userId: string) => {
    await loops.updateContact(userId, {
      subscriptionTier: 'free',
      cancelledAt: new Date().toISOString(),
    })
  },
}
```

**Email templates w Loops Dashboard:**

Utwórz następujące transactional templates:

1. **welcome** - Welcome email (triggered by signup)
2. **child_created** - Congratulations on creating your first child profile
3. **first_activity** - Great job completing your first activity!
4. **badge_earned** - You earned a new badge!
5. **weekly_summary** - Weekly progress report
6. **upgrade_prompt** - Upgrade to Premium
7. **payment_success** - Payment received
8. **subscription_cancelled** - Subscription cancelled

**Wysyłanie transactional email:**

```typescript
import { loops } from '@/lib/loops/client'

export async function sendWelcomeEmail(email: string, name: string) {
  await loops.sendTransactionalEmail({
    transactionalId: 'welcome', // ID z Loops Dashboard
    email,
    dataVariables: {
      name,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    },
  })
}
```

### 6.5. Integracja z aplikacją

**1. Po rejestracji:**
```typescript
// /src/app/api/auth/signup/route.ts
import { loopsEvent } from '@/lib/loops/events'
import { sendWelcomeEmail } from '@/lib/loops/emails'

// After creating user
await loopsEvent.userSignedUp(user.id, user.email)
await sendWelcomeEmail(user.email, user.full_name)
```

**2. Po utworzeniu dziecka:**
```typescript
// /src/app/api/children/route.ts
import { loopsEvent } from '@/lib/loops/events'

await loopsEvent.childCreated(user.id)
```

**3. Po upgrade do Premium:**
```typescript
// /src/app/api/stripe/webhook/route.ts (checkout.session.completed)
import { loopsEvent } from '@/lib/loops/events'

await loopsEvent.upgradedToPremium(userId)
```

### 6.6. Segmentacja

**Segmenty w Loops Dashboard:**

1. **Free users** - `subscriptionTier = 'free'`
2. **Premium users** - `subscriptionTier = 'premium'`
3. **Active users** - `lastActivityAt > 7 days ago`
4. **Inactive users** - `lastActivityAt > 30 days ago`
5. **Power users** - `totalActivitiesCompleted > 20`
6. **New users** - `signedUpAt > 7 days ago`
7. **At-risk premium** - `subscriptionTier = 'premium' AND lastActivityAt > 14 days ago`

**Campaigns:**
- Newsletter → Segment: All users (opt-in)
- Re-engagement → Segment: Inactive users
- Upsell → Segment: Power users + Free tier
- Retention → Segment: At-risk premium

### 6.7. Koszty

**Loops:**
- Free tier: 2,000 contacts, 10,000 emails/month
- Starter: $49/month - 10K contacts, 100K emails
- Growth: $149/month - 50K contacts, 500K emails
- Szacowany koszt: $0-49/miesiąc (start z free tier)

---

## 7. Harmonogram wdrożenia

### Faza 1: Monitoring & Performance (Tydzień 1-2)

**Priorytet: WYSOKI - Foundation dla wszystkiego**

**Tydzień 1:**
- [ ] **Sentry** (1 dzień)
  - Setup konta i projektu
  - Instalacja pakietów
  - Konfiguracja client + server
  - Deploy i weryfikacja
  - Konfiguracja alertów

- [ ] **PostHog** (2 dni)
  - Setup konta i projektu
  - Instalacja pakietów
  - Implementacja event tracking (podstawowe eventy)
  - Konfiguracja privacy (COPPA/GDPR)
  - Weryfikacja na produkcji

- [ ] **Upstash Redis** (2 dni)
  - Setup konta i database
  - Instalacja pakietów
  - Implementacja cache helpers
  - Migracja rate limiting do Redis
  - Testing i monitoring

**Deliverables:**
- Sentry tracking all errors
- PostHog tracking key events (signup, activity completion)
- Redis caching modules + activities
- Dashboard z metrykami (PostHog, Sentry, Upstash)

---

### Faza 2: Email Marketing (Tydzień 3)

**Priorytet: ŚREDNI - Potrzebne dla retencji**

**Tydzień 3:**
- [ ] **Loops** (3 dni)
  - Setup konta i verified domain
  - Instalacja pakietów
  - Implementacja contact management
  - Utworzenie email templates (welcome, weekly summary)
  - Konfiguracja onboarding sequence
  - Testing z test emails

**Deliverables:**
- Welcome email po signup
- Weekly progress email (Loops, nie n8n)
- Segmentacja użytkowników (free/premium, active/inactive)

---

### Faza 3: Payments (Tydzień 4-5)

**Priorytet: WYSOKI - Revenue stream**

**Tydzień 4-5:**
- [ ] **Stripe** (5-7 dni)
  - Setup konta i produktów (monthly, yearly)
  - Instalacja pakietów
  - Migracja schematu DB (stripe_customer_id, stripe_subscription_id)
  - Implementacja checkout flow
  - Implementacja webhook handlers
  - Implementacja Customer Portal
  - Upgrade/downgrade logic
  - Testing (test mode + real transactions)
  - Integracja z Loops (payment emails)
  - Integracja z Sentry (payment error tracking)

**Deliverables:**
- Działający checkout flow (monthly + yearly plans)
- Webhook handling (subscription lifecycle)
- Customer portal (self-service)
- Payment success/failure emails (Loops)
- Dashboard pokazujący subscription status

---

### Faza 4: Optimization & Monitoring (Tydzień 6)

**Priorytet: NISKI - Polish**

- [ ] Monitoring dashboards
  - PostHog: Product analytics dashboard
  - Sentry: Performance monitoring dashboard
  - Upstash: Cache hit rate, Redis metrics
  - Loops: Email analytics (open rate, click rate)
  - Stripe: Revenue analytics

- [ ] A/B testing setup (PostHog)
  - Test: Onboarding flow variations
  - Test: Upgrade prompts (messaging, placement)

- [ ] Performance optimization
  - Analyze slow queries (Sentry)
  - Optimize cache TTLs (Upstash analytics)
  - Reduce bundle size (Next.js analyzer)

**Deliverables:**
- Comprehensive monitoring dashboards
- A/B tests running
- Performance optimizations implemented

---

## 8. Zależności między integracjami

### Integration Dependencies Graph

```
Sentry (1 dzień)
    ↓
    ├─→ PostHog (2 dni) ─────────┐
    │                             ↓
    └─→ Upstash Redis (2 dni) ──→ Stripe (5 dni)
                                   ↓
                            Loops (3 dni)
```

**Wyjaśnienie:**

1. **Sentry first** - Error tracking dla wszystkich kolejnych integracji
2. **PostHog + Upstash parallel** - Niezależne od siebie
3. **Stripe needs Sentry** - Payment errors muszą być trackowane
4. **Loops needs Stripe** - Payment emails (welcome to premium, etc.)
5. **Loops needs PostHog** - Segmentacja based on user behavior

### Critical Path

**Najkrótszy czas do MVP z płatnościami:**
1. Sentry (1 dzień)
2. Stripe (5 dni w parallel z Loops setup)
3. Loops (3 dni, dokończ payment emails)

**Total: ~7-8 dni roboczych**

### Feature Flags During Rollout

Użyj environment variables jako feature flags:

```bash
# Stopniowo włączaj nowe integracje
SENTRY_ENABLED=true
POSTHOG_ENABLED=true
REDIS_CACHE_ENABLED=false      # Włącz po testach
REDIS_RATELIMIT_ENABLED=false  # Włącz po testach
STRIPE_ENABLED=false            # Włącz po pełnych testach
LOOPS_ENABLED=true
```

**Deployment strategy:**
1. Deploy każdej integracji z `ENABLED=false`
2. Test na staging
3. Stopniowo włączaj na produkcji (1 feature/dzień)
4. Monitor errors (Sentry), metrics (PostHog)
5. Rollback jeśli error rate > 5%

---

## Podsumowanie

### Całkowite koszty (miesięcznie)

| Serwis | Plan | Koszt |
|--------|------|-------|
| **Upstash Redis** | Pay-as-you-go | $10-20 |
| **PostHog** | Free/Starter | $0-50 |
| **Sentry** | Team | $29-99 |
| **Stripe** | Transaction fees | 2.9% + €0.30 |
| **Loops** | Free/Starter | $0-49 |
| **TOTAL** | | **$40-220/miesiąc** |

### Całkowity czas implementacji

- **Minimum (MVP)**: 7-8 dni roboczych (Sentry + Stripe + Loops)
- **Full stack**: 15-20 dni roboczych (wszystkie integracje + testing + optimization)

### ROI Analysis

**Koszty:** $40-220/miesiąc
**Revenue:** $9.99/miesiąc per premium user

**Break-even:** 5-25 premium subscribers
**Target:** 100+ premium subscribers → $1000/miesiąc revenue

**Wniosek:** ROI pozytywny już przy małej bazie użytkowników.

---

## Następne kroki

Po przeczytaniu tego planu:
1. ✅ Przejrzyj `DEPLOYMENT_GUIDE.md` - Deploy obecnej wersji
2. ✅ Przejrzyj `ROADMAP.md` - Długoterminowy plan rozwoju
3. ⏳ Rozpocznij Fazę 1 (Sentry + PostHog + Redis)
4. ⏳ Przygotuj feature branch: `feature/integrations-phase-1`
5. ⏳ Deploy na staging i testuj
6. ⏳ Deploy na production z feature flags

**Pytania? Kontakt:** admin@smartcamp.ai

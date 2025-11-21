# CosmosKids - Instrukcja Wdrożenia i Konfiguracji

## Spis treści

1. [Przegląd architektury](#1-przegląd-architektury)
2. [Wymagania systemowe](#2-wymagania-systemowe)
3. [Konfiguracja środowiska](#3-konfiguracja-środowiska)
4. [Konfiguracja Supabase](#4-konfiguracja-supabase)
5. [Wdrożenie lokalne](#5-wdrożenie-lokalne)
6. [Wdrożenie na VPS (Docker)](#6-wdrożenie-na-vps-docker)
7. [Weryfikacja wdrożenia](#7-weryfikacja-wdrożenia)
8. [Rozwiązywanie problemów](#8-rozwiązywanie-problemów)

---

## 1. Przegląd architektury

### Tech Stack

**Frontend:**
- Next.js 14.2.18 (App Router)
- React 18.3.1
- TypeScript 5.7.2
- Tailwind CSS 3.4.15
- Framer Motion (animacje)

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL 15, Authentication, Storage)
- Node.js 18+

**Integracje zewnętrzne:**
- **n8n** - Automatyzacja workflow (emaile, notyfikacje)
- **Flowise** - AI chatbot (Stella - tutor kosmiczny)
- **Gotenberg** - Generowanie PDF (raporty)

**Deployment:**
- Docker (multi-stage build)
- Traefik (reverse proxy + SSL)
- VPS: SmartCamp.AI shared instance

### Architektura aplikacji

```
┌─────────────────────────────────────────────────────────────┐
│                    CosmosKids Frontend                       │
│              (Next.js 14 App Router + React)                 │
├─────────────────────────────────────────────────────────────┤
│  Routes:                                                      │
│  - / (landing page)                                          │
│  - /login, /signup (autentykacja rodziców)                  │
│  - /dashboard (panel rodzica)                               │
│  - /child/[childId] (panel dziecka - Mission Control)      │
│  - /child/[childId]/module/[moduleSlug] (moduły nauki)     │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
├─────────────────────────────────────────────────────────────┤
│  - /api/auth/* (login, signup, logout)                      │
│  - /api/children/* (zarządzanie profilami dzieci)           │
│  - /api/progress/* (śledzenie postępów)                     │
│  - /api/chat (proxy do Flowise AI)                          │
│  - /api/reports/* (generowanie raportów PDF)                │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
├─────────────────────────────────────────────────────────────┤
│  - PostgreSQL (baza danych z RLS)                           │
│  - Authentication (JWT, email/password)                      │
│  - Storage (avatary, raporty PDF, multimedia)               │
│  - Realtime (opcjonalnie)                                   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Integracje zewnętrzne                       │
├─────────────────────────────────────────────────────────────┤
│  - n8n: Welcome emails, weekly reports, achievements        │
│  - Flowise: AI chatbot "Stella" (tutor kosmiczny)          │
│  - Gotenberg: Konwersja HTML → PDF (raporty)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Wymagania systemowe

### Środowisko deweloperskie

- **Node.js**: ≥18.0.0
- **npm**: ≥9.0.0
- **System operacyjny**: Linux, macOS, Windows (WSL2)
- **RAM**: ≥4GB
- **Przestrzeń dyskowa**: ≥2GB

### Środowisko produkcyjne (VPS)

- **System**: Linux (Ubuntu 20.04+ / Debian 11+)
- **Docker**: ≥20.10
- **Docker Compose**: ≥2.0
- **RAM**: ≥2GB (zalecane 4GB)
- **CPU**: ≥2 cores
- **Przestrzeń dyskowa**: ≥10GB
- **Domena**: Skonfigurowana z DNS wskazującym na VPS

### Wymagane konta i usługi

1. **Supabase** - Konto na `api.supabase.smartcamp.ai` (shared instance)
2. **n8n** - Dostęp do `https://n8n.smartcamp.ai`
3. **Flowise** - Dostęp do `https://flowise.smartcamp.ai`
4. **Gotenberg** - Dostęp do kontenera Docker lub standalone service
5. **VPS** - Serwer z publicznym IP i domeną

---

## 3. Konfiguracja środowiska

### 3.1. Klonowanie repozytorium

```bash
git clone <repository-url> cosmos-kids
cd cosmos-kids
```

### 3.2. Instalacja zależności

```bash
npm install
```

### 3.3. Konfiguracja zmiennych środowiskowych

Skopiuj przykładowy plik `.env.example` do `.env.local` (development) lub `.env.production` (production):

```bash
# Development
cp .env.example .env.local

# Production
cp .env.example .env.production
```

### 3.4. Zmienne środowiskowe - opis szczegółowy

#### **Podstawowa konfiguracja**

```bash
# Środowisko
NODE_ENV=development  # lub 'production'
PORT=3000

# URL aplikacji
NEXT_PUBLIC_APP_URL=http://localhost:3000  # dev
# NEXT_PUBLIC_APP_URL=https://cosmoskids.smartcamp.ai  # production
```

#### **Supabase** (WYMAGANE)

```bash
# Publiczne (widoczne w przeglądarce)
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Tylko server-side (NIGDY nie eksponuj w kliencie!)
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_JWT_SECRET=<your-jwt-secret>

# Bezpośrednie połączenie do bazy (opcjonalne)
DATABASE_URL=postgresql://postgres:<password>@api.supabase.smartcamp.ai:5432/postgres
```

**Gdzie znaleźć klucze Supabase:**
1. Zaloguj się do Supabase Dashboard
2. Wybierz projekt CosmosKids
3. Settings → API
4. Skopiuj:
   - `anon` / `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
   - JWT Secret → `SUPABASE_JWT_SECRET`

#### **n8n Integration** (WYMAGANE dla emaili i notyfikacji)

```bash
N8N_WEBHOOK_URL=https://n8n.smartcamp.ai/webhook
N8N_WELCOME_WEBHOOK_PATH=cosmoskids-welcome
N8N_WEEKLY_REPORT_WEBHOOK_PATH=cosmoskids-weekly-report
N8N_ACHIEVEMENT_WEBHOOK_PATH=cosmoskids-achievement
N8N_API_KEY=<your-n8n-api-key>
```

**Konfiguracja n8n:**
1. Utwórz 3 workflow w n8n:
   - **cosmoskids-welcome**: Wysyła email powitalny po rejestracji
   - **cosmoskids-weekly-report**: Cotygodniowy raport postępów (cron)
   - **cosmoskids-achievement**: Notyfikacja o osiągnięciu nowej odznaki
2. Dla każdego workflow:
   - Dodaj node "Webhook"
   - Skopiuj endpoint URL (ostatnia część to `N8N_*_WEBHOOK_PATH`)
   - Skonfiguruj akcje (np. email via SendGrid, Slack, etc.)

#### **Flowise AI** (WYMAGANE dla AI chatbota)

```bash
FLOWISE_URL=https://flowise.smartcamp.ai
FLOWISE_API_KEY=<your-flowise-api-key>
FLOWISE_SPACE_TUTOR_CHATFLOW_ID=<chatflow-id>
FLOWISE_PROGRESS_ANALYZER_CHATFLOW_ID=<analyzer-chatflow-id>
```

**Konfiguracja Flowise:**
1. Utwórz 2 chatflows w Flowise:
   - **Space Tutor**: Chatbot "Stella" dla dzieci (wiek 6-12)
   - **Progress Analyzer**: Analiza postępów i rekomendacje
2. Dla każdego chatflow:
   - Ustaw model: GPT-4 lub GPT-3.5-turbo
   - Prompt engineering:
     - Space Tutor: "You are Stella, a friendly space tutor for kids aged 6-12..."
     - Analyzer: "Analyze learning progress and suggest next modules..."
   - Skopiuj Chatflow ID z URL

#### **Gotenberg PDF** (WYMAGANE dla raportów PDF)

```bash
# Docker internal network
GOTENBERG_URL=http://gotenberg:3000

# Lub standalone
# GOTENBERG_URL=http://localhost:3001
```

**Uruchomienie Gotenberg:**

```bash
# Docker
docker run -d --name gotenberg \
  --restart unless-stopped \
  -p 3001:3000 \
  gotenberg/gotenberg:8

# Lub dodaj do docker-compose.yml (patrz sekcja 6)
```

#### **Authentication & Security**

```bash
# Wygeneruj secret:
# openssl rand -base64 32
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000

# Czas ważności sesji (30 dni = 2592000 sekund)
SESSION_MAX_AGE=2592000
```

#### **Email (opcjonalne - jeśli nie używasz n8n do emaili)**

```bash
# SMTP (np. SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid-api-key>
SMTP_FROM_EMAIL=noreply@smartcamp.ai
SMTP_FROM_NAME=CosmosKids

# Lub SendGrid API
SENDGRID_API_KEY=<api-key>
```

#### **Analytics & Monitoring (opcjonalne)**

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry (error tracking) - PLANOWANE
NEXT_PUBLIC_SENTRY_DSN=<sentry-dsn>
SENTRY_AUTH_TOKEN=<sentry-token>
```

#### **Feature Flags**

```bash
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_PDF_REPORTS=true
NEXT_PUBLIC_ENABLE_ACHIEVEMENTS=true
NEXT_PUBLIC_ENABLE_SOCIAL_SHARING=false
```

#### **Rate Limiting**

```bash
# API rate limits
RATE_LIMIT_WINDOW=60000  # 1 minuta w ms
RATE_LIMIT_MAX_REQUESTS=100

# AI chat limits
AI_CHAT_RATE_LIMIT=20  # wiadomości/godzinę/dziecko
```

#### **Content & Media**

```bash
# Limity uploadów (w bajtach)
MAX_AVATAR_SIZE=5242880  # 5MB
MAX_REPORT_SIZE=10485760  # 10MB

# Dozwolone typy plików
ALLOWED_AVATAR_TYPES=image/jpeg,image/png,image/webp
ALLOWED_DOCUMENT_TYPES=application/pdf,image/jpeg,image/png
```

#### **Development Tools**

```bash
NEXT_TELEMETRY_DISABLED=1
DEBUG=false
LOG_LEVEL=info  # debug, info, warn, error
```

---

## 4. Konfiguracja Supabase

### 4.1. Utworzenie projektu (jeśli nowy)

1. Zaloguj się do Supabase Dashboard: https://api.supabase.smartcamp.ai
2. Utwórz nowy projekt lub użyj istniejącego (shared instance)
3. Zanotuj:
   - Project URL
   - `anon` key
   - `service_role` key
   - JWT Secret

### 4.2. Import schematu bazy danych

**Plik schematu:** `database/schema.sql`

**Metoda 1: SQL Editor (zalecane)**

1. Otwórz Supabase Dashboard → SQL Editor
2. Skopiuj zawartość `database/schema.sql`
3. Wklej i uruchom (Run)
4. Sprawdź logi - powinno utworzyć:
   - 9 tabel (wszystkie z prefiksem `cosmoskids_`)
   - 3 storage buckets
   - RLS policies dla wszystkich tabel
   - Triggery i funkcje

**Metoda 2: psql CLI**

```bash
psql $DATABASE_URL -f database/schema.sql
```

### 4.3. Weryfikacja schematu

Sprawdź czy utworzone zostały następujące tabele:

```sql
-- Powinno zwrócić 9 tabel
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'cosmoskids_%'
ORDER BY tablename;
```

Oczekiwane tabele:
- `cosmoskids_activities`
- `cosmoskids_achievements`
- `cosmoskids_badges`
- `cosmoskids_chat_history`
- `cosmoskids_children`
- `cosmoskids_modules`
- `cosmoskids_progress`
- `cosmoskids_reports`
- `cosmoskids_users`

### 4.4. Konfiguracja Storage Buckets

Sprawdź czy utworzone zostały 3 buckety:

1. **cosmoskids-avatars** (public)
   - Public read access
   - Authenticated users can upload
   - RLS: Tylko właściciel profilu może edytować

2. **cosmoskids-reports** (private)
   - Private read (RLS-controlled)
   - Authenticated users can upload
   - RLS: Tylko rodzic może odczytać raporty swoich dzieci

3. **cosmoskids-content** (public)
   - Public read access
   - Admin upload only (service_role)
   - Zawiera multimedia do modułów edukacyjnych

**Weryfikacja:**

Supabase Dashboard → Storage → Buckets

### 4.5. Dane seed (opcjonalne)

Schema zawiera dane startowe:
- 6 modułów edukacyjnych (Solar System, Stars, etc.)
- 7 odznak/achievementów

Jeśli nie załadowały się automatycznie, uruchom ponownie sekcję `-- Seed Data` z `schema.sql`.

### 4.6. Konfiguracja Authentication

Supabase Dashboard → Authentication → Settings:

1. **Email Auth**: Włącz
2. **Confirm Email**: Włącz (zalecane dla produkcji)
3. **Mailer Templates**: Dostosuj emaile (opcjonalne)
4. **Site URL**: Ustaw na `NEXT_PUBLIC_APP_URL`
5. **Redirect URLs**: Dodaj:
   - `http://localhost:3000/**` (dev)
   - `https://cosmoskids.smartcamp.ai/**` (production)

### 4.7. Row Level Security (RLS)

Schema automatycznie konfiguruje RLS dla wszystkich tabel. Sprawdź polityki:

```sql
-- Powinno zwrócić ~20 policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename LIKE 'cosmoskids_%';
```

**Najważniejsze polityki:**
- Rodzice mogą edytować tylko swoje konto (`cosmoskids_users`)
- Rodzice mogą zarządzać tylko swoimi dziećmi (`cosmoskids_children`)
- Rodzice widzą tylko postępy swoich dzieci (`cosmoskids_progress`)
- Wszyscy mogą czytać opublikowane moduły i aktywności

---

## 5. Wdrożenie lokalne

### 5.1. Uruchomienie dev server

```bash
# Zainstaluj zależności
npm install

# Skopiuj .env.example → .env.local i uzupełnij wartości
cp .env.example .env.local

# Uruchom dev server
npm run dev
```

Aplikacja dostępna pod: http://localhost:3000

### 5.2. Sprawdzenie TypeScript

```bash
npm run type-check
```

### 5.3. Linting i formatowanie

```bash
# ESLint
npm run lint

# Prettier
npm run format
```

### 5.4. Build produkcyjny (lokalnie)

```bash
npm run build
npm run start
```

### 5.5. Troubleshooting - lokalne wdrożenie

**Problem: Błąd połączenia z Supabase**
```
Error: Invalid Supabase URL or anon key
```
**Rozwiązanie:**
- Sprawdź czy `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_ANON_KEY` są poprawne
- Upewnij się że klucze są w `.env.local` (nie `.env.example`)

**Problem: Tabele nie istnieją**
```
Error: relation "cosmoskids_users" does not exist
```
**Rozwiązanie:**
- Uruchom `database/schema.sql` w Supabase SQL Editor

**Problem: RLS policy violation**
```
Error: new row violates row-level security policy
```
**Rozwiązanie:**
- Sprawdź czy użytkownik jest zalogowany
- Zweryfikuj polityki RLS w Supabase Dashboard

---

## 6. Wdrożenie na VPS (Docker)

### 6.1. Wymagania VPS

- Ubuntu 20.04+ lub Debian 11+
- Docker i Docker Compose zainstalowane
- Domena skonfigurowana z DNS (A record → IP VPS)
- Porty otwarte: 80, 443 (HTTP/HTTPS)

### 6.2. Instalacja Docker (jeśli nie zainstalowane)

```bash
# Usuń stare wersje
sudo apt-get remove docker docker-engine docker.io containerd runc

# Zainstaluj zależności
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Dodaj klucz GPG Dockera
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Dodaj repozytorium
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Zainstaluj Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Weryfikacja
docker --version
docker compose version
```

### 6.3. Przygotowanie VPS

```bash
# Utwórz katalog projektu
sudo mkdir -p /opt/cosmos-kids
sudo chown $USER:$USER /opt/cosmos-kids
cd /opt/cosmos-kids

# Sklonuj repozytorium
git clone <repository-url> .

# Skopiuj .env.production i uzupełnij
cp .env.example .env.production
nano .env.production
```

**Kluczowe zmienne dla produkcji w `.env.production`:**

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://cosmoskids.smartcamp.ai

# Supabase (produkcyjne klucze)
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<production-service-role-key>

# Wszystkie pozostałe zmienne...
```

### 6.4. Docker Compose - kompletna konfiguracja

**Edytuj `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  cosmoskids-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cosmoskids-app
    restart: unless-stopped
    env_file:
      - .env.production
    networks:
      - smartcamp-network
    labels:
      # Traefik
      - "traefik.enable=true"
      - "traefik.http.routers.cosmoskids.rule=Host(`cosmoskids.smartcamp.ai`)"
      - "traefik.http.routers.cosmoskids.entrypoints=websecure"
      - "traefik.http.routers.cosmoskids.tls=true"
      - "traefik.http.routers.cosmoskids.tls.certresolver=letsencrypt"
      - "traefik.http.services.cosmoskids.loadbalancer.server.port=3000"
    depends_on:
      - gotenberg

  # Gotenberg (PDF generation)
  gotenberg:
    image: gotenberg/gotenberg:8
    container_name: cosmoskids-gotenberg
    restart: unless-stopped
    networks:
      - smartcamp-network
    # Nie wystawiaj publicznie, tylko internal network
    # Jeśli potrzebny publiczny dostęp, dodaj labels dla Traefik

networks:
  smartcamp-network:
    external: true
```

### 6.5. Build i uruchomienie

```bash
# Build image
docker compose build

# Uruchom w tle
docker compose up -d

# Sprawdź logi
docker compose logs -f cosmoskids-app

# Sprawdź status
docker compose ps
```

### 6.6. Konfiguracja Traefik (jeśli nie skonfigurowany)

Jeśli na VPS nie ma jeszcze Traefika, utwórz:

**`traefik/docker-compose.yml`:**

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./acme.json:/acme.json
    networks:
      - smartcamp-network
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@smartcamp.ai"
      - "--certificatesresolvers.letsencrypt.acme.storage=/acme.json"

networks:
  smartcamp-network:
    external: true
```

```bash
# Utwórz network
docker network create smartcamp-network

# Utwórz plik dla certyfikatów
touch traefik/acme.json
chmod 600 traefik/acme.json

# Uruchom Traefik
cd traefik
docker compose up -d
```

### 6.7. Aktualizacja aplikacji

```bash
cd /opt/cosmos-kids

# Pobierz zmiany
git pull origin main

# Rebuild i restart
docker compose build
docker compose up -d

# Sprawdź logi
docker compose logs -f cosmoskids-app
```

### 6.8. Backup i monitoring

**Backup bazy danych (Supabase):**

Supabase wykonuje automatyczne backupy. Aby pobrać manual backup:

```bash
# Backup przez pg_dump
pg_dump $DATABASE_URL -f backup_$(date +%Y%m%d).sql

# Lub przez Supabase Dashboard:
# Dashboard → Database → Backups → Download
```

**Monitoring:**

```bash
# Logi aplikacji
docker compose logs -f cosmoskids-app

# Logi Gotenberg
docker compose logs -f gotenberg

# Użycie zasobów
docker stats

# Health check
curl https://cosmoskids.smartcamp.ai
```

---

## 7. Weryfikacja wdrożenia

### 7.1. Testy podstawowe

**1. Sprawdź czy aplikacja odpowiada:**

```bash
curl https://cosmoskids.smartcamp.ai
# Powinno zwrócić HTML landing page
```

**2. Sprawdź połączenie z Supabase:**

- Otwórz https://cosmoskids.smartcamp.ai/login
- Formularz logowania powinien się załadować
- DevTools → Network → Sprawdź czy jest połączenie z Supabase

**3. Sprawdź Auth:**

- Zarejestruj nowego użytkownika (jeśli signup działa)
- Lub zaloguj się istniejącym kontem
- Powinno przekierować do dashboardu

**4. Sprawdź Supabase Storage:**

- Dashboard → Storage → cosmoskids-avatars
- Sprawdź czy bucket jest publiczny (public read)

**5. Sprawdź AI Chat (jeśli włączony):**

- Przejdź do panelu dziecka
- Otwórz chat z "Stellą"
- Wyślij wiadomość testową
- Sprawdź odpowiedź (może być opóźnienie 2-5s)

### 7.2. Testy integracji

**n8n Webhooks:**

```bash
# Test welcome webhook
curl -X POST https://n8n.smartcamp.ai/webhook/cosmoskids-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'

# Sprawdź logi n8n czy wykonał się workflow
```

**Flowise Chatbot:**

```bash
# Test chatbot API
curl -X POST https://flowise.smartcamp.ai/api/v1/prediction/$FLOWISE_SPACE_TUTOR_CHATFLOW_ID \
  -H "Authorization: Bearer $FLOWISE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the Solar System?",
    "overrideConfig": {
      "sessionId": "test-session-123"
    }
  }'
```

**Gotenberg PDF:**

```bash
# Test PDF generation
curl --request POST \
  --url http://gotenberg:3000/forms/chromium/convert/html \
  --header 'Content-Type: multipart/form-data' \
  --form files=@test.html \
  -o test.pdf

# Sprawdź czy plik PDF został utworzony
file test.pdf
```

### 7.3. Checklist końcowy

- [ ] Aplikacja dostępna przez HTTPS
- [ ] Certyfikat SSL ważny (Let's Encrypt)
- [ ] Strona główna ładuje się poprawnie
- [ ] Formularz logowania/rejestracji działa
- [ ] Połączenie z Supabase działa
- [ ] Tabele w bazie danych istnieją (9 tabel)
- [ ] Storage buckets utworzone (3 buckety)
- [ ] RLS policies skonfigurowane
- [ ] n8n webhooks odpowiadają
- [ ] Flowise chatbot odpowiada
- [ ] Gotenberg generuje PDF
- [ ] Logi nie pokazują błędów krytycznych
- [ ] Docker containers są `healthy` (docker ps)

---

## 8. Rozwiązywanie problemów

### Problem: Aplikacja nie startuje

**Symptomy:**
```
docker compose ps
# cosmoskids-app: exited (1)
```

**Diagnoza:**
```bash
docker compose logs cosmoskids-app
```

**Typowe przyczyny:**
1. Błąd w `.env.production` (brakująca zmienna)
2. Błąd w kodzie (syntax error)
3. Brak połączenia z Supabase

**Rozwiązanie:**
```bash
# Sprawdź .env.production
nano .env.production

# Rebuild
docker compose build --no-cache
docker compose up -d
```

---

### Problem: 502 Bad Gateway

**Symptomy:**
- Strona wyświetla "502 Bad Gateway" z Traefik

**Przyczyny:**
1. Kontener nie działa: `docker compose ps`
2. Port 3000 nie jest otwarty w kontenerze
3. Traefik nie może połączyć się z aplikacją

**Rozwiązanie:**
```bash
# Sprawdź czy kontener działa
docker compose ps

# Sprawdź logi Traefik
docker logs traefik

# Sprawdź czy aplikacja odpowiada wewnętrznie
docker exec -it cosmoskids-app curl http://localhost:3000

# Jeśli nie odpowiada, sprawdź logi aplikacji
docker compose logs cosmoskids-app
```

---

### Problem: Błąd połączenia z Supabase

**Symptomy:**
```
Error: Invalid Supabase URL
Error: Could not connect to Supabase
```

**Rozwiązanie:**
1. Sprawdź `.env.production`:
   ```bash
   grep SUPABASE .env.production
   ```
2. Zweryfikuj klucze w Supabase Dashboard → Settings → API
3. Sprawdź czy VPS ma dostęp do internetu:
   ```bash
   curl https://api.supabase.smartcamp.ai
   ```

---

### Problem: RLS policy violation

**Symptomy:**
```
Error: new row violates row-level security policy for table "cosmoskids_users"
```

**Przyczyny:**
- Użytkownik nie jest zalogowany
- RLS policy nie zezwala na operację

**Rozwiązanie:**
1. Sprawdź czy użytkownik jest zalogowany (JWT token w cookies)
2. Zweryfikuj RLS policies w Supabase Dashboard:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'cosmoskids_users';
   ```
3. Jeśli potrzeba, tymczasowo wyłącz RLS (tylko dev!):
   ```sql
   ALTER TABLE cosmoskids_users DISABLE ROW LEVEL SECURITY;
   ```

---

### Problem: n8n webhook nie działa

**Symptomy:**
- Webhook zwraca 404 lub 500
- n8n nie wykonuje workflow

**Rozwiązanie:**
1. Sprawdź czy webhook jest aktywny w n8n Dashboard
2. Zweryfikuj URL:
   ```bash
   echo $N8N_WEBHOOK_URL/$N8N_WELCOME_WEBHOOK_PATH
   # Powinno: https://n8n.smartcamp.ai/webhook/cosmoskids-welcome
   ```
3. Testuj webhook bezpośrednio:
   ```bash
   curl -X POST https://n8n.smartcamp.ai/webhook/cosmoskids-welcome \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```
4. Sprawdź logi n8n

---

### Problem: Flowise chatbot nie odpowiada

**Symptomy:**
```
Error: Flowise API request failed
Timeout waiting for Flowise response
```

**Rozwiązanie:**
1. Sprawdź czy `FLOWISE_API_KEY` jest poprawny
2. Zweryfikuj `FLOWISE_SPACE_TUTOR_CHATFLOW_ID`:
   - Otwórz Flowise Dashboard
   - Znajdź chatflow
   - Skopiuj ID z URL
3. Testuj API bezpośrednio:
   ```bash
   curl -X POST https://flowise.smartcamp.ai/api/v1/prediction/$FLOWISE_SPACE_TUTOR_CHATFLOW_ID \
     -H "Authorization: Bearer $FLOWISE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"question":"test"}'
   ```

---

### Problem: Gotenberg nie generuje PDF

**Symptomy:**
```
Error: Could not connect to Gotenberg
PDF generation failed
```

**Rozwiązanie:**
1. Sprawdź czy kontener Gotenberg działa:
   ```bash
   docker ps | grep gotenberg
   ```
2. Sprawdź czy aplikacja może połączyć się z Gotenberg:
   ```bash
   docker exec -it cosmoskids-app curl http://gotenberg:3000/health
   ```
3. Sprawdź logi Gotenberg:
   ```bash
   docker compose logs gotenberg
   ```
4. Jeśli kontener nie działa, uruchom ponownie:
   ```bash
   docker compose restart gotenberg
   ```

---

### Problem: Certyfikat SSL nie działa

**Symptomy:**
- Strona wyświetla "Your connection is not private"
- Let's Encrypt nie może wydać certyfikatu

**Rozwiązanie:**
1. Sprawdź czy domena wskazuje na prawidłowy IP:
   ```bash
   dig cosmoskids.smartcamp.ai
   nslookup cosmoskids.smartcamp.ai
   ```
2. Sprawdź logi Traefik:
   ```bash
   docker logs traefik | grep -i letsencrypt
   ```
3. Sprawdź czy porty 80 i 443 są otwarte:
   ```bash
   sudo ufw status
   # Jeśli firewall blokuje, otwórz porty:
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```
4. Sprawdź `acme.json`:
   ```bash
   cat traefik/acme.json
   # Powinno zawierać certyfikaty
   ```
5. Wymuś odnowienie certyfikatu:
   ```bash
   # Usuń acme.json i zrestartuj Traefik
   rm traefik/acme.json
   touch traefik/acme.json
   chmod 600 traefik/acme.json
   docker compose -f traefik/docker-compose.yml restart
   ```

---

### Pomoc i wsparcie

**Logi:**
```bash
# Wszystkie logi
docker compose logs -f

# Logi tylko aplikacji
docker compose logs -f cosmoskids-app

# Logi z ostatnich 100 linii
docker compose logs --tail=100 cosmoskids-app
```

**Dostęp do kontenera:**
```bash
# Shell w kontenerze
docker exec -it cosmoskids-app sh

# Sprawdź zmienne środowiskowe
docker exec cosmoskids-app env | grep -i supabase
```

**Kontakt:**
- Dokumentacja: `/docs/ARCHITECTURE.md`
- Issues: GitHub Issues
- Email: admin@smartcamp.ai

---

## Następne kroki

Po udanym wdrożeniu:
1. Zobacz `INTEGRATION_PLAN.md` dla planowanych integracji (Redis, PostHog, Sentry, Stripe, Loops)
2. Zobacz `ROADMAP.md` dla planu rozwoju aplikacji
3. Skonfiguruj monitoring produkcyjny (Sentry, PostHog)
4. Uruchom backup automatyczny
5. Skonfiguruj CI/CD pipeline (opcjonalne)


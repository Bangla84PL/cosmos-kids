# CosmosKids Deployment Guide

This guide covers deploying CosmosKids to the SmartCamp.AI VPS infrastructure.

## Prerequisites

- Access to SmartCamp.AI VPS (SSH)
- Supabase database access (api.supabase.smartcamp.ai)
- n8n access (n8n.smartcamp.ai)
- Flowise access (flowise.smartcamp.ai)
- Git repository access
- Docker and Docker Compose installed on VPS

## Deployment Steps

### 1. Database Setup

#### Connect to Supabase

Via Supabase Studio:
1. Navigate to https://studio.supabase.smartcamp.ai
2. Log in with credentials
3. Open SQL Editor

Or via psql:
```bash
psql postgresql://postgres:password@api.supabase.smartcamp.ai:5432/postgres
```

#### Execute Schema

Run the entire contents of `database/schema.sql`:

```bash
# Copy schema file to VPS
scp database/schema.sql user@smartcamp.ai:/tmp/cosmoskids-schema.sql

# Execute on Supabase
psql postgresql://postgres:password@api.supabase.smartcamp.ai:5432/postgres \
  -f /tmp/cosmoskids-schema.sql
```

Or paste contents into Supabase Studio SQL Editor and execute.

#### Verify Tables Created

```sql
\dt cosmoskids_*

-- Should show:
-- cosmoskids_users
-- cosmoskids_children
-- cosmoskids_modules
-- cosmoskids_activities
-- cosmoskids_progress
-- cosmoskids_badges
-- cosmoskids_achievements
-- cosmoskids_chat_history
-- cosmoskids_reports
```

#### Create Storage Buckets

Via Supabase Dashboard:
1. Go to Storage section
2. Create buckets:
   - `cosmoskids-avatars` (public: true)
   - `cosmoskids-reports` (public: false)
   - `cosmoskids-content` (public: true)

Or via API:
```javascript
// Via Supabase admin client
await supabase.storage.createBucket('cosmoskids-avatars', { public: true });
await supabase.storage.createBucket('cosmoskids-reports', { public: false });
await supabase.storage.createBucket('cosmoskids-content', { public: true });
```

#### Set Storage Policies

See commented section at bottom of `database/schema.sql` for storage policy examples.

Execute via Supabase Studio SQL Editor.

### 2. Prepare Environment Variables

On your VPS, create `/opt/apps/cosmoskids/.env.production`:

```env
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://cosmoskids.smartcamp.ai

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (get from Supabase Dashboard)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (get from Supabase Dashboard - keep secret!)
SUPABASE_JWT_SECRET=your-jwt-secret

# n8n Integration
N8N_WEBHOOK_URL=https://n8n.smartcamp.ai/webhook
N8N_WELCOME_WEBHOOK_PATH=cosmoskids-welcome
N8N_WEEKLY_REPORT_WEBHOOK_PATH=cosmoskids-weekly-report
N8N_ACHIEVEMENT_WEBHOOK_PATH=cosmoskids-achievement

# Flowise AI
FLOWISE_URL=https://flowise.smartcamp.ai
FLOWISE_API_KEY=your-flowise-api-key
FLOWISE_SPACE_TUTOR_CHATFLOW_ID=your-chatflow-id

# Gotenberg PDF
GOTENBERG_URL=http://gotenberg:3000

# NextAuth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://cosmoskids.smartcamp.ai

# Email (if not using n8n)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=noreply@smartcamp.ai

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_PDF_REPORTS=true
NEXT_PUBLIC_ENABLE_ACHIEVEMENTS=true

# Telemetry
NEXT_TELEMETRY_DISABLED=1
```

**CRITICAL**: Keep this file secure. Never commit `.env.production` to git.

### 3. Get Supabase Credentials

#### Anon Key (Public, safe for client)
1. Go to https://studio.supabase.smartcamp.ai
2. Click your project
3. Settings → API
4. Copy "anon public" key

#### Service Role Key (Private, server-only)
1. Same location as above
2. Copy "service_role" key
3. **NEVER expose this to the client!**

#### JWT Secret
1. Same location
2. Copy "JWT Secret"

### 4. Deploy Application to VPS

#### SSH to VPS

```bash
ssh user@smartcamp.ai
```

#### Create Application Directory

```bash
sudo mkdir -p /opt/apps/cosmoskids
cd /opt/apps/cosmoskids
```

#### Clone Repository

```bash
git clone <your-repo-url> .
# or
git clone https://github.com/smartcampai/cosmos-kids.git .
```

#### Switch to Deployment Branch

```bash
git checkout claude/build-full-project-018hmv9yJUmzGbPcMESqQ8wh
```

#### Create .env.production

```bash
nano .env.production
# Paste environment variables from step 2
# Save with Ctrl+X, Y, Enter
```

#### Verify docker-compose.yml

Ensure `docker-compose.yml` is present and correct:

```yaml
version: '3.8'

services:
  cosmoskids:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cosmoskids-app
    restart: unless-stopped
    env_file:
      - .env.production
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.cosmoskids.rule=Host(`cosmoskids.smartcamp.ai`)"
      - "traefik.http.routers.cosmoskids.entrypoints=websecure"
      - "traefik.http.routers.cosmoskids.tls=true"
      - "traefik.http.routers.cosmoskids.tls.certresolver=letsencrypt"
      - "traefik.http.services.cosmoskids.loadbalancer.server.port=3000"
    networks:
      - smartcamp-network

networks:
  smartcamp-network:
    external: true
```

#### Build and Start

```bash
docker-compose up -d --build
```

This will:
1. Build the Docker image
2. Start the container
3. Traefik will automatically detect it and configure routing
4. Let's Encrypt will issue SSL certificate

#### Monitor Logs

```bash
docker-compose logs -f
```

Watch for any errors. You should see:
```
cosmoskids-app | Ready on http://0.0.0.0:3000
```

### 5. Verify Deployment

#### Check Container Status

```bash
docker ps | grep cosmoskids
```

Should show container running.

#### Check Traefik Routing

```bash
docker logs traefik | grep cosmoskids
```

Should show routing configuration.

#### Test DNS

```bash
nslookup cosmoskids.smartcamp.ai
```

Should resolve to VPS IP.

#### Test HTTPS

Open browser to: https://cosmoskids.smartcamp.ai

Should see:
- ✅ Valid SSL certificate
- ✅ Homepage loads correctly
- ✅ SmartCamp.AI branding visible
- ✅ Login/signup links work

#### Test Authentication

1. Click "Get Started Free"
2. Create test account
3. Verify redirect to parent dashboard
4. Try creating a child profile
5. Verify child interface loads

#### Test Database Connection

Check Supabase logs or query:

```sql
SELECT * FROM cosmoskids_users ORDER BY created_at DESC LIMIT 5;
SELECT * FROM cosmoskids_children ORDER BY created_at DESC LIMIT 5;
```

Should see your test data.

### 6. Configure n8n Workflows (Optional)

#### Welcome Email Workflow

1. Log in to https://n8n.smartcamp.ai
2. Create new workflow: "CosmosKids - Welcome Email"
3. Add nodes:
   - Webhook trigger: `/webhook/cosmoskids-welcome`
   - Email node (SendGrid or SMTP)
4. Activate workflow
5. Test:
   ```bash
   curl -X POST https://n8n.smartcamp.ai/webhook/cosmoskids-welcome \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "name": "Test User"}'
   ```

#### Weekly Digest Workflow

1. Create workflow: "CosmosKids - Weekly Digest"
2. Add nodes:
   - Cron trigger: Every Monday 9 AM
   - Supabase query (fetch active users)
   - Supabase query (fetch children + progress)
   - Email node (send digest)
3. Activate workflow

#### Achievement Notification Workflow

1. Create workflow: "CosmosKids - Achievement Notification"
2. Add nodes:
   - Webhook trigger: `/webhook/cosmoskids-achievement`
   - Supabase query (fetch badge details)
   - Email node (send congratulations)
3. Activate workflow

### 7. Configure Flowise AI Chatbot (Optional)

#### Create Space Tutor Chatflow

1. Log in to https://flowise.smartcamp.ai
2. Create new chatflow: "CosmosKids Space Tutor"
3. Add nodes:
   - ChatOpenAI or ChatAnthropic (LLM)
   - ConversationBufferMemory (memory)
   - ConversationChain
4. System prompt:
   ```
   You are Stella, a friendly and enthusiastic space tutor for children ages 6-12.
   Your job is to answer questions about space, astronomy, planets, astronauts, and
   science in an age-appropriate, engaging way. Use simple language, be encouraging,
   and celebrate curiosity. If a question is too advanced, gently guide them to
   simpler concepts. Always be positive and supportive.
   ```
5. Save and deploy
6. Copy Chatflow ID
7. Add to `.env.production` as `FLOWISE_SPACE_TUTOR_CHATFLOW_ID`

### 8. Verify All Integrations

#### Test n8n Welcome Email

Create new account on site, verify email received.

#### Test Flowise Chat (when implemented)

Go to child dashboard, open chat, send message.

#### Test Gotenberg PDF (when implemented)

Generate a progress report, verify PDF created.

## Maintenance

### Update Application

```bash
cd /opt/apps/cosmoskids
git pull origin claude/build-full-project-018hmv9yJUmzGbPcMESqQ8wh
docker-compose up -d --build
docker-compose logs -f
```

### View Logs

```bash
docker-compose logs -f cosmoskids
```

### Restart Application

```bash
docker-compose restart
```

### Stop Application

```bash
docker-compose down
```

### Database Backup

```bash
# Backup cosmoskids tables
pg_dump postgresql://postgres:password@api.supabase.smartcamp.ai:5432/postgres \
  --table='cosmoskids_*' \
  > backup-cosmoskids-$(date +%Y%m%d).sql

# Compress
gzip backup-cosmoskids-$(date +%Y%m%d).sql
```

### Database Restore

```bash
# Decompress
gunzip backup-cosmoskids-20251118.sql.gz

# Restore
psql postgresql://postgres:password@api.supabase.smartcamp.ai:5432/postgres \
  -f backup-cosmoskids-20251118.sql
```

## Troubleshooting

### Application Not Accessible

**Check container:**
```bash
docker ps | grep cosmoskids
docker logs cosmoskids-app
```

**Check Traefik:**
```bash
docker logs traefik | grep cosmoskids
```

**Check DNS:**
```bash
nslookup cosmoskids.smartcamp.ai
```

### Database Connection Error

**Verify Supabase credentials in .env.production**

**Test connection:**
```bash
docker exec cosmoskids-app env | grep SUPABASE
```

**Check RLS policies** - ensure they allow the operations you're attempting.

### SSL Certificate Not Issued

**Check Traefik logs:**
```bash
docker logs traefik | grep -i acme
docker logs traefik | grep cosmoskids
```

**Verify DNS points to VPS**

**Wait a few minutes** - Let's Encrypt can take time

**Restart Traefik** (if needed):
```bash
cd /opt/traefik
docker-compose restart
```

### Build Fails

**Check Dockerfile syntax**

**Check dependencies:**
```bash
# Locally test build
docker build -t cosmoskids-test .
```

**Check disk space:**
```bash
df -h
```

**Clean up Docker:**
```bash
docker system prune -a
```

## Security Checklist

- [x] `.env.production` contains no secrets in git
- [x] Service role key is server-only (not exposed to client)
- [x] RLS policies enabled on all tables
- [x] Storage bucket policies configured
- [x] HTTPS enforced (Traefik handles this)
- [x] Firewall rules in place (UFW on VPS)
- [x] Regular backups scheduled

## Performance Optimization

### Enable Next.js Output Standalone

Already configured in `next.config.js`:

```javascript
output: 'standalone'
```

This reduces Docker image size.

### Enable Caching

Configure Traefik caching middleware (optional).

### Database Indexes

Already created in schema:
- Indexes on foreign keys
- Indexes on frequently queried columns

### CDN (Future)

Consider CloudFlare or similar for static assets.

## Monitoring

### Application Logs

```bash
docker-compose logs -f
```

### Database Monitoring

Via Supabase Studio Dashboard.

### Uptime Monitoring (Optional)

Set up external uptime monitor (UptimeRobot, Pingdom, etc.):
- Monitor: https://cosmoskids.smartcamp.ai
- Alert if down for >5 minutes

## Rollback

If deployment fails, rollback to previous version:

```bash
cd /opt/apps/cosmoskids
git log --oneline  # Find previous commit
git checkout <previous-commit-hash>
docker-compose up -d --build
```

## Future Enhancements

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing in deployment
- [ ] Blue-green deployment
- [ ] Load balancing (if scaling)
- [ ] Redis caching layer
- [ ] Database read replicas

---

**Document Version**: 1.0
**Last Updated**: 2025-11-18

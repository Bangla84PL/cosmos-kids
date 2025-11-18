# SmartCamp.AI VPS Configuration Guide

## Overview

This guide describes the SmartCamp.AI VPS infrastructure and how to deploy applications to it. The VPS hosts multiple services using Docker containers orchestrated behind a Traefik reverse proxy.

## Infrastructure Architecture

### Core Services

**Traefik** - Reverse Proxy & Load Balancer
- Handles all incoming HTTPS traffic
- Automatic SSL certificate management (Let's Encrypt)
- Routes requests to appropriate containers
- WebSocket support
- Dashboard at `traefik.smartcamp.ai`

**Supabase** - Backend-as-a-Service
- PostgreSQL database (shared across projects)
- Authentication service
- Storage service
- Realtime subscriptions
- Edge functions
- URLs:
  - API: `api.supabase.smartcamp.ai`
  - Studio: `studio.supabase.smartcamp.ai`

**n8n** - Workflow Automation
- Visual workflow builder
- Webhook endpoints
- Scheduled tasks
- Email automation
- Data processing
- URL: `n8n.smartcamp.ai`

**Flowise** - AI Agent Builder
- Visual AI workflow builder
- Chatbot creation
- LLM integration (OpenAI, Anthropic, etc.)
- Vector database support
- URL: `flowise.smartcamp.ai`

**Gotenberg** - PDF Generation
- Microservice for PDF conversion
- HTML to PDF
- URL to PDF
- Office document conversion
- URL: `gotenberg.smartcamp.ai` (internal)

### Network Architecture

```
Internet
    ↓
Traefik (Port 443/80)
    ↓
┌─────────┬──────────┬──────────┬──────────┬──────────┐
│ App 1   │ Supabase │ n8n      │ Flowise  │ Gotenberg│
└─────────┴──────────┴──────────┴──────────┴──────────┘
         Docker Network: smartcamp-network
```

All services communicate through a shared Docker network: `smartcamp-network`

## Domain Structure

Base domain: `smartcamp.ai`

### Service Subdomains
- `traefik.smartcamp.ai` - Traefik dashboard
- `api.supabase.smartcamp.ai` - Supabase API
- `studio.supabase.smartcamp.ai` - Supabase Studio
- `n8n.smartcamp.ai` - n8n automation
- `flowise.smartcamp.ai` - Flowise AI builder
- `gotenberg.smartcamp.ai` - PDF service (internal)

### Application Subdomains
- `*.smartcamp.ai` - Application-specific subdomains
- Example: `cosmoskids.smartcamp.ai`, `app.smartcamp.ai`

## Docker Configuration

### Required Docker Compose Labels

For Traefik to route traffic to your application, add these labels:

```yaml
services:
  your-app:
    image: your-image
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.your-app.rule=Host(`your-app.smartcamp.ai`)"
      - "traefik.http.routers.your-app.entrypoints=websecure"
      - "traefik.http.routers.your-app.tls=true"
      - "traefik.http.routers.your-app.tls.certresolver=letsencrypt"
      - "traefik.http.services.your-app.loadbalancer.server.port=3000"
    networks:
      - smartcamp-network

networks:
  smartcamp-network:
    external: true
```

### Environment Variables

Applications must use environment variables for all configuration:

**Never hardcode**:
- API URLs
- Database credentials
- API keys
- Service endpoints

**Use .env files**:
```env
# Supabase
SUPABASE_URL=https://api.supabase.smartcamp.ai
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# n8n
N8N_WEBHOOK_URL=https://n8n.smartcamp.ai/webhook

# Flowise
FLOWISE_URL=https://flowise.smartcamp.ai

# Gotenberg
GOTENBERG_URL=http://gotenberg:3000

# App-specific
NODE_ENV=production
PORT=3000
```

## Supabase Multi-Project Strategy

### Important: Shared Database

The Supabase instance is **shared across all SmartCamp.AI projects**.

### Namespacing Requirements

**All database objects MUST use project-specific prefixes**:

```sql
-- Tables
CREATE TABLE projectname_users (...);
CREATE TABLE projectname_data (...);

-- Views
CREATE VIEW projectname_analytics AS ...;

-- Functions
CREATE FUNCTION projectname_calculate(...) ...;

-- Triggers
CREATE TRIGGER projectname_on_update ...;
```

### Storage Buckets

Bucket names must be prefixed:

```javascript
// Good
const { data } = await supabase.storage.from('cosmoskids-avatars').upload(...)

// Bad
const { data } = await supabase.storage.from('avatars').upload(...)
```

### Row Level Security (RLS)

Enable RLS on all tables:

```sql
ALTER TABLE projectname_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
ON projectname_users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON projectname_users
FOR UPDATE
USING (auth.uid() = id);
```

### Connection Details

From VPS applications:
```env
SUPABASE_URL=https://api.supabase.smartcamp.ai
```

From external services (if needed):
```env
SUPABASE_URL=https://api.supabase.smartcamp.ai
```

## n8n Integration

### Webhook URLs

n8n webhooks follow this pattern:
```
https://n8n.smartcamp.ai/webhook/{webhook-path}
```

Example workflow endpoints:
- `https://n8n.smartcamp.ai/webhook/cosmoskids-welcome`
- `https://n8n.smartcamp.ai/webhook/cosmoskids-weekly-report`

### Common n8n Workflows

**Welcome Email**
- Trigger: HTTP webhook
- Payload: `{ email, name, childName }`
- Actions: Send email via SMTP/SendGrid

**Weekly Report**
- Trigger: Schedule (cron)
- Actions: Query Supabase, generate data, send email

**Achievement Notification**
- Trigger: HTTP webhook
- Payload: `{ childId, achievementId, parentEmail }`
- Actions: Fetch data, send email

### Calling n8n from Application

```typescript
const response = await fetch('https://n8n.smartcamp.ai/webhook/cosmoskids-welcome', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: user.email,
    name: user.name,
    childName: child.name
  })
});
```

## Flowise Integration

### Chatflow URLs

Each Flowise chatflow has a unique ID:
```
https://flowise.smartcamp.ai/api/v1/prediction/{chatflow-id}
```

### API Authentication

```typescript
const response = await fetch(`${FLOWISE_URL}/api/v1/prediction/${chatflowId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${FLOWISE_API_KEY}`
  },
  body: JSON.stringify({
    question: "What is the largest planet?",
    overrideConfig: {
      sessionId: `child-${childId}`
    }
  })
});

const data = await response.json();
console.log(data.text); // AI response
```

### Session Management

Use child ID as session ID to maintain conversation context:
```javascript
sessionId: `cosmoskids-${childId}`
```

## Gotenberg Integration

### PDF Generation Endpoints

**HTML to PDF**:
```
POST http://gotenberg:3000/forms/chromium/convert/html
```

**URL to PDF**:
```
POST http://gotenberg:3000/forms/chromium/convert/url
```

### Example: Generate Progress Report

```typescript
const formData = new FormData();
formData.append('index.html', htmlContent);

const response = await fetch('http://gotenberg:3000/forms/chromium/convert/html', {
  method: 'POST',
  body: formData
});

const pdfBuffer = await response.arrayBuffer();

// Upload to Supabase Storage
const { data } = await supabase.storage
  .from('cosmoskids-reports')
  .upload(`reports/${reportId}.pdf`, pdfBuffer, {
    contentType: 'application/pdf'
  });
```

## Deployment Process

### 1. Prepare Application

**Dockerfile**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  cosmoskids:
    build: .
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

### 2. Database Setup

**Run migrations on Supabase**:
```bash
# Connect to Supabase
psql postgresql://postgres:password@api.supabase.smartcamp.ai:5432/postgres

# Or use Supabase Studio SQL editor
# Navigate to: https://studio.supabase.smartcamp.ai
```

**Execute schema**:
```sql
-- Create tables with namespace prefix
CREATE TABLE cosmoskids_users (...);
CREATE TABLE cosmoskids_children (...);

-- Enable RLS
ALTER TABLE cosmoskids_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY ...;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('cosmoskids-avatars', 'cosmoskids-avatars', true);

-- Set bucket policies
CREATE POLICY ...;
```

### 3. Environment Configuration

Create `.env.production` on VPS:
```env
NODE_ENV=production
PORT=3000

NEXT_PUBLIC_APP_URL=https://cosmoskids.smartcamp.ai
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

SUPABASE_SERVICE_ROLE_KEY=eyJ...

N8N_WEBHOOK_URL=https://n8n.smartcamp.ai/webhook
FLOWISE_URL=https://flowise.smartcamp.ai
FLOWISE_API_KEY=...

GOTENBERG_URL=http://gotenberg:3000
```

### 4. Deploy to VPS

```bash
# SSH to VPS
ssh user@smartcamp.ai

# Navigate to app directory
cd /opt/apps/cosmoskids

# Pull latest code
git pull

# Build and start
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Verify Traefik picked up service
docker-compose logs traefik | grep cosmoskids
```

### 5. Verify Deployment

- Check DNS: `cosmoskids.smartcamp.ai` resolves
- Check SSL: `https://cosmoskids.smartcamp.ai` has valid certificate
- Check application: Test critical flows
- Check Supabase: Verify database connection
- Check n8n: Trigger test webhook
- Check logs: No errors in `docker-compose logs`

## SSL Certificates

Traefik automatically handles SSL certificates via Let's Encrypt.

**Configuration** (already set up in Traefik):
```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@smartcamp.ai
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
```

**Renewal**: Automatic (Traefik handles this)

**Troubleshooting**:
```bash
# Check Traefik logs for certificate issues
docker logs traefik | grep -i acme

# Check certificate status
docker exec traefik cat /letsencrypt/acme.json
```

## Monitoring & Logs

### Application Logs

```bash
# View real-time logs
docker-compose logs -f your-app

# View last 100 lines
docker-compose logs --tail=100 your-app

# Search logs
docker-compose logs your-app | grep ERROR
```

### Traefik Logs

```bash
docker logs traefik -f
```

### Database Logs

Access via Supabase Studio:
- Navigate to `https://studio.supabase.smartcamp.ai`
- Go to Database → Logs

### n8n Execution Logs

- Navigate to `https://n8n.smartcamp.ai`
- Click on workflow
- View execution history

## Backup Strategy

### Database Backups

Supabase automatic backups are enabled:
- Daily backups retained for 7 days
- Manual backup before major changes

Manual backup:
```bash
pg_dump postgresql://postgres:password@api.supabase.smartcamp.ai:5432/postgres \
  --table=cosmoskids_* > backup-$(date +%Y%m%d).sql
```

### Storage Backups

Supabase Storage is backed up with database.

Additional backup:
```bash
# Use Supabase CLI or API to download buckets
supabase storage download cosmoskids-avatars/* ./backup/avatars/
```

### Application Backups

- Code: Git repository
- Environment: Encrypted `.env` backups
- Docker volumes: Regular snapshots

## Security Best Practices

### Environment Variables
- Never commit `.env` files
- Use different keys for dev/staging/production
- Rotate keys regularly
- Use service role key only in backend

### Network Security
- All services on private `smartcamp-network`
- Only Traefik exposed to internet
- Firewall rules on VPS (UFW)

### Database Security
- Row Level Security (RLS) enabled
- Principle of least privilege
- Regular security audits
- Prepared statements (prevent SQL injection)

### Application Security
- HTTPS everywhere
- Content Security Policy headers
- Rate limiting
- Input validation
- XSS prevention
- CSRF protection

## Troubleshooting

### Application Not Accessible

1. Check container is running:
   ```bash
   docker ps | grep your-app
   ```

2. Check Traefik routing:
   ```bash
   docker logs traefik | grep your-app
   ```

3. Check labels in docker-compose.yml

4. Check DNS resolution:
   ```bash
   nslookup your-app.smartcamp.ai
   ```

### Database Connection Issues

1. Verify Supabase URL and keys in `.env`
2. Check RLS policies aren't blocking queries
3. Test connection:
   ```javascript
   const { data, error } = await supabase.from('cosmoskids_users').select('count');
   console.log(data, error);
   ```

### n8n Webhook Not Triggering

1. Check webhook URL is correct
2. Verify n8n workflow is active
3. Check n8n logs for errors
4. Test with curl:
   ```bash
   curl -X POST https://n8n.smartcamp.ai/webhook/test \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

### SSL Certificate Issues

1. Check Traefik logs:
   ```bash
   docker logs traefik | grep -i acme
   ```

2. Verify DNS is pointing to VPS

3. Check rate limits (Let's Encrypt has limits)

4. Manual certificate request:
   ```bash
   # Stop Traefik, run certbot manually if needed
   ```

## VPS Resource Limits

Current VPS specifications:
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 160 GB SSD
- **Bandwidth**: Unmetered

### Resource Allocation Guidelines

- Keep applications lightweight
- Use efficient queries
- Implement caching where possible
- Monitor resource usage:
  ```bash
  docker stats
  ```

## Support & Contacts

- **VPS Admin**: admin@smartcamp.ai
- **Documentation**: https://docs.smartcamp.ai
- **GitHub**: https://github.com/smartcampai

## Additional Resources

- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Supabase Documentation](https://supabase.com/docs)
- [n8n Documentation](https://docs.n8n.io/)
- [Flowise Documentation](https://docs.flowiseai.com/)
- [Gotenberg Documentation](https://gotenberg.dev/)

# VPS Technical Documentation - SmartCamp.AI

## Server Information

**Provider**: [Cloud Provider Name]
**OS**: Ubuntu 22.04 LTS
**IP Address**: [VPS IP]
**Domain**: smartcamp.ai
**Location**: [Data Center Location]

## System Architecture

### Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Internet (Port 443/80)                │
└───────────────────────┬─────────────────────────────────┘
                        │
                ┌───────▼────────┐
                │  Traefik v2.10 │ (Reverse Proxy)
                │  Let's Encrypt │ (SSL/TLS)
                └───────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        │    Docker Network              │
        │    smartcamp-network           │
        │                                │
  ┌─────▼─────┐  ┌──────▼──────┐  ┌────▼────┐
  │ Supabase  │  │    n8n      │  │ Flowise │
  │  Stack    │  │  Automation │  │ AI Flow │
  └───────────┘  └─────────────┘  └─────────┘
       │
  ┌────▼─────┐  ┌──────────┐
  │PostgreSQL│  │Gotenberg │
  │   DB     │  │   PDF    │
  └──────────┘  └──────────┘
```

## Installed Software

### Core System
- Ubuntu 22.04 LTS
- Docker 24.0.x
- Docker Compose 2.20.x
- Git 2.34.x
- Nginx (not used, Traefik handles proxy)
- UFW (Firewall)
- Fail2ban
- Certbot (not needed, Traefik handles SSL)

### Container Services

**Traefik**
- Version: 2.10
- Image: `traefik:v2.10`
- Config: `/opt/traefik/traefik.yml`
- Certificates: `/opt/traefik/letsencrypt/`

**Supabase Stack**
- Kong Gateway
- GoTrue (Auth)
- PostgREST (API)
- Realtime Server
- Storage API
- PostgreSQL 15
- pgBouncer
- Config: `/opt/supabase/docker/`

**n8n**
- Version: Latest
- Image: `n8nio/n8n:latest`
- Data: `/opt/n8n/data`

**Flowise**
- Version: Latest
- Image: `flowiseai/flowise:latest`
- Data: `/opt/flowise/data`

**Gotenberg**
- Version: 7.x
- Image: `gotenberg/gotenberg:7`

## Directory Structure

```
/opt/
├── traefik/
│   ├── traefik.yml
│   ├── docker-compose.yml
│   └── letsencrypt/
│       └── acme.json
├── supabase/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   └── .env
│   └── volumes/
│       ├── db/
│       └── storage/
├── n8n/
│   ├── docker-compose.yml
│   ├── .env
│   └── data/
├── flowise/
│   ├── docker-compose.yml
│   ├── .env
│   └── data/
├── gotenberg/
│   └── docker-compose.yml
└── apps/
    ├── cosmoskids/
    │   ├── docker-compose.yml
    │   ├── .env.production
    │   └── [app files]
    └── [other apps]/
```

## Traefik Configuration

### /opt/traefik/traefik.yml

```yaml
api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"
    http:
      tls:
        certResolver: letsencrypt

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@smartcamp.ai
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: smartcamp-network

log:
  level: INFO

accessLog: {}
```

### /opt/traefik/docker-compose.yml

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./letsencrypt:/letsencrypt
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.smartcamp.ai`)"
      - "traefik.http.routers.traefik.entrypoints=websecure"
      - "traefik.http.routers.traefik.tls=true"
      - "traefik.http.routers.traefik.tls.certresolver=letsencrypt"
      - "traefik.http.routers.traefik.service=api@internal"
      - "traefik.http.routers.traefik.middlewares=traefik-auth"
      - "traefik.http.middlewares.traefik-auth.basicauth.users=admin:$$apr1$$..."
    networks:
      - smartcamp-network

networks:
  smartcamp-network:
    name: smartcamp-network
    driver: bridge
```

## Supabase Configuration

### Connection Details

**API URL** (External): `https://api.supabase.smartcamp.ai`
**Studio URL**: `https://studio.supabase.smartcamp.ai`

**Database**:
- Host: `db` (internal to Docker network) or `api.supabase.smartcamp.ai` (external)
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: [See `/opt/supabase/.env`]

**Service Keys**:
- Anon Key: [Public key, safe for client-side]
- Service Role Key: [Private key, server-only]

### Key Environment Variables

```env
# /opt/supabase/.env (example - actual values are different)

# PostgreSQL
POSTGRES_PASSWORD=super_secret_password

# JWT
JWT_SECRET=your-jwt-secret-here
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API
API_EXTERNAL_URL=https://api.supabase.smartcamp.ai
STUDIO_URL=https://studio.supabase.smartcamp.ai

# Dashboard
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=dashboard_password

# SMTP (for auth emails)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxx
SMTP_ADMIN_EMAIL=noreply@smartcamp.ai
```

## n8n Configuration

### Access
- URL: `https://n8n.smartcamp.ai`
- Auth: Username/password (set in .env)

### Key Settings

```env
# /opt/n8n/.env

N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password

N8N_HOST=n8n.smartcamp.ai
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.smartcamp.ai/

N8N_ENCRYPTION_KEY=your-encryption-key

GENERIC_TIMEZONE=America/New_York

# Database (optional, uses SQLite by default)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=db
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=n8n_password
```

### Common Workflows

Create these in n8n UI:

1. **Welcome Email**
   - Webhook trigger: `/webhook/welcome`
   - Send email node

2. **Weekly Report**
   - Cron trigger: Every Monday 9am
   - Supabase query
   - Email sending

3. **Achievement Notification**
   - Webhook trigger: `/webhook/achievement`
   - Fetch user data
   - Send congratulations email

## Flowise Configuration

### Access
- URL: `https://flowise.smartcamp.ai`
- API Key: Set in Flowise UI

### Settings

```env
# /opt/flowise/.env

FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=secure_password

PORT=3000

# Database (optional)
DATABASE_TYPE=postgres
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=flowise
DATABASE_PASSWORD=flowise_password
DATABASE_NAME=flowise

# API Keys (for LLM providers)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Chatflows

Create AI chatflows in Flowise UI:

1. **Space Tutor Chatbot**
   - LLM: GPT-4 or Claude
   - Memory: Conversation buffer
   - Context: Space education knowledge base
   - System prompt: "You are Stella, a friendly space tutor..."

2. **Progress Analyzer**
   - Input: Child progress data
   - Output: Insights and recommendations

## Gotenberg Configuration

Minimal configuration, runs as internal service.

```yaml
# /opt/gotenberg/docker-compose.yml

version: '3.8'

services:
  gotenberg:
    image: gotenberg/gotenberg:7
    container_name: gotenberg
    restart: unless-stopped
    command:
      - "gotenberg"
      - "--api-timeout=30s"
    networks:
      - smartcamp-network

networks:
  smartcamp-network:
    external: true
```

## Firewall Configuration (UFW)

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS (for Traefik)
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Status
ufw status
```

Output:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

## Docker Network

All services communicate via `smartcamp-network`:

```bash
# Create network (already created)
docker network create smartcamp-network

# List containers on network
docker network inspect smartcamp-network
```

## Database Management

### PostgreSQL Access

**Via psql**:
```bash
docker exec -it supabase-db psql -U postgres
```

**From external tool** (if enabled):
- Host: `api.supabase.smartcamp.ai`
- Port: `5432`
- User: `postgres`
- Password: [from .env]
- Database: `postgres`

### Common SQL Commands

```sql
-- List all tables
\dt

-- List project-specific tables
\dt cosmoskids_*

-- Show table schema
\d cosmoskids_users

-- Grant permissions
GRANT ALL ON cosmoskids_users TO authenticated;

-- Enable RLS
ALTER TABLE cosmoskids_users ENABLE ROW LEVEL SECURITY;
```

### Backup Script

```bash
#!/bin/bash
# /opt/scripts/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"

# Backup all tables for a project
docker exec supabase-db pg_dump -U postgres \
  --table='cosmoskids_*' \
  > "$BACKUP_DIR/cosmoskids_$DATE.sql"

# Compress
gzip "$BACKUP_DIR/cosmoskids_$DATE.sql"

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

Set up cron:
```bash
crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup-db.sh
```

## SSL Certificate Management

Traefik handles this automatically via Let's Encrypt.

**Certificate storage**: `/opt/traefik/letsencrypt/acme.json`

**Renewal**: Automatic (Traefik renews ~30 days before expiry)

**Check certificate**:
```bash
echo | openssl s_client -servername cosmoskids.smartcamp.ai \
  -connect cosmoskids.smartcamp.ai:443 2>/dev/null | \
  openssl x509 -noout -dates
```

## Monitoring

### Container Health

```bash
# Check all containers
docker ps -a

# Check specific container
docker inspect cosmoskids-app

# Container stats (CPU, RAM)
docker stats

# Container logs
docker logs -f container_name
```

### System Resources

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top

# Docker disk usage
docker system df
```

### Cleanup

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Full cleanup
docker system prune -a --volumes
```

## Deployment Checklist

When deploying a new application:

- [ ] Create app directory in `/opt/apps/`
- [ ] Write Dockerfile and docker-compose.yml
- [ ] Add Traefik labels to docker-compose.yml
- [ ] Create `.env.production` with all required variables
- [ ] Set up Supabase schema with namespaced tables
- [ ] Create storage buckets with namespace prefix
- [ ] Configure RLS policies
- [ ] Set up n8n workflows if needed
- [ ] Create Flowise chatflows if needed
- [ ] Add DNS A record pointing to VPS IP
- [ ] Run `docker-compose up -d`
- [ ] Verify SSL certificate issued
- [ ] Test application endpoints
- [ ] Monitor logs for errors
- [ ] Set up backups

## Common Maintenance Tasks

### Update Traefik

```bash
cd /opt/traefik
docker-compose pull
docker-compose up -d
```

### Update Supabase

```bash
cd /opt/supabase/docker
docker-compose pull
docker-compose up -d
```

### Update Application

```bash
cd /opt/apps/cosmoskids
git pull
docker-compose up -d --build
```

### View All Logs

```bash
# System logs
journalctl -xe

# Docker daemon logs
journalctl -u docker

# Specific container logs
docker logs -f --tail=100 container_name
```

## Security Hardening

- [x] UFW firewall enabled (only 22, 80, 443)
- [x] Fail2ban configured for SSH
- [x] All passwords are strong and unique
- [x] SSH key-based authentication
- [x] Password auth disabled in SSH
- [x] Root login disabled in SSH
- [x] Regular system updates (`apt update && apt upgrade`)
- [x] Docker containers run as non-root (where possible)
- [x] Environment variables stored securely
- [x] HTTPS enforced (HTTP redirects to HTTPS)
- [x] Let's Encrypt SSL certificates
- [x] Traefik dashboard protected with basic auth
- [x] Database not exposed to internet
- [x] Regular backups automated

## Troubleshooting Guide

### Container Won't Start

```bash
# Check logs
docker logs container_name

# Check docker-compose.yml syntax
docker-compose config

# Check if port is already in use
netstat -tulpn | grep :3000
```

### Website Not Accessible

```bash
# Check Traefik routing
docker logs traefik | grep cosmoskids

# Check DNS
nslookup cosmoskids.smartcamp.ai

# Check container is healthy
docker inspect cosmoskids-app | grep -i health

# Test internal connectivity
docker exec traefik ping cosmoskids-app
```

### Database Connection Failed

```bash
# Check database is running
docker ps | grep postgres

# Test connection from app container
docker exec cosmoskids-app psql \
  postgresql://postgres:password@db:5432/postgres \
  -c "SELECT 1"

# Check RLS policies
# (might be blocking queries)
```

### SSL Certificate Issues

```bash
# Check Traefik logs
docker logs traefik | grep -i acme

# Verify DNS is correct
dig cosmoskids.smartcamp.ai

# Check certificate file
docker exec traefik cat /letsencrypt/acme.json | jq

# Force certificate renewal (if needed)
# Stop Traefik, delete acme.json, restart Traefik
```

## Emergency Contacts

- **Primary Admin**: admin@smartcamp.ai
- **VPS Provider Support**: [Provider contact]
- **Escalation**: [Escalation contact]

## Change Log

- **2025-11-18**: Initial VPS setup
  - Traefik installed
  - Supabase stack deployed
  - n8n, Flowise, Gotenberg installed
  - smartcamp-network created
  - CosmosKids project initialized

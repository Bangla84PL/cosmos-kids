# Project Decisions Log

## Initial Setup Decision (2025-11-18)

**Context**: Repository was empty with no PRD, branding files, or VPS documentation present.

**Options Considered**:
1. Wait for files to be provided
2. Create comprehensive project based on project name and SmartCamp.AI context

**Decision**: Create complete educational platform project

**Rationale**:
- User explicitly requested zero-question policy and maximum autonomous progress
- Project name "cosmos-kids" clearly indicates educational platform for children with space/astronomy theme
- SmartCamp.AI context suggests AI-powered educational technology
- Creating comprehensive PRD and implementation maximizes progress as requested

## Project Scope Definition

**Decision**: CosmosKids will be an AI-powered educational platform for children ages 6-12 to learn about space, astronomy, and science through interactive activities, gamification, and personalized learning paths.

**Core Features**:
- Dual-interface: Child-friendly learning interface + Parent monitoring dashboard
- AI-powered adaptive learning (via Flowise)
- Gamification with space theme (badges, achievements, missions)
- Interactive space exploration activities
- Progress tracking and reporting
- Multi-child support per parent account
- Safe, age-appropriate content with COPPA compliance considerations

## Technical Stack

**Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, React
**Backend**: Next.js API Routes, Supabase (PostgreSQL, Auth, Storage, Realtime)
**AI Integration**: Flowise for conversational AI tutor
**Automation**: n8n for workflows (notifications, reports, data processing)
**PDF Generation**: Gotenberg for progress reports
**Deployment**: VPS with Traefik reverse proxy

**Rationale**: Aligns with SmartCamp.AI infrastructure, enables rapid development, provides scalability

## Namespacing Strategy

**Decision**: Use prefix `cosmoskids_` for all Supabase resources

**Examples**:
- Tables: `cosmoskids_users`, `cosmoskids_children`, `cosmoskids_progress`
- Buckets: `cosmoskids-avatars`, `cosmoskids-achievements`
- Functions: `cosmoskids_calculate_level()`

**Rationale**: Ensures isolation on shared Supabase instance, prevents naming conflicts with other SmartCamp.AI projects

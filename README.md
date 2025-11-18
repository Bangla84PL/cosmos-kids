# CosmosKids 🚀

An AI-powered educational platform that makes learning about space, astronomy, and science fun and engaging for children ages 6-12.

## Features

### For Children
- 🌟 Interactive learning modules about space and astronomy
- 🤖 AI space tutor companion (Stella)
- 🏆 Gamification with XP, levels, and achievements
- 🎯 Age-appropriate content (6-12 years)
- 🎨 Beautiful, playful space-themed interface

### For Parents
- 📊 Track child progress and achievements
- 📧 Weekly progress reports
- 👥 Manage multiple children from one account
- 📈 Insights into learning patterns
- 🔒 Safe, ad-free environment

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, React
- **Backend**: Next.js API Routes, Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI Integration**: Flowise for conversational AI tutor
- **Automation**: n8n for workflows (notifications, reports, data processing)
- **PDF Generation**: Gotenberg for progress reports
- **Deployment**: VPS with Traefik reverse proxy

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account (or access to SmartCamp.AI VPS Supabase)
- Access to n8n, Flowise, and Gotenberg instances (if using these features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/cosmos-kids.git
   cd cosmos-kids
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your configuration:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   # ... other variables
   ```

4. Set up the database:

   Run the schema SQL on your Supabase instance:
   ```bash
   # Connect to Supabase and execute database/schema.sql
   # Via Supabase Studio SQL editor or psql
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cosmos-kids/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (parent)/          # Parent dashboard
│   │   ├── (child)/           # Child learning interface
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   └── layouts/          # Layout components
│   ├── lib/                   # Utilities and integrations
│   │   ├── supabase/         # Supabase clients
│   │   ├── integrations/     # n8n, Flowise, Gotenberg
│   │   └── types/            # TypeScript types
│   ├── hooks/                 # Custom React hooks
│   └── styles/                # Global styles
├── public/                    # Static assets
├── database/                  # Database schema
├── docs/                      # Documentation
├── CLAUDE_MANIFEST.md         # Guide for future Claude sessions
├── PROGRESS.md                # Implementation progress
├── DECISIONS.md               # Architecture decisions
├── PRD.md                     # Product requirements
└── README.md                  # This file
```

## Key Documentation

- **[PRD.md](./PRD.md)** - Full product requirements document
- **[CLAUDE_MANIFEST.md](./CLAUDE_MANIFEST.md)** - Quick orientation for developers
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture and design
- **[docs/API.md](./docs/API.md)** - API documentation (to be created)
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment guide (to be created)
- **[PROGRESS.md](./PROGRESS.md)** - Implementation progress log
- **[DECISIONS.md](./DECISIONS.md)** - Architectural decisions and rationale

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm run format       # Format code with Prettier
npm test             # Run tests (when configured)
```

### Environment Variables

See [.env.example](./.env.example) for all required environment variables.

## Database

### Namespacing

**CRITICAL**: This project uses the shared SmartCamp.AI Supabase instance. All database resources use the `cosmoskids_` namespace prefix:

- Tables: `cosmoskids_users`, `cosmoskids_children`, etc.
- Buckets: `cosmoskids-avatars`, `cosmoskids-reports`, etc.
- Functions: `cosmoskids_calculate_level()`, etc.

### Schema

The database schema is defined in `database/schema.sql`. Key tables:

- `cosmoskids_users` - Parent accounts
- `cosmoskids_children` - Child profiles
- `cosmoskids_modules` - Learning modules
- `cosmoskids_activities` - Individual activities
- `cosmoskids_progress` - Activity completion tracking
- `cosmoskids_badges` - Achievement definitions
- `cosmoskids_achievements` - Earned achievements

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full schema documentation.

## Integrations

### n8n (Automation)

Workflows for:
- Welcome emails
- Weekly progress digests
- Achievement notifications
- Report generation triggers

Configure webhook URLs in `.env.local`.

### Flowise (AI Chat)

AI-powered space tutor "Stella" for:
- Answering children's questions
- Providing learning hints
- Personalized recommendations

Configure API endpoint and key in `.env.local`.

### Gotenberg (PDF)

PDF generation for:
- Monthly progress reports
- Achievement certificates

Configure service URL in `.env.local`.

## Branding

CosmosKids follows SmartCamp.AI branding guidelines with space-themed adaptations:

- **Colors**: Jungle greens, space blues, cosmic purples, star yellows
- **Typography**: Jost font family
- **Patterns**: Glassmorphism UI with jungle/space backgrounds
- **Footer**: Required SmartCamp.AI attribution on all pages

See [branding/SmartCampAI_branding.md](./branding/SmartCampAI_branding.md) for full guidelines.

## Testing

(Testing framework to be set up)

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Deployment

### VPS Deployment (Production)

1. Build the application:
   ```bash
   npm run build
   ```

2. Create Docker image (see `Dockerfile` - to be created)

3. Deploy to SmartCamp.AI VPS

4. Configure Traefik routing for `cosmoskids.smartcamp.ai`

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

### Environment Setup

Production environment variables must be set on the VPS in `.env.production`.

## Contributing

(To be defined)

## License

(To be defined)

## Support

For issues, questions, or contributions:
- GitHub Issues: (to be set up)
- Email: support@smartcamp.ai

## Acknowledgments

Created with ❤️ by [SmartCamp.AI](https://smartcamp.ai/)

---

**Current Status**: MVP in development
**Version**: 0.1.0
**Last Updated**: 2025-11-18

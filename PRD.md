# CosmosKids - Product Requirements Document

## Executive Summary

CosmosKids is an AI-powered educational platform that makes learning about space, astronomy, and science fun and engaging for children ages 6-12. Through gamification, interactive activities, and personalized AI tutoring, children embark on cosmic adventures while parents track progress and engagement.

## Vision & Goals

### Vision
Inspire the next generation of scientists, astronauts, and space enthusiasts through joyful, interactive learning experiences powered by AI.

### Primary Goals
1. Make space science accessible and engaging for children ages 6-12
2. Provide parents with insights into their children's learning progress
3. Use AI to personalize learning paths and provide adaptive support
4. Create safe, age-appropriate educational environment
5. Build long-term engagement through gamification and achievement systems

## Target Audience

### Primary Users: Children (Ages 6-12)
- **Early Learners (6-8)**: Simple vocabulary, heavy visual content, basic concepts
- **Mid-Level (9-10)**: More complex topics, reading comprehension, problem-solving
- **Advanced (11-12)**: Scientific concepts, critical thinking, research skills

### Secondary Users: Parents/Guardians
- Want educational screen time for children
- Desire progress visibility and reporting
- Need multi-child management
- Value safety and age-appropriate content

## Core Features

### 1. User Management & Authentication

#### Parent Account
- Email/password authentication via Supabase Auth
- Profile management
- Multi-child support (add up to 5 children per account)
- Subscription management (free tier + premium)

#### Child Profiles
- Name, age, avatar selection
- Learning level (auto-detected and adaptive)
- Privacy: no direct login, accessed through parent account
- Individual progress tracking
- Customizable learning preferences

### 2. Child Learning Interface

#### Space Explorer Dashboard
- **Mission Control**: Current active learning missions
- **Galaxy Map**: Visual progress through learning modules
- **Achievement Wall**: Earned badges and rewards
- **AI Companion**: Space-themed chatbot assistant (Flowise integration)
- **Daily Challenges**: Quick activities to maintain engagement

#### Learning Modules

**Solar System Explorer**
- Interactive 3D planet exploration
- Fun facts about each planet
- Quizzes and games
- AR viewing (progressive enhancement)

**Constellations & Stars**
- Stargazing guides
- Constellation mythology
- Star classification basics
- Night sky simulator

**Space Missions & History**
- Famous missions (Apollo, Mars rovers, ISS)
- Astronaut stories
- Timeline of space exploration
- Interactive mission simulations

**Rockets & Technology**
- How rockets work
- Spacecraft design
- Physics of space travel (age-appropriate)
- Build virtual rockets

**Life in Space**
- Astronaut daily life
- Space station tours
- Spacewalks and EVAs
- Future space habitats

**Astrobiology & Aliens**
- Search for life
- Extremophiles on Earth
- Habitable zones
- SETI and exoplanets

#### Interactive Activities
- **Quizzes**: Multiple choice, drag-and-drop, image matching
- **Mini Games**: Memory cards, puzzles, sorting games
- **Videos**: Curated educational content (embedded or linked)
- **Reading**: Age-appropriate articles and stories
- **Creative**: Drawing space scenes, design missions
- **AI Chat**: Ask the AI tutor questions about space

### 3. Gamification System

#### Experience Points (XP)
- Earned through completing activities
- Daily login bonuses
- Streak multipliers

#### Levels & Ranks
- **Cadet** (Level 1-5)
- **Space Explorer** (Level 6-10)
- **Astronaut** (Level 11-20)
- **Mission Specialist** (Level 21-30)
- **Commander** (Level 31-50)
- **Galactic Legend** (Level 51+)

#### Badges & Achievements
- Completion badges (finish all modules in a topic)
- Mastery badges (score 100% on quizzes)
- Streak badges (login 7, 30, 100 days)
- Special achievements (discover all planets, complete space mission)
- Seasonal/event badges

#### Rewards
- Unlock new avatars and customization items
- Access to bonus content
- Virtual telescope upgrades
- Spaceship customization parts

### 4. Parent Dashboard

#### Overview
- All children's profiles at a glance
- Recent activity summary
- Upcoming milestones
- Recommended actions

#### Progress Tracking
- Time spent learning (per child, per module)
- Completed modules and activities
- Current level and XP
- Quiz scores and trends
- Strength/weakness analysis (AI-generated insights)

#### Reports
- Weekly progress emails (via n8n automation)
- Monthly PDF reports (via Gotenberg)
- Export data (CSV)
- Printable certificates

#### Settings & Controls
- Manage child profiles
- Set daily time limits (optional)
- Content filters (if applicable)
- Notification preferences
- Account and billing

### 5. AI Features (Flowise Integration)

#### AI Space Tutor
- Conversational interface for children
- Answer questions about space topics
- Provide hints for quizzes
- Suggest next activities
- Adaptive difficulty based on performance

#### Personalization Engine
- Analyze learning patterns
- Recommend content based on interests
- Adjust difficulty dynamically
- Identify knowledge gaps

#### Parent Insights
- AI-generated progress summaries
- Learning style analysis
- Suggested interventions or encouragement

### 6. Automation (n8n Integration)

#### Automated Workflows
- **Welcome Email**: New parent signup
- **Weekly Digest**: Parent email with child progress
- **Achievement Notifications**: Email when child earns badge
- **Reminder Notifications**: Encourage daily logins
- **Report Generation**: Trigger monthly PDF report via Gotenberg
- **Data Processing**: Aggregate analytics, compute insights
- **Content Updates**: Sync new activities/modules

### 7. Content Management

#### Admin Interface (Future Phase)
- Create/edit learning modules
- Upload media (images, videos)
- Manage quiz questions
- Configure badges and achievements
- Content scheduling

#### Content Storage
- Supabase Storage for images, videos, PDFs
- Namespaced buckets: `cosmoskids-content`, `cosmoskids-avatars`, `cosmoskids-reports`

## User Journeys

### Parent Journey

1. **Discovery & Signup**
   - Land on homepage, see value proposition
   - Click "Get Started" → Sign up form
   - Verify email
   - Complete onboarding quiz (child's age, interests)

2. **Child Profile Setup**
   - Add first child (name, age, avatar)
   - Optional: add more children
   - Set preferences

3. **Child Starts Learning**
   - Parent hands device to child or child uses own
   - Child sees onboarding wizard: "Welcome, Astronaut!"
   - Completes first mission
   - Parent receives "First Mission Complete" email

4. **Ongoing Engagement**
   - Parent receives weekly digest
   - Logs in to check progress
   - Sees AI insights and recommendations
   - Downloads monthly PDF report

5. **Milestones & Sharing**
   - Child earns significant achievement
   - Parent receives notification
   - Option to share on social (with privacy controls)

### Child Journey

1. **First Launch**
   - Sees animated intro: rocket launch
   - Chooses avatar (astronaut, alien, robot)
   - Meets AI companion: "Hi! I'm Stella, your space guide!"
   - Completes tutorial mission

2. **Daily Learning Loop**
   - Logs in → sees "Mission Control" dashboard
   - Checks daily challenge
   - Completes 1-2 activities (10-20 mins)
   - Earns XP and checks progress to next level
   - Asks AI tutor a question
   - Logs out, sees encouraging message

3. **Achievement Moments**
   - Completes full module
   - Earns badge with celebration animation
   - Unlocks new avatar item
   - Shares with parent (in-app notification)

4. **Exploration & Discovery**
   - Uses Galaxy Map to browse topics
   - Picks interesting module
   - Watches video, takes quiz
   - Explores related content
   - Asks "why is Mars red?" to AI tutor

## Technical Requirements

### Performance
- Page load < 2s on 4G connection
- Interactive activities run smoothly on tablets
- Optimized images and lazy loading
- CDN for static assets

### Security
- HTTPS everywhere (Traefik SSL)
- Secure authentication (Supabase Auth)
- RLS policies for data isolation
- No PII exposure in client code
- Input validation and sanitization
- Rate limiting on API endpoints

### Privacy & Compliance
- COPPA considerations (children under 13)
- No direct marketing to children
- Parental consent for data collection
- Clear privacy policy
- Data export and deletion capabilities
- Minimal data collection

### Accessibility
- WCAG 2.1 AA compliance (target)
- Keyboard navigation
- Screen reader support
- High contrast mode
- Adjustable text sizes
- Alt text for all images

### Browser Support
- Chrome/Edge (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (1024px+)
- Touch-friendly interactions
- Adaptive layouts

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables for branding
- **UI Components**: Custom components + Headless UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Zustand (if needed)

### Backend
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime (for live updates)

### Integrations
- **AI**: Flowise (chatbot, recommendations)
- **Automation**: n8n (workflows, emails, reports)
- **PDF**: Gotenberg (progress reports, certificates)

### Development Tools
- **Version Control**: Git
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest + Testing Library
- **Type Checking**: TypeScript strict mode

### Deployment
- **Hosting**: VPS (SmartCamp.AI infrastructure)
- **Reverse Proxy**: Traefik
- **Domain**: `cosmoskids.smartcamp.ai` (or similar)
- **SSL**: Let's Encrypt via Traefik
- **CI/CD**: GitHub Actions (future)

## Data Model (High-Level)

### Core Entities

**cosmoskids_users** (parents)
- id, email, created_at, subscription_tier

**cosmoskids_children**
- id, user_id, name, age, avatar, level, xp, created_at

**cosmoskids_modules**
- id, title, description, category, difficulty, content_json

**cosmoskids_activities**
- id, module_id, title, type (quiz/game/video/reading), content_json

**cosmoskids_progress**
- id, child_id, activity_id, completed_at, score, time_spent

**cosmoskids_achievements**
- id, child_id, badge_id, earned_at

**cosmoskids_badges**
- id, name, description, image_url, criteria_json

**cosmoskids_chat_history**
- id, child_id, message, response, created_at

**cosmoskids_reports**
- id, child_id, period, report_url, generated_at

## Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average session duration: 15-20 minutes
- Return rate: 60%+ within 7 days
- Streak: 30%+ maintain 7-day streak

### Learning Outcomes
- Modules completed per child per month: 5+
- Average quiz score: 75%+
- Improvement over time (score trends)
- Content coverage: children explore 70%+ of modules

### Retention
- 30-day retention: 50%+
- 90-day retention: 30%+
- Parent satisfaction: 4.5+ / 5

### Business (Future)
- Free to paid conversion: 10%+
- Churn rate: < 5% monthly
- Net Promoter Score (NPS): 50+

## Roadmap

### MVP (Phase 1) - Current Focus
- User authentication (parent accounts)
- Child profile management
- 3 core learning modules (Solar System, Astronauts, Rockets)
- Basic quiz system
- XP and leveling system
- 10 initial badges
- Parent dashboard with basic progress tracking
- AI tutor chatbot (Flowise integration)
- Responsive design with SmartCamp.AI branding

### Phase 2
- 5 additional modules
- Mini-games and interactive activities
- Streak system and daily challenges
- Automated email notifications (n8n)
- PDF report generation (Gotenberg)
- Enhanced AI personalization
- Achievement sharing

### Phase 3
- Admin CMS for content management
- Advanced analytics and insights
- Social features (safe, moderated)
- Mobile app (React Native or PWA)
- Subscription/payment system
- Internationalization (i18n)
- Accessibility audit and improvements

### Future Considerations
- AR/VR experiences
- Live events and webinars
- Integration with school curricula
- Teacher/classroom accounts
- API for third-party integrations
- White-label licensing

## Design Principles

### For Children
- **Joyful**: Bright colors, playful animations, celebration moments
- **Clear**: Simple language, visual hierarchy, obvious CTAs
- **Empowering**: Positive reinforcement, no punishment for mistakes
- **Exploratory**: Freedom to navigate, discover, and learn at own pace
- **Safe**: No ads, no external links without parent gate

### For Parents
- **Informative**: Clear data visualization, actionable insights
- **Trustworthy**: Transparent about data usage, credible content
- **Efficient**: Quick access to key information, minimal clicks
- **Professional**: Clean design, reliable performance

## Brand Integration

All design elements must follow SmartCamp.AI branding:
- Color palette, typography (Jost font), spacing system
- Jungle background with glassmorphism overlays
- Logo usage and mascots
- Footer: "© Created with ❤️ by SmartCamp.AI" linking to https://smartcamp.ai/

Space theme adaptations:
- Cosmic color accents (deep blues, purples, star effects)
- Space-themed illustrations and icons
- Planet and constellation motifs
- Astronaut/rocket mascots

## Open Questions & Future Research
- Content partnerships (NASA, ESA, planetariums)
- Gamification balance (engagement vs. intrinsic motivation)
- Optimal AI tutor personality and boundaries
- Accessibility for neurodiverse children
- Offline mode capabilities
- Multilingual content strategy

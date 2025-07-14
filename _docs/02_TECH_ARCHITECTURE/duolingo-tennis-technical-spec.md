# Duolingo Tennis Technical Specification

> **Purpose**: Define the technical architecture for rapid SVP development
> **Timeline**: 8-week build
> **Stack Decision**: Next.js + Supabase + Vercel

## 🏗️ Architecture Overview

### Why This Stack

1. **Next.js 14**: 
   - Server components for performance
   - Built-in auth patterns
   - Progressive Web App support
   - Existing team knowledge

2. **Supabase**:
   - Real-time subscriptions for leagues
   - Built-in auth with magic links
   - PostgreSQL for complex queries
   - Storage for form videos

3. **Vercel**:
   - Seamless Next.js deployment
   - Edge functions for notifications
   - Analytics built-in

### System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  Next.js PWA    │────▶│  Supabase API    │────▶│  PostgreSQL     │
│  (Frontend)     │     │  (Backend)       │     │  (Database)     │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                         │
         ▼                       ▼                         ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Cloudflare R2   │     │ Stripe           │     │ WhatsApp API    │
│ (Video Storage) │     │ (Payments)       │     │ (Spanish)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## 📊 Database Schema

### Core Tables

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  premium_tier TEXT DEFAULT 'free',
  premium_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  user_id UUID REFERENCES profiles(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  tennis_iq_score INTEGER DEFAULT 0,
  last_activity TIMESTAMP,
  morning_ritual_streak INTEGER DEFAULT 0,
  PRIMARY KEY (user_id)
);

-- Lessons content
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL, -- {en: "Split Step", es: "Paso Dividido"}
  description JSONB NOT NULL,
  duration_minutes INTEGER NOT NULL,
  xp_value INTEGER DEFAULT 10,
  lesson_type TEXT, -- 'technique', 'fitness', 'mental'
  equipment JSONB, -- ["racquet", "cones"]
  video_url TEXT,
  skill_tree_position JSONB, -- {week: 1, day: 1, order: 1}
  is_premium BOOLEAN DEFAULT FALSE,
  spanish_exclusive BOOLEAN DEFAULT FALSE
);

-- User lesson completion
CREATE TABLE lesson_completions (
  user_id UUID REFERENCES profiles(id),
  lesson_id UUID REFERENCES lessons(id),
  completed_at TIMESTAMP DEFAULT NOW(),
  xp_earned INTEGER,
  performance_score INTEGER, -- 1-5 self assessment
  notes TEXT,
  PRIMARY KEY (user_id, lesson_id, completed_at)
);

-- Leagues and competitions
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'Bronze', 'Silver', etc
  week_start DATE NOT NULL,
  tier INTEGER NOT NULL -- 1=Bronze, 2=Silver, etc
);

CREATE TABLE league_members (
  league_id UUID REFERENCES leagues(id),
  user_id UUID REFERENCES profiles(id),
  weekly_xp INTEGER DEFAULT 0,
  rank INTEGER,
  PRIMARY KEY (league_id, user_id)
);

-- Achievements system
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB NOT NULL,
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 50
);

CREATE TABLE user_achievements (
  user_id UUID REFERENCES profiles(id),
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Form videos storage
CREATE TABLE form_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  lesson_id UUID REFERENCES lessons(id),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Tennis IQ cards
CREATE TABLE tennis_iq_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fact JSONB NOT NULL,
  source_citation TEXT,
  difficulty INTEGER DEFAULT 1, -- 1-3
  xp_value INTEGER DEFAULT 5
);

-- WhatsApp squads (Spanish feature)
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp_group_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE squad_members (
  squad_id UUID REFERENCES squads(id),
  user_id UUID REFERENCES profiles(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  role TEXT DEFAULT 'member', -- 'captain', 'member'
  PRIMARY KEY (squad_id, user_id)
);
```

## 🔧 API Structure

### Core Endpoints (Supabase Functions)

```typescript
// Authentication
POST /auth/magic-link
POST /auth/verify
POST /auth/logout

// User Progress
GET /api/progress
POST /api/progress/streak
POST /api/progress/xp

// Lessons
GET /api/lessons
GET /api/lessons/:slug
POST /api/lessons/:id/complete
POST /api/lessons/:id/video

// Leagues
GET /api/leagues/current
GET /api/leagues/:id/leaderboard
POST /api/leagues/join

// Achievements
GET /api/achievements
POST /api/achievements/check

// Premium
POST /api/premium/subscribe
POST /api/premium/cancel
GET /api/premium/features

// Spanish Features
POST /api/squads/create
POST /api/squads/:id/join
GET /api/squads/:id/challenges
```

## 🎮 Frontend Architecture

### Route Structure
```
app/
├── (auth)/
│   ├── login/
│   └── magic-link/
├── (app)/
│   ├── dashboard/
│   ├── lessons/
│   │   └── [slug]/
│   ├── progress/
│   ├── leagues/
│   ├── achievements/
│   └── settings/
├── (premium)/
│   ├── subscribe/
│   └── spanish-pro/
└── api/
    └── [...various endpoints]
```

### Key Components

```typescript
// Core game loop component
<DailySession>
  <StreakCounter />
  <LessonPlayer>
    <VideoDemo />
    <PracticeTimer />
    <SelfAssessment />
  </LessonPlayer>
  <XPCelebration />
  <NextLessonTeaser />
</DailySession>

// Gamification components
<SkillTree />
<LeagueLeaderboard />
<AchievementGallery />
<TennisIQQuiz />

// Spanish-specific
<WhatsAppSquadChat />
<SpanishProZone />
```

## 📱 Progressive Web App Setup

### Service Worker Strategy
```javascript
// Offline support for core features
- Cache lesson content
- Store progress locally
- Sync when online
- Push notifications
```

### Mobile Optimizations
- Touch gestures for navigation
- Video preloading
- Reduced motion options
- Battery-aware features

## 🚀 Deployment Pipeline

### Environments
1. **Development**: Vercel preview deployments
2. **Staging**: staging.tenis-manual.app
3. **Production**: app.tenis-manual.app

### CI/CD with GitHub Actions
```yaml
- Automated testing on PR
- Type checking
- Lighthouse performance tests
- Automatic deployment to Vercel
```

## 📊 Analytics & Monitoring

### Key Metrics Tracking
```typescript
// Custom events
track('lesson_completed', {
  lesson_id: string,
  duration: number,
  xp_earned: number,
  performance: number
})

track('streak_milestone', {
  days: number,
  type: 'daily' | 'morning_ritual'
})

track('premium_conversion', {
  trigger: string,
  price_point: number,
  language: string
})
```

### Monitoring Stack
- Vercel Analytics (Core Web Vitals)
- Supabase Dashboard (API performance)
- Sentry (Error tracking)
- Mixpanel (User behavior)

## 🔐 Security Considerations

1. **Authentication**: Magic links (no passwords)
2. **API Rate Limiting**: Via Supabase
3. **Video Access**: Signed URLs (expire in 1 hour)
4. **Payment Security**: Stripe handles all cards
5. **Data Privacy**: GDPR compliant

## 📱 Third-Party Integrations

### WhatsApp Business API (Spanish)
```typescript
// Squad notifications
sendSquadChallenge(squadId, challenge)
sendDailyReminder(userId, message)
```

### Stripe Subscription Management
```typescript
// Subscription tiers
const TIERS = {
  premium_monthly: 'price_xxx', // €19
  premium_annual: 'price_yyy',  // €190
  team_monthly: 'price_zzz'     // €15/user
}
```

### Cloudflare R2 (Video Storage)
- Automatic video optimization
- Global CDN distribution
- Bandwidth cost control

---

**Next Steps**: Create detailed wireframes and user flows
# Tenis Manual Architecture Overview

> **Status: ACTIVE** | Last updated: 2025-07-05  
> **Lifecycle: MAINTAINED** | Review quarterly

## Purpose

This document describes the technical architecture decisions specific to the Tenis Manual platform, focusing on why these choices were made for a tennis training content system.

## Why Docusaurus for Tennis Content

### Content-Specific Requirements

- **84 workout files** with complex cross-references between exercises
- **100+ exercise database** requiring structured categorization
- **Bilingual content** with 3x higher engagement in Spanish
- **Progressive disclosure** for workout unlocking system
- **MDX support** for embedding workout timers and interactive components

### Performance Optimizations for Training Content

- **Image optimization pipeline** for exercise demonstration photos
- **Lazy loading** for below-fold workout videos
- **Service worker caching** for offline workout access (planned)
- **95+ Lighthouse score** maintained despite heavy media content

## Spanish Localization Architecture

### i18n Implementation

```javascript
// Specific configuration for Spanish-first approach
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  localeConfigs: {
    es: {
      label: 'Español',
      // Spanish users show 3x engagement
      // Prioritize Spanish in URL structure
      path: 'es'
    }
  }
}
```

### Translation System Design

- **Source of truth**: English `/docs` folder
- **Spanish mirror**: `/i18n/es` with 100% coverage
- **Translation tracking**: `translation-status.json` for automated checking
- **Cultural adaptation**: Spanish workout terminology localized for Latin American and European markets

## Content Gating Architecture

### Progressive Disclosure System

```typescript
// Tennis-specific content tiers
type ContentTier =
  | "free" // Basic exercises
  | "email" // 7-day workout plan
  | "week1" // First week unlocked
  | "week2-12" // Progressive unlock
  | "premium"; // Future paid tier

// LocalStorage structure for workout progress
interface TennisUserData {
  email: string;
  unlockedTiers: ContentTier[];
  completedWorkouts: string[];
  lastWorkoutDate: string;
  preferredLanguage: "en" | "es";
}
```

### ConvertKit Integration Points

- **Form ID**: Specific to Tenis Manual subscriber form
- **Custom fields**: `source`, `language`, `workout_completion`
- **Tag automation**: Tracks engagement through workout journey
- **48% open rate**: Optimized email sequences for tennis enthusiasts

## Performance Architecture for Workout Content

### Bundle Optimization

- **Route-based splitting**: Each week's workouts load independently
- **Exercise database indexing**: Pre-built search indexes for 100+ exercises
- **Image formats**: WebP with JPEG fallbacks for exercise photos
- **Initial bundle**: <200KB despite extensive workout library

### Workout-Specific Components

```typescript
// Lazy-loaded workout components
const WorkoutTimer = lazy(() => import("./components/WorkoutTimer"));
const ExerciseDemo = lazy(() => import("./components/ExerciseDemo"));
const ProgressTracker = lazy(() => import("./components/ProgressTracker"));
```

## Deployment Architecture

### Static Hosting Optimization

- **GitHub Pages CDN**: Zero-cost hosting with global distribution
- **Custom domain**: tennis-training.dev with SSL
- **Build optimization**: Separate builds for each locale
- **Cache strategy**: 1-year cache for static assets, 5-minute for HTML

### Future Architecture Evolution

#### Phase 2: Spanish Premium (Month 3-4)

- **User accounts**: JWT authentication for progress tracking
- **WhatsApp integration**: Spanish-specific community features
- **SEPA payments**: Stripe configuration for European market
- **Workout API**: Dynamic daily workout generation

#### Phase 3: Full Platform (Month 7-12)

- **Video CDN**: Cloudflare for exercise demonstration videos
- **Mobile apps**: React Native for offline workout access
- **ML personalization**: Workout adaptation based on progress
- **Progress database**: PostgreSQL for tracking improvements

## Technical Decisions Log

### Why Not WordPress/Ghost?

- **MDX requirement**: Interactive workout components
- **i18n complexity**: Deep Spanish localization needs
- **Performance target**: 95+ Lighthouse non-negotiable
- **Developer velocity**: React expertise on team

### Why GitHub Pages over Vercel?

- **Cost**: $0 vs $20/month at current traffic
- **Simplicity**: No serverless functions needed yet
- **Performance**: Comparable CDN performance
- **Migration path**: Easy to move when needed

### Why ConvertKit over Mailchimp?

- **Creator focus**: Better for content creators
- **Automation**: Superior tag-based workflows
- **Deliverability**: Higher inbox rates
- **API**: Cleaner for our use case

## Monitoring & Maintenance

### Key Metrics

- **Build time**: <5 minutes for both locales
- **Deploy time**: <2 minutes to GitHub Pages
- **Core Web Vitals**: All green, monitored weekly
- **Bundle size**: Track per-component growth

### Architecture Review Triggers

- Traffic exceeds 100k monthly visits
- Premium features require backend
- Video content exceeds 50 demonstrations
- Mobile app development begins

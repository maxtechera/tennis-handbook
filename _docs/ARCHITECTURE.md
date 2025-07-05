# Tennis Handbook Technical Architecture

**Last Updated**: January 2025  
**Status**: Active Development Architecture  
**Quick Links**: [Strategy](./STRATEGY.md) | [Current Sprint](./ACTIVE_SPRINT.md) | [Project Status](../PROJECT_STATUS.md)

## 🏗️ System Overview

Tennis Handbook is a high-performance static site built with Docusaurus v3.8.1, optimized for content delivery, SEO excellence, and internationalization. The architecture prioritizes performance (95+ Lighthouse), scalability, and progressive enhancement as we evolve from content repository to daily training companion.

**Core Philosophy**: Maintain static site performance advantages while progressively adding dynamic features for monetization and engagement.

## 🔧 Current Tech Stack

### Core Framework
- **Docusaurus v3.8.1**: Static site generator with built-in i18n
- **React 18**: UI components and interactivity  
- **TypeScript**: Type safety across components
- **MDX**: Enhanced Markdown with React components
- **CSS Modules**: Scoped styling with theme integration

### Infrastructure
- **Hosting**: GitHub Pages (zero cost, global CDN)
- **Domain**: tennis-training.dev (custom SSL/TLS)
- **CI/CD**: GitHub Actions automated deployment
- **Email**: ConvertKit integration (500+ subscribers)
- **Analytics**: Google Analytics basic tracking

### Development Environment
- **Node.js v20**: Via nvm for consistency
- **pnpm**: Efficient package management
- **Git**: Version control with feature branches
- **VS Code**: Recommended IDE with extensions

## 📁 Project Structure

```
tennis-workout/
├── _docs/                    # Project documentation (this file)
├── website/                  # Main Docusaurus application
│   ├── docs/                # English content (source of truth)
│   │   ├── training-philosophy/  # Elite coaching methods
│   │   ├── exercises/           # Exercise database (100+)
│   │   ├── workouts/           # 12-week program (84 files)
│   │   │   ├── week-1/
│   │   │   │   ├── monday.mdx
│   │   │   │   └── ...
│   │   │   └── week-12/
│   │   └── specialized/        # Advanced methods
│   ├── i18n/                  # Internationalization
│   │   └── es/               # Spanish translations (100%)
│   ├── src/                  # React components & styles
│   │   ├── components/
│   │   │   ├── EmailCapture/
│   │   │   ├── WorkoutCarousel/
│   │   │   └── WorkoutNav/
│   │   └── css/
│   │       └── custom.css
│   ├── static/              # Static assets
│   ├── docusaurus.config.ts # Main configuration
│   └── sidebars.ts         # Navigation structure
└── source-archive/         # Original content backup
```

## 🚀 Performance Requirements

### Current Benchmarks ✅
- **Lighthouse Score**: 95+ (all metrics green)
- **First Contentful Paint**: <1.5 seconds
- **Time to Interactive**: <3 seconds
- **Core Web Vitals**: All passing
- **Bundle Size**: ~200KB initial JS

### Performance Constraints
- **Never drop below 95 Lighthouse** (hard requirement)
- **Mobile-first optimization** (60%+ traffic)
- **Global CDN delivery** via GitHub Pages
- **Progressive enhancement** for all features
- **Offline capability** for premium users (future)

## 🏗️ Architecture Evolution

### Phase 1: Progressive Disclosure (Current)
```
Static Site + Email Gating
├── Content tiers (Free → Email → Progressive)
├── ConvertKit integration for unlocking
├── LocalStorage for access state
├── API endpoints via Vercel Functions
└── Analytics for conversion tracking
```

### Phase 2: Spanish Premium MVP (Month 3-4)
```
Enhanced Static + User Accounts
├── Authentication layer (Auth0/custom JWT)
├── Progress tracking database (PostgreSQL)
├── Payment integration (Stripe + SEPA)
├── WhatsApp community automation
└── Daily workout generation engine
```

### Phase 3: Full Platform (Month 7-12)
```
Hybrid Architecture
├── Frontend: Enhanced React SPA
├── Backend: Node.js API
├── Database: PostgreSQL + Redis cache
├── Video CDN: Cloudflare/Bunny
├── Mobile: React Native apps
└── ML: Workout personalization
```

## 🔌 Integration Architecture

### Current Integrations
- **ConvertKit**: Email capture & automation
  - API key stored in environment variables
  - Webhook for progressive unlocking
  - Tag-based tier management
  - 500+ subscribers, 48% open rate

### Planned Integrations
- **Stripe**: Payment processing (Spanish SEPA support)
- **WhatsApp Business**: Spanish community features
- **Cloudflare**: Video CDN for demonstrations
- **PostgreSQL**: User progress and analytics
- **SendGrid**: Transactional emails

## 🌐 Internationalization Architecture

### i18n Configuration
```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  localeConfigs: {
    en: { label: 'English', direction: 'ltr' },
    es: { label: 'Español', direction: 'ltr' }
  }
}
```

### Translation System
- **Source**: English content in `/docs`
- **Target**: Spanish in `/i18n/es` (100% complete)
- **Scripts**: Automated translation checking
- **Quality**: Manual translation with cultural adaptation
- **Performance**: 3x higher Spanish engagement

## 🔒 Security Architecture

### Current Security
- **Static Site**: No server-side vulnerabilities
- **HTTPS Only**: Enforced via GitHub Pages
- **No PII Storage**: Email only in ConvertKit
- **CSP Headers**: Basic content security policy

### Future Security (Premium Phase)
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Data Encryption**: At rest and in transit
- **PCI Compliance**: For payment processing
- **GDPR/Privacy**: User data management

## 📊 Data Architecture

### Current (Static Phase)
```javascript
// Browser localStorage structure
{
  "tennis_user_email": "user@example.com",
  "tennis_unlocked_tiers": ["email", "week1"],
  "tennis_preferences": {
    "locale": "es",
    "theme": "light"
  }
}
```

### Future (Database Phase)
```sql
-- Core user progress tracking
users (id, email, locale, subscription_status)
workouts_completed (user_id, workout_id, date, duration)
exercise_progress (user_id, exercise_id, sets, reps, weight)
user_preferences (user_id, settings_json)
subscription_history (user_id, plan, start_date, status)
```

## 🧩 Component Architecture

### Design System Principles
- **Atomic Design**: Small, composable components
- **TypeScript First**: Full type safety
- **Accessibility**: WCAG 2.1 AA compliance
- **Progressive Enhancement**: Works without JS
- **Mobile First**: Responsive by default

### Key Components
```typescript
// Example: ContentGate component structure
interface ContentGateProps {
  tier: 'free' | 'email' | 'week1' | 'week2' | 'premium';
  children: React.ReactNode;
  gateMessage?: string;
}

// Example: WorkoutTracker component (future)
interface WorkoutTrackerProps {
  workoutId: string;
  userId: string;
  onComplete: (data: CompletionData) => void;
}
```

## 🚀 Deployment Architecture

### Current CI/CD Pipeline
```yaml
# GitHub Actions workflow
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    steps:
      - Build English version
      - Build Spanish version
      - Run tests
      - Deploy to GitHub Pages
      - Invalidate CDN cache
```

### Deployment Strategy
- **Zero-downtime deployments** via static generation
- **Rollback capability** through Git commits
- **A/B testing** via feature flags (future)
- **Canary releases** for premium features

## 📈 Scalability Architecture

### Content Scaling
- **Automated metadata** extraction from frontmatter
- **Tag-based relationships** for content discovery
- **Search optimization** with pre-built indexes
- **Image optimization** pipeline for performance

### Traffic Scaling
- **GitHub Pages CDN**: Handles millions of requests
- **Static generation**: No server bottlenecks
- **Edge caching**: Global performance
- **Service workers**: Offline capability (future)

### Feature Scaling
- **Feature flags**: Gradual rollout system
- **A/B testing**: Built into analytics
- **API versioning**: Backward compatibility
- **Microservices ready**: Service separation

## 🔄 Technical Decisions & Rationale

### Why Docusaurus?
- **SEO Excellence**: Built-in optimizations
- **i18n Support**: Native internationalization
- **Performance**: Static generation with React
- **Developer Experience**: Great documentation tools
- **Extensibility**: React components + plugins

### Why Progressive Enhancement?
- **Performance First**: Keep 95+ Lighthouse scores
- **SEO Preservation**: Maintain #1 rankings
- **User Experience**: Works for everyone
- **Risk Mitigation**: Gradual feature addition
- **Cost Efficiency**: Minimize infrastructure

### Why Spanish First?
- **3x Engagement**: Validated market advantage
- **Revenue Potential**: Higher pricing tolerance
- **Community Focus**: WhatsApp integration natural
- **Faster Iteration**: Smaller market for testing

## 🛠️ Development Standards

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Consistent formatting
- **Husky**: Pre-commit hooks for quality
- **Jest**: Unit testing for components

### Performance Standards
- **Bundle Size**: <250KB for initial load
- **Image Optimization**: WebP with fallbacks
- **Lazy Loading**: For below-fold content
- **Code Splitting**: Route-based chunks
- **Tree Shaking**: Remove unused code

### Accessibility Standards
- **WCAG 2.1 AA**: Minimum compliance
- **Keyboard Navigation**: Full support
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: 4.5:1 minimum
- **Focus Indicators**: Visible for all

## 📋 Technical Roadmap

### Immediate (Week 1-4)
- [ ] Implement content gating components
- [ ] Set up ConvertKit webhooks
- [ ] Create progressive unlock system
- [ ] Add conversion tracking

### Short-term (Month 2-3)
- [ ] User authentication system
- [ ] Payment integration (Stripe)
- [ ] Progress tracking database
- [ ] Spanish WhatsApp automation

### Medium-term (Month 4-6)
- [ ] Video CDN integration
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Performance monitoring

### Long-term (Month 7-12)
- [ ] Native mobile apps
- [ ] ML personalization
- [ ] Offline capability
- [ ] API marketplace

---

**Architecture Principles**: Performance first, progressive enhancement, Spanish market optimization, and maintainable scalability. Every technical decision supports the business goal of transforming content into a €100k+ MRR subscription platform.
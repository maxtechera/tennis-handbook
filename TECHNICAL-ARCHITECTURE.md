# Tennis Handbook - Technical Architecture

## 🏗️ System Overview

Tennis Handbook is a static site built with Docusaurus v3, optimized for content delivery, SEO, and internationalization. The architecture prioritizes simplicity, performance, and maintainability.

## 🔧 Tech Stack Details

### Core Framework
- **Docusaurus v3.8.1**
  - Static site generator optimized for documentation
  - Built-in i18n support
  - React-based with SSG capabilities
  - Excellent SEO out of the box

### Languages & Tools
- **TypeScript** - Type safety for React components
- **React 18** - UI components and interactivity
- **CSS Modules** - Scoped styling with theme integration
- **MDX** - Enhanced Markdown with React components
- **Node.js v20** - Build environment (via nvm)
- **pnpm** - Efficient package management

### Hosting & Deployment
- **GitHub Pages** - Static hosting at tennis-training.dev
- **GitHub Actions** - Automated deployment pipeline
- **Custom Domain** - DNS configured for tennis-training.dev
- **SSL/TLS** - Automatic HTTPS via GitHub

## 📁 Project Structure

```
tennis-workout/
├── docs/                    # English content (source of truth)
│   ├── training-philosophy/ # Elite coaching methods
│   ├── exercises/          # Exercise database
│   ├── programming/        # Training program design
│   ├── specialized/        # Advanced methods
│   ├── recovery/          # Recovery protocols
│   ├── nutrition/         # Performance nutrition
│   ├── assessment/        # Testing protocols
│   └── workouts/          # 12-week program (84 files)
│       ├── week-1/
│       │   ├── monday.mdx
│       │   ├── tuesday.mdx
│       │   └── ...
│       └── week-12/
├── i18n/                   # Internationalization
│   └── es/                # Spanish translations
│       └── docusaurus-plugin-content-docs/
│           └── current/   # Mirrored structure
├── src/                   # React components & styles
│   ├── components/
│   │   ├── HomepageFeatures/
│   │   ├── WorkoutCarousel/
│   │   └── WorkoutNav/
│   ├── css/
│   │   └── custom.css    # Global styles
│   └── pages/
│       └── index.tsx      # Homepage
├── static/               # Static assets
├── docusaurus.config.ts  # Main configuration
├── sidebars.ts          # Navigation structure
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## 🧩 Key Components

### WorkoutCarousel
**Purpose**: Display exercises in a carousel format for Week 1 Monday
```typescript
interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  intensity?: string;
  rest?: string;
  notes?: string;
}
```

### WorkoutNav
**Purpose**: Navigation between workout days with previous/next functionality
- Intelligent navigation across weeks
- Mobile-responsive design
- Accessible keyboard navigation

### Custom MDX Components
- Exercise tables with responsive design
- Video embedding (future implementation)
- Callout boxes for important information
- Progress indicators

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

### Translation Workflow
1. **Source Files**: English content in `/docs`
2. **Target Files**: Spanish in `/i18n/es`
3. **Automation**: Scripts for checking translation status
4. **Quality**: Manual translation for accuracy

### Translation Scripts
```
scripts/
├── check-translations.js      # Full status report
├── quick-translation-check.js # Quick check for Claude
└── translate-file.js         # Single file helper
```

## 🚀 Build & Deployment

### Build Process
```bash
# Development
pnpm start       # Local dev server on :3000

# Production Build
pnpm build       # Creates static files in /build
pnpm serve       # Test production build locally

# Deployment
pnpm deploy      # Deploys to GitHub Pages
```

### Build Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Lazy loading for images
- **CSS Optimization**: Minification and tree-shaking
- **Static Generation**: Pre-rendered HTML for all routes
- **Search Index**: Pre-built for client-side search

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
- Triggered on push to main
- Builds both English and Spanish versions
- Deploys to GitHub Pages
- Validates links and structure
```

## 📊 Performance Characteristics

### Page Load Performance
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Lighthouse Score**: 95+
- **Bundle Size**: ~200KB initial JS

### SEO Optimizations
- Server-side rendered meta tags
- Structured data for workouts
- XML sitemap generation
- Canonical URLs for translations
- Open Graph tags for social sharing

## 🔒 Security Considerations

### Current Implementation
- **Static Site**: No server-side vulnerabilities
- **No User Data**: No authentication or PII storage
- **HTTPS Only**: Enforced by GitHub Pages
- **CSP Headers**: Basic content security policy

### Future Considerations
- Implement stricter CSP for embedded content
- Add subresource integrity for external scripts
- Consider privacy-focused analytics
- Plan for secure user data handling (Phase 2)

## 🗄️ Data Storage Architecture

### Current (Phase 1)
- **Content**: Markdown files in Git
- **User Progress**: Browser localStorage
- **No Backend**: Fully static operation

### Future (Phase 2+)
```javascript
// Proposed localStorage structure
{
  "userProgress": {
    "learning": {
      "articlesRead": ["id1", "id2"],
      "currentPath": "biomechanics",
      "notes": {}
    },
    "training": {
      "currentWeek": 3,
      "currentDay": 2,
      "completedWorkouts": [],
      "personalRecords": {}
    }
  },
  "preferences": {
    "locale": "es",
    "theme": "light"
  }
}
```

## 🔌 Integration Points

### Current Integrations
- **GitHub**: Version control and hosting
- **Google Analytics**: Basic usage tracking
- **Browser APIs**: localStorage, Navigation

### Planned Integrations
- **Search Service**: Algolia or similar
- **Video CDN**: For exercise demonstrations
- **Email Service**: Newsletter and updates
- **Payment Processing**: Stripe for premium

## 🎨 Design System

### CSS Architecture
- **CSS Modules**: Component-scoped styles
- **CSS Variables**: Theme customization
- **Responsive Breakpoints**:
  - Mobile: <768px
  - Tablet: 768px-1024px
  - Desktop: >1024px

### Component Patterns
- **Atomic Design**: Small, reusable components
- **Composition**: Complex UIs from simple parts
- **Accessibility**: ARIA labels, keyboard nav
- **Progressive Enhancement**: Works without JS

## 🛠️ Development Workflow

### Local Development
```bash
# Setup
nvm use 20
pnpm install

# Development
pnpm start         # Start dev server
pnpm typecheck     # Run TypeScript checks
pnpm build         # Test production build

# Translation
pnpm check-translations    # Check status
pnpm translation-quick     # Quick report
```

### Code Organization
- **Feature Folders**: Components with their styles
- **Shared Utilities**: In src/utils
- **Type Definitions**: Centralized in src/types
- **Constants**: Configuration in src/config

## 📈 Scalability Considerations

### Content Scaling
- Automated metadata extraction
- Tag-based content relationships
- Efficient sidebar generation
- Search index optimization

### Performance Scaling
- CDN for static assets
- Image optimization pipeline
- Lazy loading for heavy content
- Service worker for offline

### Feature Scaling
- Modular component architecture
- Feature flags for gradual rollout
- A/B testing infrastructure ready
- API-first design for future backend

## 🔄 Migration Paths

### Future Considerations
1. **Next.js Migration**: If dynamic features needed
2. **Headless CMS**: For content management
3. **Mobile App**: React Native sharing components
4. **API Development**: Node.js/Express backend

## 📋 Technical Debt & Improvements

### Current Technical Debt
- [ ] Limited test coverage
- [ ] Manual translation process
- [ ] No automated visual regression tests
- [ ] Basic error boundary implementation

### Planned Improvements
- [ ] Implement comprehensive testing
- [ ] Add Storybook for components
- [ ] Automate translation workflow
- [ ] Enhanced error handling
- [ ] Performance monitoring

---

*This technical architecture document provides a comprehensive overview of the Tennis Handbook platform's technical implementation, design decisions, and future scalability considerations.*
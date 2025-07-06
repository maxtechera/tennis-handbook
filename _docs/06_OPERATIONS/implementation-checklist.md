# Tennis Handbook Implementation Checklist

**Document Status**: 🟡 Active Reference  
**Lifecycle**: Updated Per Sprint  
**Created**: January 2025  
**Purpose**: Current implementation tasks and technical checklist for Tennis Handbook  
**Project**: [Tennis Handbook](https://linear.app/max-techera/project/tennis-handbook)  

---

## Active Implementation Tasks

### 🔴 Current Sprint (July 1-14, 2025)

#### 🚨 IMMEDIATE ACTIONS (Next 48 Hours)
- [ ] **Deploy API to Vercel** (1 hour)
  - [ ] Create Vercel project
  - [ ] Add environment variables
  - [ ] Deploy api/subscribe.js
  - [ ] Update API_CONFIG in src/config/api.ts
  - [ ] Test production endpoint

- [ ] **ConvertKit Production Setup** (30 min)
  - [ ] Add API keys to Vercel env
  - [ ] Create custom fields (50+ fields)
  - [ ] Set up tag structure
  - [ ] Test subscription flow

- [ ] **Create Lead Magnet PDF** (2 hours)
  - [ ] Design 7-Day Workout PDF
  - [ ] Spanish version
  - [ ] Upload to ConvertKit
  - [ ] Configure auto-delivery

- [ ] **Monitor & Optimize** (Ongoing)
  - [ ] Track wizard completion rates
  - [ ] Monitor conversion metrics
  - [ ] A/B test messaging
  - [ ] Fix any production issues

#### ConvertKit Integration (MAX-79)
- [x] Create ConvertKit account
- [x] Configure initial form
- [ ] Complete domain authentication (SPF/DKIM)
- [ ] Create segmentation tags
- [ ] Test subscriber flow
- [ ] Document API credentials

#### Email Capture System (MAX-46) - ✅ ONBOARDING WIZARD COMPLETE
- [x] **Phase 1: Foundation** - DONE
  - [x] Create OnboardingWizard component structure
  - [x] Build step navigation system
  - [x] Implement progress indicator
  - [x] Set up state management hooks

- [x] **Phase 2: Data Collection Steps** - DONE
  - [x] WelcomeStep - email + introduction
  - [x] BackgroundStep - training experience/goals  
  - [x] ChallengesStep - current issues/constraints
  - [x] PersonalizationStep - preferences/interests
  - [x] CompletionStep - thank you + recommendations

- [x] **Phase 3: API Integration** - DONE
  - [x] Extend `/api/subscribe` for rich data
  - [x] Implement ConvertKit advanced tagging
  - [x] Map wizard data to custom fields
  - [x] Add wizard completion tracking

- [x] **Phase 4: UX Polish** - DONE
  - [x] Mobile-responsive design
  - [x] Tennis Handbook branding
  - [x] Accessibility compliance (WCAG 2.1 AA)
  - [x] Smooth step transitions

- [ ] **Phase 5: Production Setup (Remaining)**
  - [x] Homepage integration - DONE
  - [ ] Deploy API to Vercel
  - [ ] Configure ConvertKit API keys
  - [ ] Create lead magnet PDF
  - [ ] Set up welcome email sequence

#### Progressive Disclosure (MAX-80)
- [ ] Implement content gating logic
- [ ] Create unlock schedule automation
- [ ] Build progress indicator UI
- [ ] Set up email tag triggers
- [ ] Test full user journey

### 🟡 Next Sprint Planning

#### Spanish Premium Features
- [ ] Video content integration
- [ ] Premium exercise variations
- [ ] Personalized programming
- [ ] Coach Q&A system

#### Performance Optimization
- [ ] Lazy load components
- [ ] Image optimization
- [ ] Bundle size reduction
- [ ] Maintain 95+ Lighthouse scores

### 🟢 Backlog

#### Content Enhancement
- [ ] Weekly video analysis
- [ ] Exercise demo videos
- [ ] PDF workout downloads
- [ ] Mobile app considerations

## Technical Standards

### Performance Requirements
- **Lighthouse Score**: 95+ (all metrics)
- **Time to Interactive**: <3.8s
- **First Contentful Paint**: <1.8s
- **Cumulative Layout Shift**: <0.1

### Code Quality
- **TypeScript**: Strict mode enabled
- **React**: Functional components only
- **Testing**: Unit tests for critical paths
- **Documentation**: JSDoc for public APIs

### ConvertKit Integration
```typescript
// Standard implementation pattern
interface EmailCaptureConfig {
  formId: string;
  tags: string[];
  customFields?: Record<string, any>;
  successCallback?: () => void;
}
```

### Progressive Disclosure Rules
```
Day 0: Signup → 7-day PDF + Week 1
Day 2: Unlock exercise database
Day 4: Unlock weeks 2-4
Day 7: Complete access + survey
```

## Deployment Checklist

### Pre-Deployment
- [ ] Run TypeScript checks: `pnpm typecheck`
- [ ] Build production: `pnpm build`
- [ ] Test locally: `pnpm serve`
- [ ] Check Lighthouse scores
- [ ] Verify i18n content

### Deployment
- [ ] Push to main branch
- [ ] Verify GitHub Actions success
- [ ] Check production site
- [ ] Test email capture flow
- [ ] Monitor error tracking

### Post-Deployment
- [ ] Update Linear tickets
- [ ] Document any issues
- [ ] Check analytics
- [ ] Monitor conversion rates

## Success Metrics

### Email Capture
- **Target**: 3% overall, 5% Spanish
- **Current**: [Track in ConvertKit]
- **Goal**: 1,000 subscribers/month

### Content Engagement
- **Spanish**: 3x higher than English
- **Video**: 82% preference rate
- **PDF Downloads**: 45% of subscribers

### Technical Health
- **Uptime**: 99.9%
- **Error Rate**: <0.1%
- **Page Speed**: 95+ score
- **Mobile Usage**: 65%

## Key Decisions Log

### July 2025
- **Progressive Disclosure**: Gate content to increase conversions
- **Spanish First**: All features optimized for Spanish market
- **ConvertKit**: Chosen for automation capabilities

### June 2025
- **Docusaurus 3.8.1**: Upgraded for better performance
- **TypeScript**: Added for better development experience
- **Two-sidebar system**: Separate theory from workouts

## Notes

- Always test with Spanish content first
- Mobile experience is critical (65% of traffic)
- Keep email capture friction minimal
- Focus on value delivery, not aggressive selling

---

**Remember**: This is a living document. Update after each sprint completion.
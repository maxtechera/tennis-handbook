# Onboarding Wizard Implementation Guide

> **Status**: Ready for Development | **Priority**: High | **Estimated Time**: 6-8 hours

## Overview

This guide provides step-by-step instructions for implementing the custom onboarding wizard that replaces basic ConvertKit email capture forms with an intelligent data collection experience.

## Prerequisites

- [ ] ConvertKit account configured with custom fields (see [ConvertKit Integration Guide](../07_EXTERNAL/convertkit-integration.md))
- [ ] API endpoint functional at `/api/subscribe`
- [ ] Development environment set up
- [ ] Access to Tenis Manual codebase

## Implementation Phases

### Phase 1: Foundation Setup (2 hours)

#### 1.1 Create Component Structure

```bash
# Create onboarding wizard directory structure
mkdir -p src/components/OnboardingWizard/{steps,components,hooks}
touch src/components/OnboardingWizard/OnboardingWizard.tsx
touch src/components/OnboardingWizard/OnboardingWizard.module.css
touch src/components/OnboardingWizard/index.tsx
```

#### 1.2 Create Step Components

- [ ] `steps/WelcomeStep.tsx` - Email collection + introduction
- [ ] `steps/BackgroundStep.tsx` - Training experience and goals
- [ ] `steps/ChallengesStep.tsx` - Current challenges and constraints
- [ ] `steps/PersonalizationStep.tsx` - Preferences and interests
- [ ] `steps/CompletionStep.tsx` - Thank you + recommendations

#### 1.3 Create Shared Components

- [ ] `components/ProgressIndicator.tsx` - Step progress bar
- [ ] `components/QuestionCard.tsx` - Reusable question container
- [ ] `components/OptionSelector.tsx` - Multi-choice selection UI
- [ ] `components/WizardButton.tsx` - Consistent button styling

#### 1.4 Create Hooks

- [ ] `hooks/useWizardState.tsx` - Main state management
- [ ] `hooks/usePersonalization.tsx` - Data processing and recommendations
- [ ] `hooks/useWizardPersistence.tsx` - Local storage management

### Phase 2: Core Wizard Development (2 hours)

#### 2.1 Implement Main Container

**File**: `OnboardingWizard.tsx`

**Required Features**:

- [ ] Step navigation (next/previous)
- [ ] Progress tracking (1/4, 2/4, etc.)
- [ ] State management integration
- [ ] Mobile-responsive design
- [ ] Keyboard navigation support

**Key Implementation Points**:

```typescript
interface WizardData {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  userData: OnboardingData;
}
```

#### 2.2 Implement Welcome Step

**File**: `steps/WelcomeStep.tsx`

**Required Features**:

- [ ] Email input with validation
- [ ] Consent checkbox (GDPR compliance)
- [ ] Language detection and display
- [ ] Tenis Manual branding
- [ ] Clear value proposition

**Validation Rules**:

- Email format validation
- Required consent checkbox
- Real-time error feedback

#### 2.3 Implement Progress Indicator

**File**: `components/ProgressIndicator.tsx`

**Required Features**:

- [ ] Visual step progression
- [ ] Mobile-friendly design
- [ ] Accessibility labels
- [ ] Tennis theme colors

### Phase 3: Data Collection Steps (2 hours)

#### 3.1 Background Step Implementation

**File**: `steps/BackgroundStep.tsx`

**Data Collection**:

- [ ] Experience level (4 options: beginner, intermediate, advanced, competitive)
- [ ] Current training (4 options: none, gym-only, tennis-specific, professional)
- [ ] Training frequency (4 options: 1-2x, 3-4x, 5+x, daily)
- [ ] Primary goals (multi-select: fitness, recreation, competition, professional)

**UI Requirements**:

- Card-based selection interface
- Clear visual feedback for selections
- Multi-select support for goals
- Skip option available

#### 3.2 Challenges Step Implementation

**File**: `steps/ChallengesStep.tsx`

**Data Collection**:

- [ ] Injury history (multi-select: none, knee-ankle, shoulder-elbow, back, multiple)
- [ ] Biggest challenge (5 options: power, endurance, consistency, recovery, technique)
- [ ] Time available (4 options: 30min, 45min, 60min, 90min+)
- [ ] Equipment access (4 options: none, basic, full-gym, tennis-facility)

**UI Requirements**:

- Optional step with clear skip option
- Contextual help text for injury categories
- Visual equipment icons
- Progressive disclosure of sub-questions

#### 3.3 Personalization Step Implementation

**File**: `steps/PersonalizationStep.tsx`

**Data Collection**:

- [ ] Favorite players (multi-select: Djokovic, Alcaraz, Sinner, Medvedev, Other)
- [ ] Playing style (4 options: baseline, all-court, serve-volley, aggressive)
- [ ] Content preferences (multi-select: videos, articles, workouts, analysis)
- [ ] Coach interest (yes/no)

**UI Requirements**:

- Player photos/cards for selection
- Content type icons
- Fun, engaging interface design
- Optional with high completion incentive

### Phase 4: Integration & Testing (2 hours)

#### 4.1 API Integration Enhancement

**File**: `api/subscribe.js`

**Required Updates**:

- [ ] Extend endpoint to handle wizard data
- [ ] Map wizard data to ConvertKit fields
- [ ] Implement advanced tagging logic
- [ ] Add wizard completion tracking

**New API Contract**:

```typescript
interface OnboardingSubmission {
  // Basic data (required)
  email: string;
  language: string;
  source: string;
  consent: boolean;

  // Wizard data (optional)
  experience_level?: string;
  current_training?: string;
  training_frequency?: string;
  primary_goals?: string[];
  injury_history?: string[];
  biggest_challenge?: string;
  time_available?: string;
  equipment_access?: string;
  favorite_players?: string[];
  playing_style?: string;
  content_preferences?: string[];

  // Metadata
  wizard_completion: "partial" | "complete";
  wizard_completion_date?: string;
}
```

#### 4.2 ConvertKit Field Mapping

- [ ] Verify all custom fields exist in ConvertKit
- [ ] Implement tag generation logic
- [ ] Test API calls with sample data
- [ ] Verify data appears correctly in ConvertKit

#### 4.3 Homepage Integration

**File**: `src/pages/index.tsx`

**Integration Points**:

- [ ] Replace `EmailCaptureForm` with `OnboardingWizard`
- [ ] Maintain existing trigger points (hero, popup, footer)
- [ ] Implement progressive enhancement
- [ ] Add fallback for JavaScript-disabled users

### Phase 5: Styling & UX Polish (1 hour)

#### 5.1 CSS Module Implementation

**File**: `OnboardingWizard.module.css`

**Required Styles**:

- [ ] Responsive design (mobile-first)
- [ ] Tenis Manual brand colors
- [ ] Smooth step transitions
- [ ] Loading states and animations
- [ ] Accessibility focus indicators

#### 5.2 Mobile Optimization

- [ ] Touch-friendly button sizes (44px minimum)
- [ ] Optimized text sizes for mobile
- [ ] Gesture support for navigation
- [ ] Viewport meta tag compliance

#### 5.3 Accessibility Implementation

- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader compatibility
- [ ] Keyboard navigation support
- [ ] High contrast mode support
- [ ] Focus management between steps

### Phase 6: Testing & Deployment (1 hour)

#### 6.1 Unit Testing

- [ ] Test wizard state management
- [ ] Test form validation
- [ ] Test API integration
- [ ] Test error handling

#### 6.2 Integration Testing

- [ ] End-to-end wizard flow
- [ ] ConvertKit data verification
- [ ] Email sequence triggering
- [ ] Mobile device testing

#### 6.3 Performance Testing

- [ ] Lighthouse score impact (<100ms)
- [ ] Bundle size analysis
- [ ] Load time measurement
- [ ] Memory usage monitoring

## Technical Specifications

### State Management

```typescript
interface WizardState {
  currentStep: number;
  userData: Partial<OnboardingData>;
  isSubmitting: boolean;
  errors: Record<string, string>;
  hasStarted: boolean;
  completionTime?: Date;
}
```

### Component Props Interface

```typescript
interface StepProps {
  data: Partial<OnboardingData>;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
```

### Validation Schema

```typescript
const validationRules = {
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  consent: { required: true, value: true },
  experience_level: {
    required: false,
    options: ["beginner", "intermediate", "advanced", "competitive"],
  },
  // ... additional rules
};
```

## Quality Checklist

### Code Quality

- [ ] TypeScript strict mode compliance
- [ ] ESLint warnings resolved
- [ ] Component prop validation
- [ ] Error boundary implementation
- [ ] Loading state management

### User Experience

- [ ] Intuitive navigation flow
- [ ] Clear progress indication
- [ ] Helpful error messages
- [ ] Smooth animations
- [ ] Consistent interaction patterns

### Performance

- [ ] Bundle size impact <50KB
- [ ] Page load impact <100ms
- [ ] Smooth 60fps animations
- [ ] Efficient re-rendering
- [ ] Memory leak prevention

### Accessibility

- [ ] Screen reader testing
- [ ] Keyboard navigation testing
- [ ] High contrast mode testing
- [ ] Voice control compatibility
- [ ] Mobile accessibility testing

## Deployment Steps

### 1. Environment Preparation

- [ ] Update `.env` with required variables
- [ ] Set up Vercel environment variables
- [ ] Configure ConvertKit fields and tags
- [ ] Test API connectivity

### 2. Code Deployment

- [ ] Create feature branch
- [ ] Implement wizard components
- [ ] Run comprehensive testing
- [ ] Create pull request for review

### 3. Production Deployment

- [ ] Merge to main branch
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Test live wizard flow

### 4. Monitoring Setup

- [ ] Analytics tracking implementation
- [ ] Error monitoring setup
- [ ] Performance monitoring
- [ ] User feedback collection

## Success Metrics

### Immediate Metrics (Week 1)

- [ ] Wizard completion rate >60%
- [ ] Email capture rate improvement >15%
- [ ] No critical bugs or errors
- [ ] Page performance maintained

### Medium-term Metrics (Month 1)

- [ ] Email engagement improvement >40%
- [ ] User session duration increase >3x
- [ ] ConvertKit segmentation accuracy >95%
- [ ] User satisfaction scores >4.5/5

### Long-term Metrics (Quarter 1)

- [ ] Lead quality improvement (higher conversion)
- [ ] Reduced customer acquisition cost
- [ ] Increased customer lifetime value
- [ ] Enhanced personalization effectiveness

## Support & Maintenance

### Ongoing Tasks

- [ ] Monitor completion rates by step
- [ ] A/B test question phrasing
- [ ] Optimize based on user feedback
- [ ] Update ConvertKit sequences based on data

### Documentation Updates

- [ ] Update component documentation
- [ ] Create user journey maps
- [ ] Document personalization logic
- [ ] Maintain API documentation

This implementation guide ensures a systematic approach to building a world-class onboarding experience that maximizes user engagement and data collection quality.

# Onboarding Wizard Specification

> **Status**: In Development | **Priority**: High | **Sprint**: July 2025
> **Replaces**: Basic ConvertKit email capture forms

## Executive Summary

Transform the basic email capture experience into an intelligent onboarding wizard that collects valuable user data, provides immediate personalized value, and dramatically improves email engagement rates through advanced segmentation.

**Key Benefits:**
- 3x longer user engagement vs simple forms
- 40% higher email open rates through personalization
- Rich user data for content customization
- Progressive value delivery at each step

## User Journey Flow

### Current State (Basic Email Capture)
1. User sees simple email form
2. Enters email + consent checkbox
3. Receives generic welcome email
4. Gets 7-day workout plan PDF

**Issues:**
- No user context or personalization
- Generic email sequences
- Poor engagement metrics
- Limited segmentation data

### Proposed State (Onboarding Wizard)
1. **Welcome Step** - Email + basic introduction
2. **Background Step** - Training experience and goals
3. **Challenges Step** - Current issues and constraints  
4. **Personalization Step** - Preferences and interests
5. **Completion Step** - Personalized recommendations

**Progressive Value Delivery:**
- After Step 1: 7-day workout plan access
- After Step 2: Personalized training path
- After Step 3: Custom injury prevention guide
- After Step 4: Favorite player training insights

## Data Collection Strategy

### Required Data (Step 1)
```typescript
interface RequiredData {
  email: string;
  language: string; // Auto-detected from page
  source: string;   // Form location tracking
  consent: boolean;
}
```

### Training Background (Step 2 - Encouraged)
```typescript
interface TrainingBackground {
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'competitive';
  current_training: 'none' | 'gym-only' | 'tennis-specific' | 'professional';
  training_frequency: '1-2x' | '3-4x' | '5+x' | 'daily';
  primary_goals: Array<'fitness' | 'recreation' | 'competition' | 'professional'>;
}
```

### Current Challenges (Step 3 - Optional)
```typescript
interface CurrentChallenges {
  injury_history?: Array<'none' | 'knee-ankle' | 'shoulder-elbow' | 'back' | 'multiple'>;
  biggest_challenge?: 'power' | 'endurance' | 'consistency' | 'recovery' | 'technique';
  time_available?: '30min' | '45min' | '60min' | '90min+';
  equipment_access?: 'none' | 'basic' | 'full-gym' | 'tennis-facility';
}
```

### Personalization (Step 4 - Optional)
```typescript
interface PersonalizationData {
  favorite_players?: Array<'djokovic' | 'alcaraz' | 'sinner' | 'medvedev' | 'other'>;
  playing_style?: 'baseline' | 'all-court' | 'serve-volley' | 'aggressive';
  content_preferences?: Array<'videos' | 'articles' | 'workouts' | 'analysis'>;
  coach_interest?: boolean;
}
```

## User Experience Design

### Visual Design Principles
- **Progress Indication**: Clear step progression (1/4, 2/4, etc.)
- **Minimal Friction**: Single question per screen on mobile
- **Tennis Branding**: Consistent with Tennis Handbook theme
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: <100ms impact on page load

### Interaction Patterns
- **Optional Steps**: Clear skip options for non-required data
- **Visual Selection**: Card-based selection for options
- **Immediate Feedback**: Real-time validation and confirmation
- **Mobile-First**: Touch-friendly interface design
- **Keyboard Navigation**: Full keyboard accessibility

### Content Strategy
- **Question Phrasing**: Conversational, tennis-focused language
- **Option Labels**: Clear, mutually exclusive choices  
- **Help Text**: Contextual explanations where needed
- **Motivational Copy**: Benefits-focused messaging

## Personalization Engine

### Segmentation Logic
```typescript
// User Classification
function classifyUser(data: OnboardingData): UserSegment {
  const experience = data.experience_level;
  const goals = data.primary_goals;
  const challenges = data.biggest_challenge;
  
  if (experience === 'beginner' && goals.includes('fitness')) {
    return 'fitness-beginner';
  }
  
  if (experience === 'competitive' || goals.includes('professional')) {
    return 'competitive-player';
  }
  
  if (challenges === 'recovery' || data.injury_history?.length > 0) {
    return 'injury-focused';
  }
  
  return 'recreational-player';
}
```

### Content Recommendations
- **Fitness Beginners**: Foundation building, basic movements
- **Competitive Players**: Advanced techniques, performance optimization
- **Injury-Focused**: Recovery protocols, prevention strategies
- **Recreational Players**: Balanced fitness and fun

### Email Sequence Routing
- **Dynamic Sequences**: Different email flows per segment
- **Behavioral Triggers**: Additional sequences based on engagement
- **Progressive Unlocking**: Content access based on profile completion

## Technical Requirements

### Frontend Components
- React TypeScript components
- CSS Modules for styling
- Docusaurus i18n integration
- Mobile-responsive design
- Progressive enhancement

### State Management
- React hooks for wizard state
- Local storage for step persistence
- Form validation library
- Error handling and recovery

### API Integration
- Extended `/api/subscribe` endpoint
- ConvertKit advanced tagging
- Custom field population
- Error handling and retry logic

### Performance Targets
- **Load Time**: <2s on 3G connection
- **Interaction**: <100ms button response
- **Completion**: <5 minutes average
- **Accessibility**: WCAG 2.1 AA compliance

## Success Metrics

### Conversion Metrics
- **Email Capture Rate**: Target >15% (vs 8% current)
- **Full Completion**: Target >60% of email captures
- **Step Progression**: >80% Step 1→2, >70% Step 2→3

### Engagement Metrics  
- **Session Duration**: Target 3x increase vs simple form
- **Email Open Rate**: Target 40% improvement with personalization
- **Click-Through Rate**: Target 25% improvement
- **Content Engagement**: Higher time-on-page for recommended content

### Business Metrics
- **Lead Quality**: Higher conversion to paid products
- **Retention**: Improved email engagement over time
- **Revenue Attribution**: Direct impact on course sales

## Implementation Roadmap

### Phase 1: Core Wizard (Week 1)
- [ ] Build wizard container and navigation
- [ ] Create welcome and background steps
- [ ] Implement basic state management
- [ ] Add progress indicator

### Phase 2: Data Collection (Week 1)
- [ ] Add challenges and personalization steps
- [ ] Build reusable question components
- [ ] Implement skip/optional logic
- [ ] Add form validation

### Phase 3: Integration (Week 2)
- [ ] Extend API endpoint for new data
- [ ] Update ConvertKit field mapping
- [ ] Implement advanced tagging
- [ ] Test complete user flow

### Phase 4: Personalization (Week 2)
- [ ] Build recommendation engine
- [ ] Create dynamic content system
- [ ] Implement email sequence routing
- [ ] Add analytics tracking

## Risk Assessment

### Technical Risks
- **Complexity**: Multi-step form state management
- **Performance**: Impact on page load times
- **Mobile UX**: Responsive design challenges
- **Data Quality**: Incomplete submissions

### Mitigation Strategies
- Progressive enhancement with simple form fallback
- Lazy loading of wizard components
- Extensive mobile testing
- Clear value proposition at each step

### Success Dependencies
- ConvertKit API reliability
- User willingness to share data
- Quality of personalization algorithms
- Email deliverability rates

## Future Enhancements

### Phase 2 Features
- Video introduction from elite coaches
- Interactive training plan preview
- Social proof and testimonials
- Gamification elements

### Advanced Personalization
- AI-powered content recommendations
- Dynamic workout generation
- Progress tracking integration
- Community features based on profile

This specification serves as the comprehensive guide for implementing a world-class onboarding experience that transforms casual visitors into highly engaged Tennis Handbook community members.
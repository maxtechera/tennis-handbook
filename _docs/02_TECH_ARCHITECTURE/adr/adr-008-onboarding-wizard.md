# ADR-008: Custom Onboarding Wizard vs ConvertKit Embeds

**Status**: Accepted  
**Date**: 2025-07-05  
**Deciders**: Max, Claude

## Context

We need to implement email capture for the Tenis Manual platform. The current basic ConvertKit integration using simple forms is functional but provides limited user data for personalization and segmentation. We must decide between:

1. **ConvertKit Native Embeds**: Using ConvertKit's built-in form embeds
2. **Custom Onboarding Wizard**: Building a multi-step data collection experience

## Decision

We will implement a **Custom Onboarding Wizard** that replaces basic email capture with an intelligent multi-step experience.

## Rationale

### Why Not ConvertKit Embeds

**Limited Customization**

- ConvertKit forms have restricted styling options
- Cannot match Tenis Manual brand identity
- No control over user experience flow
- Fixed field layouts and validation

**Poor Mobile Experience**

- ConvertKit embeds not optimized for mobile-first design
- Cannot implement progressive disclosure patterns
- No control over responsive behavior

**Data Collection Limitations**

- Basic forms collect minimal user context
- No conditional logic for dynamic questioning
- Cannot implement progressive value delivery
- Limited to ConvertKit's field types

**Integration Constraints**

- Relies on external JavaScript loading
- Potential performance impact
- Cannot implement custom analytics
- Limited error handling control

### Why Custom Onboarding Wizard

**Enhanced User Experience**

- Progressive disclosure reduces cognitive load
- Mobile-first responsive design
- Immediate value delivery at each step
- Custom validation and error handling

**Rich Data Collection**

- Multi-step questioning allows deeper insights
- Conditional logic based on previous answers
- Optional steps reduce abandonment
- Tennis-specific context gathering

**Personalization Opportunities**

- Immediate content recommendations
- Dynamic email sequence routing
- Customized homepage experience
- Segmented user journeys

**Technical Control**

- Full control over styling and branding
- Custom analytics and tracking
- Progressive enhancement capabilities
- Integration with existing component system

## Architecture Decision

### Component Structure

```
src/components/OnboardingWizard/
├── OnboardingWizard.tsx           # Main container
├── steps/                         # Individual wizard steps
├── components/                    # Reusable UI components
├── hooks/                         # State management
└── OnboardingWizard.module.css    # Styling
```

### State Management Approach

- **React Hooks**: `useState` and `useReducer` for wizard state
- **Local Storage**: Persist progress across page reloads
- **Context API**: Share data between wizard components
- **Form Validation**: Real-time validation with error recovery

### API Integration Strategy

- **Extended Endpoint**: Enhance `/api/subscribe` for rich data
- **Backward Compatibility**: Maintain simple form fallback
- **ConvertKit Mapping**: Map collected data to custom fields and tags
- **Error Handling**: Graceful degradation and retry logic

### Progressive Enhancement

- **Base Experience**: Simple email form for JavaScript-disabled users
- **Enhanced Experience**: Full wizard for capable browsers
- **Performance**: Lazy load wizard components
- **Accessibility**: WCAG 2.1 AA compliance throughout

## Technical Implementation

### Data Model

```typescript
interface OnboardingData {
  // Required (Step 1)
  email: string;
  language: string;
  source: string;
  consent: boolean;

  // Training Background (Step 2)
  experience_level?: string;
  current_training?: string;
  training_frequency?: string;
  primary_goals?: string[];

  // Challenges (Step 3)
  injury_history?: string[];
  biggest_challenge?: string;
  time_available?: string;
  equipment_access?: string;

  // Personalization (Step 4)
  favorite_players?: string[];
  playing_style?: string;
  content_preferences?: string[];
}
```

### ConvertKit Integration

- **Custom Fields**: Map all collected data to ConvertKit
- **Advanced Tagging**: Segment users by multiple dimensions
- **Email Sequences**: Route to personalized automation flows
- **Behavioral Triggers**: Additional sequences based on completion

### Performance Considerations

- **Code Splitting**: Lazy load wizard components
- **Bundle Size**: Keep core wizard under 50KB
- **Load Time**: <100ms impact on initial page load
- **Interaction**: <100ms response time for step transitions

## Consequences

### Positive Consequences

**Enhanced User Engagement**

- Expected 3x increase in session duration
- Higher quality leads through rich data collection
- Improved email engagement rates (40% target increase)
- Better user experience with immediate value delivery

**Business Value**

- Detailed user segmentation for targeted marketing
- Personalized content recommendations
- Higher conversion rates to paid products
- Competitive advantage through superior onboarding

**Technical Benefits**

- Full control over user experience
- Custom analytics and tracking capabilities
- Integration with existing component architecture
- Flexibility for future enhancements

### Negative Consequences

**Development Complexity**

- More complex implementation than simple forms
- Additional state management requirements
- Need for comprehensive testing across devices
- Ongoing maintenance of custom components

**Performance Considerations**

- Larger JavaScript bundle size
- Potential impact on page load times
- Additional API calls for data submission
- Need for progressive enhancement strategy

**Risk Factors**

- User abandonment during multi-step process
- Potential bugs in complex state management
- Dependency on custom code vs proven ConvertKit forms
- Need for fallback mechanisms

## Implementation Plan

### Phase 1: Foundation (Week 1)

1. Build wizard container and navigation system
2. Implement basic state management
3. Create welcome and completion steps
4. Add progress indicator and styling

### Phase 2: Data Collection (Week 1)

1. Build all wizard steps with question components
2. Implement conditional logic and validation
3. Add skip/optional step functionality
4. Test user flow end-to-end

### Phase 3: Integration (Week 2)

1. Extend API endpoint for rich data handling
2. Update ConvertKit field and tag mapping
3. Implement email sequence routing
4. Add comprehensive error handling

### Phase 4: Optimization (Week 2)

1. Performance optimization and code splitting
2. Comprehensive testing across devices
3. Analytics implementation and tracking
4. Documentation and deployment

## Monitoring and Success Metrics

### Technical Metrics

- **Performance**: Page load impact <100ms
- **Completion Rate**: >60% full wizard completion
- **Error Rate**: <1% API submission failures
- **Accessibility**: WCAG 2.1 AA compliance

### Business Metrics

- **Conversion Rate**: >15% email capture (vs 8% baseline)
- **Email Engagement**: 40% improvement in open rates
- **Session Duration**: 3x increase vs simple forms
- **Lead Quality**: Higher conversion to paid products

## Related ADRs

- [ADR-006: ConvertKit Integration](adr-006-convertkit-integration.md)
- [ADR-002: Spanish-First Strategy](adr-002-spanish-first-strategy.md)
- [ADR-003: Progressive Disclosure](adr-003-progressive-disclosure.md)

## References

- [Onboarding Wizard Specification](../01_PRODUCT/features/onboarding-wizard-spec.md)
- [ConvertKit Integration Guide](../07_EXTERNAL/convertkit-integration.md)
- [Tenis Manual Component Architecture](../architecture-overview.md)

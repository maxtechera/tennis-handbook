# Onboarding Wizard Hooks

This directory contains React hooks for managing the Tennis Handbook onboarding wizard with state management, persistence, and personalization.

## Overview

The onboarding wizard system consists of three main hooks:

1. **`useWizardState`** - Core state management and navigation
2. **`useWizardPersistence`** - Local storage persistence with auto-save
3. **`usePersonalization`** - User segmentation and content recommendations

## Quick Start

```tsx
import { useOnboardingWizard } from '@/components/OnboardingWizard/hooks/useOnboardingWizard';

function MyWizard() {
  const wizard = useOnboardingWizard({
    onComplete: (data, segment, recommendations) => {
      console.log('Wizard completed!', { data, segment, recommendations });
      // Navigate to personalized starting path
      window.location.href = recommendations.startingPath;
    },
    persistKey: 'tennis-onboarding',
    autoSave: true
  });

  return (
    <div>
      <h2>Step {wizard.currentStep + 1} of 5</h2>
      <div>Progress: {wizard.getProgress()}%</div>
      
      {/* Render current step content */}
      <CurrentStepComponent {...wizard.getStepProps('current-step-id')} />
      
      <button onClick={wizard.previousStep} disabled={wizard.currentStep === 0}>
        Previous
      </button>
      
      <button onClick={() => wizard.nextStepWithValidation('current-step-id')}>
        Next
      </button>
    </div>
  );
}
```

## Hook APIs

### useWizardState

Manages the core wizard state and navigation.

```tsx
const {
  // State
  state,              // Complete wizard state
  currentStep,        // Current step index
  wizardData,         // All collected data
  isComplete,         // Completion status
  sessionId,          // Unique session ID

  // Actions
  updateStepData,     // Update data for a step
  validateCurrentStep,// Validate current step data
  goToStep,           // Navigate to specific step
  nextStep,           // Go to next step
  previousStep,       // Go to previous step
  completeWizard,     // Mark wizard as complete
  resetWizard,        // Reset all data

  // Utilities
  hasStepData,        // Check if step has data
  getProgress,        // Get completion percentage
  calculateSegment    // Calculate user segment
} = useWizardState(options);
```

### useWizardPersistence

Handles automatic saving and loading of wizard state.

```tsx
const {
  // Core functions
  saveState,          // Manually save state
  loadState,          // Load saved state
  clearState,         // Clear saved state
  hasSavedState,      // Check if saved state exists
  getSavedSessionId,  // Get saved session ID

  // Utilities
  exportData,         // Export data as JSON
  importData,         // Import JSON data
  isStorageAvailable  // Check localStorage availability
} = useWizardPersistence({
  state,              // Wizard state to persist
  persistKey,         // Storage key
  autoSave,           // Enable auto-save
  autoSaveDelay       // Debounce delay (ms)
});
```

### usePersonalization

Generates personalized recommendations based on user data.

```tsx
const {
  // Profile data
  userProfile,        // Complete user profile
  segment,            // User segment

  // Recommendation functions
  getPersonalization, // Get all recommendations
  getContentRecommendations, // Get content suggestions
  getEmailSequence,   // Get email sequence
  generateTags,       // Generate CRM tags
  getStartingPath     // Get recommended start path
} = usePersonalization({
  wizardData,         // Collected wizard data
  preferredLanguage   // Default language
});
```

## User Segments

The system categorizes users into four segments:

- **Beginner**: New to tennis or <1 year experience
- **Intermediate**: 1-5 years experience, regular play
- **Advanced**: 5+ years, excellent fitness, serious training
- **Competitive**: Tournament players with rankings

## Personalization Features

### Content Recommendations
- Prioritized by user segment and goals
- Spanish content boosted for Spanish speakers
- Injury prevention content for those with injury history

### Email Sequences
- Segment-specific onboarding sequences
- Spanish language sequences available
- Special sequences for injury recovery

### Auto-Detection
- Browser language detection for Spanish preference
- Timezone-based language detection
- Automatic segment calculation

## Validation

Built-in validation for all form fields:

```tsx
// Example validation result
const validation = wizard.validateCurrentStep('personal-info');
if (!validation.isValid) {
  console.log('Errors:', validation.errors);
  // { email: 'Please enter a valid email address' }
}
```

## Persistence

- Auto-saves on each step change (debounced)
- Saves on page unload
- 30-day expiration for saved data
- Clears on completion

## Integration with ConvertKit

The wizard automatically:
1. Segments users based on responses
2. Assigns appropriate email sequences
3. Adds relevant tags for targeting
4. Sends data to your email service on completion

## TypeScript Support

Full TypeScript support with strict typing:

```tsx
import { 
  WizardData, 
  UserSegment, 
  PersonalizationResult 
} from '@/components/OnboardingWizard/types';
```

## Testing

Example test setup:

```tsx
// Import test data
const mockWizardData: WizardData = {
  personalInfo: {
    email: 'test@example.com',
    language: 'es'
  },
  tennisExperience: {
    yearsPlaying: '3-5',
    currentLevel: 'intermediate',
    playsCompetitively: true
  }
  // ... other fields
};

// Test personalization
const { segment, getContentRecommendations } = usePersonalization({
  wizardData: mockWizardData
});

expect(segment).toBe('intermediate');
expect(getContentRecommendations()).toHaveLength(6);
```
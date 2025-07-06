/**
 * Analytics utilities for tracking wizard events and user behavior
 * Supports multiple analytics platforms (GA4, ConvertKit events, custom tracking)
 */

import type { WizardData, WizardState } from '../components/OnboardingWizard/types';

interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

/**
 * Track wizard start event
 */
export function trackWizardStart(language: string = 'en') {
  sendEvent({
    event: 'wizard_start',
    category: 'Onboarding',
    label: language,
    properties: {
      language,
      timestamp: new Date().toISOString(),
      source: getTrafficSource(),
    }
  });
}

/**
 * Track wizard step completion
 */
export function trackWizardStep(stepId: string, stepNumber: number, data: any) {
  sendEvent({
    event: 'wizard_step_complete',
    category: 'Onboarding',
    label: stepId,
    value: stepNumber,
    properties: {
      step_id: stepId,
      step_number: stepNumber,
      has_data: !!data,
      timestamp: new Date().toISOString(),
    }
  });
}

/**
 * Track wizard completion
 */
export function trackWizardComplete(wizardData: WizardData) {
  const segment = wizardData.tennisExperience?.currentLevel || 'unknown';
  const goal = wizardData.trainingGoals?.primaryGoal || 'unknown';
  const commitment = wizardData.schedulePreferences?.commitmentLevel || 'unknown';
  
  sendEvent({
    event: 'wizard_complete',
    category: 'Onboarding',
    label: `${segment}-${goal}`,
    properties: {
      user_segment: segment,
      primary_goal: goal,
      commitment_level: commitment,
      language: wizardData.personalInfo?.language || 'en',
      has_injuries: wizardData.trainingGoals?.injuryHistory || false,
      trainings_per_week: wizardData.schedulePreferences?.trainingsPerWeek || 0,
      timestamp: new Date().toISOString(),
    }
  });
  
  // Track conversion goal
  sendEvent({
    event: 'conversion',
    category: 'Goal',
    label: 'wizard_email_capture',
    value: 1,
  });
}

/**
 * Track wizard abandonment
 */
export function trackWizardAbandon(currentStep: number, totalSteps: number) {
  sendEvent({
    event: 'wizard_abandon',
    category: 'Onboarding',
    label: `step_${currentStep}_of_${totalSteps}`,
    value: currentStep,
    properties: {
      current_step: currentStep,
      total_steps: totalSteps,
      completion_percentage: Math.round((currentStep / totalSteps) * 100),
      timestamp: new Date().toISOString(),
    }
  });
}

/**
 * Track content recommendation click
 */
export function trackRecommendationClick(contentPath: string, reason: string) {
  sendEvent({
    event: 'recommendation_click',
    category: 'Personalization',
    label: contentPath,
    properties: {
      content_path: contentPath,
      recommendation_reason: reason,
      timestamp: new Date().toISOString(),
    }
  });
}

/**
 * Track email capture (simple form)
 */
export function trackEmailCapture(source: string, language: string = 'en') {
  sendEvent({
    event: 'email_capture',
    category: 'Lead Generation',
    label: source,
    properties: {
      capture_source: source,
      language,
      is_wizard: false,
      timestamp: new Date().toISOString(),
    }
  });
}

/**
 * Track progressive disclosure unlock
 */
export function trackContentUnlock(contentId: string, unlockReason: string) {
  sendEvent({
    event: 'content_unlock',
    category: 'Progressive Disclosure',
    label: contentId,
    properties: {
      content_id: contentId,
      unlock_reason: unlockReason,
      timestamp: new Date().toISOString(),
    }
  });
}

/**
 * Track WhatsApp opt-in (Spanish users)
 */
export function trackWhatsAppOptIn(hasOptedIn: boolean) {
  sendEvent({
    event: 'whatsapp_preference',
    category: 'Communication',
    label: hasOptedIn ? 'opted_in' : 'opted_out',
    value: hasOptedIn ? 1 : 0,
    properties: {
      opted_in: hasOptedIn,
      timestamp: new Date().toISOString(),
    }
  });
}

/**
 * Core event sending function
 * Adapts to available analytics platforms
 */
function sendEvent(event: AnalyticsEvent) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.event, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.properties,
    });
  }
  
  // Custom analytics endpoint
  if (typeof window !== 'undefined') {
    // Non-blocking analytics call
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(() => {
      // Silently fail - don't break user experience
    });
  }
  
  // Console logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }
}

/**
 * Helper to determine traffic source
 */
function getTrafficSource(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check UTM parameters
  if (urlParams.get('utm_source')) {
    return urlParams.get('utm_source') || 'unknown';
  }
  
  // Check referrer
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  
  try {
    const referrerUrl = new URL(referrer);
    const currentUrl = new URL(window.location.href);
    
    if (referrerUrl.hostname === currentUrl.hostname) {
      return 'internal';
    }
    
    // Common referrers
    if (referrerUrl.hostname.includes('google')) return 'google';
    if (referrerUrl.hostname.includes('facebook')) return 'facebook';
    if (referrerUrl.hostname.includes('twitter')) return 'twitter';
    if (referrerUrl.hostname.includes('linkedin')) return 'linkedin';
    
    return referrerUrl.hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Session tracking utilities
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('wizard_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('wizard_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Performance tracking
 */
export function trackWizardPerformance(wizardState: WizardState) {
  const startTime = new Date(wizardState.startedAt).getTime();
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  sendEvent({
    event: 'wizard_performance',
    category: 'Performance',
    label: 'completion_time',
    value: Math.round(duration / 1000), // seconds
    properties: {
      duration_ms: duration,
      duration_seconds: Math.round(duration / 1000),
      steps_completed: wizardState.currentStep + 1,
      session_id: wizardState.sessionId,
    }
  });
}
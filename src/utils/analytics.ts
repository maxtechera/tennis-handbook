/**
 * Analytics utilities for tracking wizard events and user behavior
 * Supports multiple analytics platforms (GA4, ConvertKit events, custom tracking)
 */

import type {
  WizardData,
  WizardState,
} from "../components/OnboardingWizard/types";

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
export function trackWizardStart(language: string = "en") {
  sendEvent({
    event: "wizard_start",
    category: "Onboarding",
    label: language,
    properties: {
      language,
      timestamp: new Date().toISOString(),
      source: getTrafficSource(),
    },
  });
}

/**
 * Track wizard step completion
 */
export function trackWizardStep(stepId: string, stepNumber: number, data: any) {
  sendEvent({
    event: "wizard_step_complete",
    category: "Onboarding",
    label: stepId,
    value: stepNumber,
    properties: {
      step_id: stepId,
      step_number: stepNumber,
      has_data: !!data,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track wizard completion
 */
export function trackWizardComplete(wizardData: WizardData) {
  const segment = wizardData.tennisExperience?.currentLevel || "unknown";
  const goal = wizardData.trainingGoals?.primaryGoal || "unknown";
  const commitment =
    wizardData.schedulePreferences?.commitmentLevel || "unknown";
  const language = wizardData.personalInfo?.language || "en";
  const hasWhatsApp = !!wizardData.personalInfo?.whatsapp;

  // Calculate estimated lifetime value
  const baseValue = language === "es" ? 29 : 19; // €29 for Spanish, €19 for English
  const monthlyValue = segment === "competitive" ? baseValue * 1.5 : baseValue;
  const estimatedLTV = monthlyValue * 12; // 12-month LTV

  sendEvent({
    event: "wizard_complete",
    category: "Onboarding",
    label: `${segment}-${goal}`,
    value: estimatedLTV,
    properties: {
      user_segment: segment,
      primary_goal: goal,
      commitment_level: commitment,
      language: language,
      has_injuries: wizardData.trainingGoals?.injuryHistory || false,
      trainings_per_week: wizardData.schedulePreferences?.trainingsPerWeek || 0,
      has_whatsapp: hasWhatsApp,
      communication_preferences:
        wizardData.personalInfo?.communicationPreferences || [],
      timestamp: new Date().toISOString(),
      currency: "EUR",
    },
  });

  // Track conversion goal with value
  sendEvent({
    event: "conversion",
    category: "Goal",
    label: "wizard_email_capture",
    value: estimatedLTV,
    properties: {
      currency: "EUR",
      conversion_type: "wizard_completion",
      language: language,
      segment: segment,
    },
  });
}

/**
 * Track wizard abandonment
 */
export function trackWizardAbandon(currentStep: number, totalSteps: number) {
  sendEvent({
    event: "wizard_abandon",
    category: "Onboarding",
    label: `step_${currentStep}_of_${totalSteps}`,
    value: currentStep,
    properties: {
      current_step: currentStep,
      total_steps: totalSteps,
      completion_percentage: Math.round((currentStep / totalSteps) * 100),
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track content recommendation click
 */
export function trackRecommendationClick(contentPath: string, reason: string) {
  sendEvent({
    event: "recommendation_click",
    category: "Personalization",
    label: contentPath,
    properties: {
      content_path: contentPath,
      recommendation_reason: reason,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track email capture (simple form)
 */
export function trackEmailCapture(source: string, language: string = "en") {
  sendEvent({
    event: "email_capture",
    category: "Lead Generation",
    label: source,
    properties: {
      capture_source: source,
      language,
      is_wizard: false,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track progressive disclosure unlock
 */
export function trackContentUnlock(contentId: string, unlockReason: string) {
  sendEvent({
    event: "content_unlock",
    category: "Progressive Disclosure",
    label: contentId,
    properties: {
      content_id: contentId,
      unlock_reason: unlockReason,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track WhatsApp opt-in (Spanish users)
 */
export function trackWhatsAppOptIn(hasOptedIn: boolean) {
  sendEvent({
    event: "whatsapp_preference",
    category: "Communication",
    label: hasOptedIn ? "opted_in" : "opted_out",
    value: hasOptedIn ? 1 : 0,
    properties: {
      opted_in: hasOptedIn,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Get all available user context data
 */
function getUserContext(): Record<string, any> {
  if (typeof window === "undefined") return {};

  const context: Record<string, any> = {
    // Session data
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
    
    // Page context
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer,
    
    // Traffic source
    traffic_source: getTrafficSource(),
    
    // Device/browser info
    user_agent: navigator.userAgent,
    language: navigator.language,
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Connection info
    connection_type: (navigator as any).connection?.effectiveType || 'unknown',
    connection_speed: (navigator as any).connection?.downlink || 'unknown',
  };

  // Get wizard data from localStorage if available
  try {
    const wizardData = localStorage.getItem('onboarding-wizard-data');
    if (wizardData) {
      const parsedData = JSON.parse(wizardData);
      context.wizard_data = parsedData;
      
      // Extract key user attributes
      if (parsedData.personalInfo) {
        context.user_language = parsedData.personalInfo.language;
        context.user_country = parsedData.personalInfo.country;
        context.user_name = parsedData.personalInfo.name;
        context.has_whatsapp = !!parsedData.personalInfo.whatsapp;
        context.communication_preferences = parsedData.personalInfo.communicationPreferences;
      }
      
      if (parsedData.tennisExperience) {
        context.tennis_level = parsedData.tennisExperience.currentLevel;
        context.years_playing = parsedData.tennisExperience.yearsPlaying;
        context.plays_competitively = parsedData.tennisExperience.playsCompetitively;
        context.has_coaching = parsedData.tennisExperience.coachingHistory;
      }
      
      if (parsedData.trainingGoals) {
        context.primary_goal = parsedData.trainingGoals.primaryGoal;
        context.secondary_goals = parsedData.trainingGoals.secondaryGoals;
        context.has_injuries = parsedData.trainingGoals.injuryHistory;
        context.specific_challenges = parsedData.trainingGoals.specificChallenges;
      }
      
      if (parsedData.schedulePreferences) {
        context.trainings_per_week = parsedData.schedulePreferences.trainingsPerWeek;
        context.session_duration = parsedData.schedulePreferences.sessionDuration;
        context.commitment_level = parsedData.schedulePreferences.commitmentLevel;
        context.equipment_access = parsedData.schedulePreferences.equipmentAccess;
      }
      
      if (parsedData.physicalProfile) {
        context.age = parsedData.physicalProfile.age;
        context.fitness_level = parsedData.physicalProfile.fitnessLevel;
        context.dominant_hand = parsedData.physicalProfile.dominantHand;
        context.has_mobility_issues = parsedData.physicalProfile.mobilityIssues;
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Get wizard state from localStorage if available
  try {
    const wizardState = localStorage.getItem('onboarding-wizard-state');
    if (wizardState) {
      const parsedState = JSON.parse(wizardState);
      context.wizard_current_step = parsedState.currentStep;
      context.wizard_started_at = parsedState.startedAt;
      context.wizard_is_complete = parsedState.isComplete;
      context.wizard_session_id = parsedState.sessionId;
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Get email from localStorage if available
  try {
    const email = localStorage.getItem('user-email');
    if (email) {
      context.user_email_hash = btoa(email).substring(0, 12); // Hashed email for privacy
    }
  } catch (e) {
    // Ignore parsing errors
  }

  return context;
}

/**
 * Core event sending function
 * Adapts to available analytics platforms and includes complete user context
 */
export function sendEvent(event: AnalyticsEvent) {
  // Enhance event with complete user context
  const userContext = getUserContext();
  const enhancedEvent = {
    ...event,
    properties: {
      ...event.properties,
      ...userContext,
    },
  };

  // Google Analytics 4
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", enhancedEvent.event, {
      event_category: enhancedEvent.category,
      event_label: enhancedEvent.label,
      value: enhancedEvent.value,
      ...enhancedEvent.properties,
    });
  }

  // Custom analytics endpoint
  if (typeof window !== "undefined") {
    // Import API config dynamically to avoid SSR issues
    import("../config/api").then(({ API_CONFIG }) => {
      // Non-blocking analytics call
      fetch(API_CONFIG.ANALYTICS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enhancedEvent),
      }).catch(() => {
        // Silently fail - don't break user experience
      });
    });
  }

  // Console logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("Analytics Event:", enhancedEvent);
  }
}

/**
 * Helper to determine traffic source
 */
function getTrafficSource(): string {
  if (typeof window === "undefined") return "unknown";

  const urlParams = new URLSearchParams(window.location.search);

  // Check UTM parameters
  if (urlParams.get("utm_source")) {
    return urlParams.get("utm_source") || "unknown";
  }

  // Check referrer
  const referrer = document.referrer;
  if (!referrer) return "direct";

  try {
    const referrerUrl = new URL(referrer);
    const currentUrl = new URL(window.location.href);

    if (referrerUrl.hostname === currentUrl.hostname) {
      return "internal";
    }

    // Common referrers
    if (referrerUrl.hostname.includes("google")) return "google";
    if (referrerUrl.hostname.includes("facebook")) return "facebook";
    if (referrerUrl.hostname.includes("twitter")) return "twitter";
    if (referrerUrl.hostname.includes("linkedin")) return "linkedin";

    return referrerUrl.hostname;
  } catch {
    return "unknown";
  }
}

/**
 * Session tracking utilities
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";

  let sessionId = sessionStorage.getItem("wizard_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionStorage.setItem("wizard_session_id", sessionId);
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
    event: "wizard_performance",
    category: "Performance",
    label: "completion_time",
    value: Math.round(duration / 1000), // seconds
    properties: {
      duration_ms: duration,
      duration_seconds: Math.round(duration / 1000),
      steps_completed: wizardState.currentStep + 1,
      session_id: wizardState.sessionId,
    },
  });
}

/**
 * Track wizard progress through steps
 */
export function trackWizardProgress(step: string, language: string) {
  const stepValues: Record<string, number> = {
    welcome: 20,
    personalization: 40,
    background: 60,
    challenges: 80,
    completion: 100,
  };

  sendEvent({
    event: "wizard_progress",
    category: "Onboarding",
    label: step,
    value: stepValues[step] || 0,
    properties: {
      step_name: step,
      progress_percentage: stepValues[step] || 0,
      language: language,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Generic event tracking with automatic user context
 */
export function trackEvent(
  eventName: string,
  properties: Record<string, any> = {},
  category: string = "General",
  label?: string,
  value?: number
) {
  sendEvent({
    event: eventName,
    category,
    label,
    value,
    properties: {
      ...properties,
      event_triggered_at: new Date().toISOString(),
    },
  });
}

/**
 * Track page views with full context
 */
export function trackPageView(pagePath?: string) {
  const path = pagePath || (typeof window !== "undefined" ? window.location.pathname : "unknown");
  
  trackEvent("page_view", {
    page_path: path,
    page_url: typeof window !== "undefined" ? window.location.href : "unknown",
  }, "Navigation", path);
}

/**
 * Track user interactions
 */
export function trackInteraction(
  element: string,
  action: string,
  properties: Record<string, any> = {}
) {
  trackEvent("user_interaction", {
    element,
    action,
    ...properties,
  }, "Interaction", `${element}_${action}`);
}

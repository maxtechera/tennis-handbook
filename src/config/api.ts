// API Configuration
// In Docusaurus, we need to handle environment detection differently
const isProduction =
  typeof window !== "undefined" && window.location.hostname !== "localhost";

// Detect if we're running under Vercel dev (which serves APIs on different port)
const getApiBaseUrl = () => {
  if (isProduction) {
    return "https://tennis-handbook.vercel.app";
  }
  
  // In development, use same origin (Vercel serves APIs on same port as frontend)
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    // First try to detect the current origin for Vercel dev
    return window.location.origin;
  }
  
  // Fallback for SSR - try port 3000
  return "http://localhost:3000";
};

export const API_CONFIG = {
  // Update this when you deploy your API endpoint
  SUBSCRIBE_URL: `${getApiBaseUrl()}/api/subscribe`,

  // Analytics endpoint (optional)
  ANALYTICS_URL: `${getApiBaseUrl()}/api/analytics`,
};

// ConvertKit Form IDs (if you want different forms for different languages)
export const FORM_IDS = {
  en: "your_english_form_id",
  es: "your_spanish_form_id",
};

// API request configuration
export const API_REQUEST_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include" as RequestCredentials,
};

// API response types
export interface SubscribeResponse {
  success: boolean;
  message: string;
  personalization?: {
    segment: string;
    recommendedContent: Array<{
      path: string;
      title: string;
      reason: string;
    }>;
  };
}

// Helper function to make API calls
export async function apiCall<T = any>(
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    ...API_REQUEST_CONFIG,
    ...options,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Network error" }));
    throw new Error(error.error || "API call failed");
  }

  return response.json();
}

// Subscribe with basic email
export async function subscribeEmail(
  email: string,
  source: string,
  language: string = "en"
): Promise<SubscribeResponse> {
  return apiCall<SubscribeResponse>(API_CONFIG.SUBSCRIBE_URL, {
    email,
    source,
    language,
    consent: true,
    timestamp: new Date().toISOString(),
  });
}

// Create subscriber immediately with basic info
export async function createSubscriber(
  email: string,
  name: string,
  language: string = "en"
): Promise<SubscribeResponse> {
  return apiCall<SubscribeResponse>(API_CONFIG.SUBSCRIBE_URL, {
    email,
    name,
    source: "onboarding-wizard-email",
    language,
    consent: true,
    timestamp: new Date().toISOString(),
    createImmediately: true,
  });
}

// Update subscriber with wizard tags (subsequent calls)
export async function updateSubscriberTags(
  email: string,
  wizardData: any,
  whatsapp?: string
): Promise<SubscribeResponse> {
  const language = wizardData.personalInfo?.language || "en";

  return apiCall<SubscribeResponse>(API_CONFIG.SUBSCRIBE_URL, {
    email,
    source: "onboarding-wizard-update",
    language,
    wizardData,
    whatsapp,
    updateTags: true,
    timestamp: new Date().toISOString(),
  });
}

// Subscribe with full wizard data (legacy - for final completion)
export async function subscribeWithWizard(
  email: string,
  wizardData: any,
  whatsapp?: string
): Promise<SubscribeResponse> {
  const language = wizardData.personalInfo?.language || "en";

  return apiCall<SubscribeResponse>(API_CONFIG.SUBSCRIBE_URL, {
    email,
    source: "onboarding-wizard",
    language,
    consent: true,
    timestamp: new Date().toISOString(),
    wizardData,
    whatsapp,
    isWizardSubmission: true,
  });
}

// Environment variable validation helper
export const validateEnvConfig = () => {
  // Since we can't use process.env in the browser, we'll skip validation
  // You can configure these values directly in this file
  return true;
};

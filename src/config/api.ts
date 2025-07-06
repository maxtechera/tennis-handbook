// API Configuration
// In Docusaurus, we need to handle environment detection differently
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

export const API_CONFIG = {
  // Update this when you deploy your API endpoint
  SUBSCRIBE_URL: isProduction
    ? 'https://tennis-handbook.vercel.app/api/subscribe'
    : '/api/subscribe',
  
  // Analytics endpoint (optional)
  ANALYTICS_URL: isProduction
    ? 'https://your-tennis-handbook-api.vercel.app/api/analytics'
    : '/api/analytics',
};

// ConvertKit Form IDs (if you want different forms for different languages)
export const FORM_IDS = {
  en: 'your_english_form_id',
  es: 'your_spanish_form_id'
};

// API request configuration
export const API_REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include' as RequestCredentials,
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
    method: 'POST',
    ...API_REQUEST_CONFIG,
    ...options,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'API call failed');
  }

  return response.json();
}

// Subscribe with basic email
export async function subscribeEmail(
  email: string, 
  source: string, 
  language: string = 'en'
): Promise<SubscribeResponse> {
  return apiCall<SubscribeResponse>(API_CONFIG.SUBSCRIBE_URL, {
    email,
    source,
    language,
    consent: true,
    timestamp: new Date().toISOString(),
  });
}

// Subscribe with full wizard data
export async function subscribeWithWizard(
  email: string,
  wizardData: any,
  whatsapp?: string
): Promise<SubscribeResponse> {
  const language = wizardData.personalInfo?.language || 'en';
  
  return apiCall<SubscribeResponse>(API_CONFIG.SUBSCRIBE_URL, {
    email,
    source: 'onboarding-wizard',
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
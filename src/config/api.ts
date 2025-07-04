// API Configuration
// In Docusaurus, environment variables must be prefixed with REACT_APP_ to be exposed to the client
export const API_CONFIG = {
  // Update this when you deploy your API endpoint
  SUBSCRIBE_URL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || 'https://your-tennis-handbook-api.vercel.app/api/subscribe' // TODO: Update with your production URL
    : '/api/subscribe'
};

// ConvertKit Form IDs (if you want different forms for different languages)
export const FORM_IDS = {
  en: process.env.REACT_APP_CONVERTKIT_FORM_ID_EN || 'your_english_form_id',
  es: process.env.REACT_APP_CONVERTKIT_FORM_ID_ES || 'your_spanish_form_id'
};

// Environment variable validation helper
export const validateEnvConfig = () => {
  const requiredVars = [
    'REACT_APP_API_URL',
    'REACT_APP_CONVERTKIT_FORM_ID_EN'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
  }
  
  return missingVars.length === 0;
};
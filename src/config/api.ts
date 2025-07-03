// API Configuration
export const API_CONFIG = {
  // Update this when you deploy your API endpoint
  SUBSCRIBE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-tennis-handbook-api.vercel.app/api/subscribe' // TODO: Update with your production URL
    : '/api/subscribe'
};

// ConvertKit Form IDs (if you want different forms for different languages)
export const FORM_IDS = {
  en: process.env.CONVERTKIT_FORM_ID_EN || 'your_english_form_id',
  es: process.env.CONVERTKIT_FORM_ID_ES || 'your_spanish_form_id'
};
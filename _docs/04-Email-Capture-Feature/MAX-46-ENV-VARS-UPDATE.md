# MAX-46: Email Capture Environment Variables Update

## Summary

Updated email capture components to use environment variables for ConvertKit integration, ensuring secure API key management and flexible configuration.

## Changes Made

### 1. Updated Email Capture Components

**EmailCaptureForm.tsx**
- Removed direct ConvertKit API calls from client-side code
- Updated to use API endpoint via `API_CONFIG.SUBSCRIBE_URL`
- Simplified request payload to match server-side API

**EmailCaptureBar.tsx**
- Similar updates to use API endpoint instead of direct ConvertKit calls
- Added import for `API_CONFIG`

### 2. Enhanced API Configuration

**src/config/api.ts**
- Added support for `REACT_APP_` prefixed environment variables (required by Docusaurus)
- Added optional language-specific form IDs
- Added validation helper function

### 3. Improved Server-Side API

**api/subscribe.js**
- Added support for language-specific form IDs
- Enhanced error logging for debugging
- Falls back to default form ID if language-specific not found

### 4. Documentation and Setup

**Created Files:**
- `.env.example` - Template for environment variables
- `ENVIRONMENT_VARIABLES_GUIDE.md` - Comprehensive setup guide
- Updated `.gitignore` to include `.env`

## Environment Variables Structure

### Client-Side (Docusaurus)
```bash
REACT_APP_API_URL=https://your-api.vercel.app/api/subscribe
REACT_APP_CONVERTKIT_FORM_ID_EN=form_id_english
REACT_APP_CONVERTKIT_FORM_ID_ES=form_id_spanish
```

### Server-Side (API)
```bash
CONVERTKIT_API_SECRET=sk_your_secret_key
CONVERTKIT_FORM_ID=default_form_id
CONVERTKIT_FORM_ID_EN=form_id_english
CONVERTKIT_FORM_ID_ES=form_id_spanish
```

## Security Improvements

1. **API keys never exposed to client** - All ConvertKit API calls now go through server-side endpoint
2. **Environment-based configuration** - Easy to manage different keys for dev/staging/production
3. **Language-specific forms** - Support for different ConvertKit forms per language
4. **Proper validation** - Server-side validation of all inputs

## Testing

1. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your ConvertKit credentials
   ```

2. Test locally:
   ```bash
   npm run start
   ```

3. Test email capture form on any page

## Deployment Notes

For Vercel deployment:
1. Add all server-side env vars in Vercel dashboard
2. Mark `CONVERTKIT_API_SECRET` as secret
3. Deploy the `api/subscribe.js` as serverless function

For other platforms, see `ENVIRONMENT_VARIABLES_GUIDE.md`
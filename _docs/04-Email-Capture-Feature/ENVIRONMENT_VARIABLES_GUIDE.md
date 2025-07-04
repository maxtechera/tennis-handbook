# Environment Variables Guide for Email Capture

## Overview

The email capture feature uses environment variables to securely manage ConvertKit API credentials and configuration. This guide explains how to set up and use these variables.

## Client-Side Variables (Docusaurus)

In Docusaurus, client-side environment variables must be prefixed with `REACT_APP_` to be exposed to the browser bundle.

### Required Variables

```bash
# API endpoint for email subscriptions
REACT_APP_API_URL=https://your-tennis-handbook-api.vercel.app/api/subscribe
```

### Optional Variables

```bash
# Language-specific ConvertKit form IDs
REACT_APP_CONVERTKIT_FORM_ID_EN=your_english_form_id
REACT_APP_CONVERTKIT_FORM_ID_ES=your_spanish_form_id
```

## Server-Side Variables (API Endpoint)

These variables are used by the serverless function and should never be exposed to the client.

### Required Variables

```bash
# ConvertKit API Secret (never expose this to the client!)
CONVERTKIT_API_SECRET=sk_your_secret_key_here

# Default ConvertKit Form ID
CONVERTKIT_FORM_ID=your_default_form_id
```

### Optional Variables

```bash
# Language-specific form IDs (server-side)
CONVERTKIT_FORM_ID_EN=your_english_form_id
CONVERTKIT_FORM_ID_ES=your_spanish_form_id
```

## Setup Instructions

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your ConvertKit credentials in `.env`

3. Start the development server:
   ```bash
   npm run start
   ```

### Production Deployment (Vercel)

1. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each variable with its production value

2. Important: Set server-side variables as "Secret" to prevent exposure

### Production Deployment (Netlify)

1. Set environment variables in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add each variable

2. For the API endpoint, deploy as a Netlify Function

## Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Keep API secrets server-side only** - Never use them in client code
3. **Use different API keys for dev/prod** - Isolate environments
4. **Rotate keys regularly** - Update them every 3-6 months
5. **Monitor usage** - Check ConvertKit dashboard for unusual activity

## Testing

To verify your configuration:

1. Check client-side variables:
   ```javascript
   console.log('API URL:', process.env.REACT_APP_API_URL);
   ```

2. Test the API endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","source":"test","consent":true,"language":"en"}'
   ```

## Troubleshooting

### "ConvertKit configuration missing" error
- Ensure all required environment variables are set
- Check variable names match exactly (case-sensitive)
- Restart the development server after changing `.env`

### CORS errors
- Verify allowed origins in `api/subscribe.js`
- Ensure API URL matches your deployment URL

### Variables not loading
- In Docusaurus, variables must start with `REACT_APP_`
- Clear browser cache and restart dev server
- Check `.env` file is in project root
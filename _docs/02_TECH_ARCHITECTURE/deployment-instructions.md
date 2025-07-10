> **Status: ACTIVE** | Last updated: 2025-07-10

# Deployment Instructions for Vercel

## Environment Variables Setup

The API requires these environment variables to be set in Vercel:

1. **Via Vercel Dashboard (Recommended)**:
   - Go to your project at https://vercel.com/dashboard
   - Navigate to Settings → Environment Variables
   - Add these variables for Production:
     - `CONVERTKIT_API_SECRET`: `kit_ddb41d09b5e81e547a94d9c55b0c862c`
     - `CONVERTKIT_FORM_ID`: `8270854`

2. **Via Vercel CLI**:
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Add environment variables
   echo "kit_ddb41d09b5e81e547a94d9c55b0c862c" | vercel env add CONVERTKIT_API_SECRET production
   echo "8270854" | vercel env add CONVERTKIT_FORM_ID production
   ```

## Deploy to Production

After setting environment variables:

```bash
# Deploy to production
vercel --prod
```

## Test the Deployment

After deployment, test the API:

```bash
./test-api.sh
```

Or manually:

```bash
curl -X POST https://tennis-handbook.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -H "Origin: https://tennis-handbook.vercel.app" \
  -d '{"email":"test@example.com","source":"test","consent":true}'
```

## Troubleshooting

If you see "Server configuration error", it means the environment variables aren't set properly in Vercel.

Check the Function logs in Vercel dashboard to see what's missing.
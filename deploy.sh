#!/bin/bash

# Deploy to Vercel with environment variables

echo "🚀 Deploying tennis-workout to Vercel..."

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Add environment variables to Vercel
echo "🔧 Setting environment variables..."
vercel env add CONVERTKIT_API_SECRET production < <(echo "kit_ddb41d09b5e81e547a94d9c55b0c862c")
vercel env add CONVERTKIT_FORM_ID production < <(echo "8270854")

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test the API endpoint with: curl -X POST https://tennis-handbook.vercel.app/api/subscribe -H \"Content-Type: application/json\" -d '{\"email\":\"test@example.com\",\"source\":\"test\",\"consent\":true}'"
echo "2. Check ConvertKit dashboard for test subscription"
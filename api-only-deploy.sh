#!/bin/bash

# Deploy only the API to Vercel

echo "🚀 Deploying API-only to Vercel..."

# Create a temporary directory for API deployment
TEMP_DIR=$(mktemp -d)
echo "📁 Created temp directory: $TEMP_DIR"

# Copy only the API files
cp -r api $TEMP_DIR/
cp package.json $TEMP_DIR/
cp pnpm-lock.yaml $TEMP_DIR/

# Create a minimal vercel.json for API only
cat > $TEMP_DIR/vercel.json << EOF
{
  "functions": {
    "api/subscribe.js": {
      "runtime": "nodejs20.x"
    }
  }
}
EOF

# Deploy from temp directory
cd $TEMP_DIR
vercel --prod --confirm

# Clean up
cd -
rm -rf $TEMP_DIR

echo "✅ API deployment complete!"
#!/bin/bash

# Test the deployed API endpoint

API_URL="https://tennis-handbook.vercel.app/api/subscribe"
TEST_EMAIL="test-$(date +%s)@example.com"

echo "🧪 Testing API endpoint: $API_URL"
echo "📧 Using test email: $TEST_EMAIL"
echo ""

# Test the API
response=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: https://tennis-handbook.vercel.app" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"source\": \"api-test\",
    \"consent\": true,
    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"
  }")

echo "📥 Response:"
echo "$response" | jq .

# Check if successful
if echo "$response" | jq -e '.success == true' > /dev/null; then
  echo ""
  echo "✅ API test successful!"
  echo ""
  echo "📋 Personalization data:"
  echo "$response" | jq '.personalization'
else
  echo ""
  echo "❌ API test failed!"
  echo "$response" | jq '.error'
fi
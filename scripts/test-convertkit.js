#!/usr/bin/env node

/**
 * Test script for ConvertKit integration
 * Usage: node scripts/test-convertkit.js
 */

const https = require('https');

// Load environment variables
require('dotenv').config();

const API_KEY = process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY;
const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;

if (!API_KEY || !FORM_ID) {
  console.error('❌ Error: ConvertKit API configuration missing');
  console.error('Please ensure NEXT_PUBLIC_CONVERTKIT_API_KEY and NEXT_PUBLIC_CONVERTKIT_FORM_ID are set in .env file');
  process.exit(1);
}

console.log('🔍 Testing ConvertKit Integration...\n');
console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
console.log(`Form ID: ${FORM_ID}\n`);

// Test API connection
const testEmail = `test-${Date.now()}@example.com`;

const data = JSON.stringify({
  api_key: API_KEY,
  email: testEmail,
  tags: ['test-integration'],
  fields: {
    gdpr_consent: 'yes',
    signup_source: 'test-script',
    signup_date: new Date().toISOString(),
  }
});

const options = {
  hostname: 'api.convertkit.com',
  port: 443,
  path: `/v3/forms/${FORM_ID}/subscribe`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('📧 Testing subscription with email:', testEmail);

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      
      if (res.statusCode === 200 && response.subscription) {
        console.log('\n✅ Success! ConvertKit integration is working');
        console.log('Subscription ID:', response.subscription.id);
        console.log('State:', response.subscription.state);
        console.log('\n⚠️  Note: Remember to delete this test subscriber from ConvertKit');
      } else if (res.statusCode === 401) {
        console.error('\n❌ Authentication failed');
        console.error('Please check your API key');
      } else if (res.statusCode === 404) {
        console.error('\n❌ Form not found');
        console.error('Please check your Form ID');
      } else {
        console.error('\n❌ Error:', response.error || response.message || 'Unknown error');
        console.error('Status Code:', res.statusCode);
        console.error('Response:', responseData);
      }
    } catch (e) {
      console.error('\n❌ Failed to parse response:', e.message);
      console.error('Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Connection error:', error.message);
});

req.write(data);
req.end();

console.log('\n🔄 Waiting for response...');
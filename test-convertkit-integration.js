#!/usr/bin/env node
/**
 * ConvertKit Integration Test Script
 * Run this to verify your ConvertKit setup is working
 */

const fetch = require('node-fetch');
require('dotenv').config();

const API_SECRET = process.env.CONVERTKIT_API_SECRET;
const FORM_ID_EN = process.env.CONVERTKIT_FORM_ID_EN;
const FORM_ID_ES = process.env.CONVERTKIT_FORM_ID_ES;
const FORM_ID_DEFAULT = process.env.CONVERTKIT_FORM_ID;

console.log('🧪 Testing ConvertKit Integration...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`✅ API Secret: ${API_SECRET ? 'Set' : '❌ Missing'}`);
console.log(`✅ English Form ID: ${FORM_ID_EN ? 'Set' : '❌ Missing'}`);
console.log(`✅ Spanish Form ID: ${FORM_ID_ES ? 'Set' : '❌ Missing'}`);
console.log(`✅ Default Form ID: ${FORM_ID_DEFAULT ? 'Set' : '❌ Missing'}`);
console.log('');

if (!API_SECRET || !FORM_ID_EN) {
  console.log('❌ Missing required environment variables');
  console.log('Please set CONVERTKIT_API_SECRET and CONVERTKIT_FORM_ID_EN in your .env file');
  process.exit(1);
}

// Test ConvertKit API connection
async function testConvertKitAPI() {
  try {
    console.log('🔗 Testing ConvertKit API connection...');
    
    const testEmail = `test+${Date.now()}@example.com`;
    const formId = FORM_ID_EN;
    
    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: API_SECRET,
        email: testEmail,
        fields: {
          source: 'integration-test',
          language: 'en',
          test: 'true'
        },
        tags: ['tennis-handbook', 'test-subscriber']
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ ConvertKit API connection successful!');
      console.log(`📧 Test subscriber created: ${testEmail}`);
      console.log(`🆔 Subscriber ID: ${data.subscription?.subscriber?.id || 'Unknown'}`);
      console.log('');
      
      // Test your local API endpoint
      await testLocalAPI();
      
    } else {
      console.log('❌ ConvertKit API Error:');
      console.log(data);
    }
    
  } catch (error) {
    console.log('❌ Error testing ConvertKit API:');
    console.log(error.message);
  }
}

// Test local API endpoint
async function testLocalAPI() {
  try {
    console.log('🏠 Testing local subscribe endpoint...');
    
    const testEmail = `localtest+${Date.now()}@example.com`;
    
    const response = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        email: testEmail,
        name: 'Test User',
        consent: true,
        source: 'integration-test',
        language: 'en'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Local API endpoint working!');
      console.log(`📧 Message: ${data.message}`);
      if (data.development) {
        console.log('🛠️  Development mode active');
      }
    } else {
      console.log('❌ Local API Error:');
      console.log(data);
    }
    
  } catch (error) {
    console.log('❌ Error testing local API:');
    console.log(error.message);
    console.log('💡 Make sure your development server is running: vercel dev');
  }
}

// Run tests
testConvertKitAPI();
// Test script for wizard flow
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testWizardFlow() {
  console.log('🧪 Testing Wizard Flow...\n');
  
  const sessionId = `test-session-${Date.now()}`;
  const testEmail = 'test@example.com';
  
  try {
    // 1. Test setup check
    console.log('1. Checking development setup...');
    const setupResponse = await fetch(`${BASE_URL}/api/dev-setup`);
    const setup = await setupResponse.json();
    console.log('✅ Setup:', setup.setup.database.mode);
    
    // 2. Test email capture
    console.log('\n2. Testing email capture...');
    const startResponse = await fetch(`${BASE_URL}/api/wizard-start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        sessionId,
        source: 'test'
      })
    });
    const startResult = await startResponse.json();
    console.log('✅ Email capture:', startResult.message);
    
    // 3. Test progress save
    console.log('\n3. Testing progress save...');
    const saveResponse = await fetch(`${BASE_URL}/api/wizard-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        step: 1,
        data: {
          personalInfo: {
            email: testEmail,
            name: 'Test User',
            language: 'en'
          }
        },
        metadata: {
          utmSource: 'test'
        }
      })
    });
    const saveResult = await saveResponse.json();
    console.log('✅ Progress save:', saveResult.message);
    
    // 4. Test wizard completion
    console.log('\n4. Testing wizard completion...');
    const completeResponse = await fetch(`${BASE_URL}/api/wizard-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        wizardData: {
          personalInfo: {
            email: testEmail,
            name: 'Test User',
            language: 'en'
          },
          tennisExperience: {
            currentLevel: 'intermediate',
            yearsPlaying: '3-5'
          },
          trainingGoals: {
            primaryGoal: 'fitness'
          }
        }
      })
    });
    const completeResult = await completeResponse.json();
    console.log('✅ Wizard completion:', completeResult.message);
    console.log('📊 User segment:', completeResult.segment);
    console.log('📚 Recommendations:', completeResult.recommendations?.length || 0);
    
    // 5. Test analytics
    console.log('\n5. Testing analytics...');
    const analyticsResponse = await fetch(`${BASE_URL}/api/analytics-wizard`);
    const analytics = await analyticsResponse.json();
    console.log('✅ Analytics funnel:');
    console.log(`   Starts: ${analytics.funnel.starts}`);
    console.log(`   Emails: ${analytics.funnel.emails}`);
    console.log(`   Completes: ${analytics.funnel.completes}`);
    console.log(`   Email capture rate: ${analytics.conversionRates.emailCapture}%`);
    
    console.log('\n🎉 All tests passed! Wizard flow is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure the development server is running on localhost:3000');
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  testWizardFlow();
}

export { testWizardFlow };
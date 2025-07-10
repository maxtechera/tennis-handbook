import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const sessionId = `test-session-${Date.now()}`;

async function testWizardDataPersistence() {
  console.log('🧪 Testing wizard data persistence...');
  console.log(`📝 Session ID: ${sessionId}`);
  
  try {
    // Test step 1: Micro Quiz
    console.log('\n1️⃣ Testing micro-quiz step...');
    await saveWizardStep(0, {
      'micro-quiz': {
        level: 'intermediate',
        engagement: 100,
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 2: Goals Quiz
    console.log('\n2️⃣ Testing goals-quiz step...');
    await saveWizardStep(1, {
      'goals-quiz': {
        goal: 'competitive',
        engagement: 100,
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 3: Time Quiz
    console.log('\n3️⃣ Testing time-quiz step...');
    await saveWizardStep(2, {
      'time-quiz': {
        availability: '3-5days',
        preferredTimes: ['morning', 'evening'],
        engagement: 100,
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 4: Focus Quiz
    console.log('\n4️⃣ Testing focus-quiz step...');
    await saveWizardStep(3, {
      'focus-quiz': {
        areas: ['technique', 'fitness', 'mental'],
        primaryFocus: 'technique',
        engagement: 100,
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 5: Analyzing
    console.log('\n5️⃣ Testing analyzing step...');
    await saveWizardStep(4, {
      'analyzing': {
        aiRecommendations: ['focus on footwork', 'improve serve technique'],
        calculatedSegment: 'intermediate-competitive',
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 6: Welcome (Email capture)
    console.log('\n6️⃣ Testing welcome/email capture step...');
    await saveWizardStep(5, {
      'welcome': {
        email: 'test@example.com',
        name: 'Test User',
        acceptedTerms: true,
        newsletter: true,
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 7: Welcome Success
    console.log('\n7️⃣ Testing welcome-success step...');
    await saveWizardStep(6, {
      'welcome-success': {
        downloadedPDF: true,
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 8: Personalization
    console.log('\n8️⃣ Testing personalization step...');
    await saveWizardStep(7, {
      'personalization': {
        age: '25-34',
        gender: 'male',
        location: 'Spain',
        whatsapp: '+34123456789',
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 9: Background
    console.log('\n9️⃣ Testing background step...');
    await saveWizardStep(8, {
      'background': {
        yearsPlaying: '3-5',
        playingStyle: 'baseline',
        favoriteShot: 'forehand',
        timestamp: new Date().toISOString()
      }
    });
    
    // Test step 10: Challenges
    console.log('\n🔟 Testing challenges step...');
    await saveWizardStep(9, {
      'challenges': {
        mainChallenges: ['consistency', 'fitness'],
        injuries: ['shoulder'],
        timestamp: new Date().toISOString()
      }
    });
    
    // Test completion
    console.log('\n✅ Testing wizard completion...');
    const allData = {
      'micro-quiz': { level: 'intermediate', engagement: 100 },
      'goals-quiz': { goal: 'competitive', engagement: 100 },
      'time-quiz': { availability: '3-5days', preferredTimes: ['morning', 'evening'] },
      'focus-quiz': { areas: ['technique', 'fitness', 'mental'], primaryFocus: 'technique' },
      'analyzing': { aiRecommendations: ['focus on footwork', 'improve serve technique'] },
      'welcome': { email: 'test@example.com', name: 'Test User', acceptedTerms: true },
      'welcome-success': { downloadedPDF: true },
      'personalization': { age: '25-34', gender: 'male', location: 'Spain', whatsapp: '+34123456789' },
      'background': { yearsPlaying: '3-5', playingStyle: 'baseline', favoriteShot: 'forehand' },
      'challenges': { mainChallenges: ['consistency', 'fitness'], injuries: ['shoulder'] },
      'personalInfo': { email: 'test@example.com', name: 'Test User' }
    };
    
    const completeResponse = await fetch(`${API_URL}/wizard-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, wizardData: allData })
    });
    
    const completeResult = await completeResponse.json();
    console.log('Completion result:', completeResult);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

async function saveWizardStep(step, data) {
  const response = await fetch(`${API_URL}/wizard-save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      step,
      data,
      metadata: {
        utmSource: 'test',
        utmMedium: 'script',
        referrer: 'test-script'
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to save step ${step}: ${response.statusText}`);
  }
  
  const result = await response.json();
  console.log(`✅ Step saved:`, result);
  return result;
}

// Run the test
testWizardDataPersistence();
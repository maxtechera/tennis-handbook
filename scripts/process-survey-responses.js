#!/usr/bin/env node

/**
 * Process Survey Responses Script
 * Processes CSV survey responses and updates the tracking JSON
 * 
 * Usage: node scripts/process-survey-responses.js <csv-file>
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Paths
const TRACKING_FILE = path.join(__dirname, '../docs/email-campaigns/surveys/survey-tracking.json');

function processResponses(csvFile) {
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(csvFile, 'utf-8');
    const records = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Read current tracking data
    const trackingData = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));

    // Reset counters
    const results = trackingData.results_summary;
    Object.keys(results).forEach(category => {
      Object.keys(results[category]).forEach(key => {
        results[category][key] = 0;
      });
    });

    // Process each response
    records.forEach(record => {
      // Usage frequency
      const usage = record.usage_frequency.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
      if (results.usage_frequency[usage] !== undefined) {
        results.usage_frequency[usage]++;
      }

      // Primary goal
      const goalMap = {
        'following workout program': 'workout_program',
        'learn exercises': 'learn_exercises',
        'general fitness': 'general_fitness',
        'injury prevention': 'injury_prevention'
      };
      const goal = goalMap[record.primary_goal.toLowerCase()] || 'other';
      if (results.primary_goal[goal] !== undefined) {
        results.primary_goal[goal]++;
      }

      // Biggest challenge
      const challengeMap = {
        'too much content': 'too_much_content',
        'hard to track progress': 'tracking_progress',
        'mobile experience': 'mobile_experience',
        'finding exercises': 'finding_exercises'
      };
      const challenge = challengeMap[record.biggest_challenge.toLowerCase()] || 'other';
      if (results.biggest_challenge[challenge] !== undefined) {
        results.biggest_challenge[challenge]++;
      }

      // Premium interest
      const premiumMap = {
        'yes, definitely ($9/month)': 'yes_9',
        'yes, definitely ($19/month)': 'yes_19',
        'maybe': 'maybe',
        'no': 'no'
      };
      const premium = premiumMap[record.premium_interest] || 'no';
      if (results.premium_interest[premium] !== undefined) {
        results.premium_interest[premium]++;
      }

      // Wanted features
      const featureMap = {
        'progress tracking': 'progress_tracking',
        'video demos': 'video_demos',
        'personalized plans': 'personalized_plans',
        'community': 'community',
        'mobile app': 'mobile_app'
      };
      const feature = featureMap[record.wanted_feature.toLowerCase()] || 'other';
      if (results.wanted_features[feature] !== undefined) {
        results.wanted_features[feature]++;
      }

      // Device preference
      const device = record.device_preference.toLowerCase();
      if (results.device_preference[device] !== undefined) {
        results.device_preference[device]++;
      }
    });

    // Update response tracking
    trackingData.response_tracking.surveys_completed = records.length;
    trackingData.response_tracking.response_rate = 
      ((records.length / trackingData.response_tracking.total_sent) * 100).toFixed(1) + '%';

    // Save updated tracking data
    fs.writeFileSync(TRACKING_FILE, JSON.stringify(trackingData, null, 2));

    console.log(`✅ Processed ${records.length} survey responses`);
    console.log('\n📊 Summary:');
    console.log('- Usage: Daily/Weekly users:', 
      results.usage_frequency.daily + results.usage_frequency['2_3_per_week'] + results.usage_frequency.weekly);
    console.log('- Premium interest:', 
      results.premium_interest.yes_9 + results.premium_interest.yes_19, 'willing to pay');
    console.log('- Top challenge:', 
      Object.entries(results.biggest_challenge).sort((a, b) => b[1] - a[1])[0][0]);
    console.log('- Top feature request:', 
      Object.entries(results.wanted_features).sort((a, b) => b[1] - a[1])[0][0]);

  } catch (error) {
    console.error('❌ Error processing responses:', error.message);
    process.exit(1);
  }
}

// Check if CSV file is provided
if (process.argv.length < 3) {
  console.log('Usage: node scripts/process-survey-responses.js <csv-file>');
  process.exit(1);
}

// Check if csv-parse is installed
try {
  require('csv-parse/sync');
} catch (e) {
  console.log('📦 Installing required dependency: csv-parse');
  require('child_process').execSync('npm install csv-parse', { stdio: 'inherit' });
}

processResponses(process.argv[2]);
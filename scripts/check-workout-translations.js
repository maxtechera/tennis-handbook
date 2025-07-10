#!/usr/bin/env node
/**
 * Workout Translation Tracker
 * 
 * This script checks the translation status of all workout YAML files
 * and generates a comprehensive report for tracking progress.
 * 
 * Usage: node scripts/check-workout-translations.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const WORKOUT_DATA_DIR = 'workout-data';
const OUTPUT_FILE = 'workout-translation-status.json';
const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

class WorkoutTranslationTracker {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalWorkouts: 0,
        englishWorkouts: 0,
        spanishWorkouts: 0,
        translationCoverage: 0,
        missingTranslations: 0
      },
      weeks: {}
    };
  }

  /**
   * Get file last modified date using Git
   */
  getFileLastModified(filePath) {
    try {
      const timestamp = execSync(
        `git log -1 --format="%ct" -- "${filePath}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      ).trim();
      
      if (timestamp) {
        return new Date(parseInt(timestamp) * 1000);
      }
    } catch (error) {
      // Fallback to filesystem date
    }
    
    try {
      return fs.statSync(filePath).mtime;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if a file exists and get its info
   */
  getFileInfo(filePath) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        exists: true,
        size: stats.size,
        lastModified: this.getFileLastModified(filePath),
        path: filePath
      };
    }
    return {
      exists: false,
      size: 0,
      lastModified: null,
      path: filePath
    };
  }

  /**
   * Analyze workout files for a specific week
   */
  analyzeWeek(weekNumber) {
    const weekDir = path.join(WORKOUT_DATA_DIR, `week-${weekNumber}`);
    const weekData = {
      weekNumber,
      days: {},
      summary: {
        englishCount: 0,
        spanishCount: 0,
        translationCoverage: 0
      }
    };

    if (!fs.existsSync(weekDir)) {
      console.warn(`Week ${weekNumber} directory not found: ${weekDir}`);
      return weekData;
    }

    // Check each day of the week
    for (const day of DAYS_OF_WEEK) {
      const englishFile = path.join(weekDir, `${day}.yml`);
      const spanishFile = path.join(weekDir, `${day}.es.yml`);
      
      const englishInfo = this.getFileInfo(englishFile);
      const spanishInfo = this.getFileInfo(spanishFile);

      weekData.days[day] = {
        english: englishInfo,
        spanish: spanishInfo,
        status: this.getTranslationStatus(englishInfo, spanishInfo)
      };

      // Update counters
      if (englishInfo.exists) {
        weekData.summary.englishCount++;
        this.results.summary.englishWorkouts++;
      }
      
      if (spanishInfo.exists) {
        weekData.summary.spanishCount++;
        this.results.summary.spanishWorkouts++;
      }
    }

    // Calculate translation coverage for this week
    weekData.summary.translationCoverage = weekData.summary.englishCount > 0 
      ? Math.round((weekData.summary.spanishCount / weekData.summary.englishCount) * 100)
      : 0;

    this.results.summary.totalWorkouts += weekData.summary.englishCount;
    this.results.summary.missingTranslations += (weekData.summary.englishCount - weekData.summary.spanishCount);

    return weekData;
  }

  /**
   * Determine translation status for a day
   */
  getTranslationStatus(englishInfo, spanishInfo) {
    if (!englishInfo.exists) {
      return 'NO_ENGLISH';
    }
    
    if (!spanishInfo.exists) {
      return 'MISSING_SPANISH';
    }

    // Check if Spanish is older than English
    if (spanishInfo.lastModified && englishInfo.lastModified) {
      if (spanishInfo.lastModified < englishInfo.lastModified) {
        return 'OUTDATED_SPANISH';
      }
    }

    return 'UP_TO_DATE';
  }

  /**
   * Generate priority recommendations
   */
  generatePriorityRecommendations() {
    const recommendations = [];
    
    // Read the quality scores from the completion tracker
    const completionTrackerPath = '_docs/WORKOUT_COMPLETION_TRACKER.md';
    const qualityScores = this.extractQualityScores(completionTrackerPath);
    
    // Generate recommendations based on quality scores and translation status
    for (const [weekKey, weekData] of Object.entries(this.results.weeks)) {
      const weekNumber = weekData.weekNumber;
      const avgQuality = qualityScores[`week-${weekNumber}`] || 0;
      
      for (const [day, dayData] of Object.entries(weekData.days)) {
        if (dayData.status === 'MISSING_SPANISH' && avgQuality >= 80) {
          recommendations.push({
            week: weekNumber,
            day,
            priority: 'HIGH',
            reason: `High quality workout (${avgQuality}%) missing Spanish translation`,
            action: 'Translate immediately'
          });
        } else if (dayData.status === 'OUTDATED_SPANISH') {
          recommendations.push({
            week: weekNumber,
            day,
            priority: 'MEDIUM',
            reason: 'Spanish translation is outdated',
            action: 'Update translation'
          });
        } else if (dayData.status === 'MISSING_SPANISH' && avgQuality >= 70) {
          recommendations.push({
            week: weekNumber,
            day,
            priority: 'MEDIUM',
            reason: `Good quality workout (${avgQuality}%) missing Spanish translation`,
            action: 'Translate when possible'
          });
        } else if (dayData.status === 'MISSING_SPANISH' && avgQuality < 60) {
          recommendations.push({
            week: weekNumber,
            day,
            priority: 'LOW',
            reason: `Low quality workout (${avgQuality}%) - improve quality before translation`,
            action: 'Improve quality first'
          });
        }
      }
    }

    // Sort by priority
    const priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recommendations;
  }

  /**
   * Extract quality scores from completion tracker
   */
  extractQualityScores(filePath) {
    const scores = {};
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Parse quality scores from the markdown tables
        const lines = content.split('\n');
        let currentWeek = null;
        
        for (const line of lines) {
          // Detect week headers
          const weekMatch = line.match(/### Week (\d+)/);
          if (weekMatch) {
            currentWeek = parseInt(weekMatch[1]);
            continue;
          }
          
          // Parse table rows with quality scores
          const tableMatch = line.match(/\|\s*\w+\s*\|.*?\|\s*(\d+)%\s*\|/);
          if (tableMatch && currentWeek) {
            const score = parseInt(tableMatch[1]);
            if (!scores[`week-${currentWeek}`]) {
              scores[`week-${currentWeek}`] = [];
            }
            scores[`week-${currentWeek}`].push(score);
          }
        }
        
        // Calculate averages
        for (const [week, scoreArray] of Object.entries(scores)) {
          scores[week] = Math.round(scoreArray.reduce((a, b) => a + b, 0) / scoreArray.length);
        }
      }
    } catch (error) {
      console.warn('Could not read quality scores:', error.message);
    }
    
    return scores;
  }

  /**
   * Run the complete analysis
   */
  analyze() {
    console.log('🔍 Analyzing workout translation status...');
    
    // Analyze all 12 weeks
    for (let week = 1; week <= 12; week++) {
      const weekData = this.analyzeWeek(week);
      this.results.weeks[`week-${week}`] = weekData;
    }

    // Calculate overall translation coverage
    this.results.summary.translationCoverage = this.results.summary.totalWorkouts > 0
      ? Math.round((this.results.summary.spanishWorkouts / this.results.summary.totalWorkouts) * 100)
      : 0;

    // Generate recommendations
    this.results.recommendations = this.generatePriorityRecommendations();

    console.log(`📊 Analysis complete:`);
    console.log(`   Total workouts: ${this.results.summary.totalWorkouts}`);
    console.log(`   English workouts: ${this.results.summary.englishWorkouts}`);
    console.log(`   Spanish workouts: ${this.results.summary.spanishWorkouts}`);
    console.log(`   Translation coverage: ${this.results.summary.translationCoverage}%`);
    console.log(`   Missing translations: ${this.results.summary.missingTranslations}`);
    console.log(`   Recommendations: ${this.results.recommendations.length}`);
  }

  /**
   * Save results to JSON file
   */
  saveResults() {
    try {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(this.results, null, 2));
      console.log(`✅ Results saved to ${OUTPUT_FILE}`);
    } catch (error) {
      console.error('❌ Error saving results:', error.message);
    }
  }

  /**
   * Generate console report
   */
  generateConsoleReport() {
    console.log('\n📋 WORKOUT TRANSLATION STATUS REPORT');
    console.log('='.repeat(50));
    
    // Summary
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Workouts: ${this.results.summary.totalWorkouts}`);
    console.log(`   Spanish Translations: ${this.results.summary.spanishWorkouts}`);
    console.log(`   Missing Translations: ${this.results.summary.missingTranslations}`);
    console.log(`   Coverage: ${this.results.summary.translationCoverage}%`);

    // Week-by-week breakdown
    console.log(`\n📅 WEEK BREAKDOWN:`);
    for (const [weekKey, weekData] of Object.entries(this.results.weeks)) {
      console.log(`   ${weekKey}: ${weekData.summary.spanishCount}/${weekData.summary.englishCount} (${weekData.summary.translationCoverage}%)`);
    }

    // Top recommendations
    console.log(`\n🎯 TOP RECOMMENDATIONS:`);
    const topRecommendations = this.results.recommendations.slice(0, 10);
    for (const rec of topRecommendations) {
      console.log(`   [${rec.priority}] Week ${rec.week} ${rec.day}: ${rec.reason}`);
    }

    console.log(`\n📄 Full report saved to: ${OUTPUT_FILE}`);
  }
}

// Main execution
if (require.main === module) {
  const tracker = new WorkoutTranslationTracker();
  
  try {
    tracker.analyze();
    tracker.saveResults();
    tracker.generateConsoleReport();
  } catch (error) {
    console.error('❌ Error running translation tracker:', error.message);
    process.exit(1);
  }
}
#!/usr/bin/env node

/**
 * YAML Template Generator
 * Creates YAML templates based on the monday.yml structure for any workout day
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class YAMLTemplateGenerator {
  constructor() {
    this.masterTemplate = null;
    this.loadMasterTemplate();
  }

  /**
   * Load the master template from monday.yml
   */
  loadMasterTemplate() {
    try {
      const mondayPath = path.join(process.cwd(), 'workout-data/week-1/monday.yml');
      const content = fs.readFileSync(mondayPath, 'utf8');
      this.masterTemplate = yaml.load(content);
      console.log('✅ Master template loaded from monday.yml');
    } catch (error) {
      console.error('❌ Failed to load master template:', error.message);
      process.exit(1);
    }
  }

  /**
   * Generate a blank template for a specific week/day
   */
  generateTemplate(week, day, dayNumber) {
    const template = {
      metadata: {
        week: week,
        week_name: `Week ${week}`,
        day: day.toLowerCase(),
        day_number: dayNumber,
        title: `Week ${week} ${day} Training`,
        subtitle: "Elite training session",
        phase: this.getPhaseFromWeek(week),
        phase_week: this.getPhaseWeek(week),
        focus: "Training focus",
        volume_target: "100%",
        intensity_target: "70-80%",
        athlete_methods: [],
        equipment_needed: [],
        navigation: {
          daily: this.generateNavigation(week, day),
          week_overview_link: "./",
          next_day: this.getNextDay(day),
          next_day_link: this.getNextDay(day)
        },
        section_headers: this.getDefaultSectionHeaders()
      }
    };

    // Add conditional sections based on day type
    if (this.isFullTrainingDay(day)) {
      template.pre_week_assessment = this.getPreWeekAssessmentTemplate();
      template.morning_protocol = this.getMorningProtocolTemplate();
      template.tennis_training = this.getTennisTrainingTemplate();
      template.movement_preparation = this.getMovementPrepTemplate();
      template.strength_training = this.getStrengthTrainingTemplate();
      template.recovery_protocol = this.getRecoveryProtocolTemplate();
    } else if (this.isRecoveryDay(day)) {
      template.recovery_protocol = this.getActiveRecoveryTemplate();
      template.mobility_work = this.getMobilityTemplate();
    }

    return template;
  }

  /**
   * Get phase information based on week number
   */
  getPhaseFromWeek(week) {
    if (week <= 4) return "Phase 1: Foundation";
    if (week <= 8) return "Phase 2: Development";
    if (week <= 12) return "Phase 3: Peak Performance";
    return "Phase 4: Competition";
  }

  getPhaseWeek(week) {
    if (week <= 4) return week;
    if (week <= 8) return week - 4;
    if (week <= 12) return week - 8;
    return week - 12;
  }

  /**
   * Generate navigation string
   */
  generateNavigation(week, day) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentIndex = days.indexOf(day.toLowerCase());
    const nextDay = days[currentIndex + 1] || 'overview';
    
    return `[📋 Week Overview](./) | [${this.capitalize(nextDay)} ➡️](${nextDay})`;
  }

  getNextDay(day) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentIndex = days.indexOf(day.toLowerCase());
    return days[currentIndex + 1] || 'overview';
  }

  /**
   * Check if it's a full training day
   */
  isFullTrainingDay(day) {
    const fullDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    return fullDays.includes(day.toLowerCase());
  }

  /**
   * Check if it's a recovery day
   */
  isRecoveryDay(day) {
    const recoveryDays = ['saturday', 'sunday'];
    return recoveryDays.includes(day.toLowerCase());
  }

  /**
   * Default section headers
   */
  getDefaultSectionHeaders() {
    return {
      movement_prep: "Movement Preparation",
      movement_method: "Dynamic Preparation Method",
      professional_assessment_header: "Professional Assessment Protocol",
      assessment_admonition: {
        type: "info",
        title: "Daily Assessment Checklist",
        content: "Complete each assessment and record your results:"
      }
    };
  }

  /**
   * Template for pre-week assessment
   */
  getPreWeekAssessmentTemplate() {
    return {
      title: "Pre-Week Assessment",
      duration: "20 minutes",
      description: "Complete assessment protocol",
      movement_screen: [],
      advanced_assessments: {
        title: "Advanced Assessment",
        exercises: []
      },
      baseline_testing: {
        power_assessment: []
      }
    };
  }

  /**
   * Template for morning protocol
   */
  getMorningProtocolTemplate() {
    return {
      yoga_breathing: {
        yoga_flow: {
          duration: "8 minutes",
          method: "Dynamic flow sequence",
          focus: "Mobility and activation",
          professional_notes: []
        },
        breathing_protocol: {
          duration: "5 minutes",
          pattern: "4-4-4-4 breathing",
          technique: "Diaphragmatic breathing",
          parasympathetic_goals: []
        }
      },
      mindful_preparation: {
        duration: "5 minutes",
        focus: "Mental preparation",
        goal: "Focus and intention setting"
      }
    };
  }

  /**
   * Template for tennis training
   */
  getTennisTrainingTemplate() {
    return {
      alcaraz_integration: {
        warm_up: {
          method: "Dynamic warm-up sequence",
          standard: "Professional movement quality",
          tracking: "Movement assessment"
        },
        rally_development: {
          standard: "Precision hitting standards",
          tracking: "Shot accuracy tracking"
        },
        directional_precision: {
          method: "Target-based training",
          standard: "Directional accuracy",
          tracking: "Success rate monitoring"
        },
        power_accuracy_integration: {
          power_range: "70-85% intensity",
          standard: "Power with control",
          tracking: "Performance metrics"
        }
      },
      elite_success_metrics: {}
    };
  }

  /**
   * Template for movement preparation
   */
  getMovementPrepTemplate() {
    return {
      exercises: [],
      targeted_correctives: []
    };
  }

  /**
   * Template for strength training
   */
  getStrengthTrainingTemplate() {
    return {
      phase_description: "Strength training phase description",
      main_exercises: [],
      phase_2_integration: {
        title: "Phase 2 Integration",
        exercises: []
      },
      advanced_tendon_conditioning: {
        title: "Advanced Tendon Conditioning",
        exercises: []
      },
      stability_power_block: {
        title: "Stability & Power Block",
        exercises: []
      }
    };
  }

  /**
   * Template for recovery protocol
   */
  getRecoveryProtocolTemplate() {
    return {
      title: "Recovery Protocol",
      sections: [],
      completion_tracking: []
    };
  }

  /**
   * Template for active recovery
   */
  getActiveRecoveryTemplate() {
    return {
      title: "Active Recovery Protocol",
      duration: "45-60 minutes",
      components: [],
      tracking: []
    };
  }

  /**
   * Template for mobility work
   */
  getMobilityTemplate() {
    return {
      title: "Mobility & Movement Quality",
      sessions: [],
      targeted_areas: []
    };
  }

  /**
   * Save template to file
   */
  saveTemplate(template, week, day) {
    const dirPath = path.join(process.cwd(), `workout-data/week-${week}`);
    
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, `${day.toLowerCase()}.yml`);
    const yamlContent = yaml.dump(template, {
      lineWidth: 120,
      noRefs: true,
      indent: 2
    });

    fs.writeFileSync(filePath, yamlContent);
    console.log(`✅ Template saved: ${filePath}`);
    
    return filePath;
  }

  /**
   * Generate templates for an entire week
   */
  generateWeekTemplates(week) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const generatedFiles = [];

    days.forEach((day, index) => {
      const dayNumber = index + 1;
      const template = this.generateTemplate(week, day, dayNumber);
      const filePath = this.saveTemplate(template, week, day);
      generatedFiles.push(filePath);
    });

    return generatedFiles;
  }

  /**
   * Utility function to capitalize first letter
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate template with analysis data integration
   */
  generateFromAnalysis(analysisData, week, day) {
    const baseTemplate = this.generateTemplate(week, day, this.getDayNumber(day));
    
    // Integrate analysis findings
    if (analysisData.extractedData) {
      // Add headers as section structure
      if (analysisData.extractedData.headers) {
        baseTemplate.content_structure = {
          headers: analysisData.extractedData.headers.map(h => ({
            level: h.groups[0].length,
            text: h.groups[1],
            anchor: h.groups[2] || null
          }))
        };
      }

      // Add detected tables
      if (analysisData.extractedData.tables) {
        baseTemplate.tables = analysisData.extractedData.tables.map((table, idx) => ({
          table_id: `table_${idx + 1}`,
          raw_content: table.fullMatch,
          requires_migration: true
        }));
      }

      // Add exercise instructions
      if (analysisData.extractedData.exerciseInstructions) {
        baseTemplate.exercise_data = {
          instructions: analysisData.extractedData.exerciseInstructions,
          requires_migration: true
        };
      }
    }

    return baseTemplate;
  }

  getDayNumber(day) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.indexOf(day.toLowerCase()) + 1;
  }
}

// Export for use in other scripts
module.exports = { YAMLTemplateGenerator };

// CLI usage
if (require.main === module) {
  const generator = new YAMLTemplateGenerator();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🏗️  YAML Template Generator');
  console.log('=' .repeat(50));

  if (command === 'week') {
    const week = parseInt(args[1]);
    if (!week || week < 1 || week > 12) {
      console.error('❌ Please provide a valid week number (1-12)');
      process.exit(1);
    }
    
    console.log(`📅 Generating templates for Week ${week}...`);
    const files = generator.generateWeekTemplates(week);
    console.log(`\n✅ Generated ${files.length} template files for Week ${week}`);
    
  } else if (command === 'day') {
    const week = parseInt(args[1]);
    const day = args[2];
    
    if (!week || !day) {
      console.error('❌ Usage: node yaml-template-generator.js day <week> <day>');
      process.exit(1);
    }
    
    console.log(`📅 Generating template for Week ${week} ${day}...`);
    const template = generator.generateTemplate(week, day, generator.getDayNumber(day));
    const filePath = generator.saveTemplate(template, week, day);
    console.log(`✅ Template generated: ${filePath}`);
    
  } else {
    console.log('📋 Usage:');
    console.log('  week <number>     Generate all 7 days for a week');
    console.log('  day <week> <day>  Generate single day template');
    console.log('\nExamples:');
    console.log('  node yaml-template-generator.js week 2');
    console.log('  node yaml-template-generator.js day 3 tuesday');
  }
}
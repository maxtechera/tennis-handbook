#!/usr/bin/env node

/**
 * MDX to YAML Migrator
 * Extracts content from existing MDX files and populates YAML templates
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { MDXAnalyzer } = require('./mdx-analyzer');
const { YAMLTemplateGenerator } = require('./yaml-template-generator');

class MDXMigrator {
  constructor() {
    this.analyzer = new MDXAnalyzer();
    this.templateGenerator = new YAMLTemplateGenerator();
    
    // Enhanced patterns for content extraction
    this.extractionPatterns = {
      // Enhanced exercise extraction
      exercises: {
        workoutCarousel: /workoutTitle="([^"]+)"\s*phases=\{(\[[^\]]+\])\}/g,
        exerciseBlocks: /##?\s+🏋️.*?Exercise\s+\d+:\s*([^{]+)(?:\{#([^}]+)\})?/g,
        setTracking: /Set\s+(\d+):\s*_+\s*lbs\s*×\s*(\d+)\s*reps/g,
        instructions: /\*\*(?:Technique|Instructions?):\*\*\s*\n((?:[-*]\s+[^\n]+\n?)+)/g,
        cues: /\*\*(?:Professional\s+)?Cues:\*\*\s*\n((?:[-*]\s+[^\n]+\n?)+)/g,
        research: /\*\*Research\s+Integration:\*\*\s*\n((?:[-*]\s+[^\n]+\n?)+)/g
      },
      
      // Tennis training patterns
      tennis: {
        alcarazIntegration: /##\s+Alcaraz.*?Integration/g,
        trainingTable: /\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|\n\|[-:]+\|[-:]+\|[-:]+\|[-:]+\|[-:]+\|\n((?:\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|\n?)+)/g,
        successMetrics: /\*\*Elite Success Metrics.*?:\*\*\s*\n((?:[-*]\s+[^\n]+\n?)+)/g
      },
      
      // Protocol patterns
      protocols: {
        morningProtocol: /##?\s+🌅.*?(?:Morning|Elite).*?Protocol/g,
        recoveryProtocol: /##?\s+.*?Recovery.*?Protocol/g,
        assessmentProtocol: /##?\s+.*?Assessment.*?Protocol/g,
        checkboxLists: /[-*]\s+\[\s*\]\s+\*\*([^*]+)\*\*:\s*(.+)/g
      },
      
      // Time-based patterns
      timing: {
        timeHeaders: /##?\s+⏰\s*(\d{1,2}:\d{2}[^)]*\))\s*[:-]\s*(.+)/g,
        timeRanges: /(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})/g,
        duration: /\*\*Duration:\*\*\s*([^\n]+)/g
      },
      
      // Navigation and metadata
      metadata: {
        dailyNavigation: /\*\*(?:Daily\s+)?Navigation:\*\*\s*(.+)/g,
        phaseInfo: /Phase\s+(\d+):\s*([^{(\n]+)/g,
        weekInfo: /Week\s+(\d+)[:\s]*([^{(\n]*)/g,
        focus: /\*\*Focus:\*\*\s*([^\n]+)/g
      },
      
      // Content structure
      structure: {
        admonitions: /:::(tip|info|note|warning|danger|success|caution)\s*([^\n]*)\n([\s\S]*?):::/g,
        details: /<details>\s*<summary>([^<]+)<\/summary>([\s\S]*?)<\/details>/g,
        tables: /\|([^|\n]+\|)+\n\|[\s-:|]+\|\n((?:\|[^|\n]*\|[^\n]*\n)+)/g
      }
    };
  }

  /**
   * Migrate a single MDX file to YAML
   */
  async migrateFile(mdxFilePath, outputPath = null) {
    console.log(`\n🔄 Migrating: ${mdxFilePath}`);
    
    // Extract week and day from file path
    const pathParts = mdxFilePath.split('/');
    const weekMatch = pathParts.find(part => part.match(/week-(\d+)/));
    const fileName = path.basename(mdxFilePath, '.mdx');
    
    if (!weekMatch) {
      throw new Error(`Cannot determine week from path: ${mdxFilePath}`);
    }
    
    const week = parseInt(weekMatch.match(/week-(\d+)/)[1]);
    const day = fileName;
    
    // Analyze the MDX file
    const analysis = this.analyzer.analyzeFile(mdxFilePath);
    const content = fs.readFileSync(mdxFilePath, 'utf8');
    
    // Generate base template
    const template = this.templateGenerator.generateFromAnalysis(analysis, week, day);
    
    // Extract and populate content
    const extractedData = this.extractAllContent(content, analysis);
    const populatedTemplate = this.populateTemplate(template, extractedData, content);
    
    // Determine output path
    if (!outputPath) {
      outputPath = path.join(process.cwd(), `workout-data/week-${week}/${day}.yml`);
    }
    
    // Ensure directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save YAML file
    const yamlContent = yaml.dump(populatedTemplate, {
      lineWidth: 120,
      noRefs: true,
      indent: 2
    });
    
    fs.writeFileSync(outputPath, yamlContent);
    
    // Generate migration report
    const report = this.generateMigrationReport(mdxFilePath, outputPath, analysis, extractedData);
    
    console.log(`✅ Migrated to: ${outputPath}`);
    return {
      inputFile: mdxFilePath,
      outputFile: outputPath,
      template: populatedTemplate,
      report: report
    };
  }

  /**
   * Extract all content from MDX using enhanced patterns
   */
  extractAllContent(content, analysis) {
    const extracted = {
      metadata: {},
      exercises: [],
      tennis_training: {},
      protocols: {},
      timing: {},
      structure: {},
      raw_sections: {}
    };

    // Extract metadata
    extracted.metadata = this.extractMetadata(content);
    
    // Extract exercises
    extracted.exercises = this.extractExercises(content);
    
    // Extract tennis training
    extracted.tennis_training = this.extractTennisTraining(content);
    
    // Extract protocols
    extracted.protocols = this.extractProtocols(content);
    
    // Extract timing information
    extracted.timing = this.extractTiming(content);
    
    // Extract structural elements
    extracted.structure = this.extractStructure(content);
    
    // Extract raw sections by headers
    extracted.raw_sections = this.extractRawSections(content);
    
    return extracted;
  }

  /**
   * Extract metadata from content
   */
  extractMetadata(content) {
    const metadata = {};
    
    // Extract navigation
    const navMatches = [...content.matchAll(this.extractionPatterns.metadata.dailyNavigation)];
    if (navMatches.length > 0) {
      metadata.navigation = { daily: navMatches[0][1].trim() };
    }
    
    // Extract phase information
    const phaseMatches = [...content.matchAll(this.extractionPatterns.metadata.phaseInfo)];
    if (phaseMatches.length > 0) {
      metadata.phase = `Phase ${phaseMatches[0][1]}: ${phaseMatches[0][2].trim()}`;
    }
    
    // Extract focus
    const focusMatches = [...content.matchAll(this.extractionPatterns.metadata.focus)];
    if (focusMatches.length > 0) {
      metadata.focus = focusMatches[0][1].trim();
    }
    
    return metadata;
  }

  /**
   * Extract exercise information
   */
  extractExercises(content) {
    const exercises = [];
    
    // Extract workout carousel data
    const carouselMatches = [...content.matchAll(this.extractionPatterns.exercises.workoutCarousel)];
    carouselMatches.forEach(match => {
      try {
        const phases = eval(match[2]); // Parse the array
        exercises.push({
          type: 'workout_carousel',
          title: match[1],
          phases: phases,
          source: 'workoutCarousel'
        });
      } catch (e) {
        console.warn('Failed to parse workout carousel phases:', match[2]);
      }
    });
    
    // Extract exercise blocks
    const exerciseMatches = [...content.matchAll(this.extractionPatterns.exercises.exerciseBlocks)];
    exerciseMatches.forEach((match, idx) => {
      const exerciseName = match[1].trim();
      const anchor = match[2];
      
      // Find associated content for this exercise
      const exerciseContent = this.extractExerciseContent(content, match.index, exerciseName);
      
      exercises.push({
        type: 'strength_exercise',
        name: exerciseName,
        anchor: anchor,
        exercise_id: `ex_${idx + 1}`,
        ...exerciseContent
      });
    });
    
    return exercises;
  }

  /**
   * Extract content for a specific exercise
   */
  extractExerciseContent(content, startIndex, exerciseName) {
    const exerciseData = {
      instructions: [],
      cues: [],
      research: [],
      sets: [],
      reps: '',
      load: '',
      rest_seconds: 0
    };
    
    // Find the section content for this exercise
    const section = this.getSectionContent(content, startIndex, 500); // Get next 500 chars
    
    // Extract instructions
    const instructionMatches = [...section.matchAll(this.extractionPatterns.exercises.instructions)];
    if (instructionMatches.length > 0) {
      exerciseData.instructions = this.parseListItems(instructionMatches[0][1]);
    }
    
    // Extract cues
    const cueMatches = [...section.matchAll(this.extractionPatterns.exercises.cues)];
    if (cueMatches.length > 0) {
      exerciseData.cues = this.parseListItems(cueMatches[0][1]);
    }
    
    // Extract research
    const researchMatches = [...section.matchAll(this.extractionPatterns.exercises.research)];
    if (researchMatches.length > 0) {
      exerciseData.research = this.parseListItems(researchMatches[0][1]);
    }
    
    // Extract set tracking
    const setMatches = [...section.matchAll(this.extractionPatterns.exercises.setTracking)];
    exerciseData.sets = setMatches.map(match => ({
      set: parseInt(match[1]),
      target_reps: parseInt(match[2])
    }));
    
    return exerciseData;
  }

  /**
   * Extract tennis training information
   */
  extractTennisTraining(content) {
    const tennis = {};
    
    // Extract training tables
    const tableMatches = [...content.matchAll(this.extractionPatterns.tennis.trainingTable)];
    if (tableMatches.length > 0) {
      tennis.training_table = this.parseTrainingTable(tableMatches[0][1]);
    }
    
    // Extract success metrics
    const metricsMatches = [...content.matchAll(this.extractionPatterns.tennis.successMetrics)];
    if (metricsMatches.length > 0) {
      tennis.success_metrics = this.parseListItems(metricsMatches[0][1]);
    }
    
    return tennis;
  }

  /**
   * Extract protocol information
   */
  extractProtocols(content) {
    const protocols = {};
    
    // Extract checkbox lists (completion tracking)
    const checkboxMatches = [...content.matchAll(this.extractionPatterns.protocols.checkboxLists)];
    if (checkboxMatches.length > 0) {
      protocols.completion_tracking = checkboxMatches.map(match => ({
        item: match[1].trim(),
        description: match[2].trim()
      }));
    }
    
    return protocols;
  }

  /**
   * Extract timing information
   */
  extractTiming(content) {
    const timing = {};
    
    // Extract time headers
    const timeHeaderMatches = [...content.matchAll(this.extractionPatterns.timing.timeHeaders)];
    timing.time_headers = timeHeaderMatches.map(match => ({
      time_range: match[1].trim(),
      description: match[2].trim()
    }));
    
    // Extract durations
    const durationMatches = [...content.matchAll(this.extractionPatterns.timing.duration)];
    timing.durations = durationMatches.map(match => match[1].trim());
    
    return timing;
  }

  /**
   * Extract structural elements
   */
  extractStructure(content) {
    const structure = {};
    
    // Extract admonitions
    const admonitionMatches = [...content.matchAll(this.extractionPatterns.structure.admonitions)];
    structure.admonitions = admonitionMatches.map(match => ({
      type: match[1],
      title: match[2].trim(),
      content: match[3].trim()
    }));
    
    // Extract details/expandable sections
    const detailMatches = [...content.matchAll(this.extractionPatterns.structure.details)];
    structure.details = detailMatches.map(match => ({
      summary: match[1].trim(),
      content: match[2].trim()
    }));
    
    // Extract tables
    const tableMatches = [...content.matchAll(this.extractionPatterns.structure.tables)];
    structure.tables = tableMatches.map(match => this.parseTable(match[0]));
    
    return structure;
  }

  /**
   * Extract raw sections by headers
   */
  extractRawSections(content) {
    const sections = {};
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];
    
    lines.forEach(line => {
      const headerMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s+\{#([^}]+)\})?$/);
      
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          sections[currentSection.slug] = {
            level: currentSection.level,
            title: currentSection.title,
            anchor: currentSection.anchor,
            content: currentContent.join('\n').trim()
          };
        }
        
        // Start new section
        currentSection = {
          level: headerMatch[1].length,
          title: headerMatch[2].trim(),
          anchor: headerMatch[3] || this.slugify(headerMatch[2]),
          slug: this.slugify(headerMatch[2])
        };
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    });
    
    // Save last section
    if (currentSection) {
      sections[currentSection.slug] = {
        level: currentSection.level,
        title: currentSection.title,
        anchor: currentSection.anchor,
        content: currentContent.join('\n').trim()
      };
    }
    
    return sections;
  }

  /**
   * Populate template with extracted data
   */
  populateTemplate(template, extractedData, originalContent) {
    // Update metadata
    if (extractedData.metadata.navigation) {
      template.metadata.navigation = { ...template.metadata.navigation, ...extractedData.metadata.navigation };
    }
    
    if (extractedData.metadata.phase) {
      template.metadata.phase = extractedData.metadata.phase;
    }
    
    if (extractedData.metadata.focus) {
      template.metadata.focus = extractedData.metadata.focus;
    }
    
    // Add extracted exercises to strength training
    if (extractedData.exercises.length > 0) {
      template.strength_training = template.strength_training || {};
      template.strength_training.main_exercises = extractedData.exercises.filter(ex => ex.type === 'strength_exercise');
      
      // Add workout carousel data
      const carouselData = extractedData.exercises.filter(ex => ex.type === 'workout_carousel');
      if (carouselData.length > 0) {
        template.workout_carousel_data = carouselData;
      }
    }
    
    // Add tennis training data
    if (Object.keys(extractedData.tennis_training).length > 0) {
      template.tennis_training = { ...template.tennis_training, ...extractedData.tennis_training };
    }
    
    // Add protocols
    if (Object.keys(extractedData.protocols).length > 0) {
      template.protocols = extractedData.protocols;
    }
    
    // Add timing information
    if (Object.keys(extractedData.timing).length > 0) {
      template.timing = extractedData.timing;
    }
    
    // Add structural elements
    if (Object.keys(extractedData.structure).length > 0) {
      template.structure = extractedData.structure;
    }
    
    // Add raw sections for manual review
    template.extracted_sections = extractedData.raw_sections;
    
    // Add migration metadata
    template._migration = {
      source_file: path.basename(originalContent),
      migrated_at: new Date().toISOString(),
      extraction_summary: {
        sections_found: Object.keys(extractedData.raw_sections).length,
        exercises_found: extractedData.exercises.length,
        tables_found: extractedData.structure.tables?.length || 0,
        admonitions_found: extractedData.structure.admonitions?.length || 0
      }
    };
    
    return template;
  }

  /**
   * Helper methods
   */
  getSectionContent(content, startIndex, length) {
    return content.substring(startIndex, startIndex + length);
  }

  parseListItems(text) {
    return text.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  parseTrainingTable(tableContent) {
    const rows = tableContent.trim().split('\n');
    return rows.map(row => {
      const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
      return cells;
    });
  }

  parseTable(tableText) {
    const lines = tableText.trim().split('\n');
    const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
    const rows = lines.slice(2).map(line => 
      line.split('|').map(cell => cell.trim()).filter(cell => cell)
    );
    
    return {
      headers,
      rows,
      rowCount: rows.length,
      columnCount: headers.length
    };
  }

  slugify(text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  /**
   * Generate migration report
   */
  generateMigrationReport(inputFile, outputFile, analysis, extractedData) {
    return {
      input_file: inputFile,
      output_file: outputFile,
      migration_timestamp: new Date().toISOString(),
      analysis_summary: {
        total_content_elements: Object.values(analysis.contentTypes).reduce((a, b) => a + b, 0),
        complexity: this.analyzer.assessComplexity(analysis.contentTypes)
      },
      extracted_summary: {
        sections: Object.keys(extractedData.raw_sections).length,
        exercises: extractedData.exercises.length,
        tables: extractedData.structure.tables?.length || 0,
        admonitions: extractedData.structure.admonitions?.length || 0,
        protocols: Object.keys(extractedData.protocols).length
      },
      recommendations: this.generateRecommendations(extractedData)
    };
  }

  generateRecommendations(extractedData) {
    const recommendations = [];
    
    if (extractedData.exercises.length === 0) {
      recommendations.push("No exercises detected - manual review recommended");
    }
    
    if (Object.keys(extractedData.raw_sections).length > 10) {
      recommendations.push("High section count - consider section consolidation");
    }
    
    if (extractedData.structure.tables?.length > 5) {
      recommendations.push("Multiple tables detected - verify data structure");
    }
    
    return recommendations;
  }

  /**
   * Migrate entire week
   */
  async migrateWeek(week) {
    const weekDir = path.join(process.cwd(), `docs/workouts/week-${week}`);
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const results = [];
    
    for (const day of days) {
      const mdxPath = path.join(weekDir, `${day}.mdx`);
      if (fs.existsSync(mdxPath)) {
        try {
          const result = await this.migrateFile(mdxPath);
          results.push(result);
        } catch (error) {
          console.error(`❌ Failed to migrate ${day}:`, error.message);
          results.push({ error: error.message, file: mdxPath });
        }
      }
    }
    
    return results;
  }
}

// Export for use in other scripts
module.exports = { MDXMigrator };

// CLI usage
if (require.main === module) {
  const migrator = new MDXMigrator();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🔄 MDX to YAML Migrator');
  console.log('=' .repeat(50));

  if (command === 'file') {
    const filePath = args[1];
    if (!filePath || !fs.existsSync(filePath)) {
      console.error('❌ Please provide a valid MDX file path');
      process.exit(1);
    }
    
    migrator.migrateFile(filePath)
      .then(result => {
        console.log('\n📊 Migration completed successfully!');
        console.log('📁 Output file:', result.outputFile);
      })
      .catch(error => {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
      });
      
  } else if (command === 'week') {
    const week = parseInt(args[1]);
    if (!week || week < 1 || week > 12) {
      console.error('❌ Please provide a valid week number (1-12)');
      process.exit(1);
    }
    
    migrator.migrateWeek(week)
      .then(results => {
        const successful = results.filter(r => !r.error);
        const failed = results.filter(r => r.error);
        
        console.log(`\n📊 Week ${week} Migration Results:`);
        console.log(`✅ Successful: ${successful.length}`);
        console.log(`❌ Failed: ${failed.length}`);
        
        if (failed.length > 0) {
          console.log('\n❌ Failed migrations:');
          failed.forEach(f => console.log(`  ${f.file}: ${f.error}`));
        }
      })
      .catch(error => {
        console.error('❌ Week migration failed:', error.message);
        process.exit(1);
      });
      
  } else {
    console.log('📋 Usage:');
    console.log('  file <path>    Migrate single MDX file');
    console.log('  week <number>  Migrate entire week');
    console.log('\nExamples:');
    console.log('  node mdx-migrator.js file docs/workouts/week-2/tuesday.mdx');
    console.log('  node mdx-migrator.js week 2');
  }
}
#!/usr/bin/env node
/**
 * Workout Translation Helper
 * 
 * This script provides utilities for managing workout YAML translations.
 * It can extract translatable strings, generate templates, and validate translations.
 * 
 * Usage: 
 *   node scripts/workout-translation-helper.js extract <week> <day>
 *   node scripts/workout-translation-helper.js generate-template <week> <day>
 *   node scripts/workout-translation-helper.js validate <week> <day>
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class WorkoutTranslationHelper {
  constructor() {
    this.glossary = this.loadGlossary();
  }

  /**
   * Load translation glossary
   */
  loadGlossary() {
    const glossaryPath = '_docs/WORKOUT_TRANSLATION_GLOSSARY.md';
    const glossary = {};
    
    try {
      if (fs.existsSync(glossaryPath)) {
        const content = fs.readFileSync(glossaryPath, 'utf8');
        
        // Parse glossary from markdown
        const lines = content.split('\n');
        for (const line of lines) {
          const match = line.match(/^\s*-\s*(.+?)\s*→\s*(.+?)\s*$/);
          if (match) {
            glossary[match[1].trim()] = match[2].trim();
          }
        }
      }
    } catch (error) {
      console.warn('Could not load glossary:', error.message);
    }
    
    return glossary;
  }

  /**
   * Extract all translatable strings from a workout YAML file
   */
  extractTranslatableStrings(weekNumber, day) {
    const filePath = path.join('workout-data', `week-${weekNumber}`, `${day}.yml`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Workout file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const workoutData = yaml.load(content);

    const extractedStrings = {
      metadata: {},
      translatable: [],
      context: {}
    };

    // Extract metadata
    if (workoutData.metadata) {
      extractedStrings.metadata = {
        week: weekNumber,
        day: day,
        title: workoutData.metadata.title,
        subtitle: workoutData.metadata.subtitle,
        phase: workoutData.metadata.phase
      };
    }

    // Extract translatable strings with context
    this.extractFromObject(workoutData, extractedStrings.translatable, extractedStrings.context);

    return extractedStrings;
  }

  /**
   * Recursively extract translatable strings from object
   */
  extractFromObject(obj, strings, context, path = '') {
    const translatableFields = [
      'title', 'subtitle', 'name', 'description', 'instructions', 'protocol',
      'tennis_application', 'implementation', 'notes', 'focus', 'execution',
      'method', 'context', 'focus_areas'
    ];

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string' && translatableFields.includes(key)) {
        strings.push({
          key: currentPath,
          original: value,
          translation: this.getAutoTranslation(value),
          context: this.getFieldContext(currentPath),
          priority: this.getTranslationPriority(key)
        });
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string' && translatableFields.includes(key)) {
            strings.push({
              key: `${currentPath}[${index}]`,
              original: item,
              translation: this.getAutoTranslation(item),
              context: this.getFieldContext(currentPath),
              priority: this.getTranslationPriority(key)
            });
          } else if (typeof item === 'object' && item !== null) {
            this.extractFromObject(item, strings, context, `${currentPath}[${index}]`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        this.extractFromObject(value, strings, context, currentPath);
      }
    }
  }

  /**
   * Get automatic translation from glossary
   */
  getAutoTranslation(text) {
    // Try exact match first
    if (this.glossary[text]) {
      return this.glossary[text];
    }

    // Try partial matches for common terms
    let translation = text;
    for (const [en, es] of Object.entries(this.glossary)) {
      if (text.includes(en)) {
        translation = translation.replace(new RegExp(en, 'gi'), es);
      }
    }

    return translation !== text ? translation : '';
  }

  /**
   * Get context for a field
   */
  getFieldContext(path) {
    const contexts = {
      'metadata.title': 'Workout main title',
      'metadata.subtitle': 'Workout subtitle/description',
      'metadata.focus_areas': 'Main training focus areas',
      'exercises.name': 'Exercise name',
      'exercises.instructions': 'Exercise instructions',
      'exercises.protocol': 'Exercise protocol',
      'exercises.tennis_application': 'Tennis-specific application',
      'assessments.title': 'Assessment title',
      'assessments.description': 'Assessment description',
      'elite_methods.name': 'Elite training method name',
      'elite_methods.context': 'Elite method context'
    };

    // Find matching context
    for (const [pattern, desc] of Object.entries(contexts)) {
      if (path.includes(pattern)) {
        return desc;
      }
    }

    return 'General translation';
  }

  /**
   * Get translation priority
   */
  getTranslationPriority(field) {
    const priorities = {
      'title': 'HIGH',
      'subtitle': 'HIGH',
      'name': 'HIGH',
      'description': 'MEDIUM',
      'instructions': 'HIGH',
      'protocol': 'MEDIUM',
      'tennis_application': 'HIGH',
      'notes': 'LOW',
      'focus': 'MEDIUM',
      'execution': 'MEDIUM',
      'method': 'MEDIUM',
      'context': 'LOW'
    };

    return priorities[field] || 'LOW';
  }

  /**
   * Generate translation template
   */
  generateTranslationTemplate(weekNumber, day) {
    const extracted = this.extractTranslatableStrings(weekNumber, day);
    
    const template = {
      meta: {
        sourceFile: `workout-data/week-${weekNumber}/${day}.yml`,
        targetFile: `workout-data/week-${weekNumber}/${day}.es.yml`,
        extractedAt: new Date().toISOString(),
        totalStrings: extracted.translatable.length,
        highPriority: extracted.translatable.filter(s => s.priority === 'HIGH').length,
        mediumPriority: extracted.translatable.filter(s => s.priority === 'MEDIUM').length,
        lowPriority: extracted.translatable.filter(s => s.priority === 'LOW').length
      },
      metadata: extracted.metadata,
      strings: extracted.translatable,
      instructions: [
        '1. Translate all strings marked as HIGH priority first',
        '2. Use the glossary for consistent terminology',
        '3. Keep all technical values unchanged',
        '4. Maintain YAML structure',
        '5. Test the translation after completion'
      ]
    };

    return template;
  }

  /**
   * Create translated YAML file
   */
  createTranslatedFile(weekNumber, day, translations) {
    const originalPath = path.join('workout-data', `week-${weekNumber}`, `${day}.yml`);
    const translatedPath = path.join('workout-data', `week-${weekNumber}`, `${day}.es.yml`);

    if (!fs.existsSync(originalPath)) {
      throw new Error(`Original file not found: ${originalPath}`);
    }

    const originalContent = fs.readFileSync(originalPath, 'utf8');
    const originalData = yaml.load(originalContent);

    // Apply translations
    const translatedData = this.applyTranslations(originalData, translations);

    // Write translated file
    const translatedYaml = yaml.dump(translatedData, {
      indent: 2,
      lineWidth: 100,
      noRefs: true,
      sortKeys: false
    });

    fs.writeFileSync(translatedPath, translatedYaml);
    console.log(`✅ Translated file created: ${translatedPath}`);

    return translatedPath;
  }

  /**
   * Apply translations to data object
   */
  applyTranslations(data, translations) {
    const translatedData = JSON.parse(JSON.stringify(data)); // Deep clone

    for (const translation of translations) {
      if (translation.translation) {
        this.setNestedValue(translatedData, translation.key, translation.translation);
      }
    }

    return translatedData;
  }

  /**
   * Set nested value in object using dot notation
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      // Handle array indices
      const arrayMatch = key.match(/^(.+?)\[(\d+)\]$/);
      if (arrayMatch) {
        const arrayKey = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        
        if (!current[arrayKey]) current[arrayKey] = [];
        if (!current[arrayKey][index]) current[arrayKey][index] = {};
        current = current[arrayKey][index];
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }

    const lastKey = keys[keys.length - 1];
    const arrayMatch = lastKey.match(/^(.+?)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      const index = parseInt(arrayMatch[2]);
      
      if (!current[arrayKey]) current[arrayKey] = [];
      current[arrayKey][index] = value;
    } else {
      current[lastKey] = value;
    }
  }

  /**
   * Validate translation
   */
  validateTranslation(weekNumber, day) {
    const originalPath = path.join('workout-data', `week-${weekNumber}`, `${day}.yml`);
    const translatedPath = path.join('workout-data', `week-${weekNumber}`, `${day}.es.yml`);

    const validation = {
      originalExists: fs.existsSync(originalPath),
      translatedExists: fs.existsSync(translatedPath),
      structureValid: false,
      missingTranslations: [],
      validationErrors: []
    };

    if (!validation.originalExists) {
      validation.validationErrors.push('Original file not found');
      return validation;
    }

    if (!validation.translatedExists) {
      validation.validationErrors.push('Translated file not found');
      return validation;
    }

    try {
      const originalData = yaml.load(fs.readFileSync(originalPath, 'utf8'));
      const translatedData = yaml.load(fs.readFileSync(translatedPath, 'utf8'));

      // Check structure
      validation.structureValid = this.compareStructure(originalData, translatedData);

      // Check for missing translations
      const extracted = this.extractTranslatableStrings(weekNumber, day);
      for (const string of extracted.translatable) {
        if (string.priority === 'HIGH' && !this.hasTranslation(translatedData, string.key)) {
          validation.missingTranslations.push(string.key);
        }
      }

    } catch (error) {
      validation.validationErrors.push(`YAML parsing error: ${error.message}`);
    }

    return validation;
  }

  /**
   * Compare structure of two objects
   */
  compareStructure(obj1, obj2, path = '') {
    for (const key of Object.keys(obj1)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in obj2)) {
        console.warn(`Missing key in translation: ${currentPath}`);
        return false;
      }

      if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        if (!this.compareStructure(obj1[key], obj2[key], currentPath)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check if translation exists for a key
   */
  hasTranslation(data, key) {
    try {
      const value = this.getNestedValue(data, key);
      return value !== undefined && value !== null && value !== '';
    } catch {
      return false;
    }
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      const arrayMatch = key.match(/^(.+?)\[(\d+)\]$/);
      if (arrayMatch) {
        const arrayKey = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        current = current[arrayKey]?.[index];
      } else {
        current = current[key];
      }

      if (current === undefined || current === null) {
        return undefined;
      }
    }

    return current;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const weekNumber = parseInt(args[1]);
  const day = args[2];

  const helper = new WorkoutTranslationHelper();

  try {
    switch (command) {
      case 'extract':
        if (!weekNumber || !day) {
          console.error('Usage: extract <week> <day>');
          process.exit(1);
        }
        const extracted = helper.extractTranslatableStrings(weekNumber, day);
        console.log(JSON.stringify(extracted, null, 2));
        break;

      case 'generate-template':
        if (!weekNumber || !day) {
          console.error('Usage: generate-template <week> <day>');
          process.exit(1);
        }
        const template = helper.generateTranslationTemplate(weekNumber, day);
        const templateFile = `translation-template-week${weekNumber}-${day}.json`;
        fs.writeFileSync(templateFile, JSON.stringify(template, null, 2));
        console.log(`✅ Template generated: ${templateFile}`);
        break;

      case 'validate':
        if (!weekNumber || !day) {
          console.error('Usage: validate <week> <day>');
          process.exit(1);
        }
        const validation = helper.validateTranslation(weekNumber, day);
        console.log(JSON.stringify(validation, null, 2));
        break;

      default:
        console.log('Available commands:');
        console.log('  extract <week> <day>          - Extract translatable strings');
        console.log('  generate-template <week> <day> - Generate translation template');
        console.log('  validate <week> <day>         - Validate translation');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = WorkoutTranslationHelper;
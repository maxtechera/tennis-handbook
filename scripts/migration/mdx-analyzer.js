#!/usr/bin/env node

/**
 * MDX Content Analyzer
 * Analyzes existing MDX files to identify all content types and patterns
 */

const fs = require('fs');
const path = require('path');

class MDXAnalyzer {
  constructor() {
    this.patterns = {
      // Headers and sections
      headers: /^(#{1,6})\s+(.+?)(?:\s+\{#([^}]+)\})?$/gm,
      
      // Admonition boxes
      admonitions: /:::(tip|info|note|warning|danger|success|caution)\s*([^\n]*)\n([\s\S]*?):::/g,
      
      // Tables
      tables: /\|([^|\n]+\|)+\n\|[\s-:|]+\|\n(\|[^|\n]*\|[^\n]*\n)+/g,
      
      // Lists (ordered and unordered)
      lists: /^(\s*)([-*+]|\d+\.)\s+(.+)$/gm,
      
      // Checkboxes
      checkboxes: /- \[ \]\s*\*\*([^*]+)\*\*:\s*(.+)/g,
      
      // Details/Expandable sections
      details: /<details>\s*<summary>([^<]+)<\/summary>([\s\S]*?)<\/details>/g,
      
      // Component imports and usage
      imports: /^import\s+([^}]+from\s+)?['"`]([^'"`]+)['"`];?$/gm,
      componentUsage: /<([A-Z][a-zA-Z0-9]*)[^>]*>/g,
      
      // WorkoutCarousel data
      workoutCarousel: /workoutTitle="([^"]+)"\s*phases=\{(\[[^\]]+\])\}/g,
      
      // Exercise instructions and cues
      exerciseInstructions: /instructions:\s*\[([\s\S]*?)\]/g,
      exerciseCues: /cues:\s*\[([\s\S]*?)\]/g,
      
      // Video URLs
      videoUrls: /videoUrl:\s*['"`]([^'"`]+)['"`]/g,
      
      // Metadata patterns
      setsReps: /(\d+)×(\d+(?:\s+(?:per\s+)?(?:leg|side|arm))?)/g,
      loadPercent: /(\d+)%\s*(?:1RM|BW)/g,
      timeRanges: /(\d{1,2}):(\d{2})[–-](\d{1,2}):(\d{2})/g,
      
      // Navigation patterns
      navigation: /\*\*(?:Daily\s+)?Navigation[^:]*:\*\*\s*(.+)/g,
      
      // Emphasis and styling
      bold: /\*\*([^*]+)\*\*/g,
      italic: /_([^_]+)_/g,
      code: /`([^`]+)`/g,
    };
  }

  /**
   * Analyze a single MDX file
   */
  analyzeFile(filePath) {
    console.log(`\n📄 Analyzing: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const analysis = {
      filePath,
      fileName: path.basename(filePath),
      contentTypes: {},
      extractedData: {},
      statistics: {
        totalLines: content.split('\n').length,
        contentLines: content.split('\n').filter(line => line.trim()).length
      }
    };

    // Analyze each pattern type
    Object.entries(this.patterns).forEach(([type, pattern]) => {
      const matches = [...content.matchAll(pattern)];
      if (matches.length > 0) {
        analysis.contentTypes[type] = matches.length;
        analysis.extractedData[type] = matches.map(match => ({
          fullMatch: match[0],
          groups: match.slice(1),
          index: match.index
        }));
      }
    });

    return analysis;
  }

  /**
   * Analyze all MDX files in a directory
   */
  analyzeDirectory(dirPath) {
    console.log(`🔍 Analyzing MDX files in: ${dirPath}`);
    
    const results = {
      directory: dirPath,
      files: [],
      summary: {
        totalFiles: 0,
        contentTypes: {},
        commonPatterns: {},
        migrationComplexity: 'simple'
      }
    };

    const files = this.findMDXFiles(dirPath);
    results.summary.totalFiles = files.length;

    files.forEach(file => {
      const analysis = this.analyzeFile(file);
      results.files.push(analysis);

      // Aggregate content types
      Object.entries(analysis.contentTypes).forEach(([type, count]) => {
        results.summary.contentTypes[type] = (results.summary.contentTypes[type] || 0) + count;
      });
    });

    // Determine migration complexity
    results.summary.migrationComplexity = this.assessComplexity(results.summary.contentTypes);

    return results;
  }

  /**
   * Find all MDX files recursively
   */
  findMDXFiles(dirPath) {
    const files = [];
    
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findMDXFiles(itemPath));
      } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
        files.push(itemPath);
      }
    });
    
    return files;
  }

  /**
   * Assess migration complexity based on content types
   */
  assessComplexity(contentTypes) {
    const complexIndicators = ['workoutCarousel', 'componentUsage', 'details', 'admonitions'];
    const mediumIndicators = ['tables', 'checkboxes', 'exerciseInstructions'];
    
    const hasComplex = complexIndicators.some(indicator => contentTypes[indicator] > 0);
    const hasMedium = mediumIndicators.some(indicator => contentTypes[indicator] > 5);
    
    if (hasComplex) return 'complex';
    if (hasMedium) return 'medium';
    return 'simple';
  }

  /**
   * Generate migration report
   */
  generateReport(analysis) {
    console.log('\n📊 MIGRATION ANALYSIS REPORT');
    console.log('=' .repeat(50));
    
    console.log(`\n📁 Directory: ${analysis.directory}`);
    console.log(`📄 Total Files: ${analysis.summary.totalFiles}`);
    console.log(`🎯 Migration Complexity: ${analysis.summary.migrationComplexity.toUpperCase()}`);
    
    console.log('\n📋 Content Types Found:');
    Object.entries(analysis.summary.contentTypes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  • ${type}: ${count} instances`);
      });

    console.log('\n📄 Files Requiring Migration:');
    analysis.files.forEach(file => {
      const complexity = this.assessComplexity(file.contentTypes);
      const contentCount = Object.values(file.contentTypes).reduce((a, b) => a + b, 0);
      console.log(`  • ${file.fileName}: ${contentCount} content elements (${complexity})`);
    });

    return analysis;
  }

  /**
   * Extract structured data for YAML generation
   */
  extractStructuredData(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const structured = {
      metadata: {},
      sections: [],
      exercises: [],
      tables: [],
      navigation: {},
      admonitions: [],
      components: []
    };

    // Extract metadata from headers
    const headerMatches = [...content.matchAll(this.patterns.headers)];
    headerMatches.forEach(match => {
      const level = match[1].length;
      const text = match[2].trim();
      const anchor = match[3];
      
      if (level === 1) {
        structured.metadata.title = text;
      } else {
        structured.sections.push({
          level,
          text,
          anchor,
          content: this.extractSectionContent(content, match.index)
        });
      }
    });

    // Extract admonitions
    const admonitionMatches = [...content.matchAll(this.patterns.admonitions)];
    structured.admonitions = admonitionMatches.map(match => ({
      type: match[1],
      title: match[2].trim(),
      content: match[3].trim()
    }));

    // Extract tables
    const tableMatches = [...content.matchAll(this.patterns.tables)];
    structured.tables = tableMatches.map(match => this.parseTable(match[0]));

    // Extract navigation
    const navMatches = [...content.matchAll(this.patterns.navigation)];
    if (navMatches.length > 0) {
      structured.navigation.daily = navMatches[0][1].trim();
    }

    return structured;
  }

  /**
   * Extract content for a specific section
   */
  extractSectionContent(fullContent, startIndex) {
    const lines = fullContent.split('\n');
    const startLine = fullContent.substring(0, startIndex).split('\n').length - 1;
    
    // Find the next header of equal or higher level
    let endLine = lines.length;
    for (let i = startLine + 1; i < lines.length; i++) {
      if (lines[i].match(/^#{1,6}\s/)) {
        endLine = i;
        break;
      }
    }
    
    return lines.slice(startLine + 1, endLine).join('\n').trim();
  }

  /**
   * Parse table into structured format
   */
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
}

// Export for use in other scripts
module.exports = { MDXAnalyzer };

// CLI usage
if (require.main === module) {
  const analyzer = new MDXAnalyzer();
  const targetDir = process.argv[2] || './docs/workouts';
  
  console.log('🔍 MDX Migration Analysis Tool');
  console.log('=' .repeat(50));
  
  const analysis = analyzer.analyzeDirectory(targetDir);
  analyzer.generateReport(analysis);
  
  // Save detailed report
  const reportPath = './migration-analysis.json';
  fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);
}
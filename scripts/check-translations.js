#!/usr/bin/env node
/**
 * Script de Verificación de Estado de Traducciones
 * 
 * Este script compara los archivos en inglés con sus traducciones al español
 * para identificar qué archivos necesitan ser traducidos o actualizados.
 * 
 * Uso: node scripts/check-translations.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración de directorios
const ENGLISH_DIR = 'docs';
const SPANISH_DIR = 'i18n/es/docusaurus-plugin-content-docs/current';
const IGNORE_PATTERNS = ['.DS_Store', 'node_modules', '.git'];
const SUPPORTED_EXTENSIONS = ['.md', '.mdx'];

class TranslationChecker {
  constructor() {
    this.results = {
      missing: [],
      outdated: [],
      upToDate: [],
      englishOnly: []
    };
  }

  /**
   * Obtiene la fecha de última modificación de un archivo usando Git
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
      // Fallback a fecha del archivo del sistema
    }
    
    try {
      return fs.statSync(filePath).mtime;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica si un archivo debe ser ignorado
   */
  shouldIgnore(filePath) {
    return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
  }

  /**
   * Verifica si un archivo es soportado para traducción
   */
  isSupportedFile(filePath) {
    return SUPPORTED_EXTENSIONS.some(ext => filePath.endsWith(ext));
  }

  /**
   * Obtiene la ruta correspondiente en español para un archivo en inglés
   */
  getSpanishPath(englishPath) {
    const relativePath = path.relative(ENGLISH_DIR, englishPath);
    return path.join(SPANISH_DIR, relativePath);
  }

  /**
   * Recorre recursivamente un directorio y obtiene todos los archivos
   */
  getAllFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const dirFiles = fs.readdirSync(dir);
    
    for (const file of dirFiles) {
      const filePath = path.join(dir, file);
      
      if (this.shouldIgnore(filePath)) continue;
      
      if (fs.statSync(filePath).isDirectory()) {
        this.getAllFiles(filePath, files);
      } else if (this.isSupportedFile(filePath)) {
        files.push(filePath);
      }
    }
    
    return files;
  }

  /**
   * Verifica el estado de todas las traducciones
   */
  checkTranslations() {
    console.log('🔍 Verificando estado de traducciones...\n');
    
    const englishFiles = this.getAllFiles(ENGLISH_DIR);
    
    for (const englishFile of englishFiles) {
      const spanishFile = this.getSpanishPath(englishFile);
      const relativePath = path.relative(ENGLISH_DIR, englishFile);
      
      if (!fs.existsSync(spanishFile)) {
        this.results.missing.push({
          path: relativePath,
          englishFile,
          spanishFile,
          status: 'FALTA'
        });
      } else {
        const englishDate = this.getFileLastModified(englishFile);
        const spanishDate = this.getFileLastModified(spanishFile);
        
        if (englishDate && spanishDate) {
          if (englishDate > spanishDate) {
            this.results.outdated.push({
              path: relativePath,
              englishFile,
              spanishFile,
              englishDate,
              spanishDate,
              status: 'DESACTUALIZADO'
            });
          } else {
            this.results.upToDate.push({
              path: relativePath,
              status: 'ACTUALIZADO'
            });
          }
        } else {
          this.results.upToDate.push({
            path: relativePath,
            status: 'ACTUALIZADO (sin fechas)'
          });
        }
      }
    }
  }

  /**
   * Genera reporte detallado
   */
  generateReport() {
    console.log('📋 REPORTE DE ESTADO DE TRADUCCIONES');
    console.log('=====================================\n');
    
    // Resumen
    console.log('📊 RESUMEN:');
    console.log(`✅ Actualizados: ${this.results.upToDate.length}`);
    console.log(`⚠️  Desactualizados: ${this.results.outdated.length}`);
    console.log(`❌ Faltantes: ${this.results.missing.length}`);
    console.log(`📄 Total archivos en inglés: ${this.results.upToDate.length + this.results.outdated.length + this.results.missing.length}\n`);
    
    // Archivos faltantes
    if (this.results.missing.length > 0) {
      console.log('❌ ARCHIVOS QUE NECESITAN TRADUCCIÓN:');
      console.log('=====================================');
      this.results.missing.forEach(file => {
        console.log(`📄 ${file.path}`);
      });
      console.log('');
    }
    
    // Archivos desactualizados
    if (this.results.outdated.length > 0) {
      console.log('⚠️  ARCHIVOS QUE NECESITAN ACTUALIZACIÓN:');
      console.log('==========================================');
      this.results.outdated.forEach(file => {
        const daysDiff = Math.ceil((file.englishDate - file.spanishDate) / (1000 * 60 * 60 * 24));
        console.log(`📄 ${file.path}`);
        console.log(`   📅 Inglés: ${file.englishDate.toLocaleDateString()}`);
        console.log(`   📅 Español: ${file.spanishDate.toLocaleDateString()}`);
        console.log(`   ⏰ Diferencia: ${daysDiff} días\n`);
      });
    }
    
    if (this.results.missing.length === 0 && this.results.outdated.length === 0) {
      console.log('🎉 ¡Todas las traducciones están actualizadas!');
    }
  }

  /**
   * Genera archivo JSON con resultados para uso programático
   */
  generateJSONReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        upToDate: this.results.upToDate.length,
        outdated: this.results.outdated.length,
        missing: this.results.missing.length,
        total: this.results.upToDate.length + this.results.outdated.length + this.results.missing.length
      },
      details: this.results
    };
    
    const reportPath = 'translation-status.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Reporte JSON guardado en: ${reportPath}\n`);
    
    return report;
  }

  /**
   * Genera comandos para actualizar traducciones
   */
  generateUpdateCommands() {
    const needsWork = [...this.results.missing, ...this.results.outdated];
    
    if (needsWork.length === 0) {
      return;
    }
    
    console.log('🛠️  COMANDOS PARA ACTUALIZAR:');
    console.log('=============================');
    console.log('// Copia estos comandos para usar con Claude Code\n');
    
    needsWork.forEach(file => {
      if (file.status === 'FALTA') {
        console.log(`// Traducir archivo faltante: ${file.path}`);
        console.log(`// mkdir -p "$(dirname "${file.spanishFile}")"`);
        console.log(`// Leer ${file.englishFile} y crear traducción en ${file.spanishFile}\n`);
      } else {
        console.log(`// Actualizar traducción desactualizada: ${file.path}`);
        console.log(`// Comparar ${file.englishFile} con ${file.spanishFile} y actualizar\n`);
      }
    });
  }

  /**
   * Ejecuta la verificación completa
   */
  run() {
    this.checkTranslations();
    this.generateReport();
    this.generateJSONReport();
    this.generateUpdateCommands();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const checker = new TranslationChecker();
  checker.run();
}

module.exports = TranslationChecker;
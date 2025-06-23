#!/usr/bin/env node
/**
 * Script de Ayuda para Traducción de Archivos Individuales
 * 
 * Este script ayuda a traducir archivos específicos y mantiene
 * un registro de los cambios realizados.
 * 
 * Uso: node scripts/translate-file.js <archivo-relativo>
 * Ejemplo: node scripts/translate-file.js workouts/week-1/monday.mdx
 */

const fs = require('fs');
const path = require('path');

const ENGLISH_DIR = 'docs';
const SPANISH_DIR = 'i18n/es/docusaurus-plugin-content-docs/current';

class FileTranslator {
  constructor(relativePath) {
    this.relativePath = relativePath;
    this.englishFile = path.join(ENGLISH_DIR, relativePath);
    this.spanishFile = path.join(SPANISH_DIR, relativePath);
  }

  /**
   * Verifica si el archivo existe y es válido para traducción
   */
  validateFiles() {
    if (!fs.existsSync(this.englishFile)) {
      throw new Error(`❌ Archivo en inglés no encontrado: ${this.englishFile}`);
    }

    if (!this.englishFile.match(/\.(md|mdx)$/)) {
      throw new Error(`❌ Tipo de archivo no soportado: ${this.englishFile}`);
    }

    return true;
  }

  /**
   * Crea el directorio español si no existe
   */
  ensureSpanishDir() {
    const spanishDir = path.dirname(this.spanishFile);
    if (!fs.existsSync(spanishDir)) {
      fs.mkdirSync(spanishDir, { recursive: true });
      console.log(`📁 Directorio creado: ${spanishDir}`);
    }
  }

  /**
   * Lee el contenido del archivo en inglés
   */
  readEnglishContent() {
    return fs.readFileSync(this.englishFile, 'utf8');
  }

  /**
   * Lee el contenido del archivo en español si existe
   */
  readSpanishContent() {
    if (fs.existsSync(this.spanishFile)) {
      return fs.readFileSync(this.spanishFile, 'utf8');
    }
    return null;
  }

  /**
   * Muestra información del archivo para Claude Code
   */
  showFileInfo() {
    console.log('📋 INFORMACIÓN DEL ARCHIVO');
    console.log('===========================');
    console.log(`📄 Archivo: ${this.relativePath}`);
    console.log(`🇺🇸 Inglés: ${this.englishFile}`);
    console.log(`🇪🇸 Español: ${this.spanishFile}`);
    
    const englishExists = fs.existsSync(this.englishFile);
    const spanishExists = fs.existsSync(this.spanishFile);
    
    console.log(`✅ Inglés existe: ${englishExists ? 'Sí' : 'No'}`);
    console.log(`✅ Español existe: ${spanishExists ? 'Sí' : 'No'}`);
    
    if (spanishExists) {
      const englishDate = fs.statSync(this.englishFile).mtime;
      const spanishDate = fs.statSync(this.spanishFile).mtime;
      const isOutdated = englishDate > spanishDate;
      
      console.log(`⏰ Estado: ${isOutdated ? 'DESACTUALIZADO' : 'ACTUALIZADO'}`);
      console.log(`📅 Inglés modificado: ${englishDate.toLocaleString()}`);
      console.log(`📅 Español modificado: ${spanishDate.toLocaleString()}`);
    } else {
      console.log(`⚠️  Estado: FALTA TRADUCCIÓN`);
    }
    
    console.log('');
  }

  /**
   * Genera instrucciones para Claude Code
   */
  generateClaudeInstructions() {
    const spanishExists = fs.existsSync(this.spanishFile);
    
    console.log('🤖 INSTRUCCIONES PARA CLAUDE CODE');
    console.log('===================================');
    
    if (spanishExists) {
      console.log('📝 ARCHIVO YA EXISTE - Actualizar traducción:');
      console.log('');
      console.log('1. Lee el archivo en inglés:');
      console.log(`   Read("${this.englishFile}")`);
      console.log('');
      console.log('2. Lee la traducción actual:');
      console.log(`   Read("${this.spanishFile}")`);
      console.log('');
      console.log('3. Compara y actualiza la traducción manteniendo:');
      console.log('   - Todos los componentes React');
      console.log('   - Todas las tablas y estructura MDX');
      console.log('   - Referencias de video');
      console.log('   - Terminología técnica consistente');
      console.log('');
    } else {
      console.log('📝 ARCHIVO NUEVO - Crear traducción:');
      console.log('');
      console.log('1. Lee el archivo en inglés:');
      console.log(`   Read("${this.englishFile}")`);
      console.log('');
      console.log('2. Crea la traducción en español:');
      console.log(`   Write("${this.spanishFile}", [contenido-traducido])`);
      console.log('');
      console.log('3. Asegúrate de mantener:');
      console.log('   - Todos los componentes React (WorkoutNav, etc.)');
      console.log('   - Todas las tablas y estructura MDX');
      console.log('   - Referencias de video de Jeff Nippard');
      console.log('   - Terminología técnica de tenis y fitness');
      console.log('   - Frontmatter (sidebar_position, etc.)');
      console.log('');
    }
    
    console.log('4. Verifica con build:');
    console.log('   Bash("pnpm build")');
    console.log('');
  }

  /**
   * Ejecuta el análisis del archivo
   */
  run() {
    try {
      this.validateFiles();
      this.ensureSpanishDir();
      this.showFileInfo();
      this.generateClaudeInstructions();
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
}

// Obtener argumentos de línea de comandos
const relativePath = process.argv[2];

if (!relativePath) {
  console.log('❌ Error: Debes proporcionar la ruta relativa del archivo');
  console.log('');
  console.log('Uso: node scripts/translate-file.js <archivo-relativo>');
  console.log('Ejemplo: node scripts/translate-file.js workouts/week-1/monday.mdx');
  process.exit(1);
}

// Ejecutar
const translator = new FileTranslator(relativePath);
translator.run();
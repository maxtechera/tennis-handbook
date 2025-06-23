#!/usr/bin/env node
/**
 * Script Rápido de Verificación para Claude Code
 * 
 * Este script genera un reporte resumido optimizado para copiar y pegar
 * en conversaciones con Claude Code.
 * 
 * Uso: node scripts/quick-translation-check.js
 */

const TranslationChecker = require('./check-translations.js');

class QuickChecker extends TranslationChecker {
  
  /**
   * Genera un reporte conciso para Claude Code
   */
  generateQuickReport() {
    console.log('🚀 REPORTE RÁPIDO PARA CLAUDE CODE');
    console.log('==================================\n');
    
    const needsWork = [...this.results.missing, ...this.results.outdated];
    
    if (needsWork.length === 0) {
      console.log('✅ Todas las traducciones están actualizadas');
      console.log('🎉 No se requiere trabajo de traducción\n');
      return;
    }
    
    console.log(`📊 RESUMEN: ${needsWork.length} archivos necesitan trabajo\n`);
    
    // Generar mensaje para Claude Code
    console.log('📋 MENSAJE PARA CLAUDE CODE:');
    console.log('============================');
    console.log('```');
    console.log('He detectado archivos que necesitan traducción/actualización al español.');
    console.log('');
    console.log('Archivos que necesitan trabajo:');
    
    needsWork.forEach((file, index) => {
      const status = file.status === 'FALTA' ? 'TRADUCIR' : 'ACTUALIZAR';
      console.log(`${index + 1}. ${file.path} (${status})`);
    });
    
    console.log('');
    console.log('Por favor:');
    console.log('1. Lee cada archivo en inglés');
    console.log('2. Crea/actualiza la traducción en español');
    console.log('3. Mantén todos los componentes React, tablas y estructura MDX');
    console.log('4. Usa terminología consistente de tenis y fitness');
    console.log('5. Verifica que el build funcione al final');
    console.log('```\n');
    
    // Lista detallada para referencia
    console.log('📂 ARCHIVOS DETALLADOS:');
    console.log('========================');
    needsWork.forEach(file => {
      console.log(`📄 ${file.path}`);
      console.log(`   🇺🇸 ${file.englishFile}`);
      console.log(`   🇪🇸 ${file.spanishFile}`);
      console.log(`   ⚡ ${file.status}`);
      if (file.englishDate && file.spanishDate) {
        const daysDiff = Math.ceil((file.englishDate - file.spanishDate) / (1000 * 60 * 60 * 24));
        console.log(`   📅 Diferencia: ${daysDiff} días`);
      }
      console.log('');
    });
  }

  /**
   * Ejecuta la verificación rápida
   */
  run() {
    this.checkTranslations();
    this.generateQuickReport();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const checker = new QuickChecker();
  checker.run();
}

module.exports = QuickChecker;
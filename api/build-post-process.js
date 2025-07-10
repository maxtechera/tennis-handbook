#!/usr/bin/env node

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');
const apiDir = __dirname;

// Functions that can use Edge Runtime (stateless, lightweight)
const EDGE_RUNTIME_FUNCTIONS = [
  'analytics.js',
  'analytics-wizard.js', 
  'track-stats.js'
];

// Functions that need Node.js runtime (database, complex operations)  
const NODEJS_RUNTIME_FUNCTIONS = [
  'wizard-start.js',
  'wizard-save.js', 
  'wizard-complete.js'
];

async function addRuntimeConfig() {
  console.log('🔧 Adding runtime configuration to compiled functions...');
  
  try {
    const files = await readdir(distDir);
    
    for (const file of files) {
      if (extname(file) === '.js') {
        const filePath = join(distDir, file);
        const content = await readFile(filePath, 'utf-8');
        
        let runtimeConfig = '';
        const functionName = basename(file);
        
        if (EDGE_RUNTIME_FUNCTIONS.includes(functionName)) {
          runtimeConfig = `// Vercel Edge Runtime Configuration
export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'fra1'], // Multi-region for low latency
};

`;
          console.log(`  ⚡ Configured ${functionName} for Edge Runtime`);
        } else if (NODEJS_RUNTIME_FUNCTIONS.includes(functionName)) {
          runtimeConfig = `// Vercel Node.js Runtime Configuration  
export const config = {
  runtime: 'nodejs22.x',
  memory: 512, // Optimize memory usage
  maxDuration: 15, // 15 second timeout for database operations
};

`;
          console.log(`  🟢 Configured ${functionName} for Node.js Runtime`);
        }
        
        // Add runtime config at the top of the file
        const optimizedContent = runtimeConfig + content;
        await writeFile(filePath, optimizedContent, 'utf-8');
      }
    }
    
    console.log('✅ Runtime configuration added successfully');
  } catch (error) {
    console.error('❌ Error adding runtime configuration:', error.message);
  }
}

async function optimizeImports() {
  console.log('📦 Optimizing import statements...');
  
  try {
    const files = await readdir(distDir);
    
    for (const file of files) {
      if (extname(file) === '.js') {
        const filePath = join(distDir, file);
        let content = await readFile(filePath, 'utf-8');
        
        // Fix .js imports that should point to compiled files
        content = content.replace(/from ["']\.\/([^"']+)\.js["']/g, 'from "./$1.js"');
        content = content.replace(/from ["']\.\/([^"']+)["']/g, 'from "./$1.js"');
        
        await writeFile(filePath, content, 'utf-8');
      }
    }
    
    console.log('✅ Import optimization completed');
  } catch (error) {
    console.error('❌ Error optimizing imports:', error.message);
  }
}

async function copyUtilsDirectory() {
  console.log('📂 Processing utils directory...');
  
  try {
    // Create utils directory in dist
    const utilsDistDir = join(distDir, 'utils');
    await mkdir(utilsDistDir, { recursive: true });
    
    console.log('✅ Utils directory processed');
  } catch (error) {
    console.error('❌ Error processing utils directory:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting API build post-processing...');
  
  await copyUtilsDirectory();
  await addRuntimeConfig();
  await optimizeImports();
  
  console.log('🎉 API build post-processing completed!');
  console.log('');
  console.log('📊 Build Summary:');
  console.log(`  Edge Runtime: ${EDGE_RUNTIME_FUNCTIONS.length} functions`);
  console.log(`  Node.js Runtime: ${NODEJS_RUNTIME_FUNCTIONS.length} functions`); 
  console.log('  ⚡ Edge functions: Faster cold starts, lower cost');
  console.log('  🟢 Node.js functions: Full API access, database operations');
}

main().catch(console.error);
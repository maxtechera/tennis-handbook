#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load deployment configuration
const config = require('../deploy.config.js');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Utility functions
const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}!${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`)
};

// Check if required environment variables are set
function checkEnvironment() {
  log.info('Checking environment variables...');
  
  const required = [
    'CONVERTKIT_API_KEY',
    'CONVERTKIT_FORM_ID',
    'VERCEL_TOKEN'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    log.error('Missing required environment variables:');
    missing.forEach(key => console.log(`  - ${key}`));
    process.exit(1);
  }
  
  log.success('All required environment variables are set');
}

// Test ConvertKit API connection
async function testConvertKit() {
  log.info('Testing ConvertKit API connection...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.convertkit.com',
      path: `/v3/forms/${process.env.CONVERTKIT_FORM_ID}`,
      method: 'GET',
      headers: {
        'X-Api-Secret': process.env.CONVERTKIT_API_KEY
      }
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        log.success('ConvertKit API connection successful');
        resolve();
      } else {
        log.error(`ConvertKit API returned status ${res.statusCode}`);
        reject(new Error('ConvertKit API connection failed'));
      }
    });
    
    req.on('error', (error) => {
      log.error(`ConvertKit API error: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

// Build the project
function buildProject() {
  log.info('Building the project...');
  
  try {
    // Check if dependencies are installed
    if (!fs.existsSync('node_modules')) {
      log.info('Installing dependencies...');
      execSync('pnpm install || npm install', { stdio: 'inherit' });
    }
    
    // Run build
    execSync('pnpm build || npm run build', { stdio: 'inherit' });
    log.success('Build completed successfully');
  } catch (error) {
    log.error('Build failed');
    throw error;
  }
}

// Create .env.production file for deployment
function createProductionEnv() {
  log.info('Creating production environment file...');
  
  const envContent = Object.entries(config.vercel.env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync('.env.production', envContent);
  log.success('Production environment file created');
}

// Deploy to Vercel
function deployToVercel(stage = 'production') {
  log.info(`Deploying to Vercel (${stage})...`);
  
  try {
    // Build Vercel command with environment variables
    const envFlags = Object.entries(config.vercel.env)
      .map(([key, value]) => `-e ${key}="${value}"`)
      .join(' ');
    
    const command = stage === 'production' 
      ? `npx vercel --prod --token="${process.env.VERCEL_TOKEN}" ${envFlags}`
      : `npx vercel --token="${process.env.VERCEL_TOKEN}" ${envFlags}`;
    
    const output = execSync(command, { encoding: 'utf8' });
    const deploymentUrl = output.trim().split('\n').pop();
    
    log.success(`Deployed successfully to: ${deploymentUrl}`);
    return deploymentUrl;
  } catch (error) {
    log.error('Deployment failed');
    throw error;
  }
}

// Run health checks
async function runHealthChecks(deploymentUrl) {
  log.info('Running health checks...');
  
  for (const check of config.healthChecks) {
    const url = check.url
      .replace('${DEPLOYMENT_URL}', deploymentUrl)
      .replace('${CONVERTKIT_FORM_ID}', process.env.CONVERTKIT_FORM_ID);
    
    try {
      await performHealthCheck(check.name, url, check);
      log.success(`Health check passed: ${check.name}`);
    } catch (error) {
      log.error(`Health check failed: ${check.name}`);
      if (config.rollback.enabled) {
        log.warning('Initiating rollback...');
        throw error;
      }
    }
  }
}

// Perform individual health check
function performHealthCheck(name, url, check) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== check.expectedStatus) {
        reject(new Error(`Expected status ${check.expectedStatus}, got ${res.statusCode}`));
        return;
      }
      
      if (check.contentCheck) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (!data.includes(check.contentCheck)) {
            reject(new Error(`Content check failed: "${check.contentCheck}" not found`));
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    }).on('error', reject);
  });
}

// Main deployment function
async function deploy() {
  console.log('=====================================');
  console.log('ConvertKit Integration Deployment');
  console.log('=====================================\n');
  
  try {
    // Load .env file if it exists
    if (fs.existsSync('.env')) {
      require('dotenv').config();
      log.success('Loaded environment variables from .env file');
    }
    
    // Check environment
    checkEnvironment();
    
    // Test ConvertKit connection
    await testConvertKit();
    
    // Build project
    buildProject();
    
    // Create production env file
    createProductionEnv();
    
    // Deploy to Vercel
    const deploymentUrl = deployToVercel('production');
    
    // Run health checks
    await runHealthChecks(deploymentUrl);
    
    console.log('\n=====================================');
    log.success('Deployment completed successfully!');
    console.log('=====================================');
    
    // Clean up
    if (fs.existsSync('.env.production')) {
      fs.unlinkSync('.env.production');
    }
    
  } catch (error) {
    log.error(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const stage = args[0] || 'production';

// Run deployment
deploy().catch(error => {
  console.error(error);
  process.exit(1);
});
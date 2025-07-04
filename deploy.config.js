// ConvertKit Integration Deployment Configuration

module.exports = {
  // ConvertKit Configuration
  convertkit: {
    apiKey: process.env.CONVERTKIT_API_KEY,
    formId: process.env.CONVERTKIT_FORM_ID,
    // Public form ID for client-side usage
    publicFormId: process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID || process.env.CONVERTKIT_FORM_ID,
    
    // API endpoints
    endpoints: {
      forms: 'https://api.convertkit.com/v3/forms',
      subscribers: 'https://api.convertkit.com/v3/subscribers',
      tags: 'https://api.convertkit.com/v3/tags'
    },
    
    // Form configuration
    forms: {
      newsletter: {
        id: process.env.CONVERTKIT_NEWSLETTER_FORM_ID || process.env.CONVERTKIT_FORM_ID,
        successMessage: 'Thank you for subscribing!',
        errorMessage: 'Something went wrong. Please try again.'
      },
      workout: {
        id: process.env.CONVERTKIT_WORKOUT_FORM_ID || process.env.CONVERTKIT_FORM_ID,
        successMessage: 'Welcome to the tennis workout program!',
        errorMessage: 'Unable to complete signup. Please try again.'
      }
    }
  },
  
  // Vercel Deployment Configuration
  vercel: {
    token: process.env.VERCEL_TOKEN,
    orgId: process.env.VERCEL_ORG_ID,
    projectId: process.env.VERCEL_PROJECT_ID,
    
    // Environment variables to pass to Vercel
    env: {
      CONVERTKIT_API_KEY: process.env.CONVERTKIT_API_KEY,
      CONVERTKIT_FORM_ID: process.env.CONVERTKIT_FORM_ID,
      NEXT_PUBLIC_CONVERTKIT_FORM_ID: process.env.CONVERTKIT_FORM_ID,
      NODE_ENV: 'production'
    },
    
    // Build configuration
    build: {
      command: 'pnpm build',
      output: 'build'
    }
  },
  
  // Deployment stages
  stages: {
    development: {
      url: 'http://localhost:3000',
      env: {
        NODE_ENV: 'development',
        CONVERTKIT_TEST_MODE: 'true'
      }
    },
    staging: {
      url: process.env.STAGING_URL,
      env: {
        NODE_ENV: 'staging',
        CONVERTKIT_TEST_MODE: 'true'
      }
    },
    production: {
      url: process.env.PRODUCTION_URL,
      env: {
        NODE_ENV: 'production',
        CONVERTKIT_TEST_MODE: 'false'
      }
    }
  },
  
  // Health checks
  healthChecks: [
    {
      name: 'ConvertKit API',
      url: 'https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}',
      headers: {
        'X-Api-Secret': '${CONVERTKIT_API_KEY}'
      },
      expectedStatus: 200
    },
    {
      name: 'Website Homepage',
      url: '${DEPLOYMENT_URL}',
      expectedStatus: 200
    },
    {
      name: 'Email Capture Form',
      url: '${DEPLOYMENT_URL}',
      contentCheck: 'convertkit',
      expectedStatus: 200
    }
  ],
  
  // Rollback configuration
  rollback: {
    enabled: true,
    maxRetries: 3,
    conditions: [
      'healthCheckFailed',
      'buildFailed',
      'deploymentFailed'
    ]
  }
}
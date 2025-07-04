# ConvertKit Integration Deployment Guide

This guide covers the automated deployment process for the Tennis Workout website with ConvertKit email capture integration.

## Prerequisites

1. **Environment Variables**
   - `CONVERTKIT_API_KEY` - Your ConvertKit API key
   - `CONVERTKIT_FORM_ID` - Your ConvertKit form ID
   - `VERCEL_TOKEN` - Your Vercel deployment token
   - `VERCEL_ORG_ID` - Your Vercel organization ID (optional)
   - `VERCEL_PROJECT_ID` - Your Vercel project ID (optional)

2. **Dependencies**
   - Node.js 18+ 
   - pnpm or npm
   - Vercel CLI (installed automatically)

## Quick Start

### Manual Deployment

1. **Using Bash Script:**
   ```bash
   ./scripts/deploy-convertkit.sh
   ```

2. **Using Node.js Script:**
   ```bash
   node scripts/deploy.js
   ```

### Automated Deployment (GitHub Actions)

Deployments are automatically triggered on:
- Push to `main` or `production` branches
- Manual workflow dispatch
- Pull request creation/updates (build only)

## Deployment Scripts

### 1. Bash Deployment Script (`scripts/deploy-convertkit.sh`)

Features:
- Environment variable validation
- ConvertKit API connection testing
- Project building
- Vercel deployment with env vars
- Post-deployment health checks

Usage:
```bash
# Basic deployment
./scripts/deploy-convertkit.sh

# With custom env file
CONVERTKIT_API_KEY=your_key ./scripts/deploy-convertkit.sh
```

### 2. Node.js Deployment Script (`scripts/deploy.js`)

Advanced features:
- Configuration-based deployment
- Multiple stage support
- Detailed health checks
- Rollback capabilities

Usage:
```bash
# Deploy to production
node scripts/deploy.js

# Deploy to staging
node scripts/deploy.js staging
```

### 3. GitHub Actions Workflow

Automated pipeline with:
- ConvertKit API validation
- Build artifact caching
- Multi-environment deployment
- Post-deployment testing

## Configuration

### Deploy Configuration (`deploy.config.js`)

Customize deployment settings:
```javascript
module.exports = {
  convertkit: {
    // ConvertKit settings
  },
  vercel: {
    // Vercel deployment settings
  },
  stages: {
    // Environment-specific settings
  },
  healthChecks: [
    // Post-deployment validation
  ]
}
```

### Environment Setup

1. **Create `.env` file:**
   ```bash
   CONVERTKIT_API_KEY=your_api_key_here
   CONVERTKIT_FORM_ID=your_form_id_here
   VERCEL_TOKEN=your_vercel_token_here
   ```

2. **For GitHub Actions, add secrets:**
   - Go to Settings → Secrets → Actions
   - Add the same variables as repository secrets

## Health Checks

The deployment process includes automated health checks:

1. **ConvertKit API Validation**
   - Verifies API key and form ID are valid
   - Tests API connectivity

2. **Site Availability**
   - Confirms deployment URL returns 200 OK
   - Validates site is accessible

3. **Form Integration**
   - Checks for ConvertKit form presence
   - Validates form functionality

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   Error: Missing required environment variables
   ```
   Solution: Ensure all required variables are set in `.env` or environment

2. **ConvertKit API Failed**
   ```
   Error: ConvertKit API connection failed (HTTP 401)
   ```
   Solution: Verify your API key and form ID are correct

3. **Build Failed**
   ```
   Error: Build failed
   ```
   Solution: Run `pnpm install` and check for build errors locally

### Debug Mode

Enable verbose logging:
```bash
DEBUG=true ./scripts/deploy-convertkit.sh
```

## Rollback

If deployment fails:

1. **Automatic Rollback** (if enabled):
   - Health check failures trigger automatic rollback
   - Previous stable version is restored

2. **Manual Rollback:**
   ```bash
   vercel rollback --token=$VERCEL_TOKEN
   ```

## Security Notes

- Never commit `.env` files to version control
- Use GitHub Secrets for CI/CD environments
- Rotate API keys regularly
- Monitor ConvertKit webhook logs for suspicious activity

## Support

For issues with:
- **ConvertKit Integration**: Check ConvertKit API docs
- **Vercel Deployment**: See Vercel documentation
- **Build Errors**: Check local build first with `pnpm build`
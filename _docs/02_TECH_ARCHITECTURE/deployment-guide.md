# Tenis Manual Deployment Guide

> **Status: ACTIVE** | Last updated: 2025-07-05  
> **Lifecycle: OPERATIONAL** | Review before major deployments

## Purpose

This guide covers deployment procedures specific to the Tenis Manual platform, including our ConvertKit API endpoints and multi-locale static site deployment.

## Current Deployment Architecture

### Production Environment

- **Main Site**: GitHub Pages at tennis-training.dev
- **API Endpoints**: Vercel Functions
- **Email Service**: ConvertKit API integration
- **Analytics**: Google Analytics 4

## ConvertKit API Deployment

### Environment Variables

```bash
# Production values (stored in Vercel)
CONVERTKIT_API_SECRET=sk_live_[specific_to_tennis_handbook]
CONVERTKIT_FORM_ID=7654321  # Tenis Manual subscriber form
CONVERTKIT_TAG_IDS={
  "tennis-handbook": "123456",
  "spanish": "123457",
  "english": "123458"
}
```

### Vercel Configuration

```json
{
  "functions": {
    "api/subscribe.js": {
      "maxDuration": 10,
      "environment": {
        "FORM_ID": "@convertkit-tennis-form-id",
        "API_SECRET": "@convertkit-tennis-secret"
      }
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://tennis-training.dev"
        },
        { "key": "Access-Control-Allow-Methods", "value": "POST" }
      ]
    }
  ]
}
```

### API Endpoint Specifics

- **Production URL**: `https://tennis-api.vercel.app/api/subscribe`
- **Rate Limiting**: 100 requests/minute per IP
- **Timeout**: 10 seconds max duration
- **CORS**: Restricted to tennis-training.dev domain

## Static Site Deployment

### Build Process

```bash
# Tennis-specific build optimizations
npm run build -- --locale en
npm run build -- --locale es

# Output structure
build/
├── en/           # English version
│   └── workouts/ # 84 workout files
└── es/           # Spanish version (3x engagement)
    └── workouts/ # 84 translated files
```

### GitHub Pages Configuration

```yaml
# .github/workflows/deploy.yml - Tennis-specific settings
- name: Build Tenis Manual
  run: |
    # Build both locales with optimizations
    npm run build:all

    # Generate workout indexes
    npm run generate:workout-index

    # Optimize images for exercises
    npm run optimize:images
```

### Performance Optimizations

- **Workout images**: Compressed to <100KB each
- **Exercise GIFs**: Converted to WebP, <500KB
- **Font loading**: Subset for tennis terminology
- **Critical CSS**: Inline for workout pages

## Monitoring Post-Deployment

### Key Metrics to Verify

1. **ConvertKit Integration**

   - Test email signup from all entry points
   - Verify Spanish/English tagging
   - Check welcome email delivery

2. **Performance Scores**

   - Lighthouse must remain 95+
   - Spanish site load time <2s
   - Workout pages <3s TTI

3. **Content Accessibility**
   - Free tier accessible without email
   - Email-gated content unlocks properly
   - Progressive disclosure working

### Deployment Checklist

#### Pre-Deployment

- [ ] Test ConvertKit API locally with production keys
- [ ] Verify all 84 workouts render correctly
- [ ] Check Spanish translations complete
- [ ] Run performance audit

#### Deployment

- [ ] Deploy API to Vercel
- [ ] Build and deploy static site
- [ ] Clear CDN cache
- [ ] Update DNS if needed

#### Post-Deployment

- [ ] Test email capture flow end-to-end
- [ ] Verify workout navigation works
- [ ] Check analytics tracking
- [ ] Monitor error logs for 24h

## Rollback Procedures

### API Rollback

```bash
# Revert to previous Vercel deployment
vercel rollback tennis-api-[deployment-id]
```

### Static Site Rollback

```bash
# GitHub Pages automatic via git
git revert HEAD
git push origin main
```

## Environment-Specific Settings

### Development

```javascript
// Local development overrides
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/subscribe"
    : "https://tennis-api.vercel.app/api/subscribe";
```

### Staging (Future)

- Separate ConvertKit test form
- Reduced email sequences
- Performance monitoring enabled

### Production

- Full ConvertKit automation
- All progressive tiers active
- Error reporting to Sentry (planned)

## Troubleshooting Deployments

### Common Issues

#### "ConvertKit API 401 Error"

- Verify API secret in Vercel dashboard
- Check form ID matches production form
- Ensure API key has necessary permissions

#### "Spanish Site Not Building"

- Check translation-status.json
- Verify all MDX files have Spanish versions
- Review i18n configuration

#### "Workout Images Not Loading"

- Confirm image optimization ran
- Check CDN cache headers
- Verify WebP fallbacks exist

## Future Deployment Considerations

### Phase 2 Requirements

- Database migrations for user progress
- WhatsApp webhook endpoints
- Stripe payment webhooks
- Video CDN integration

### Scaling Preparations

- Move to dedicated CDN when >100k visits/month
- Implement API caching layer
- Add redundant email providers
- Set up monitoring dashboards

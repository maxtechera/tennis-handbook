# ConvertKit Integration Technical Specifications

## Executive Summary

This document outlines the complete technical specifications for integrating ConvertKit email marketing platform with the Tennis Handbook website. The integration aims to capture email subscribers, deliver lead magnets, and build an audience for future monetization.

**Current Status**: Partially implemented - Frontend components complete, backend API and ConvertKit account setup pending.

## Architecture Overview

### System Components

1. **Frontend Components** (✅ Implemented)
   - EmailCaptureForm - Main form component with 4 variants
   - EmailCapturePopup - Timed popup (3-minute trigger)
   - EmailCaptureBar - Sticky footer bar (5-second delay)
   - ContentEmailCapture - In-content capture for workouts
   - Spanish translations via i18n

2. **Backend API** (🔄 Pending)
   - Serverless function for ConvertKit integration
   - CORS handling for cross-origin requests
   - Rate limiting and security measures
   - Environment variable management

3. **ConvertKit Configuration** (🔄 Pending)
   - Account setup with API credentials
   - Form creation with custom fields
   - Tag management for segmentation
   - Welcome email sequence
   - Lead magnet delivery automation

### Data Flow

```
User Input → Frontend Form → API Endpoint → ConvertKit API
                ↓                              ↓
           Local Storage                 Email Automation
           (Prevent Duplicates)         (Welcome Series)
```

## Technical Requirements

### Frontend Requirements

#### Component Architecture
- **Framework**: React with TypeScript
- **Styling**: CSS Modules
- **Internationalization**: Docusaurus i18n system
- **State Management**: React hooks (useState)

#### Form Variants
1. **Hero Form** (`variant="hero"`)
   - Prominent placement on homepage
   - Larger styling for maximum visibility
   - Immediate value proposition

2. **Inline Form** (`variant="inline"`)
   - Content integration
   - Contextual placement after workouts
   - Seamless reading experience

3. **Popup Form** (`variant="popup"`)
   - 3-minute timer activation
   - Exit intent detection capability
   - Local storage tracking to prevent repeat shows

4. **Footer Bar** (`variant="footer"`)
   - Sticky positioning
   - 5-second delay before showing
   - Dismissible with memory

#### Form Features
- Email validation (client-side)
- GDPR consent checkbox (required)
- Loading states during submission
- Success/error message display
- Source tracking for analytics
- Language detection for segmentation

### Backend Requirements

#### API Endpoint Specifications
- **Method**: POST
- **Path**: `/api/subscribe`
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "email": "user@example.com",
  "source": "homepage-hero|popup|footer-bar|content-page",
  "consent": true,
  "timestamp": "2025-01-04T10:30:00Z",
  "language": "en|es"
}
```

#### Response Format
```json
{
  "success": true,
  "message": "Thanks for subscribing! Check your email.",
  "subscriber_id": "ck_subscriber_123" // Optional
}
```

#### Error Handling
- 400: Invalid email or missing consent
- 409: Already subscribed
- 429: Rate limit exceeded
- 500: Server error

#### Security Measures
1. **CORS Configuration**
   - Allowed origins: production domain + localhost
   - Credentials: true for cookie support

2. **Rate Limiting**
   - IP-based: 5 requests per minute
   - Email-based: 3 attempts per hour

3. **Input Validation**
   - Email format validation
   - XSS prevention
   - SQL injection protection (if using database)

### ConvertKit Integration

#### API Configuration
- **Base URL**: `https://api.convertkit.com/v3`
- **Authentication**: API Secret in headers
- **Form Endpoint**: `/forms/{form_id}/subscribe`

#### Required Environment Variables
```
CONVERTKIT_API_SECRET=sk_live_xxxxxxxxxxxxx
CONVERTKIT_FORM_ID=1234567
```

#### Custom Fields Setup
1. **source** (text) - Track signup location
2. **language** (text) - User's preferred language
3. **signup_date** (date) - Timestamp of signup
4. **gdpr_consent** (text) - Yes/No consent status

#### Tag Strategy
- `tennis-handbook` - All subscribers
- `english` / `spanish` - Language preference
- `homepage-hero` - Source: Homepage hero section
- `popup` - Source: Timed popup
- `footer-bar` - Source: Footer bar
- `content-page` - Source: Content pages
- `7-day-plan` - Downloaded lead magnet

## Content Requirements

### Lead Magnets

#### Primary: 7-Day Elite Tennis Workout Plan
- **Format**: PDF (8.5x11" printable)
- **Size**: ~2-3MB with images
- **Content**: Complete workout program with exercise demonstrations
- **Delivery**: Immediate via ConvertKit automation

#### Future Lead Magnets
1. **Tennis Nutrition Guide** (Month 2)
2. **Injury Prevention Checklist** (Month 3)
3. **Mental Game Workbook** (Month 4)

### Email Sequences

#### Welcome Series (5 Emails)
1. **Email 1** - Immediate
   - Subject: "Your 7-Day Tennis Workout Plan is here! 🎾"
   - Content: Welcome + PDF delivery
   - CTA: Start Day 1 tomorrow

2. **Email 2** - Day 1
   - Subject: "The #1 fitness mistake tennis players make"
   - Content: Training philosophy education
   - CTA: Complete Day 2 workout

3. **Email 3** - Day 3
   - Subject: "Djokovic's recovery secret"
   - Content: Recovery importance
   - CTA: Focus on Day 4 recovery

4. **Email 4** - Day 5
   - Subject: "The one exercise every tennis player needs"
   - Content: Single-leg RDL benefits
   - CTA: Perfect your form

5. **Email 5** - Day 7
   - Subject: "You did it! Here's what's next..."
   - Content: Completion congratulations + next steps
   - CTA: Explore 12-week program

#### Segmented Content
- **Spanish Subscribers**: Translated email versions
- **High Engagement**: Premium content previews
- **Low Engagement**: Re-engagement campaigns

## Implementation Phases

### Phase 1: ConvertKit Setup (Day 1)
- [ ] Create ConvertKit account
- [ ] Configure custom fields and tags
- [ ] Set up form in ConvertKit
- [ ] Create welcome email sequence
- [ ] Upload lead magnet PDF
- [ ] Test email delivery

### Phase 2: Backend Development (Day 2)
- [ ] Deploy serverless function
- [ ] Configure environment variables
- [ ] Implement security measures
- [ ] Set up monitoring/logging
- [ ] Test API endpoints

### Phase 3: Frontend Integration (Day 3)
- [ ] Update API endpoint URLs
- [ ] Test all form variants
- [ ] Verify analytics tracking
- [ ] Mobile responsiveness check
- [ ] Cross-browser testing

### Phase 4: Launch & Monitor (Day 4)
- [ ] Deploy to production
- [ ] Monitor first 24 hours
- [ ] Check conversion rates
- [ ] Verify email delivery
- [ ] Address any issues

## Success Metrics

### Technical KPIs
- API response time < 500ms
- Form submission success rate > 98%
- Email delivery rate > 95%
- Mobile conversion rate > 1.5%

### Business KPIs
- Overall conversion rate > 2%
- Welcome email open rate > 40%
- Lead magnet download rate > 80%
- 30-day engagement rate > 25%

### Growth Targets
- Month 1: 100+ subscribers
- Month 3: 500+ subscribers
- Month 6: 2,000+ subscribers
- Month 12: 10,000+ subscribers

## Testing Requirements

### Unit Tests
- Form validation logic
- API error handling
- Email format validation
- Consent checkbox requirements

### Integration Tests
- Full submission flow
- ConvertKit API integration
- Email delivery verification
- Analytics event firing

### User Acceptance Tests
- [ ] Can subscribe from homepage
- [ ] Receives welcome email within 2 minutes
- [ ] PDF link works correctly
- [ ] Can't subscribe twice with same email
- [ ] Spanish users get Spanish emails
- [ ] Popup appears after 3 minutes
- [ ] Footer bar shows after 5 seconds
- [ ] Forms work on mobile devices

## Security Considerations

### Data Protection
- GDPR compliance with explicit consent
- Data minimization (only collect necessary info)
- Secure transmission (HTTPS only)
- No password storage required

### API Security
- API keys in environment variables only
- Server-side API calls only
- Rate limiting to prevent abuse
- Input sanitization

### Privacy Policy Updates
- Add ConvertKit as data processor
- Explain email marketing purposes
- Include unsubscribe information
- Detail data retention policy

## Maintenance & Monitoring

### Daily Checks
- API error rates
- Bounce rates
- Spam complaints
- Conversion tracking

### Weekly Reviews
- Subscriber growth
- Engagement metrics
- A/B test results
- Technical performance

### Monthly Tasks
- Review and optimize sequences
- Update lead magnets
- Analyze subscriber feedback
- Plan new content

## Deployment Configuration

### Vercel Setup
```json
{
  "functions": {
    "api/subscribe.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "CONVERTKIT_API_SECRET": "@convertkit-api-secret",
    "CONVERTKIT_FORM_ID": "@convertkit-form-id"
  }
}
```

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Support & Troubleshooting

### Common Issues
1. **CORS Errors**
   - Verify allowed origins in API
   - Check request headers

2. **Emails Not Sending**
   - Verify API credentials
   - Check ConvertKit form ID
   - Review automation triggers

3. **Low Conversion**
   - A/B test copy variations
   - Adjust popup timing
   - Improve value proposition

### Support Resources
- ConvertKit API Docs: https://developers.convertkit.com
- Vercel Functions: https://vercel.com/docs/functions
- Docusaurus i18n: https://docusaurus.io/docs/i18n

## Appendix

### Code Examples

#### Frontend Form Submission
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  if (!hasConsent) {
    showError('Please agree to receive emails');
    return;
  }

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source,
        consent: true,
        language: document.documentElement.lang
      })
    });

    if (response.ok) {
      showSuccess('Welcome! Check your email.');
      trackEvent('email_capture', { source });
    }
  } catch (error) {
    showError('Something went wrong. Please try again.');
  }
};
```

#### Backend API Handler
```javascript
export default async function handler(req, res) {
  const { email, source, consent, language } = req.body;

  // Validation
  if (!email || !consent) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // ConvertKit API call
  const response = await fetch(
    `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_secret: API_SECRET,
        email,
        fields: { source, language },
        tags: ['tennis-handbook', source]
      })
    }
  );

  // Handle response
  if (response.ok) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ error: 'Subscription failed' });
  }
}
```

---

This specification provides a complete blueprint for implementing and maintaining the ConvertKit integration. Follow the implementation phases sequentially for best results.
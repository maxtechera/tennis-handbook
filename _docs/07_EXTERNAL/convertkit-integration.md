# ConvertKit Integration Technical Setup

> **Status: ACTIVE** | Last updated: 2025-07-05

## Overview

This document provides technical setup instructions for integrating ConvertKit email marketing platform with the Tennis Handbook website.

## Prerequisites

- ConvertKit account (Creator plan - $29/month after 14-day trial)
- Vercel or Netlify account for API deployment
- Access to website environment variables

## Tennis Handbook Specific Configuration

### Form IDs and Tags
```bash
# Production Form IDs
MAIN_FORM_ID=7654321        # Primary subscriber form
SPANISH_FORM_ID=7654322     # Spanish-specific form (future)

# Tag IDs for Automation
TENNIS_HANDBOOK_TAG=123456
SPANISH_TAG=123457
ENGLISH_TAG=123458
HIGHLY_ENGAGED_TAG=123459
WORKOUT_COMPLETION_TAG=123460
```

## Account Setup

### 1. Create ConvertKit Account
1. Visit https://convertkit.com
2. Select "Creator" account type
3. Complete 14-day free trial setup

### 2. Configure Account Settings
```
Profile Name: Tennis Handbook
From Email: hello@tennishandbook.com
Website: https://tennishandbook.com
```

### 3. Domain Verification
1. Go to Settings → Email → Sending
2. Add your domain
3. Add required DNS records:
   - SPF record
   - DKIM records
   - Return-Path CNAME

## Form Configuration

### 1. Create Main Form
1. Navigate to Grow → Forms → Create New
2. Form Settings:
   ```
   Name: Tennis Handbook Subscribers
   Type: Embedded Form
   ```

### 2. Add Custom Fields
Create these fields in Settings → Custom Fields:
- `source` (text) - Tracks signup location
- `language` (text) - User language preference
- `signup_date` (date) - Subscription timestamp
- `gdpr_consent` (text) - GDPR compliance

### 3. Configure Form Options
- Enable double opt-in (recommended for deliverability)
- Set success action to "Show success message"
- Enable GDPR features for EU compliance

## Tag Structure

Create tags in Subscribers → Tags:

### Core Tags
- `tennis-handbook` - Applied to all subscribers
- `english` - English language users
- `spanish` - Spanish language users

### Source Tracking Tags
- `homepage-hero` - Hero section signups
- `homepage-popup` - Popup conversions
- `homepage-footer` - Footer bar signups
- `workout-completion` - Post-workout signups
- `content-page` - Content page conversions
- `announcement` - Top bar clicks

### Engagement Tags
- `highly-engaged` - Completed workouts
- `browser` - Popup interactions
- `lead-magnet-downloaded` - Downloaded PDF

## API Credentials

### 1. Get API Secret
1. Go to Settings → Advanced → API
2. Copy your API Secret (starts with `sk_`)
3. Store securely - never commit to git

### 2. Find Form ID
1. Navigate to your form
2. Check URL: `https://app.convertkit.com/forms/[FORM_ID]/edit`
3. Copy the numeric ID

### 3. Environment Variables
```bash
# Production environment
CONVERTKIT_API_SECRET=sk_live_xxxxxxxxxxxxx
CONVERTKIT_FORM_ID=1234567
NEXT_PUBLIC_CONVERTKIT_API_KEY=your_public_key_here
```

## Email Automation Setup

### 1. Create Welcome Sequence
1. Go to Automations → Sequences → New
2. Name: "Tennis Handbook Welcome Series"
3. Trigger: When subscriber joins form

### 2. Upload Lead Magnet
1. Navigate to Broadcasts → Incentives
2. Upload: "7-Day Elite Tennis Workout Plan.pdf"
3. Copy download URL for email

### 3. Email Schedule
- Email 1: Immediate - Welcome + PDF
- Email 2: +1 day - Training tip
- Email 3: +3 days - Recovery secret  
- Email 4: +5 days - Key exercise
- Email 5: +7 days - Next steps

### Tennis-Specific Email Sequences

#### Welcome Series (English)
1. **Welcome + 7-Day Plan** (Immediate)
   - Subject: "Your Elite Tennis Training Plan is Here! 🎾"
   - PDF download link
   - Quick start guide

2. **Ferrero's Secret** (+1 day)
   - Subject: "The drill that made Alcaraz unstoppable"
   - Teaser content from Week 1

3. **Recovery Like Sinner** (+3 days)
   - Subject: "Why top players never get injured"
   - Preview tendon health content

4. **Power Development** (+5 days)
   - Subject: "Add 10mph to your serve (science-backed)"
   - Exercise demonstration

5. **Unlock Full Program** (+7 days)
   - Subject: "Ready for the complete 12-week transformation?"
   - Progressive unlock CTA

#### Spanish Welcome Series
- Same structure with culturally adapted content
- References to Spanish/Latin American players
- WhatsApp community invitation (Phase 2)

### 4. Segmentation Rules
```
IF subscriber.tag = "spanish" THEN
  Add to Spanish welcome sequence
ELSE
  Add to English welcome sequence
END

IF subscriber.tag = "workout-completion" THEN
  Add tag "highly-engaged"
  Add to advanced training sequence
END
```

## API Integration

### Endpoint Structure
```javascript
POST /api/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "source": "homepage-hero",
  "language": "en",
  "consent": true
}
```

### ConvertKit API Call
```javascript
POST https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
Content-Type: application/json

{
  "api_secret": "YOUR_API_SECRET",
  "email": "user@example.com",
  "fields": {
    "source": "homepage-hero",
    "language": "en",
    "signup_date": "2025-07-05T10:00:00Z",
    "gdpr_consent": "yes"
  },
  "tags": ["tennis-handbook", "homepage-hero", "english"]
}
```

## Testing Checklist

### 1. API Connection Test
```bash
curl -X GET https://api.convertkit.com/v3/account \
  -H "X-API-Secret: YOUR_API_SECRET"
```

### 2. Form Submission Test
```bash
node scripts/test-convertkit.js
```

### 3. Full Flow Test
1. Submit test email via website
2. Verify ConvertKit receives subscriber
3. Check welcome email delivery
4. Confirm PDF download works
5. Verify tags applied correctly

## GDPR Compliance

### 1. Consent Settings
- Enable double opt-in for EU subscribers
- Include unsubscribe link in all emails
- Store consent timestamp and source

### 2. Data Processing
- Only collect necessary data (email + consent)
- Honor unsubscribe requests immediately
- Provide data export/deletion options

### 3. Privacy Policy Updates
Include ConvertKit in privacy policy:
- Data collected via forms
- ConvertKit as data processor
- User rights under GDPR

## Monitoring & Optimization

### Key Metrics to Track
1. **Signup Rate** by source
2. **Confirmation Rate** (double opt-in)
3. **Open Rate** for welcome series
4. **Click Rate** on PDF download
5. **Unsubscribe Rate** by source

### A/B Testing Opportunities
- Form headlines
- Button text
- Popup timing
- Email subject lines
- Lead magnet offers

## Troubleshooting

### Common Issues

#### "Invalid API Key"
- Verify API secret is correct
- Check for extra spaces
- Ensure using production key

#### "Form Not Found"
- Confirm form ID matches
- Check form is published
- Verify form accepts API submissions

#### "Subscriber Not Added"
- Check for existing subscriber
- Verify email format
- Review API response for errors

#### "Emails Not Sending"
- Confirm automation is active
- Check subscriber confirmed (if double opt-in)
- Verify domain authentication

## Support Resources

- ConvertKit API Docs: https://developers.convertkit.com
- Support: help@convertkit.com
- Status Page: https://status.convertkit.com
- Community: https://community.convertkit.com

## Tennis Handbook Tracking Setup

### Custom Event Tracking
```javascript
// Track workout completions
convertkit.tagSubscriber(email, 'workout-completed', {
  workout_id: 'week1-monday',
  duration: '45min',
  language: 'es'
});

// Track content unlocks
convertkit.tagSubscriber(email, 'content-unlocked', {
  tier: 'week2',
  method: 'progressive'
});
```

### Webhook Configuration
```javascript
// Webhook endpoint for progressive unlocking
POST https://tennis-api.vercel.app/webhook/convertkit
{
  "subscriber.id": "12345",
  "subscriber.email": "user@example.com",
  "subscriber.tags": ["tennis-handbook", "week1-complete"]
}
```

## Cost Considerations

### ConvertKit Pricing
- 0-1,000 subscribers: $29/month
- 1,001-3,000 subscribers: $59/month  
- 3,001-5,000 subscribers: $79/month

### ROI Calculation
- 1,000 subscribers × 3% conversion × $97 product = $2,910 revenue
- Break-even: ~10 course sales/month
- Target: 30-50 sales/month at 1,000 subscribers

### Tennis Handbook Specific Metrics
- **Current**: 500+ subscribers
- **Open Rate**: 48% (vs 21% industry average)
- **Click Rate**: 12% (vs 2.6% average)
- **Spanish Engagement**: 3x higher than English
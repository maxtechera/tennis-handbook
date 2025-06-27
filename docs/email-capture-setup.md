# Email Capture Setup Guide

This guide explains how to complete the email capture integration for Tennis Handbook.

## Current Implementation

The email capture system includes:

1. **Email Capture Form Component** - Reusable form with variants (hero, inline, popup, footer)
2. **Popup Component** - Shows after 3 minutes on site
3. **Footer Bar Component** - Sticky footer with compact email capture
4. **Content Component** - For embedding in MDX pages
5. **Spanish Translations** - Full GDPR-compliant Spanish support

## Email Service Integration

### Option 1: ConvertKit (Recommended)

1. Sign up at https://convertkit.com
2. Create a form in ConvertKit
3. Get your API key from Account Settings
4. Deploy the API endpoint:

```javascript
// api/subscribe.js (Vercel function)
export default async function handler(req, res) {
  const { email, source, consent, language } = req.body;
  
  const response = await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.CONVERTKIT_API_KEY,
      email,
      fields: { source, language },
      tags: ['tennis-handbook', source]
    })
  });
  
  return res.json({ success: response.ok });
}
```

### Option 2: Mailchimp

1. Sign up at https://mailchimp.com
2. Create an audience
3. Get your API key
4. Deploy similar endpoint using Mailchimp API

### Option 3: Self-hosted (Supabase)

```sql
-- Create subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  language TEXT,
  consent_given BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);
```

## Deployment Steps

### 1. Environment Variables

```bash
# .env.local
CONVERTKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### 2. API Endpoint

For Vercel:
- Create `/api/subscribe.js` in your project
- Deploy to Vercel

For Netlify:
- Create `/netlify/functions/subscribe.js`
- Deploy to Netlify

### 3. Update Form Action

Update the fetch URL in EmailCaptureForm.tsx:
```javascript
const response = await fetch(
  process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com/api/subscribe'
    : '/api/subscribe',
  // ... rest of the code
);
```

## Analytics Integration

### Google Analytics 4

The components already send events:
- `email_capture` - When user subscribes
- `email_popup_shown` - When popup appears
- `email_popup_closed` - When popup is dismissed
- `email_bar_dismissed` - When footer bar is closed

Add to your GA4 dashboard:
1. Go to Configure > Events
2. Mark `email_capture` as conversion
3. Create audience of subscribers

### Conversion Tracking

Track conversion rate with:
```javascript
// In your analytics
const conversionRate = (email_capture_events / unique_visitors) * 100;
```

## A/B Testing

### Test Different Copy

Create variants:
```tsx
const copyVariants = {
  A: "Level Up Your Tennis Game",
  B: "Join 10,000+ Players Getting Better",
  C: "Free Training Tips from Elite Coaches"
};
```

### Test Different Placements

1. Hero section (implemented)
2. After first paragraph
3. Exit intent (implemented)
4. Scroll percentage trigger

## GDPR Compliance

Current implementation includes:
- ✅ Explicit consent checkbox
- ✅ Clear privacy statement
- ✅ Language detection for Spanish users
- ✅ Unsubscribe mechanism (add to emails)

## Email Sequences

### Welcome Series (Recommended)

1. **Immediate**: Welcome + best content links
2. **Day 3**: Training philosophy introduction
3. **Day 7**: Popular workout routine
4. **Day 14**: Success story + premium teaser

### Content Ideas

- Weekly workout tips
- Pro player insights
- Injury prevention tips
- Nutrition guidance
- Equipment recommendations

## Performance Monitoring

Track these metrics:
- Email capture rate (target: >2%)
- Popup conversion rate
- Footer bar conversion rate
- Page load impact (should be <100ms)

## Next Steps

1. Choose email service provider
2. Set up API endpoint
3. Configure environment variables
4. Test in development
5. Deploy to production
6. Set up email sequences
7. Monitor conversion rates
8. Optimize based on data
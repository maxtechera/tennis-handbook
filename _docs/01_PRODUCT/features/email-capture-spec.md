# Email Capture System Specification

> **Status: ACTIVE** | Last updated: 2025-07-05

## Problem Statement

The Tenis Manual website needs an effective email capture system to:

- Build an engaged subscriber list for content distribution
- Create a foundation for future monetization through premium courses
- Track user engagement and optimize conversion paths
- Deliver lead magnets (7-Day Workout Plan) to build trust

**Target metrics**: 8-12% overall conversion rate from website visitors to email subscribers

## Solution Overview

A multi-touchpoint email capture system using ConvertKit that maximizes conversion opportunities while maintaining excellent user experience.

### Core Components

1. **ConvertKit Integration** - Professional email marketing platform with automation
2. **Multiple Capture Points** - Strategic placement across user journey
3. **Lead Magnet Delivery** - Automated PDF delivery system
4. **Source Tracking** - Analytics to optimize placement
5. **GDPR Compliance** - Built-in consent and privacy controls

## User Journey & Touchpoints

### 1. Homepage Hero Section (3-5% conversion)

**Component**: `EmailCaptureForm` (variant="hero")

- High-visibility placement above the fold
- Clear value proposition: "Get Your Free 7-Day Elite Tennis Workout Plan"
- Immediate reward for subscription

### 2. Timed Popup (2-3% conversion)

**Component**: `EmailCapturePopup`

- Triggers after 3 minutes (catches engaged readers)
- Exit intent detection capability
- 24-hour cooldown using localStorage
- Mobile-optimized design

### 3. Sticky Footer Bar (1-2% conversion)

**Component**: `EmailCaptureBar`

- Appears after 5-second delay
- Dismissible with memory
- Persistent but non-intrusive
- Mobile-responsive

### 4. Content Integration (5-8% conversion)

**Component**: `ContentEmailCapture`

- End of workout pages
- Bottom of popular training guides
- After high-value content
- Context-specific messaging

### 5. Announcement Bar (Native Docusaurus)

**Implementation**: docusaurus.config.js

```javascript
announcementBar: {
  id: 'workout_plan',
  content: '🎾 Get your FREE 7-Day Elite Tennis Workout Plan! <a href="#signup">Download Now</a>',
  backgroundColor: '#2e8555',
  textColor: '#ffffff',
  isCloseable: true,
}
```

## Technical Implementation

### Frontend Components (✅ Completed)

All UI components are built and integrated:

- React components with TypeScript
- Internationalization (English/Spanish)
- Form validation and error handling
- Analytics event tracking
- GDPR compliance checkbox

### Backend Integration

#### Environment Configuration

```bash
# ConvertKit API Configuration
NEXT_PUBLIC_CONVERTKIT_API_KEY=your_convertkit_api_key_here
NEXT_PUBLIC_CONVERTKIT_FORM_ID=your_convertkit_form_id_here
CONVERTKIT_API_SECRET=your_convertkit_api_secret_here
```

#### API Endpoint (Vercel Function)

```javascript
// api/subscribe.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://tennishandbook.com");

  const { email, source, consent, language } = req.body;

  // Validation
  if (!email || !consent) {
    return res.status(400).json({ error: "Invalid request" });
  }

  // ConvertKit API call
  const response = await fetch(
    `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_secret: process.env.CONVERTKIT_API_SECRET,
        email,
        fields: { source, language },
        tags: ["tennis-handbook", source, language],
      }),
    }
  );

  return res.json({ success: response.ok });
}
```

### ConvertKit Configuration

#### Tags Structure

- `tennis-handbook` - All subscribers
- `english` / `spanish` - Language preference
- Source tags for analytics:
  - `homepage-hero`
  - `homepage-popup`
  - `homepage-footer`
  - `workout-completion`
  - `content-page`

#### Custom Fields

- `source` - Where user subscribed from
- `language` - User's language preference
- `signup_date` - Timestamp of subscription
- `gdpr_consent` - Consent confirmation

#### Automation Rules

```
IF tag = "workout-completion" → Add tag "highly-engaged"
IF tag = "homepage-popup" → Add tag "browser"
IF language = "spanish" → Trigger Spanish welcome series
```

### Lead Magnet: 7-Day Elite Tennis Workout Plan

**Content Structure**:

- Day 1: Power Foundation
- Day 2: Court Movement
- Day 3: Upper Body Strength
- Day 4: Active Recovery
- Day 5: Lower Body Power
- Day 6: Total Body Integration
- Day 7: Recovery & Planning

**Delivery**: Automated via ConvertKit welcome email with PDF attachment

### Welcome Email Sequence (5 emails)

1. **Instant**: PDF delivery + welcome
2. **Day 1**: Common training mistakes
3. **Day 3**: Pro recovery secrets
4. **Day 5**: Key exercise spotlight
5. **Day 7**: Completion celebration + next steps

## Success Metrics & KPIs

### Primary Metrics

- **Overall Conversion Rate**: Target 8-12%
- **Email Open Rate**: Target 80%+ (welcome series)
- **Click-through Rate**: Target 30%+
- **Unsubscribe Rate**: Keep below 2%

### Tracking by Source

- Homepage hero conversions
- Popup engagement rate
- Footer bar effectiveness
- Content page conversions
- Workout completion conversions

### Weekly Dashboard

1. Total new subscribers
2. Conversion rate by source
3. Email engagement metrics
4. Lead magnet download rate
5. Revenue attribution (future)

## Current Status

### ✅ Completed

- All frontend components built
- Homepage integration live
- Spanish translations
- GDPR compliance
- Analytics tracking setup

### 🚧 In Progress

- ConvertKit account setup
- API endpoint deployment
- Lead magnet PDF design
- Welcome email sequence

### 📋 Next Steps

1. Complete ConvertKit setup (30 min)
2. Deploy API endpoint (1 hour)
3. Create PDF lead magnet (2 hours)
4. Write welcome email sequence (1 hour)
5. Full system testing (30 min)

## Future Enhancements

### Phase 2 (Month 2)

- A/B testing different headlines
- Behavioral triggers (scroll depth)
- Additional lead magnets
- Advanced segmentation

### Phase 3 (Month 3)

- Course pre-launch sequence
- Paid program soft launch
- Referral system
- Advanced automation

### Phase 4 (Month 4+)

- Multiple product funnels
- Webinar integration
- Community access tiers
- Partnership opportunities

## Technical References

### Implementation Details

See: `/docs/development/email-capture-integration.md`

### Testing Guide

See: `/_docs/Implementation/testing-guide.md`

### API Deployment

See: `/_docs/Implementation/api-deployment.md`

## Archived Documentation

The following documentation has been consolidated into this spec:

- `_docs/Archive/convertkit-multi-touchpoint-plan.md` - Original planning document
- `_docs/Archive/convertkit-simple-implementation.md` - Simplified approach
- `_docs/Implementation/implementation-guide.md` - Detailed implementation steps
- `_docs/Implementation/convertkit-setup.md` - ConvertKit configuration guide

These documents remain available for historical reference but this spec should be considered the single source of truth for the email capture system.

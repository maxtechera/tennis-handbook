# ConvertKit Multi-Touchpoint Implementation Plan

**Document Status**: 🔴 Archived  
**Lifecycle**: Historical Reference  
**Archived**: July 2025  
**Reason**: Implementation completed, superseded by current system  

---

## Overview

This plan maintains all email capture touchpoints to maximize lead generation while keeping implementation simple for the Docusaurus website.

## Email Capture Touchpoints

### 1. Homepage Hero Section ✅
**Status**: Component built (`EmailCaptureForm` variant="hero")
**Implementation**: High-visibility form above the fold
**Expected Conversion**: 3-5% of homepage visitors

### 2. Timed Popup ✅
**Status**: Component built (`EmailCapturePopup`)
**Features**:
- 3-minute timer (catches engaged readers)
- LocalStorage to prevent repeat shows
- Exit intent detection ready
**Expected Conversion**: 2-3% of visitors

### 3. Sticky Footer Bar ✅
**Status**: Component built (`EmailCaptureBar`)
**Features**:
- 5-second delay appearance
- Dismissible with memory
- Mobile-optimized
**Expected Conversion**: 1-2% of visitors

### 4. Content Integration ✅
**Status**: Component built (`ContentEmailCapture`)
**Placement**:
- End of workout pages
- After popular training guides
- Bottom of high-value content
**Expected Conversion**: 5-8% of content readers

### 5. Announcement Bar (New)
**Implementation**: Native Docusaurus feature
```javascript
// docusaurus.config.js
announcementBar: {
  id: 'workout_plan',
  content: '🎾 Get your FREE 7-Day Elite Tennis Workout Plan! <a href="#signup">Download Now</a>',
  backgroundColor: '#2e8555',
  textColor: '#ffffff',
  isCloseable: true,
}
```

## Simple Implementation Strategy

### Phase 1: Backend Setup (2 hours)

#### Option A: ConvertKit JavaScript SDK (Recommended)
```javascript
// In docusaurus.config.js
scripts: [
  {
    src: 'https://f.convertkit.com/ckjs/ck.5.js',
    async: true,
  }
],

// In custom.css
.formkit-form[data-uid="YOUR_FORM_ID"] {
  /* Custom styling to match your site */
}
```

#### Option B: Simple API Endpoint
```javascript
// api/subscribe.js (Vercel function)
export default async function handler(req, res) {
  const { email, source } = req.body;
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.CONVERTKIT_API_KEY,
          email,
          tags: [source], // Track where they signed up
        })
      }
    );
    
    return res.json({ success: response.ok });
  } catch (error) {
    return res.status(500).json({ error: 'Subscription failed' });
  }
}
```

### Phase 2: Connect Existing Components (1 hour)

Since all frontend components are already built, we just need to:

1. **Update API endpoint** in components
2. **Add ConvertKit form IDs**
3. **Configure source tracking**

```javascript
// Update EmailCaptureForm.tsx
const CONVERTKIT_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? 'https://your-site.com/api/subscribe'
  : 'http://localhost:3000/api/subscribe';

// Or for native ConvertKit
const FORM_ID = 'YOUR_CONVERTKIT_FORM_ID';
```

### Phase 3: Strategic Placement (1 hour)

#### 1. Homepage Integration
```jsx
// src/pages/index.tsx
import { EmailCaptureForm, EmailCapturePopup, EmailCaptureBar } from '@site/src/components/EmailCapture';

export default function Home() {
  return (
    <Layout>
      <Hero>
        <EmailCaptureForm variant="hero" source="homepage-hero" />
      </Hero>
      
      {/* Rest of homepage */}
      
      <EmailCapturePopup source="homepage-popup" />
      <EmailCaptureBar source="homepage-footer" />
    </Layout>
  );
}
```

#### 2. Workout Page Integration
```jsx
// In workout MDX files
import { ContentEmailCapture } from '@site/src/components/EmailCapture';

## Today's Workout

[... workout content ...]

<ContentEmailCapture source={`workout-${frontMatter.week}-${frontMatter.day}`} />
```

#### 3. High-Value Content Pages
Target these pages for email capture:
- `/docs/training-philosophy/ferrero-alcaraz-methods` (high traffic)
- `/docs/exercises/exercise-database` (valuable reference)
- `/docs/workouts/overview` (program introduction)
- `/docs/specialized/tendon-health-science` (unique content)

## Source Tracking Strategy

Track where subscribers come from to optimize placement:

```javascript
// Source naming convention
const sources = {
  'homepage-hero': 'Direct homepage signup',
  'homepage-popup': 'Engaged visitor popup',
  'homepage-footer': 'Footer bar conversion',
  'workout-1-1': 'Week 1 Day 1 completion',
  'content-alcaraz': 'Alcaraz methods page',
  'announcement': 'Top bar click',
};
```

## ConvertKit Configuration

### 1. Create Tags for Each Source
- `source:homepage-hero`
- `source:homepage-popup`
- `source:homepage-footer`
- `source:workout-completion`
- `source:content-page`

### 2. Set Up Automation Rules
```
IF subscriber has tag "source:workout-completion"
THEN add tag "highly-engaged"

IF subscriber has tag "source:homepage-popup"
THEN add tag "browser"
```

### 3. Segment Welcome Emails
- Workout completers → "Great job finishing the workout!"
- Homepage signups → "Welcome to elite training!"
- Content readers → "Thanks for reading about [topic]"

## A/B Testing Plan (Built into ConvertKit)

### Test 1: Headlines
- A: "Get Your Free 7-Day Workout Plan"
- B: "Train Like Alcaraz - Free Guide"

### Test 2: Popup Timing
- A: 3 minutes
- B: 70% scroll depth

### Test 3: Value Proposition
- A: "Join 500+ Players Improving Their Game"
- B: "Science-Based Training from Pro Coaches"

## Performance Optimization

### 1. Lazy Load Components
```javascript
// Lazy load popup and footer bar
const EmailCapturePopup = lazy(() => import('./EmailCapture/EmailCapturePopup'));
const EmailCaptureBar = lazy(() => import('./EmailCapture/EmailCaptureBar'));
```

### 2. Debounce Visibility Triggers
```javascript
// Prevent performance issues
const debouncedScroll = debounce(handleScroll, 100);
```

### 3. Single ConvertKit Script
Load ConvertKit JS only once globally, not per component

## Mobile Optimization

All components already mobile-ready, but ensure:
- Touch-friendly tap targets (44px minimum)
- Readable font sizes (16px minimum)
- Proper viewport handling
- Smooth animations

## Launch Checklist

### Week 1: Setup
- [ ] Create ConvertKit account
- [ ] Configure forms and tags
- [ ] Set up automation
- [ ] Deploy API endpoint (if using)

### Week 2: Integration
- [ ] Connect all components
- [ ] Test each touchpoint
- [ ] Verify source tracking
- [ ] Check mobile experience

### Week 3: Launch
- [ ] Soft launch to 10% traffic
- [ ] Monitor conversions
- [ ] Fix any issues
- [ ] Full launch

### Week 4: Optimize
- [ ] Review conversion by source
- [ ] A/B test winners
- [ ] Remove poor performers
- [ ] Double down on winners

## Expected Results

With all touchpoints active:
- **Combined Conversion Rate**: 8-12%
- **Best Performer**: Content pages (5-8%)
- **Volume Driver**: Homepage hero (most traffic)
- **Engagement Driver**: Workout completions

## Monitoring Dashboard

Track these metrics weekly:
1. Conversions by source
2. Email open rates by source
3. Lead magnet download rate
4. Unsubscribe rate by source
5. Time to first conversion

## Simple Maintenance

### Weekly Tasks (30 min)
- Check conversion rates
- Review new subscribers
- Monitor email performance

### Monthly Tasks (1 hour)
- Optimize lowest performer
- Test new placement
- Update welcome content

## Technical Implementation Notes

### For Docusaurus specifically:
1. Use `useEffect` for client-side only code
2. Check `typeof window !== 'undefined'`
3. Use Docusaurus lifecycle hooks
4. Leverage MDX for content integration

### Example MDX Integration:
```mdx
---
sidebar_position: 1
---

import { ContentEmailCapture } from '@site/src/components/EmailCapture';

# Monday: Power & Agility

[... workout content ...]

## Ready for Tomorrow?

Get the complete 7-day plan delivered to your inbox:

<ContentEmailCapture 
  source="workout-week1-monday"
  message="Loved this workout? Get the full week's plan!"
/>
```

---

This approach maximizes conversion opportunities while keeping implementation straightforward. Start with Phase 1, test thoroughly, then expand to all touchpoints based on what converts best.
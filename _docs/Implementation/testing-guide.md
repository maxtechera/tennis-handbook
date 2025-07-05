# Email Capture Testing Guide

## Pre-Launch Testing Checklist

### 1. Local Development Testing

#### Setup Test Environment
```bash
# Start local development server
npm run start

# In another terminal, create a test API endpoint
# Create file: static/api/subscribe-test.js
```

#### Test API Endpoint (for local testing)
```javascript
// static/api/subscribe-test.js
module.exports = (req, res) => {
  console.log('Test subscription:', req.body);
  
  // Simulate success
  if (req.body.email.includes('success')) {
    return res.json({ success: true });
  }
  
  // Simulate already subscribed
  if (req.body.email.includes('exists')) {
    return res.status(400).json({ error: 'Already subscribed' });
  }
  
  // Simulate error
  return res.status(500).json({ error: 'Test error' });
};
```

### 2. Component Testing

#### Test Each Form Variant
- [ ] **Hero Form** (Homepage)
  - Navigate to homepage
  - Should see large form in hero section
  - Test with valid email
  - Test without consent checkbox
  - Verify success state

- [ ] **Popup Form** (3-minute timer)
  - Clear localStorage: `localStorage.clear()`
  - Wait 3 minutes on any page
  - Popup should appear
  - Test dismiss (X button)
  - Verify 24-hour cooldown

- [ ] **Footer Bar** (5-second delay)
  - Clear localStorage
  - Wait 5 seconds on any page
  - Footer bar should slide up
  - Test email submission
  - Test permanent dismiss

- [ ] **Inline Form** (Content pages)
  - Navigate to any workout page
  - Look for inline form in content
  - Test submission

### 3. Validation Testing

#### Email Validation
Test these emails:
- ✅ `test@example.com` - Should work
- ❌ `test@` - Should show error
- ❌ `@example.com` - Should show error
- ❌ `test` - Should show error
- ❌ ` ` (empty) - Should show error
- ✅ `test+tag@example.com` - Should work

#### Consent Testing
- [ ] Submit without checking consent - Should show error
- [ ] Error message in correct language (EN/ES)
- [ ] Submit with consent - Should succeed

### 4. API Integration Testing

#### Mock ConvertKit Responses
```javascript
// Test different scenarios
const testCases = [
  { email: 'new@test.com', expected: 'success' },
  { email: 'existing@test.com', expected: 'already subscribed error' },
  { email: 'error@test.com', expected: 'server error' },
];
```

#### Network Conditions
- [ ] Normal speed - Should work
- [ ] Slow 3G - Should show loading state
- [ ] Offline - Should show error message
- [ ] API timeout - Should handle gracefully

### 5. Spanish Language Testing

#### Switch to Spanish
```javascript
// Force Spanish language
localStorage.setItem('locale', 'es');
// Or navigate to /es/
```

#### Verify Translations
- [ ] Form labels in Spanish
- [ ] Placeholder text in Spanish
- [ ] Success message in Spanish
- [ ] Error messages in Spanish
- [ ] Consent text in Spanish

### 6. Analytics Testing

#### Check Events Fire
Open browser console and look for:
```javascript
// Should see these events
gtag('event', 'email_capture', {
  source: 'homepage-hero',
  language: 'en'
});

gtag('event', 'email_popup_shown');
gtag('event', 'email_popup_closed');
gtag('event', 'email_bar_dismissed');
```

### 7. Mobile Testing

#### Responsive Design
- [ ] iPhone SE (375px) - Form fits
- [ ] iPhone 14 (390px) - No overflow
- [ ] iPad (768px) - Proper layout
- [ ] Desktop (1200px+) - Centered

#### Touch Interactions
- [ ] Tap email field - Keyboard appears
- [ ] Submit button - Easy to tap
- [ ] Consent checkbox - Large hit area
- [ ] Popup close - Easy to dismiss

### 8. Performance Testing

#### Lighthouse Metrics
```bash
# Run Lighthouse
npm run build
npm run serve
# Open Chrome DevTools > Lighthouse
```

Target scores:
- Performance: >90
- Accessibility: >95
- Best Practices: 100
- SEO: 100

#### Bundle Size
Check that email capture adds <10KB:
```bash
# Check bundle size
npm run build
# Look at build output
```

### 9. Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile
- [ ] Safari Mobile

### 10. Production Testing

#### Pre-Deploy Checklist
- [ ] Update API endpoint URL in `src/config/api.ts`
- [ ] Set environment variables in Vercel/Netlify
- [ ] Test build locally: `npm run build && npm run serve`
- [ ] Check TypeScript: `npm run typecheck`

#### Post-Deploy Testing
1. **Immediate Tests**:
   - [ ] Submit test email
   - [ ] Check ConvertKit for new subscriber
   - [ ] Verify welcome email sent
   - [ ] Check API logs for errors

2. **Monitor First Hour**:
   - [ ] Check Vercel/Netlify function logs
   - [ ] Monitor error rate
   - [ ] Check conversion rate
   - [ ] Verify analytics tracking

### 11. A/B Testing Setup

#### Test Variations
```javascript
// In EmailCaptureForm.tsx
const headlines = {
  A: "Join 10,000+ Players Improving Their Game",
  B: "Get Elite Training Tips Weekly",
  C: "Free Workouts from Pro Coaches"
};

// Simple A/B test
const variant = Math.random() > 0.5 ? 'A' : 'B';
```

#### Track Performance
- Conversion rate per variant
- Best performing CTA text
- Optimal popup timing

### 12. Troubleshooting Common Issues

#### Form Not Submitting
```javascript
// Check console for errors
console.log('API URL:', API_CONFIG.SUBSCRIBE_URL);
console.log('Form data:', { email, source, consent });
```

#### CORS Errors
```javascript
// In your API handler, ensure:
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

#### Email Not Receiving
1. Check ConvertKit subscriber list
2. Check spam folder
3. Verify double opt-in settings
4. Test with different email providers

### Test Email Addresses

Use these for testing:
- `yourname+test1@gmail.com` - Different "emails" to same inbox
- `yourname+test2@gmail.com` - Gmail ignores everything after +
- `test@mailinator.com` - Public inbox for testing

### Success Criteria

Before launching:
- ✅ All form variants working
- ✅ Spanish translations complete
- ✅ API endpoint deployed and tested
- ✅ Welcome email sequence ready
- ✅ Analytics tracking verified
- ✅ Mobile responsive confirmed
- ✅ 3+ test subscribers received emails

### Post-Launch Monitoring

First 24 hours:
- Check conversion rate (target: >2%)
- Monitor error logs
- Respond to any user issues
- Test welcome email delivery
- Track source performance

---

Ready to test? Start with local development and work through each section! 🎾
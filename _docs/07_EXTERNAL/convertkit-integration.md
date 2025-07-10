# ConvertKit Integration - Complete Setup Guide

> **Status: ACTIVE** | Last updated: 2025-07-10

## Overview

This document provides comprehensive setup instructions for integrating ConvertKit email marketing platform with the Tenis Manual website. It consolidates all ConvertKit-related configuration, troubleshooting, and email templates.

## Prerequisites

- ConvertKit account (Creator plan - $29/month after 14-day trial)
- Vercel or Netlify account for API deployment
- Access to website environment variables

## 🎯 Quick Setup Checklist

### 1. Create ConvertKit Forms

- [ ] Go to ConvertKit Dashboard → Grow → Landing Pages & Forms
- [ ] Create "Tenis Manual - English" form
- [ ] Create "Tenis Manual - Spanish" form
- [ ] Save both Form IDs

### 2. Create All Tags

- [ ] Go to ConvertKit → Subscribers → Tags
- [ ] Create all tags from the Complete Tag List section (60+ tags)
- [ ] Copy/paste the tag list to create them quickly

### 3. Configure Environment Variables

- [ ] Copy `.env.example` to `.env`
- [ ] Add your ConvertKit API Secret
- [ ] Add your English Form ID (CONVERTKIT_FORM_ID_EN)
- [ ] Add your Spanish Form ID (CONVERTKIT_FORM_ID_ES)

### 4. Test Integration

```bash
# Install node-fetch if needed
npm install node-fetch

# Run the test script
node test-convertkit-integration.js
```

### 5. Verify in ConvertKit Dashboard

- [ ] Check that test subscribers appear in your forms
- [ ] Verify tags are being applied correctly
- [ ] Test both English and Spanish forms

## Tenis Manual Specific Configuration

### Form IDs and Tags

```bash
# Production Form IDs
MAIN_FORM_ID=8270854        # Primary subscriber form
ENGLISH_FORM_ID=8270854     # English form
SPANISH_FORM_ID=8270855     # Spanish-specific form

# Environment Variables Needed
CONVERTKIT_API_SECRET=sk_your_actual_secret_here
CONVERTKIT_FORM_ID_EN=8270854
CONVERTKIT_FORM_ID_ES=8270855
CONVERTKIT_FORM_ID=8270854
```

## Account Setup

### 1. Create ConvertKit Account

1. Visit https://convertkit.com
2. Select "Creator" account type
3. Complete 14-day free trial setup

### 2. Configure Account Settings

```
Profile Name: Tenis Manual
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
   Name: Tenis Manual Subscribers
   Type: Embedded Form
   ```

### 2. Add Custom Fields

Create these fields in Settings → Custom Fields:

#### Basic Fields (All Users)

- `source` (text) - Tracks signup location
- `language` (text) - User language preference
- `signup_date` (date) - Subscription timestamp
- `gdpr_consent` (text) - GDPR compliance

#### Onboarding Wizard Fields (Rich Data Collection)

- `experience_level` (text) - beginner, intermediate, advanced, competitive
- `current_training` (text) - none, gym-only, tennis-specific, professional
- `training_frequency` (text) - 1-2x, 3-4x, 5+x, daily
- `primary_goals` (text) - fitness, recreation, competition, professional (comma-separated)
- `injury_history` (text) - none, knee-ankle, shoulder-elbow, back, multiple (comma-separated)
- `biggest_challenge` (text) - power, endurance, consistency, recovery, technique
- `time_available` (text) - 30min, 45min, 60min, 90min+
- `equipment_access` (text) - none, basic, full-gym, tennis-facility
- `favorite_players` (text) - comma-separated list
- `playing_style` (text) - baseline, all-court, serve-volley, aggressive
- `content_preferences` (text) - videos, articles, workouts, analysis (comma-separated)
- `wizard_completion` (text) - partial, complete
- `wizard_completion_date` (date) - when wizard was completed

### 3. Configure Form Options

- Enable double opt-in (recommended for deliverability)
- Set success action to "Show success message"
- Enable GDPR features for EU compliance

## Complete Tag Structure

Create all these tags in ConvertKit Dashboard → Subscribers → Tags:

### Core Tags (Always Applied)

- `tennis-handbook` - Applied to all subscribers
- `onboarding-wizard` - All users who interact with wizard

### Language Tags

- `spanish` - Spanish language users
- `english` - English language users
- `high-engagement-3x` - High engagement users
- `spanish-preferred` - Spanish content preference

### Source Tracking Tags

- `homepage-hero` - Hero section signups
- `homepage-popup` - Popup conversions
- `homepage-footer` - Footer bar signups
- `workout-completion` - Post-workout signups
- `content-page` - Content page conversions
- `announcement` - Top bar clicks

### Experience Level Tags

- `level-beginner` - New to tennis training
- `level-intermediate` - Some tennis training experience
- `level-advanced` - Experienced tennis player
- `level-competitive` - Competitive/professional player
- `segment-beginner` - Beginner segment
- `segment-intermediate` - Intermediate segment
- `segment-advanced` - Advanced segment
- `segment-competitive` - Competitive segment

### Training Goal Tags

- `goal-competition` - Competitive improvement
- `goal-fitness` - Primary goal is fitness
- `goal-technique` - Technique focused
- `goal-fun` - Playing for fun/recreation

### Commitment Level Tags (Based on training frequency)

- `commitment-1-2` - 1-2 sessions per week
- `commitment-3-4` - 3-4 sessions per week
- `commitment-5-6` - 5-6 sessions per week
- `commitment-daily` - Daily training

### Special Behavior Tags

- `competitive-player` - Competitive players
- `injury-recovery` - Recovery/injury concerns
- `high-frequency-trainer` - 4+ sessions per week
- `advanced-fitness` - Advanced fitness level

### Communication Preference Tags

- `comm-email` - Email communication preference
- `comm-whatsapp` - WhatsApp preference
- `whatsapp-enabled` - WhatsApp enabled users
- `multi-channel-user` - Multi-channel preference

### Interest Tags

- `comm-weekly_tips` - Weekly tips interest
- `comm-pro_analysis` - Pro analysis interest
- `comm-new_workouts` - New workouts interest
- `comm-nutrition` - Nutrition interest

### Wizard Progress Tags

- `onboarding-wizard-started` - Started wizard
- `wizard-step-updated` - Updated wizard step
- `wizard-complete` - Completed full onboarding wizard
- `wizard-partial` - Started but didn't complete wizard

### Email Sequence Tags

- `sequence-spanish-beginner` - Spanish beginner sequence
- `sequence-competitive-edge` - Competitive edge sequence
- `sequence-injury-recovery` - Injury recovery sequence
- `sequence-beginner-welcome` - Beginner welcome sequence
- `sequence-intermediate-welcome` - Intermediate welcome sequence
- `sequence-advanced-welcome` - Advanced welcome sequence

### Engagement Tags

- `highly-engaged` - Completed workouts
- `browser` - Popup interactions
- `lead-magnet-downloaded` - Downloaded PDF

### Player Preference Tags (From Wizard)

- `fan-djokovic` - Djokovic fan/style preference
- `fan-alcaraz` - Alcaraz fan/style preference
- `fan-sinner` - Sinner fan/style preference
- `fan-medvedev` - Medvedev fan/style preference

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
2. Name: "Tenis Manual Welcome Series"
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

### ConvertKit API Call (Basic Form)

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

### ConvertKit API Call (Onboarding Wizard)

```javascript
POST https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
Content-Type: application/json

{
  "api_secret": "YOUR_API_SECRET",
  "email": "user@example.com",
  "fields": {
    // Basic fields
    "source": "homepage-hero",
    "language": "en",
    "signup_date": "2025-07-05T10:00:00Z",
    "gdpr_consent": "yes",

    // Onboarding wizard fields
    "experience_level": "intermediate",
    "current_training": "tennis-specific",
    "training_frequency": "3-4x",
    "primary_goals": "competition,fitness",
    "injury_history": "none",
    "biggest_challenge": "power",
    "time_available": "60min",
    "equipment_access": "full-gym",
    "favorite_players": "alcaraz,sinner",
    "playing_style": "aggressive",
    "content_preferences": "workouts,videos",
    "wizard_completion": "complete",
    "wizard_completion_date": "2025-07-05T10:05:00Z"
  },
  "tags": [
    // Base tags
    "tennis-handbook", "homepage-hero", "english", "wizard-complete",

    // Experience and goal tags
    "experience-intermediate", "goal-competition", "goal-fitness",

    // Challenge and preference tags
    "challenge-power", "fan-alcaraz", "fan-sinner"
  ]
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

## Email Templates

### 📧 Subject Lines (A/B Test)

- **Option A**: 🎾 Tu entrenamiento elite te está esperando (PDF incluido)
- **Option B**: ⚡ Descarga tu rutina de 7 días - Métodos de campeones
- **Option C**: 🏆 ¡Bienvenido! Tu PDF está listo para descargar

### 📝 Email Template (Spanish)

```html
¡Hola [FIRST_NAME]! 🎾 **¡Bienvenido al entrenamiento de élite!** Gracias por
unirte a nuestra comunidad. Como prometimos, aquí tienes tu rutina gratuita de 7
días con los métodos exactos que usan los mejores jugadores del mundo. **👇
DESCARGA TU PDF AHORA:** [🔥 DESCARGAR: Rutina Elite de 7
Días](https://tennis-handbook.vercel.app/downloads/7-day-elite-tennis-workout-spanish.pdf)
**🏆 Lo que encontrarás dentro:** ✅ Rutinas de medallistas olímpicos ✅ Métodos
de entrenadores del ATP Tour ✅ Ejercicios específicos para tenis ✅ Plan
progresivo de 7 días ✅ Técnicas de Ferrero, Panichi y más **📱 Próximos
pasos:** 1. Descarga y guarda tu PDF 2. Empieza con el Día 1 mañana 3. Revisa tu
email - te enviaremos consejos exclusivos cada semana ¿Tienes WhatsApp? Responde
con tu número y te enviaremos updates directos. **¡A entrenar como los
campeones!** Equipo Elite Tennis Training P.D: Guarda este email - tu PDF estará
siempre disponible aquí. --- *¿No quieres más emails? [Cancelar suscripción]({{
unsubscribe_url }})*
```

### 📝 Email Template (English)

```html
Hi [FIRST_NAME]! 🎾 **Welcome to elite training!** Thanks for joining our
community. As promised, here's your free 7-day routine with the exact methods
used by the world's best players. **👇 DOWNLOAD YOUR PDF NOW:** [🔥 DOWNLOAD:
7-Day Elite
Routine](https://tennis-handbook.vercel.app/downloads/7-day-elite-tennis-workout.pdf)
**🏆 What you'll find inside:** ✅ Olympic medalist routines ✅ ATP Tour coach
methods ✅ Tennis-specific exercises ✅ Progressive 7-day plan ✅ Ferrero,
Panichi techniques & more **📱 Next steps:** 1. Download and save your PDF 2.
Start with Day 1 tomorrow 3. Check your email - we'll send exclusive tips weekly
Got WhatsApp? Reply with your number for direct updates. **Train like the
champions!** Elite Tennis Training Team P.S: Save this email - your PDF will
always be available here. --- *Don't want more emails? [Unsubscribe]({{
unsubscribe_url }})*
```

### ⚙️ Email Sequence Setup Instructions

1. **Create Email Sequence:**

   - Go to ConvertKit → Automate → Sequences
   - Create "Tennis PDF Delivery - Spanish"
   - Create "Tennis PDF Delivery - English"

2. **Trigger Setup:**

   - Trigger: When subscriber is added to form
   - Wait: 0 minutes (immediate delivery)
   - Send: PDF delivery email

3. **Form Configuration:**

   - Link forms to respective email sequences
   - Spanish form → Spanish sequence
   - English form → English sequence

4. **PDF Hosting:**
   - Upload PDFs to: `/public/downloads/`
   - Spanish: `7-day-elite-tennis-workout-spanish.pdf`
   - English: `7-day-elite-tennis-workout.pdf`

## Troubleshooting Guide

### 🔍 Where to Find Subscribers in ConvertKit

#### 1. Check Your Forms First

- Go to **Grow → Landing Pages & Forms**
- Click on your specific form (ID: 8270854)
- Click **"View Subscribers"** on the form
- This shows ONLY subscribers from this specific form

#### 2. Check Subscribers Dashboard

- Go to **Subscribers → Subscribers**
- Look for recent signups by date
- Check if they have the tags you expect (tennis-handbook, spanish, etc.)
- Sort by "Date Added" to see newest first

#### 3. Check by Email Address

- In Subscribers dashboard, use the search box
- Search for the specific email address you tested with
- This will show if the subscriber exists at all

### 🧐 Common Issues & Solutions

#### Issue 1: "Server configuration error"

- Check your API Secret is correct
- Ensure Form IDs are set
- Verify environment variables are loaded

#### Issue 2: "API Key not valid"

- Double-check your ConvertKit API Secret
- Make sure you're using the API Secret, not API Key
- Check for extra spaces or characters

#### Issue 3: Subscribers not appearing

- Verify Form IDs match your ConvertKit forms
- Check that tags exist in ConvertKit
- Look for subscribers in the specific forms, not just general subscribers

#### Issue 4: Subscribers Going to Wrong Form

- **Check:** Your form ID in the API response logs
- **Fix:** Verify `CONVERTKIT_FORM_ID=8270854` matches your actual form

#### Issue 5: Subscribers in "Unconfirmed" State

- **Check:** Subscriber state in ConvertKit
- **Fix:** Look for subscribers with "unconfirmed" status - they need to click email confirmation

#### Issue 6: Multiple Forms Confusion

- **Check:** How many forms you have
- **Fix:** Make sure you're looking at the correct form for your language/setup

#### Issue 7: Tag Filtering

- **Check:** If you're filtering by tags
- **Fix:** Remove all filters and look for raw subscribers

#### Issue 8: Development Mode Active

- This is normal during development
- Real ConvertKit integration will work in production
- Check `.env` file has correct credentials

### 🛠️ Debugging Commands

#### Test ConvertKit API Directly

```bash
curl -X POST "https://api.convertkit.com/v3/forms/8270854/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "api_secret": "your_secret_here",
    "email": "debug@test.com",
    "fields": {"source": "debug-test"},
    "tags": ["debug-subscriber"]
  }'
```

#### Check Subscriber via API

```bash
curl "https://api.convertkit.com/v3/subscribers?api_secret=your_secret_here&email_address=debug@test.com"
```

#### Test Local Integration

```bash
# Test ConvertKit integration
node test-convertkit-integration.js

# Test local API endpoint
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "consent": true, "source": "test"}'

# Start development server
vercel dev
```

### 📊 What to Look For

#### In ConvertKit Dashboard:

1. **Recent Activity** - Check subscriber activity feed
2. **Form Analytics** - See if form is receiving submissions
3. **Email Deliverability** - Check if emails are being sent
4. **Automation Triggers** - See if sequences are triggering

#### In Your API Logs:

1. **Successful subscription** - Status 200 responses
2. **Subscriber ID** - ConvertKit returns subscriber ID
3. **Tags applied** - Verify tags are being set
4. **Form ID matches** - Ensure using correct form

### 🎯 Step-by-Step Verification

#### Step 1: Find Your Test Subscriber

1. Go to ConvertKit dashboard
2. Navigate to **Subscribers → Subscribers**
3. Search for your test email address
4. Note the subscriber's status and tags

#### Step 2: Check Form-Specific Subscribers

1. Go to **Grow → Landing Pages & Forms**
2. Find form ID 8270854
3. Click "View Subscribers"
4. Look for your test email

#### Step 3: Verify Email Sequence

1. Check if confirmation email was sent
2. Look at subscriber timeline/activity
3. Verify automation sequences triggered

#### Step 4: Test with Fresh Email

1. Use a completely new email address
2. Go through the full flow
3. Watch ConvertKit dashboard in real-time
4. Check both form and general subscribers list

### 🚨 Red Flags to Check

- ❌ **Subscriber status: "Unconfirmed"** → They need to confirm email
- ❌ **Wrong form ID in logs** → Check environment variables
- ❌ **No tags applied** → Tags might not exist in ConvertKit
- ❌ **API errors in logs** → Check API secret and permissions
- ❌ **Multiple accounts** → Make sure you're in the right ConvertKit account

### 📞 Next Steps if Still Not Found

1. **Check server logs** for actual ConvertKit API responses
2. **Verify form ID** matches exactly in dashboard
3. **Test with completely fresh email** and watch dashboard
4. **Check if using ConvertKit sandpit/test mode**
5. **Verify API secret** has correct permissions

### 📊 Expected Results

After setup, you should see:

- ✅ Test subscribers in your ConvertKit forms
- ✅ Tags automatically applied to subscribers
- ✅ Different tags for Spanish vs English users
- ✅ Segmentation based on tennis level, goals, etc.
- ✅ No more "Server configuration error" messages

### Common Issues (Additional)

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

**Key Insight:** If the PDF download works and you see success messages, the integration IS working - the subscribers are likely there, just in a different view than expected.

## Support Resources

- ConvertKit API Docs: https://developers.convertkit.com
- Support: help@convertkit.com
- Status Page: https://status.convertkit.com
- Community: https://community.convertkit.com

## Tenis Manual Tracking Setup

### Custom Event Tracking

```javascript
// Track workout completions
convertkit.tagSubscriber(email, "workout-completed", {
  workout_id: "week1-monday",
  duration: "45min",
  language: "es",
});

// Track content unlocks
convertkit.tagSubscriber(email, "content-unlocked", {
  tier: "week2",
  method: "progressive",
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

### Tenis Manual Specific Metrics

- **Current**: 500+ subscribers
- **Open Rate**: 48% (vs 21% industry average)
- **Click Rate**: 12% (vs 2.6% average)
- **Spanish Engagement**: 3x higher than English

## Onboarding Wizard Email Sequences

### Segmented Welcome Sequences

#### Beginner Track (experience-beginner)

**Email 1** (Immediate): Welcome + 7-Day Plan

- Subject: "Your Elite Tennis Training Journey Starts Now! 🎾"
- PDF download + foundation building focus
- Set expectations for beginner-friendly content

**Email 2** (+1 day): Tennis vs Gym Training

- Subject: "Why tennis players can't just hit the gym"
- Education on tennis-specific movement patterns
- Teaser for Week 2 content

**Email 3** (+3 days): Safety First

- Subject: "The injury that could have been prevented"
- Focus on proper form and injury prevention
- Emphasize gradual progression

**Email 4** (+5 days): Building Power Safely

- Subject: "How to get powerful without getting hurt"
- Introduction to power development concepts
- Link to beginner-friendly exercises

**Email 5** (+7 days): Your Path Forward

- Subject: "Ready for the next level?"
- Introduction to full 12-week program
- Gentle conversion opportunity

#### Intermediate Track (experience-intermediate)

**Email 1** (Immediate): Welcome + Advanced Insights

- Subject: "Time to unlock your hidden potential 🚀"
- PDF download + intermediate-specific tips
- Acknowledge existing experience level

**Email 2** (+1 day): Elite Player Secrets

- Subject: "What Alcaraz does that you don't"
- Advanced technique insights
- Performance optimization focus

**Email 3** (+3 days): Breaking Plateaus

- Subject: "Stuck? Here's how pros break through"
- Address common intermediate challenges
- Progressive overload principles

**Email 4** (+5 days): Mental Game

- Subject: "The psychology of elite performance"
- Mental training aspects
- Competition preparation

**Email 5** (+7 days): Complete Transformation

- Subject: "Ready to train like a pro?"
- Full program introduction
- Competitive advantage messaging

#### Advanced/Competitive Track (experience-advanced, experience-competitive)

**Email 1** (Immediate): Elite Welcome

- Subject: "Welcome to elite-level training 🏆"
- PDF + advanced periodization concepts
- Acknowledge high performance goals

**Email 2** (+1 day): Pro Training Insights

- Subject: "Inside Sinner's training camp"
- Behind-the-scenes pro training methods
- Scientific approach to performance

**Email 3** (+3 days): Marginal Gains

- Subject: "The 1% improvements that win titles"
- Focus on optimization and details
- Advanced recovery techniques

**Email 4** (+5 days): Competition Prep

- Subject: "Peak when it matters most"
- Periodization and peaking strategies
- Mental preparation for competition

**Email 5** (+7 days): Elite Membership

- Subject: "Join the elite training community"
- Premium program positioning
- Community access and coaching

### Challenge-Based Sequences

#### Power Development (challenge-power)

- Focus on explosive training methods
- References to power-based players (Sinner, Medvedev)
- Gym-based training progressions
- Serve development content

#### Endurance Focus (challenge-endurance)

- Aerobic and anaerobic conditioning
- References to endurance-based players (Djokovic)
- Court-specific conditioning drills
- Recovery and nutrition support

#### Injury Recovery (challenge-recovery, injury_history != "none")

- Conservative training approaches
- Rehabilitation and prevention focus
- Movement quality emphasis
- Professional guidance recommendations

#### Consistency Issues (challenge-consistency)

- Technical refinement focus
- Practice structure and quality
- Mental game and concentration
- Repetition and muscle memory

### Player Preference Content

#### Djokovic Fans (fan-djokovic)

- Flexibility and mobility focus
- Mental toughness content
- Defensive to offensive transitions
- Longevity and career management

#### Alcaraz Fans (fan-alcaraz)

- Explosive power development
- All-court game development
- Young athlete considerations
- Aggressive baseline play

#### Sinner Fans (fan-sinner)

- Technical precision focus
- Power with control
- Modern forehand techniques
- Consistent improvement mindset

#### Medvedev Fans (fan-medvedev)

- Unique style development
- Problem-solving on court
- Analytical approach to tennis
- Adaptation and versatility

### Automation Triggers

#### Wizard Completion Bonus

```
IF subscriber.tag = "wizard-complete" THEN
  Wait 10 minutes
  Send bonus content email with personal training plan
  Add tag "onboarding-complete"
END
```

#### Engagement-Based Sequences

```
IF subscriber.tag = "highly-engaged" AND "wizard-complete" THEN
  Add to advanced training sequence
  Remove from beginner sequences
  Tag with "ready-for-premium"
END
```

#### Re-engagement for Partial Completion

```
IF subscriber.tag = "wizard-partial" THEN
  Wait 24 hours
  Send re-engagement email with incentive
  Offer simplified completion path
END
```

This comprehensive segmentation ensures every user receives highly relevant content based on their specific profile, dramatically improving engagement and conversion rates.

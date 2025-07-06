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
- `wizard-complete` - Completed full onboarding wizard
- `wizard-partial` - Started but didn't complete wizard

### Experience Level Tags (From Wizard)
- `experience-beginner` - New to tennis training
- `experience-intermediate` - Some tennis training experience
- `experience-advanced` - Experienced tennis player
- `experience-competitive` - Competitive/professional player

### Goal-Based Tags (From Wizard)
- `goal-fitness` - Primary goal is fitness
- `goal-recreation` - Playing for fun/recreation
- `goal-competition` - Competitive improvement
- `goal-professional` - Professional development

### Challenge-Based Tags (From Wizard)
- `challenge-power` - Needs power development
- `challenge-endurance` - Needs endurance improvement
- `challenge-consistency` - Consistency issues
- `challenge-recovery` - Recovery/injury concerns
- `challenge-technique` - Technique focused

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
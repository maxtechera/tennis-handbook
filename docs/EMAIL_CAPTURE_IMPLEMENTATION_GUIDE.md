# Email Capture Implementation Guide - MAX-46

## ✅ What's Already Done

1. **Frontend Components** - All email capture UI components are built and integrated:
   - EmailCaptureForm (4 variants: hero, inline, popup, footer)
   - EmailCapturePopup (3-minute timer)
   - EmailCaptureBar (sticky footer)
   - Spanish translations
   - GDPR compliance

2. **Homepage Integration** - Email capture is live on:
   - Hero section form
   - Timed popup (3 minutes)
   - Sticky footer bar (5 seconds)

## 🎯 Next Steps (Priority Order)

### 1. ConvertKit Setup (Today - 30 minutes)

1. **Sign up at ConvertKit** (https://convertkit.com)
   - Use the Creator plan ($29/month after 14-day trial)
   - Best for content creators and course sellers

2. **Create Form in ConvertKit**:
   - Name: "Tennis Handbook Subscribers"
   - Add custom fields:
     - `source` (text) - tracks where they signed up
     - `language` (text) - for Spanish vs English
   - Enable double opt-in for GDPR compliance

3. **Get API Credentials**:
   - Account Settings → Advanced → API Secret
   - Copy your API Secret (starts with `sk_`)
   - Find your Form ID in the form URL

### 2. Deploy API Endpoint (1 hour)

**Option A: Vercel (Recommended for Docusaurus)**

Create `api/subscribe.js` in your project root:

```javascript
export default async function handler(req, res) {
  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Origin', 'https://tennishandbook.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'website', consent, language = 'en' } = req.body;

  // Validate
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!consent) {
    return res.status(400).json({ error: 'Consent required' });
  }

  try {
    // Add to ConvertKit
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_secret: process.env.CONVERTKIT_API_SECRET,
          email,
          fields: { source, language },
          tags: ['tennis-handbook', source, language]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to subscribe');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ 
      error: 'Failed to subscribe. Please try again.' 
    });
  }
}
```

**Vercel Environment Variables**:
```bash
CONVERTKIT_API_SECRET=sk_your_secret_here
CONVERTKIT_FORM_ID=your_form_id_here
```

**Option B: Netlify Functions**

Create `netlify/functions/subscribe.js`:
```javascript
exports.handler = async (event, context) => {
  // Similar implementation but with Netlify syntax
  // Return { statusCode, body: JSON.stringify(data) }
};
```

### 3. Update Frontend Configuration (15 minutes)

1. **Update EmailCaptureForm.tsx** endpoint URL:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.vercel.app/api/subscribe'
  : 'http://localhost:3000/api/subscribe';
```

2. **Add to docusaurus.config.ts**:
```javascript
customFields: {
  emailApiUrl: process.env.EMAIL_API_URL || '/api/subscribe',
},
```

### 4. Create Lead Magnet PDF (2 hours)

**"7-Day Elite Tennis Workout Plan" Content Structure**:

```markdown
# 7-Day Elite Tennis Workout Plan
## Based on Pro Training Methods

### Day 1: Power Foundation
- Dynamic Warmup (10 min)
- Medicine Ball Slams: 3x8
- Box Jumps: 3x5
- Single-Leg RDLs: 3x10/side
- Core Circuit: 3 rounds

### Day 2: Court Movement
- Agility Ladder: 10 min
- Lateral Bounds: 3x8/side
- Spider Drill: 3x30s
- Recovery: Foam Rolling

### Day 3: Upper Body Strength
- Pull-ups: 3x8
- DB Shoulder Press: 3x10
- Cable Rotations: 3x15/side
- Band Work: 15 min

### Day 4: Active Recovery
- Light Cardio: 20-30 min
- Mobility Flow: 20 min
- Tendon Loading: Light

### Day 5: Lower Body Power
- Trap Bar Jumps: 5x3
- Split Squats: 3x10/side
- Hamstring Curls: 3x12
- Calf Raises: 3x15

### Day 6: Total Body Integration
- Turkish Get-ups: 3x5/side
- Battle Ropes: 5x20s
- Plank Variations: 3 rounds
- Cool Down: 15 min

### Day 7: Recovery & Planning
- Self-Assessment
- Light Movement
- Plan Next Week
- Nutrition Review

### Bonus: Quick Reference Videos
- QR codes linking to form demonstrations
- Common mistake corrections
- Pro tips for each exercise
```

**Design Tips**:
- Use Canva Pro for professional design
- Include your branding (colors, logo)
- Add value with exercise images
- Make it printable (8.5x11" format)

### 5. Welcome Email Sequence (1 hour)

**Email 1: Instant Delivery**
```
Subject: Your 7-Day Tennis Workout Plan is here! 🎾

Hey [Name],

Welcome to the Tennis Handbook community!

Your 7-Day Elite Tennis Workout Plan is attached to this email.

Here's what to do next:
1. Print out the PDF (or save it to your phone)
2. Start with Day 1 tomorrow morning
3. Reply with any questions - I read every email

Quick tip: The pros don't train harder, they train smarter. This plan shows you exactly how.

Let's get after it!
[Your name]

P.S. Tomorrow I'll share the #1 mistake club players make with their fitness (and how to fix it).
```

**Email 2: Day 1 - Common Mistake**
```
Subject: The #1 fitness mistake tennis players make

[Name],

How was Day 1 of your workout plan?

Here's what most players get wrong:
They train like bodybuilders, not athletes.

The pros? They focus on explosive power and injury prevention.

That's why your plan includes:
- Medicine ball work (power)
- Single-leg exercises (balance)
- Core rotation (injury prevention)

Tomorrow: The recovery secret that changed Djokovic's career.

Keep pushing!
[Your name]
```

**Email 3: Day 3 - Recovery Secret**
```
Subject: Djokovic's recovery secret (it's not what you think)

[Name],

You're on Day 3 now. Feeling it?

Here's something interesting:
Djokovic spends MORE time on recovery than training.

Not just stretching. We're talking:
- Specific tendon loading protocols
- Timed mobility work
- Strategic rest periods

Your Day 4 active recovery is based on these exact principles.

Friday: The one exercise every tennis player should do (but 90% skip).

Almost there!
[Your name]
```

**Email 4: Day 5 - Key Exercise**
```
Subject: The one exercise every tennis player needs

[Name],

Day 5! You're crushing it.

The exercise? Single-leg RDLs.

Why pros swear by it:
- Prevents hamstring injuries
- Improves serve power
- Fixes hip imbalances

You did these on Day 1. Now you know why.

Next email: How to know if your training is actually working.

Stay strong!
[Your name]
```

**Email 5: Day 7 - Next Steps**
```
Subject: You did it! Here's what's next...

[Name],

Congrats on completing your first week! 🎉

How do you feel?

Here's how to know it's working:
- Less fatigue during matches
- More explosive first steps
- Fewer aches and pains

Want to keep going?

I'm working on something special:
A complete 12-week program with video demonstrations.

Interested? Reply and let me know.

Either way, keep training smart!
[Your name]

P.S. Check out the free workouts at [website] anytime.
```

### 6. Testing Checklist

Before going live, test:

- [ ] Email submission works (try your email)
- [ ] ConvertKit receives the subscriber
- [ ] Welcome email delivers within 2 minutes
- [ ] PDF attachment works
- [ ] Spanish version triggers Spanish emails
- [ ] Error handling (invalid email, network issues)
- [ ] Analytics events fire correctly
- [ ] Mobile responsive on all devices

### 7. Launch Day Tasks

1. **Deploy Changes**:
   ```bash
   npm run build
   npm run serve # test locally
   git push origin main # deploy
   ```

2. **Monitor First Hour**:
   - Check Vercel/Netlify logs
   - Verify ConvertKit subscribers
   - Test full flow yourself
   - Check analytics

3. **Quick Optimizations**:
   - A/B test: "Get Free Workouts" vs "Join 500+ Players"
   - Test popup timing: 3 min vs 5 min
   - Track conversion by source

## 📊 Success Metrics

**Week 1 Goals**:
- 50+ email subscribers
- 2%+ conversion rate
- 80%+ email open rate
- 40%+ welcome series completion

**Month 1 Goals**:
- 200+ subscribers
- Identify top converting pages
- Test 3 different lead magnets
- 10+ replies to emails

## 💰 Revenue Path

Subscribers → Engaged Readers → Course Buyers

1. **Month 1-2**: Build trust with free value
2. **Month 3**: Soft launch paid program to email list
3. **Month 4+**: Scale with ads to high-converting content

Each 100 subscribers = ~3 course buyers at $97 = $291 revenue

**To reach $1000/month**: ~350 engaged subscribers

## 🚀 Quick Start Commands

```bash
# Install ConvertKit package (optional, for advanced features)
npm install @convertkit/convertkit-js

# Test locally
npm run start

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Check TypeScript
npm run typecheck
```

## 🆘 Common Issues

**CORS Error**: Add your domain to API allowed origins
**Emails not sending**: Check ConvertKit API key and form ID
**PDF not attaching**: Use ConvertKit's "Incentive Email" feature
**Low conversion**: Test different headlines and button text

---

Ready to launch? Start with ConvertKit setup and let's get those first 100 subscribers! 🎾
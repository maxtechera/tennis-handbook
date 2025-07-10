# Progressive Disclosure Strategy

**Document Status**: 🟢 Active  
**Lifecycle**: Monthly Review  
**Last Updated**: January 2025  
**Linear Project**: [Tenis Manual](https://linear.app/max-techera/project/tennis-handbook)

---

## 🎯 Strategic Overview

Transform Tenis Manual from "give everything away free" to sophisticated progressive disclosure that builds engaged email audience and creates monetization pathways. Leverages validated Spanish market advantage (3x engagement).

**Core Principle**: Progressive value delivery through email capture, content gating, and gradual feature unlocking.

## 📊 Current Problem: Information Overload

### What's Wrong

- **Full 12-week program** accessible free
- **Complete database** available immediately
- **All methods** visible without signup
- **No pressure** - consume without engagement
- **Result**: High bounce, low emails, zero revenue

### User Behavior

- **Session**: 6 min (EN), 18 min (ES)
- **Completion**: <5% finish any week
- **Return**: 25% (EN), 75% (ES) within 7 days
- **Email Rate**: 2.1% overall, 4.2% Spanish

## 🏗️ Progressive Disclosure Framework

### Tier 1: Free Teaser (Public)

**Purpose**: Establish credibility, showcase quality, create desire

**Visible Without Signup:**

- Training philosophy overview (not full)
- Sample workouts (Day 1-2, Week 1 only)
- Basic demos (10-15 exercises)
- Method introductions (overview only)
- Equipment guide (basic)

**Messaging**: "This is just the beginning. Get full access with email."

### Tier 2: Email Gate

**Immediate Delivery:**

- 7-Day Elite Tennis Workout PDF
- Welcome sequence (5 emails/7 days)
- Week 1 complete workouts unlocked

**Value Prop**: "Get Alcaraz's coach training plan - FREE"

### Tier 3: Progressive Unlocks

**Week 1 (Email 2)**: Exercise Database

- Complete library (100+ exercises)
- Detailed form instructions
- Bonus: Exercise Mastery Checklist

**Week 2 (Email 4)**: Program Access

- Weeks 2-4 unlocked
- Training philosophy deep-dives
- Bonus: Weekly Planning Template

**Week 3 (Email 6)**: Specialized Methods

- Tendon health protocols
- Power development
- Recovery systems
- Bonus: Elite Recovery Handbook

**Week 4 (Email 8)**: Advanced Content

- Complete 12-week program
- Competition protocols
- Bonus: Tournament Prep Checklist

### Tier 4: Premium (Paid)

**Spanish Launch (Month 2)**: €19-29/month

- Daily personalized workouts
- Progress tracking
- Spanish video demos
- WhatsApp community

**English Launch (Month 3)**: $19-29/month

- Same features, individual focus
- Email vs WhatsApp preference

## 📧 Email Capture Strategy

### Multi-Touchpoint System

**1. Homepage Hero** (Primary)

- ES: "Entrena como Alcaraz - Plan de 7 días GRATIS"
- EN: "Train Like Alcaraz - 7-Day Plan FREE"
- Spanish converts 2.3x better

**2. Content Gates** (High Intent)

- Context-aware: "Unlock this workout with email"
- Expected: 5-8% conversion

**3. Exit Intent** (Rescue)

- 3-min delay or exit detection
- Once per 30 days
- ES: "Último momento - Descarga GRATIS"

**4. Sticky Footer** (Persistent)

- 5-sec delay, dismissible
- Mobile optimized
- ES: "Únete a miles de tenistas elite"

### Email Sequence (7 Days)

**Email 1: Instant**

- PDF + Week 1 access
- WhatsApp invite (Spanish)

**Email 2: Day 2**

- Unlock exercise database
- Teaching: Elite vs generic

**Email 3: Day 4**

- Unlock Weeks 2-4
- Teaching: Recovery secrets

**Email 4: Day 6**

- Unlock advanced methods
- Teaching: Tennis-specific science

**Email 5: Day 7**

- Full access granted
- Premium preview
- Survey invitation

## 🌐 Spanish-First Implementation

### Why Spanish First

- 3x engagement validated
- 2x email conversion
- 82% video preference
- Community oriented
- Higher pricing tolerance

### Spanish Adaptations

- PDF workout cards demand
- WhatsApp > email preference
- Video demos critical (82% vs 45%)
- Spanish players as examples
- Euro pricing

### Technical Setup

- Separate ConvertKit forms by language
- Language-based automation
- Tags: "es-subscriber", "en-subscriber"
- Spanish sending times

## 🔧 Technical Implementation

### Content Gating

```jsx
{
  hasEmailAccess ? (
    <FullWorkoutContent />
  ) : (
    <EmailCaptureGate
      content="workout-week2"
      message="Unlock Weeks 2-4 with email"
    />
  );
}
```

### ConvertKit Automation

1. **Day 0**: Signup → PDF + Tag "new"
2. **Day 2**: Unlock database + Tag "week1"
3. **Day 4**: Unlock weeks 2-4 + Tag "committed"
4. **Day 6**: Unlock advanced + Tag "advanced"
5. **Day 7**: Full access + Tag "full"

### Analytics Tracking

- Conversion by source/language
- Unlock progression rates
- Email engagement metrics
- Premium interest signals

## 🚀 Launch Timeline

### Phase 1: Foundation (Week 1-2)

- Implement gating system
- Deploy capture forms
- Launch 7-day PDF
- Begin email delivery

### Phase 2: Optimize (Week 3-4)

- A/B test subjects
- Optimize by source
- Gather feedback
- Refine timing

### Phase 3: Spanish Premium (Month 2)

- Launch €19-29/month
- WhatsApp community
- Video content
- Feature testing

### Phase 4: English Scale (Month 3)

- Adapt Spanish model
- $19-29/month pricing
- Individual focus
- Feature refinements

## 📊 Success Metrics

### Email Growth

- **Month 1**: 1,000+ subscribers
- **Month 2**: 2,500+ subscribers
- **Month 3**: 5,000+ subscribers

### Engagement

- **Open Rate**: 40%+, 45%+ Spanish
- **Completion**: 60%+ finish series
- **Progression**: 40%+ unlock all
- **Premium**: 3-5% ES, 2-3% EN

### Revenue

- **Spanish**: €19-29 validated Month 2
- **English**: $19-29 validated Month 3
- **Target**: €15,000+ MRR Month 6

## 🔄 Optimization Cycle

### Weekly

- Email performance review
- Conversion optimization
- User feedback integration
- ES vs EN comparison

### Monthly

- New lead magnets
- Sequence refinements
- Feature development
- Community improvements

### Quarterly

- Market expansion
- Pricing optimization
- Roadmap adjustments
- Competitive analysis

---

**Impact**: Transforms free resource into sophisticated lead generation and monetization machine leveraging Spanish advantage and gradual value delivery.

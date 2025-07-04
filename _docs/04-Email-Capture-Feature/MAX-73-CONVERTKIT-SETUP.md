# MAX-73: ConvertKit Account Setup Guide

## 🎯 Goal
Set up ConvertKit account and configure it for Tennis Handbook email capture in 30 minutes.

## ✅ Step-by-Step Setup

### 1. Create ConvertKit Account (5 min)
1. Go to https://convertkit.com
2. Click "Get started free"
3. Choose "Creator" account type
4. Use your Tennis Handbook email
5. 14-day free trial, then $29/month

### 2. Initial Account Setup (5 min)
1. **Profile Settings**:
   - Name: Tennis Handbook (or your brand name)
   - From Email: hello@tennishandbook.com
   - Website: https://tennishandbook.com

2. **Email Authentication** (Important!):
   - Go to Settings → Email → Sending
   - Follow steps to verify your domain
   - This improves deliverability

### 3. Create Your Form (10 min)

1. **Navigate**: Grow → Landing Pages & Forms → Create New → Form

2. **Form Settings**:
   ```
   Name: Tennis Handbook Subscribers
   Type: Embedded Form (not landing page)
   ```

3. **Form Fields**:
   - Email (default)
   - Add Custom Field: `source` (text) - Hidden field
   - Add Custom Field: `language` (text) - Hidden field
   - Add Custom Field: `signup_date` (date) - Hidden field

4. **Form Design**:
   - Keep it minimal (we're using our own design)
   - Just need the form to exist for API

5. **Success Action**:
   - Send incentive email (for PDF delivery)
   - Redirect: Stay on page (we handle this)

### 4. Create Tags (5 min)

Go to Subscribers → Tags and create:
- `tennis-handbook` (all subscribers)
- `english` (English speakers)
- `spanish` (Spanish speakers)
- `homepage-hero` (source tracking)
- `popup` (source tracking)
- `footer-bar` (source tracking)
- `content-page` (source tracking)

### 5. Set Up Welcome Sequence (10 min)

1. **Create Sequence**: 
   - Emails → Sequences → New Sequence
   - Name: "Tennis Handbook Welcome Series"

2. **Upload Lead Magnet**:
   - Emails → Broadcasts → Incentives
   - Upload your PDF: "7-Day Elite Tennis Workout Plan"
   - Get the download URL

3. **Email 1 - Instant Delivery**:
   ```
   Subject: Your 7-Day Tennis Workout Plan is here! 🎾
   
   Add PDF download button/link
   Copy content from welcome email template
   ```

4. **Schedule Remaining Emails**:
   - Email 2: Wait 1 day
   - Email 3: Wait 2 days after Email 2
   - Email 4: Wait 2 days after Email 3
   - Email 5: Wait 2 days after Email 4

### 6. Get API Credentials (2 min)

1. Go to Settings → Advanced → API Secret
2. Copy your API Secret (starts with `sk_`)
3. Find Form ID:
   - Go to your form
   - Look at URL: `https://app.convertkit.com/forms/[FORM_ID]/edit`
   - Copy the number

### 7. Configure GDPR Settings (3 min)

1. Settings → Email → Compliance
2. Enable GDPR features:
   - Double opt-in for EU subscribers
   - Unsubscribe link in all emails
   - Data processing agreement

### 8. Test Subscriber Flow

1. **Manual Test**:
   - Add yourself as subscriber
   - Verify welcome email arrives
   - Check PDF download works

2. **Note These Values** (for MAX-74):
   ```
   CONVERTKIT_API_SECRET=sk_live_xxxxxxxxxxxxx
   CONVERTKIT_FORM_ID=1234567
   ```

## 📋 Checklist

- [ ] Account created with 14-day trial
- [ ] Domain verified for sending
- [ ] Form created with custom fields
- [ ] Tags set up for segmentation
- [ ] Welcome sequence created (5 emails)
- [ ] PDF uploaded and linked
- [ ] API credentials copied
- [ ] Test subscriber receives emails

## 🔗 Quick Links

After setup, bookmark these:
- Dashboard: https://app.convertkit.com/dashboard
- Subscribers: https://app.convertkit.com/subscribers
- Your Form: https://app.convertkit.com/forms/[YOUR_FORM_ID]/edit
- Sequences: https://app.convertkit.com/sequences

## 💡 Pro Tips

1. **Deliverability**: Always use double opt-in for best deliverability
2. **Testing**: Create a test tag to exclude test emails from stats
3. **Segmentation**: Use tags liberally - they're free and powerful
4. **Templates**: Save your email design as a template for consistency

## 🚀 Next Steps

Once complete:
1. Save API credentials securely
2. Move to MAX-74 (Deploy API Endpoint)
3. Can work on PDF design in parallel

---

Time to complete: 30 minutes
Required for: MAX-74 (API deployment needs these credentials)
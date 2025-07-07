# ConvertKit Subscriber Troubleshooting Guide

## 🔍 Where to Find Subscribers in ConvertKit

### 1. Check Your Forms First
- Go to **Grow → Landing Pages & Forms**
- Click on your specific form (ID: 8270854)
- Click **"View Subscribers"** on the form
- This shows ONLY subscribers from this specific form

### 2. Check Subscribers Dashboard
- Go to **Subscribers → Subscribers**
- Look for recent signups by date
- Check if they have the tags you expect (tennis-handbook, spanish, etc.)
- Sort by "Date Added" to see newest first

### 3. Check by Email Address
- In Subscribers dashboard, use the search box
- Search for the specific email address you tested with
- This will show if the subscriber exists at all

## 🧐 Common Issues & Solutions

### Issue 1: Subscribers Going to Wrong Form
**Check:** Your form ID in the API response logs
**Fix:** Verify `CONVERTKIT_FORM_ID=8270854` matches your actual form

### Issue 2: Subscribers in "Unconfirmed" State
**Check:** Subscriber state in ConvertKit
**Fix:** Look for subscribers with "unconfirmed" status - they need to click email confirmation

### Issue 3: Multiple Forms Confusion
**Check:** How many forms you have
**Fix:** Make sure you're looking at the correct form for your language/setup

### Issue 4: Tag Filtering
**Check:** If you're filtering by tags
**Fix:** Remove all filters and look for raw subscribers

## 🛠️ Debugging Commands

### Test ConvertKit API Directly
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

### Check Subscriber via API
```bash
curl "https://api.convertkit.com/v3/subscribers?api_secret=your_secret_here&email_address=debug@test.com"
```

## 📊 What to Look For

### In ConvertKit Dashboard:
1. **Recent Activity** - Check subscriber activity feed
2. **Form Analytics** - See if form is receiving submissions
3. **Email Deliverability** - Check if emails are being sent
4. **Automation Triggers** - See if sequences are triggering

### In Your API Logs:
1. **Successful subscription** - Status 200 responses
2. **Subscriber ID** - ConvertKit returns subscriber ID
3. **Tags applied** - Verify tags are being set
4. **Form ID matches** - Ensure using correct form

## 🎯 Step-by-Step Verification

### Step 1: Find Your Test Subscriber
1. Go to ConvertKit dashboard
2. Navigate to **Subscribers → Subscribers**
3. Search for your test email address
4. Note the subscriber's status and tags

### Step 2: Check Form-Specific Subscribers
1. Go to **Grow → Landing Pages & Forms**
2. Find form ID 8270854
3. Click "View Subscribers"
4. Look for your test email

### Step 3: Verify Email Sequence
1. Check if confirmation email was sent
2. Look at subscriber timeline/activity
3. Verify automation sequences triggered

### Step 4: Test with Fresh Email
1. Use a completely new email address
2. Go through the full flow
3. Watch ConvertKit dashboard in real-time
4. Check both form and general subscribers list

## 🚨 Red Flags to Check

- ❌ **Subscriber status: "Unconfirmed"** → They need to confirm email
- ❌ **Wrong form ID in logs** → Check environment variables
- ❌ **No tags applied** → Tags might not exist in ConvertKit
- ❌ **API errors in logs** → Check API secret and permissions
- ❌ **Multiple accounts** → Make sure you're in the right ConvertKit account

## 📞 Next Steps if Still Not Found

1. **Check server logs** for actual ConvertKit API responses
2. **Verify form ID** matches exactly in dashboard
3. **Test with completely fresh email** and watch dashboard
4. **Check if using ConvertKit sandpit/test mode**
5. **Verify API secret** has correct permissions

The key is that if the PDF download works and you see success messages, the integration IS working - the subscribers are likely there, just in a different view than expected.
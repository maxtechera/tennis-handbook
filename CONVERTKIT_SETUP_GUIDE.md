# ConvertKit Complete Setup Guide

## 🎯 Quick Setup Checklist

### 1. Create ConvertKit Forms
- [ ] Go to ConvertKit Dashboard → Grow → Landing Pages & Forms
- [ ] Create "Tennis Handbook - English" form
- [ ] Create "Tennis Handbook - Spanish" form  
- [ ] Save both Form IDs

### 2. Create All Tags
- [ ] Go to ConvertKit → Subscribers → Tags
- [ ] Create all tags from `CONVERTKIT_TAGS_SETUP.md` (40+ tags)
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

## 🔧 Environment Variables Needed

```bash
CONVERTKIT_API_SECRET=sk_your_actual_secret_here
CONVERTKIT_FORM_ID_EN=your_english_form_id
CONVERTKIT_FORM_ID_ES=your_spanish_form_id
CONVERTKIT_FORM_ID=your_default_form_id
```

## 🏷️ All Tags to Create (40+ tags)

See `CONVERTKIT_TAGS_SETUP.md` for the complete list.

## 🧪 Testing Commands

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

## 🔍 Troubleshooting

### "Server configuration error"
- Check your API Secret is correct
- Ensure Form IDs are set

### "API Key not valid" 
- Double-check your ConvertKit API Secret
- Make sure you're using the API Secret, not API Key

### Subscribers not appearing
- Verify Form IDs match your ConvertKit forms
- Check that tags exist in ConvertKit
- Look for subscribers in the specific forms, not just general subscribers

### Development Mode Active
- This is normal during development
- Real ConvertKit integration will work in production
- Check `.env` file has correct credentials

## 📊 Expected Results

After setup, you should see:
- ✅ Test subscribers in your ConvertKit forms
- ✅ Tags automatically applied to subscribers
- ✅ Different tags for Spanish vs English users
- ✅ Segmentation based on tennis level, goals, etc.
- ✅ No more "Server configuration error" messages
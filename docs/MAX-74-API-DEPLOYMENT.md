# MAX-74: Deploy Email API Endpoint

## 🎯 Goal
Deploy the email subscription API endpoint to handle form submissions.

## 📋 Prerequisites
- ✅ ConvertKit account set up (MAX-73)
- ✅ API Secret and Form ID from ConvertKit
- ✅ Vercel account (free tier is fine)

## 🚀 Deployment Options

### Option A: Vercel Deployment (Recommended - 45 min)

#### 1. Install Vercel CLI (5 min)
```bash
npm install -g vercel
vercel login
```

#### 2. Prepare Project Structure (10 min)
```bash
cd /Users/max/dev/experiments/tennis-workout

# Create vercel.json for configuration
```

Create `vercel.json`:
```json
{
  "functions": {
    "api/subscribe.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ]
}
```

#### 3. Set Environment Variables (5 min)
```bash
# Add your ConvertKit credentials
vercel env add CONVERTKIT_API_SECRET
# Paste: sk_live_xxxxxxxxxxxxx

vercel env add CONVERTKIT_FORM_ID  
# Paste: 1234567
```

#### 4. Deploy to Vercel (10 min)
```bash
# Deploy to production
vercel --prod

# You'll get a URL like:
# https://tennis-workout-xxx.vercel.app
```

#### 5. Update Frontend Config (5 min)

Edit `src/config/api.ts`:
```typescript
export const API_CONFIG = {
  SUBSCRIBE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://tennis-workout-xxx.vercel.app/api/subscribe' // Your Vercel URL
    : '/api/subscribe'
};
```

#### 6. Test the Deployment (10 min)
```bash
# Test your API endpoint
curl -X POST https://tennis-workout-xxx.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "source": "api-test",
    "consent": true,
    "language": "en"
  }'
```

### Option B: Netlify Functions (Alternative - 45 min)

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
netlify login
```

#### 2. Create Netlify Function
```bash
mkdir -p netlify/functions
cp api/subscribe.js netlify/functions/subscribe.js
```

Update the function for Netlify format:
```javascript
exports.handler = async (event, context) => {
  // Netlify function code
  const { email, source, consent, language } = JSON.parse(event.body);
  // ... rest of the logic
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

#### 3. Deploy to Netlify
```bash
netlify deploy --prod
```

### Option C: Docusaurus + Vercel (Integrated - 60 min)

If you want to deploy the entire Docusaurus site with API:

#### 1. Build Docusaurus
```bash
npm run build
```

#### 2. Configure for Vercel
Add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

#### 3. Deploy Everything
```bash
vercel --prod
```

## 🧪 Testing Checklist

### 1. API Endpoint Tests
- [ ] Test with valid email - should succeed
- [ ] Test without consent - should fail
- [ ] Test with invalid email - should fail  
- [ ] Test from different domain - CORS should work

### 2. ConvertKit Integration
- [ ] Submit email through API
- [ ] Check ConvertKit dashboard for new subscriber
- [ ] Verify tags are applied correctly
- [ ] Confirm welcome email sent

### 3. Frontend Integration
- [ ] Test form on local development
- [ ] Update API URL in config
- [ ] Deploy frontend changes
- [ ] Test form on production

## 🔍 Monitoring & Debugging

### Check Vercel Logs
```bash
vercel logs tennis-workout-xxx.vercel.app
```

### Common Issues & Fixes

1. **CORS Error**
   - Add your domain to allowed origins in API
   - Check vercel.json headers configuration

2. **401 Unauthorized**
   - Verify ConvertKit API secret is correct
   - Check environment variables: `vercel env ls`

3. **Form Not Found**
   - Confirm Form ID is correct
   - Make sure form is published in ConvertKit

4. **No Email Received**
   - Check ConvertKit subscriber list
   - Verify email sequence is active
   - Check spam folder

## 📊 Success Metrics

- API responds in <500ms
- 99%+ success rate
- Proper error messages
- ConvertKit receives all submissions

## 🎯 Quick Deploy Commands

```bash
# Full deployment flow
cd /Users/max/dev/experiments/tennis-workout
vercel env add CONVERTKIT_API_SECRET  # Add your secret
vercel env add CONVERTKIT_FORM_ID     # Add your form ID
vercel --prod                         # Deploy

# Get your API URL
echo "Your API endpoint: $(vercel ls | grep tennis-workout | awk '{print $1}')/api/subscribe"
```

## ✅ Completion Checklist

- [ ] API endpoint deployed and accessible
- [ ] Environment variables configured
- [ ] CORS headers working
- [ ] Test email successfully subscribed
- [ ] Frontend config updated with production URL
- [ ] Welcome email received
- [ ] Monitoring set up

## 🚀 Next Steps

1. Update frontend with production API URL
2. Test complete email flow end-to-end
3. Monitor first real subscribers
4. Set up API monitoring (optional)

---

Time to complete: 45-60 minutes
Blocks: Frontend testing (needs this API URL)
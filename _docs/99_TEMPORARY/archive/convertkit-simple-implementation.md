# ConvertKit Simple Implementation Plan

**Document Status**: 🔴 Archived  
**Lifecycle**: Historical Reference  
**Archived**: July 2025  
**Reason**: Implementation completed, kept for implementation reference  

---

## Overview

This is a simplified implementation plan for integrating ConvertKit with the Tennis Handbook Docusaurus website. We'll leverage ConvertKit's native features to minimize custom code and complexity.

## Implementation Approach

### Option 1: ConvertKit Native Forms (Recommended)
**Complexity: Low | Time: 2-3 hours**

1. **Use ConvertKit's Embed Forms**
   - Create forms directly in ConvertKit
   - Copy the HTML/JavaScript embed code
   - Paste into Docusaurus pages/components
   - ConvertKit handles all submission logic

2. **Benefits**
   - Zero backend code needed
   - ConvertKit handles validation, GDPR, and delivery
   - Built-in analytics and A/B testing
   - Automatic mobile optimization

3. **Implementation Steps**
   ```javascript
   // In your React component
   useEffect(() => {
     // ConvertKit's script will be loaded via embed
     if (window.convertKitFormScript) {
       window.convertKitFormScript.reload();
     }
   }, []);

   return (
     <div dangerouslySetInnerHTML={{ 
       __html: `<!-- ConvertKit embed code here -->` 
     }} />
   );
   ```

### Option 2: Simple API Integration
**Complexity: Medium | Time: 4-5 hours**

1. **Minimal Custom Form**
   - Keep existing React forms
   - Single API endpoint (Vercel/Netlify function)
   - Direct ConvertKit API calls

2. **Simple API Function**
   ```javascript
   // api/subscribe.js
   export default async function handler(req, res) {
     const { email } = req.body;
     
     const response = await fetch(
       `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           api_key: process.env.CONVERTKIT_API_KEY,
           email
         })
       }
     );

     return res.json({ success: response.ok });
   }
   ```

## Quick Setup Checklist

### 1. ConvertKit Account (30 minutes)
- [ ] Sign up at ConvertKit.com
- [ ] Create a form named "Tennis Handbook Subscribers"
- [ ] Set up tags: `tennis-handbook`, `english`, `spanish`
- [ ] Get your API key from Settings

### 2. Lead Magnet Setup (1 hour)
- [ ] Upload 7-Day Workout PDF to ConvertKit
- [ ] Create "Incentive Email" to deliver it
- [ ] Set up simple 5-email welcome sequence
- [ ] Test delivery

### 3. Website Integration (1-2 hours)

#### For Native Forms:
```html
<!-- Homepage Hero -->
<script async data-uid="YOUR_FORM_ID" src="https://tennis-handbook.ck.page/YOUR_FORM_ID/index.js"></script>

<!-- Or inline form -->
<div data-ck-embed="YOUR_FORM_ID"></div>
```

#### For Custom Forms:
```javascript
// Simple EmailCapture component
const EmailCapture = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    setStatus(res.ok ? 'success' : 'error');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
      />
      <button type="submit" disabled={status === 'loading'}>
        Get Free Workout Plan
      </button>
      {status === 'success' && <p>Check your email!</p>}
    </form>
  );
};
```

### 4. Placement Strategy

#### Simple Approach:
1. **Homepage only** - One form in hero section
2. **Popular pages** - Bottom of high-traffic content
3. **Announcement bar** - Docusaurus native feature

```javascript
// docusaurus.config.js
module.exports = {
  themeConfig: {
    announcementBar: {
      content: 'Get our free 7-day workout plan! <a href="#email-capture">Sign up here</a>',
      backgroundColor: '#2e8555',
      textColor: '#ffffff',
    },
  },
};
```

## Content Requirements (Minimal)

### 1. Lead Magnet
- Use existing 7-day workout plan markdown
- Export as PDF using browser print or markdown-pdf
- Upload to ConvertKit as "Incentive"

### 2. Email Sequence (Keep Simple)
1. **Welcome** - Deliver PDF
2. **Day 2** - One key tip
3. **Day 4** - Success story
4. **Day 6** - Another tip
5. **Day 7** - What's next

### 3. Spanish Support
- Create separate ConvertKit form for Spanish
- Duplicate email sequence in Spanish
- Use conditional rendering based on locale

```javascript
const locale = useDocusaurusContext().i18n.currentLocale;
const formId = locale === 'es' ? 'SPANISH_FORM_ID' : 'ENGLISH_FORM_ID';
```

## Skip These Features (For Now)

1. ❌ Complex popup timing logic
2. ❌ Advanced segmentation
3. ❌ Custom analytics tracking
4. ❌ A/B testing (use ConvertKit's)
5. ❌ Multiple lead magnets
6. ❌ Behavioral triggers

## Deployment (30 minutes)

### Option A: No Backend (ConvertKit Forms)
- Just add embed codes
- Deploy Docusaurus normally
- No environment variables needed

### Option B: Simple API (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Create vercel.json
{
  "functions": {
    "api/subscribe.js": {
      "maxDuration": 10
    }
  }
}

# Deploy
vercel --prod
```

### Environment Variables (if using API)
```
CONVERTKIT_API_KEY=your_api_key_here
CONVERTKIT_FORM_ID=your_form_id_here
```

## Testing Checklist

- [ ] Form submits successfully
- [ ] Email arrives within 2 minutes
- [ ] PDF download works
- [ ] Spanish version works (if implemented)
- [ ] Mobile responsive

## Monitoring

### ConvertKit Dashboard Shows:
- Subscriber count
- Open rates
- Click rates
- Unsubscribes

### That's It!
No complex monitoring setup needed. ConvertKit handles it all.

## Next Steps (After Launch)

1. **Week 1**: Monitor signups
2. **Week 2**: Check email engagement
3. **Week 3**: Optimize based on data
4. **Week 4**: Consider adding complexity

## Common Issues & Quick Fixes

### "Form not showing"
- Check if ad blockers are blocking ConvertKit
- Ensure script tag is in the right place

### "Emails not arriving"
- Check ConvertKit automation is active
- Verify email isn't in spam

### "API errors" (if using custom)
- Check API key is correct
- Verify form ID matches

## Total Time Investment

- **ConvertKit Setup**: 30 minutes
- **Lead Magnet**: 1 hour
- **Integration**: 1-2 hours
- **Testing**: 30 minutes
- **Total**: 3-4 hours

## Cost

- **ConvertKit**: Free up to 1,000 subscribers
- **Vercel**: Free tier sufficient
- **Total**: $0 to start

---

This simplified approach gets you up and running quickly with minimal complexity. You can always add more sophisticated features later as the list grows.
# Database Integration Deployment Checklist

## ✅ Code Implementation Complete

### Backend Infrastructure
- [x] Vercel Postgres schema design
- [x] API endpoints (wizard-start, wizard-save, wizard-complete, analytics-wizard)
- [x] Database migration script
- [x] Test endpoint for database verification

### Frontend Integration
- [x] Updated OnboardingWizard component with database sync
- [x] Enhanced WelcomeStep with dual email capture
- [x] useWizardSync hook with debounced auto-save
- [x] Analytics dashboard component
- [x] TypeScript types updated

## 🚀 Deployment Steps

### 1. Vercel Setup
```bash
# Deploy the current code
git add .
git commit -m "feat: add database integration for wizard"
git push origin main

# Vercel will auto-deploy
```

### 2. Database Setup
```bash
# In Vercel Dashboard:
# 1. Go to Storage tab
# 2. Create new Vercel Postgres database
# 3. Copy connection details to environment variables

# Run migrations
pnpm db:migrate
```

### 3. Environment Variables
Add to Vercel dashboard:
```
POSTGRES_URL=postgresql://... (auto-configured)
POSTGRES_PRISMA_URL=postgresql://... (auto-configured)
POSTGRES_URL_NON_POOLING=postgresql://... (auto-configured)
CONVERTKIT_API_SECRET=sk_your_key
CONVERTKIT_FORM_ID=your_form_id
```

### 4. Test Database Connection
```bash
# Visit: https://your-domain.vercel.app/api/test-db
# Should return: { success: true, tables: [...] }
```

### 5. Test Wizard Flow
1. Open homepage wizard
2. Enter email in welcome step
3. Complete wizard steps
4. Verify data in analytics dashboard
5. Check ConvertKit for parallel sync

## 📊 Monitoring & Analytics

### Database Queries for Monitoring
```sql
-- Check recent wizard starts
SELECT COUNT(*) as starts_today 
FROM conversion_events 
WHERE event_type = 'wizard_start' 
AND created_at >= CURRENT_DATE;

-- Check email capture rate
SELECT 
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(DISTINCT CASE WHEN event_type = 'wizard_start' THEN session_id END) as email_captures
FROM conversion_events 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';

-- Check completion funnel
SELECT 
  event_type, 
  COUNT(DISTINCT session_id) as unique_sessions
FROM conversion_events 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY event_type
ORDER BY event_type;
```

### Analytics Dashboard Access
- Visit: `/api/analytics-wizard` for JSON data
- Add analytics component to admin page for visual dashboard

## 🔧 Optimization Features (Phase 2)

### UX Improvements
- [ ] Exit intent modal for email capture
- [ ] Progress save notifications
- [ ] Resume wizard from email link
- [ ] Multiple conversion paths (WhatsApp, video preview)

### Technical Enhancements  
- [ ] Better-auth integration for user accounts
- [ ] Email sequence automation
- [ ] A/B testing framework
- [ ] Real-time analytics dashboard

## 🐛 Troubleshooting

### Common Issues
1. **Database connection fails**: Check environment variables
2. **Migration errors**: Ensure Postgres is properly configured
3. **CORS errors**: Verify API origins in each endpoint
4. **ConvertKit sync fails**: Check API keys and form IDs

### Debugging Tools
- Check Vercel function logs for API errors
- Use `api/test-db` endpoint to verify database
- Monitor browser console for frontend errors
- Check ConvertKit webhook logs

## 📈 Success Metrics

### Target Improvements
- Email capture rate: 40% → 70%
- Wizard completion: 25% → 50%
- Data accuracy: 60% → 100%
- Response time: <50ms for all APIs

### Key Performance Indicators
1. **Conversion Funnel**: starts → emails → completions
2. **User Segments**: distribution across beginner/intermediate/advanced
3. **Source Attribution**: which traffic sources convert best
4. **Technical Performance**: API response times and error rates
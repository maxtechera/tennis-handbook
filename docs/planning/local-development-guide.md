# Local Development Guide

## 🚀 Quick Start

### 1. Start Development Server
```bash
pnpm start
```

### 2. Test Setup
```bash
# Check if everything is configured
pnpm run dev:setup

# OR visit directly
open http://localhost:3000/api/dev-setup
```

### 3. Test Wizard Flow
```bash
# Run automated test
pnpm run test:wizard

# OR test manually
open http://localhost:3000
# Click "Start Assessment" and complete the wizard
```

## 🔧 Development Features

### Local Data Storage
- All wizard data is saved to `.dev-data/` folder
- Persists between restarts
- View files directly for debugging

### API Endpoints Available
- `/api/dev-setup` - Development configuration check
- `/api/wizard-start` - Email capture
- `/api/wizard-save` - Progress auto-save
- `/api/wizard-complete` - Completion with recommendations
- `/api/analytics-wizard` - Funnel analytics
- `/api/test-db` - Database connection test

### Development Mode Features
- ✅ No database required
- ✅ Automatic JSON file storage
- ✅ Full analytics and funnel tracking
- ✅ Console logging for debugging
- ✅ ConvertKit integration (if configured)

## 📊 View Analytics

### JSON Data
```bash
# View analytics data
curl http://localhost:3000/api/analytics-wizard | jq

# View stored data files
ls -la .dev-data/
cat .dev-data/wizard_submissions.json | jq
```

### Add Analytics Dashboard
1. Create a new page: `src/pages/analytics.tsx`
2. Import the `WizardAnalytics` component
3. View at `http://localhost:3000/analytics`

## 🛠️ Configuration

### Optional: ConvertKit Setup
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local and add your ConvertKit keys
CONVERTKIT_API_SECRET=your_secret_here
CONVERTKIT_FORM_ID=your_form_id_here
```

### Optional: Database Setup
For production-like testing:
```bash
# Install local PostgreSQL
brew install postgresql

# Create database
createdb tennis_workout

# Add to .env.local
POSTGRES_URL=postgresql://localhost:5432/tennis_workout

# Create tables
pnpm run db:migrate
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill
   ```

2. **Module not found errors**
   ```bash
   # Clear cache and reinstall
   pnpm clear
   rm -rf node_modules
   pnpm install
   ```

3. **API endpoints not working**
   ```bash
   # Check server logs
   pnpm start --verbose
   
   # Test individual endpoint
   curl -X POST http://localhost:3000/api/wizard-start \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","sessionId":"test-123"}'
   ```

4. **Wizard not capturing data**
   ```bash
   # Check browser console for errors
   # Check .dev-data/ folder for files
   # Run test script
   pnpm run test:wizard
   ```

## 🎯 Testing Scenarios

### 1. Basic Flow Test
1. Open homepage
2. Click "Start Assessment"
3. Enter email and name
4. Complete all wizard steps
5. Check completion message
6. View analytics at `/api/analytics-wizard`

### 2. Progressive Enhancement Test
1. Complete wizard partially
2. Close browser
3. Restart and check localStorage
4. Check `.dev-data/` files

### 3. ConvertKit Integration Test
1. Configure ConvertKit API keys
2. Complete wizard
3. Check ConvertKit dashboard for new subscriber
4. Check console logs for sync status

## 📈 Production Deployment

When ready to deploy:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: add database integration for wizard"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Vercel auto-deploys from GitHub
   - Add Vercel Postgres storage
   - Configure environment variables

3. **Run Migrations**
   ```bash
   # In Vercel dashboard or CLI
   vercel env pull .env.local
   pnpm run db:migrate
   ```

4. **Test Production**
   ```bash
   # Test production endpoints
   curl https://your-domain.vercel.app/api/dev-setup
   ```

## 📝 Development Notes

- Local storage automatically switches to production database when `POSTGRES_URL` is available
- ConvertKit integration works in both development and production
- Analytics dashboard shows development data vs production data
- All APIs include CORS headers for local development
- Error handling includes development-specific fallbacks
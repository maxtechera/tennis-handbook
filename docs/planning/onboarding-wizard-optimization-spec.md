# Onboarding Wizard Optimization - Technical Specification

## Overview
This document outlines the technical implementation for optimizing the onboarding wizard to improve email conversions, reduce friction, and implement durable data persistence using Drizzle ORM with Vercel Postgres.

## Current State Analysis

### Issues Identified
1. **Data Persistence**: Wizard data stored only in localStorage, not synced to ConvertKit properly
2. **High Friction**: PDF download as sole conversion method creates barrier
3. **No User Profiles**: Can't track users across sessions or devices
4. **Kit Integration**: Custom fields not being saved properly
5. **No Analytics**: Limited visibility into drop-off points

### Current Tech Stack
- Frontend: React/TypeScript with Docusaurus
- API: Vercel Serverless Functions
- Email: ConvertKit API
- Storage: localStorage only

## Proposed Architecture

### Database Setup (Drizzle + Vercel Postgres)

#### Why This Stack?
- **Drizzle ORM**: Lightweight (35kb), type-safe, minimal boilerplate
- **Vercel Postgres**: Managed PostgreSQL, automatic scaling, edge-ready
- **Better-auth Ready**: This setup scales perfectly with auth services
- **Edge Runtime**: Sub-10ms response times globally

### Database Schema

```typescript
// src/db/schema.ts
import { pgTable, uuid, text, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // ConvertKit integration
  convertkitSubscriberId: text('convertkit_subscriber_id'),
  convertkitTags: text('convertkit_tags').array(),
  // Profile data
  language: text('language').default('en'),
  country: text('country'),
  whatsapp: text('whatsapp'),
});

export const wizardSubmissions = pgTable('wizard_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id').notNull(),
  
  // Wizard state
  currentStep: integer('current_step').default(0),
  completedAt: timestamp('completed_at'),
  
  // Wizard data (JSONB for flexibility)
  personalInfo: jsonb('personal_info'),
  tennisExperience: jsonb('tennis_experience'),
  trainingGoals: jsonb('training_goals'),
  schedulePreferences: jsonb('schedule_preferences'),
  physicalProfile: jsonb('physical_profile'),
  
  // Metadata
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const emailCaptures = pgTable('email_captures', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  source: text('source').notNull(), // 'wizard', 'popup', 'footer', etc
  capturedAt: timestamp('captured_at').defaultNow().notNull(),
  convertedToUser: boolean('converted_to_user').default(false),
  metadata: jsonb('metadata'), // Any additional context
});

export const conversionEvents = pgTable('conversion_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  eventType: text('event_type').notNull(), // 'wizard_start', 'email_capture', 'wizard_complete', 'pdf_download'
  eventData: jsonb('event_data'),
  sessionId: text('session_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### API Implementation

#### 1. Database Connection (Edge-optimized)

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
```

#### 2. API Routes (Edge Runtime)

```typescript
// app/api/wizard/start/route.ts
import { db } from '@/db';
import { emailCaptures, conversionEvents } from '@/db/schema';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { email, sessionId } = await request.json();
  
  // Quick email capture
  await db.insert(emailCaptures).values({
    email,
    source: 'wizard',
    metadata: { sessionId }
  });
  
  // Track event
  await db.insert(conversionEvents).values({
    eventType: 'wizard_start',
    eventData: { email },
    sessionId
  });
  
  // Async ConvertKit sync (non-blocking)
  queueConvertKitSync(email, { tags: ['onboarding-wizard-started'] });
  
  return Response.json({ success: true });
}
```

```typescript
// app/api/wizard/save/route.ts
export async function POST(request: Request) {
  const { sessionId, step, data } = await request.json();
  
  // Upsert wizard submission
  await db.insert(wizardSubmissions)
    .values({
      sessionId,
      currentStep: step,
      ...data
    })
    .onConflictDoUpdate({
      target: wizardSubmissions.sessionId,
      set: {
        currentStep: step,
        ...data,
        updatedAt: new Date()
      }
    });
    
  return Response.json({ success: true });
}
```

### Frontend Integration

#### 1. Enhanced Wizard Hook

```typescript
// src/components/OnboardingWizard/hooks/useWizardSync.tsx
import { useCallback, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function useWizardSync({ sessionId, wizardData }) {
  // Sync to database (debounced)
  const syncToDatabase = useDebouncedCallback(
    async (data) => {
      await fetch('/api/wizard/save', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          step: data.currentStep,
          data: data.wizardData
        })
      });
    },
    1000 // 1 second debounce
  );
  
  // Email capture on first step
  const captureEmail = useCallback(async (email: string) => {
    await fetch('/api/wizard/start', {
      method: 'POST',
      body: JSON.stringify({ email, sessionId })
    });
  }, [sessionId]);
  
  return { syncToDatabase, captureEmail };
}
```

#### 2. Progressive Email Capture

```typescript
// Early email capture in welcome step
const WelcomeStep = ({ onNext, wizardData }) => {
  const [email, setEmail] = useState('');
  const { captureEmail } = useWizardSync();
  
  const handleEmailSubmit = async () => {
    await captureEmail(email);
    onNext({ email }); // Continue wizard
  };
  
  return (
    <div>
      <h2>Get Your Personalized Training Plan</h2>
      <p>Enter your email to save your progress and get recommendations</p>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
      />
      <button onClick={handleEmailSubmit}>
        Start Free Assessment →
      </button>
    </div>
  );
};
```

### Conversion Optimization Features

#### 1. Multiple Conversion Paths

```typescript
// Alternative conversions beyond PDF
const conversionPaths = {
  pdf: {
    title: "Download 7-Day Training Plan",
    action: "/api/generate-pdf",
    tracking: "pdf_download"
  },
  email_series: {
    title: "Get Daily Training Tips",
    action: "/api/subscribe/daily",
    tracking: "email_series"
  },
  video_preview: {
    title: "Watch Training Preview",
    action: "/api/video-access",
    tracking: "video_preview"
  },
  whatsapp: {
    title: "Get WhatsApp Reminders",
    action: "/api/whatsapp/subscribe",
    tracking: "whatsapp_subscribe"
  }
};
```

#### 2. Smart Exit Intent

```typescript
// Detect exit intent and show save progress modal
useEffect(() => {
  const handleMouseLeave = (e: MouseEvent) => {
    if (e.clientY <= 0 && !hasEmail) {
      showExitModal({
        title: "Save Your Progress!",
        message: "Enter your email to continue later",
        action: captureEmail
      });
    }
  };
  
  document.addEventListener('mouseleave', handleMouseLeave);
  return () => document.removeEventListener('mouseleave', handleMouseLeave);
}, [hasEmail]);
```

### Analytics & Monitoring

#### 1. Funnel Analytics Query

```sql
-- Wizard conversion funnel
SELECT 
  COUNT(DISTINCT CASE WHEN event_type = 'wizard_start' THEN session_id END) as starts,
  COUNT(DISTINCT CASE WHEN event_type = 'email_capture' THEN session_id END) as emails,
  COUNT(DISTINCT CASE WHEN event_type = 'wizard_complete' THEN session_id END) as completes,
  COUNT(DISTINCT CASE WHEN event_type = 'pdf_download' THEN session_id END) as downloads
FROM conversion_events
WHERE created_at >= NOW() - INTERVAL '7 days';
```

#### 2. Real-time Monitoring

```typescript
// app/api/analytics/wizard/route.ts
export async function GET() {
  const stats = await db.select({
    total_starts: count(conversionEvents.id),
    email_captures: count(emailCaptures.id),
    completion_rate: avg(
      case(
        when(conversionEvents.eventType.eq('wizard_complete'), 1),
        0
      )
    )
  }).from(conversionEvents);
  
  return Response.json(stats);
}
```

## Implementation Plan

### Phase 1: Database Setup (Day 1)
1. Install dependencies: `pnpm add drizzle-orm @vercel/postgres`
2. Create database schema
3. Set up Vercel Postgres connection
4. Run initial migrations

### Phase 2: API Development (Day 2)
1. Create edge API routes
2. Implement data persistence endpoints
3. Add ConvertKit webhook sync
4. Test API performance

### Phase 3: Frontend Integration (Day 3-4)
1. Update wizard hooks for database sync
2. Implement progressive email capture
3. Add multiple conversion paths
4. Create exit intent handling

### Phase 4: Testing & Optimization (Day 5)
1. Load test API endpoints
2. A/B test conversion paths
3. Monitor funnel metrics
4. Optimize based on data

## Success Metrics

1. **Email Capture Rate**: Target 70%+ (from current ~40%)
2. **Wizard Completion**: Target 50%+ (from current ~25%)
3. **Response Time**: <50ms API responses
4. **Data Accuracy**: 100% sync between DB and ConvertKit

## Security Considerations

1. **Rate Limiting**: Implement per-IP limits
2. **Email Validation**: Server-side validation
3. **Data Privacy**: GDPR compliant data handling
4. **SQL Injection**: Drizzle prevents by design

## Migration Strategy

1. Deploy database schema
2. Dual-write to localStorage + DB
3. Backfill historical data from ConvertKit
4. Switch to DB as source of truth
5. Remove localStorage dependency

## Future Enhancements

1. **Better-auth Integration**: User accounts with social login
2. **Personalized Dashboard**: Show training progress
3. **Community Features**: Share workouts
4. **Mobile App**: React Native with same backend

## Dependencies

```json
{
  "dependencies": {
    "drizzle-orm": "^0.29.3",
    "@vercel/postgres": "^0.5.1",
    "use-debounce": "^10.0.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.12",
    "@types/node": "^20.11.5"
  }
}
```

## Environment Variables

```env
# Vercel Postgres (auto-configured)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# ConvertKit
CONVERTKIT_API_SECRET=
CONVERTKIT_FORM_ID=
CONVERTKIT_WEBHOOK_SECRET=
```

This architecture provides:
- Minimal code overhead
- Type-safe database queries
- Edge-optimized performance
- Easy scaling to auth services
- Real-time analytics capability
# Wizard Data Flow Documentation

## Overview

The wizard system captures user data progressively through multiple steps, building up a comprehensive user profile that can be linked to email captures and eventually users.

## Data Flow Architecture

### 1. Session-Based Grouping
- **Single Session ID** used across all wizard steps
- **Progressive data accumulation** in `wizard_submissions` table
- **Same session ID** links email captures to wizard data

### 2. Database Tables

#### `wizard_submissions`
- **Primary key**: `session_id` (unique constraint)
- **Progressive updates**: Each step adds more data to the same record
- **Raw data backup**: Complete wizard state stored in `raw_data` field
- **Flat fields**: Commonly queried fields extracted for analytics

#### `email_captures`
- **Links to wizard**: `metadata.sessionId` references wizard session
- **ConvertKit sync**: Tracks email marketing integration
- **Source tracking**: Records where email was captured

#### `conversion_events`
- **Step tracking**: Records each wizard step completion
- **Analytics data**: User engagement metrics

### 3. API Endpoints

#### `/api/wizard-start`
- **Initializes** wizard session with email
- **Creates/updates** wizard_submissions record
- **Creates** email_captures record with session link
- **Submits** to ConvertKit for email marketing

#### `/api/wizard-save`
- **Progressive updates** to wizard_submissions
- **Upsert pattern**: Creates or updates based on session_id
- **Preserves existing data**: Only updates new/changed fields
- **Flat data extraction**: Converts nested wizard data to queryable fields

### 4. Data Relationships

```
wizard_submissions (session_id) ←→ email_captures (metadata.sessionId)
                    ↓
             conversion_events (session_id)
```

### 5. Progressive Data Example

**Step 1 (wizard-start):**
```json
{
  "sessionId": "wizard-123",
  "currentStep": 0,
  "email": "user@example.com",
  "userAgent": "...",
  "ipAddress": "..."
}
```

**Step 2 (micro-quiz):**
```json
{
  "sessionId": "wizard-123", // Same session
  "currentStep": 1,
  "email": "user@example.com", // Preserved
  "tennisLevel": "beginner", // New data added
  "rawData": { "microQuiz": {...} }
}
```

**Step 3 (goals-quiz):**
```json
{
  "sessionId": "wizard-123", // Same session
  "currentStep": 2,
  "email": "user@example.com", // Preserved
  "tennisLevel": "beginner", // Preserved
  "tennisGoal": "fitness", // New data added
  "rawData": { 
    "microQuiz": {...}, // Preserved
    "goalsQuiz": {...} // New data added
  }
}
```

## Benefits

1. **Session Continuity**: User can complete wizard across multiple sessions
2. **Progressive Enhancement**: Data builds up step by step
3. **Email Integration**: Email capture linked to full wizard profile
4. **Analytics Ready**: Flat fields enable easy querying and reporting
5. **Type Safety**: Drizzle ORM provides compile-time validation
6. **Future User Linking**: Ready to link to users table when authentication added

## Usage for Analysis

### Find wizard submissions by email:
```sql
SELECT * FROM wizard_submissions 
WHERE email = 'user@example.com';
```

### Link email captures to wizard data:
```sql
SELECT ec.*, ws.tennis_level, ws.tennis_goal 
FROM email_captures ec
JOIN wizard_submissions ws ON ec.metadata->>'sessionId' = ws.session_id
WHERE ec.email = 'user@example.com';
```

### Track conversion funnel:
```sql
SELECT 
  ws.session_id,
  ws.current_step,
  ec.kit_submitted,
  ce.event_type
FROM wizard_submissions ws
LEFT JOIN email_captures ec ON ec.metadata->>'sessionId' = ws.session_id  
LEFT JOIN conversion_events ce ON ce.session_id = ws.session_id
ORDER BY ws.updated_at DESC;
```
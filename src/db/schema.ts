import { pgTable, uuid, text, timestamp, jsonb, boolean, integer, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

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
}, (table) => {
  return {
    emailIdx: index('email_idx').on(table.email),
  };
});

export const wizardSubmissions = pgTable('wizard_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id').notNull().unique(),
  
  // Wizard state
  currentStep: integer('current_step').default(0),
  completedAt: timestamp('completed_at'),
  
  // User Profile - Flat fields for easy access
  email: text('email'),
  name: text('name'),
  age: text('age'), // '18-24', '25-34', etc
  gender: text('gender'), // 'male', 'female', 'other', 'prefer_not_to_say'
  location: text('location'),
  whatsapp: text('whatsapp'),
  language: text('language').default('en'),
  
  // Tennis Profile - Flat fields
  tennisLevel: text('tennis_level'), // 'beginner', 'intermediate', 'advanced', 'professional'
  tennisGoal: text('tennis_goal'), // 'fitness', 'competitive', 'recreational', 'professional'
  yearsPlaying: text('years_playing'), // '<1', '1-3', '3-5', '5+' 
  playsCompetitively: boolean('plays_competitively').default(false),
  playingStyle: text('playing_style'), // 'baseline', 'serve_volley', 'all_court'
  favoriteShot: text('favorite_shot'), // 'forehand', 'backhand', 'serve', 'volley'
  
  // Training Preferences - Flat fields
  timeAvailability: text('time_availability'), // '1-2days', '3-5days', '6-7days'
  preferredTimes: text('preferred_times').array(), // ['morning', 'afternoon', 'evening']
  focusAreas: text('focus_areas').array(), // ['technique', 'fitness', 'mental', 'strategy']
  primaryFocus: text('primary_focus'), // Single main focus area
  commitmentLevel: text('commitment_level'), // 'casual', 'serious', 'professional'
  
  // Physical Profile - Flat fields
  fitnessLevel: text('fitness_level'), // 'beginner', 'average', 'good', 'excellent'
  mainChallenges: text('main_challenges').array(), // ['consistency', 'fitness', 'technique', etc]
  injuries: text('injuries').array(), // ['shoulder', 'knee', 'back', etc]
  
  // Engagement Metrics - Flat fields
  microQuizEngagement: integer('micro_quiz_engagement'),
  goalsQuizEngagement: integer('goals_quiz_engagement'),
  timeQuizEngagement: integer('time_quiz_engagement'),
  focusQuizEngagement: integer('focus_quiz_engagement'),
  
  // Conversion Data - Flat fields
  acceptedTerms: boolean('accepted_terms').default(false),
  newsletter: boolean('newsletter').default(false),
  downloadedPdf: boolean('downloaded_pdf').default(false),
  
  // AI/Calculated fields
  userSegment: text('user_segment'), // 'beginner', 'intermediate', 'advanced', 'competitive'
  aiRecommendations: text('ai_recommendations').array(), // Array of recommendation strings
  personalizedPath: text('personalized_path'), // Recommended content path
  
  // Tags for export (ConvertKit, etc)
  tags: text('tags').array(), // ['spanish', 'competitive', 'morning-player', etc]
  
  // Raw data backup (for complex data that doesn't fit flat structure)
  rawData: jsonb('raw_data'), // Complete wizard data as backup
  
  // Metadata
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  utmTerm: text('utm_term'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    sessionIdx: index('session_idx').on(table.sessionId),
    userIdx: index('user_idx').on(table.userId),
    emailIdx: index('wizard_email_idx').on(table.email),
    segmentIdx: index('segment_idx').on(table.userSegment),
    levelIdx: index('level_idx').on(table.tennisLevel),
    goalIdx: index('goal_idx').on(table.tennisGoal),
  };
});

export const emailCaptures = pgTable('email_captures', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  source: text('source').notNull(), // 'wizard', 'popup', 'footer', etc
  capturedAt: timestamp('captured_at').defaultNow().notNull(),
  convertedToUser: boolean('converted_to_user').default(false),
  metadata: jsonb('metadata'), // Any additional context
}, (table) => {
  return {
    emailSourceIdx: index('email_source_idx').on(table.email, table.source),
  };
});

export const conversionEvents = pgTable('conversion_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  eventType: text('event_type').notNull(), // 'wizard_start', 'email_capture', 'wizard_complete', 'pdf_download'
  eventData: jsonb('event_data'),
  sessionId: text('session_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    eventTypeIdx: index('event_type_idx').on(table.eventType),
    sessionIdx: index('event_session_idx').on(table.sessionId),
  };
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type WizardSubmission = typeof wizardSubmissions.$inferSelect;
export type NewWizardSubmission = typeof wizardSubmissions.$inferInsert;
export type EmailCapture = typeof emailCaptures.$inferSelect;
export type NewEmailCapture = typeof emailCaptures.$inferInsert;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type NewConversionEvent = typeof conversionEvents.$inferInsert;
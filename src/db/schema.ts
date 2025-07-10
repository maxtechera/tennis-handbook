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
  
  // Wizard data (JSONB for flexibility)
  personalInfo: jsonb('personal_info'),
  tennisExperience: jsonb('tennis_experience'),
  trainingGoals: jsonb('training_goals'),
  schedulePreferences: jsonb('schedule_preferences'),
  physicalProfile: jsonb('physical_profile'),
  
  // Calculated fields
  userSegment: text('user_segment'), // 'beginner', 'intermediate', 'advanced', 'competitive'
  
  // Metadata
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    sessionIdx: index('session_idx').on(table.sessionId),
    userIdx: index('user_idx').on(table.userId),
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
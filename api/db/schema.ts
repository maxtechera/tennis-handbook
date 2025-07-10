import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    // ConvertKit integration
    convertkitSubscriberId: text("convertkit_subscriber_id"),
    convertkitTags: text("convertkit_tags").array(),
    // Profile data
    language: text("language").default("en"),
    country: text("country"),
    whatsapp: text("whatsapp"),
  },
  (table) => {
    return {
      emailIdx: index("email_idx").on(table.email),
    };
  }
);

export const wizardSubmissions = pgTable(
  "wizard_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    sessionId: text("session_id").notNull().unique(),

    // Wizard state
    currentStep: integer("current_step").default(0),
    completedAt: timestamp("completed_at"),

    // Wizard step data (JSONB columns for individual quiz steps)
    microQuiz: jsonb("micro_quiz"), // Quiz step 1 data
    goalsQuiz: jsonb("goals_quiz"), // Quiz step 2 data
    timeQuiz: jsonb("time_quiz"), // Quiz step 3 data
    focusQuiz: jsonb("focus_quiz"), // Quiz step 4 data
    personalInfo: jsonb("personal_info"), // Personal information step
    tennisExperience: jsonb("tennis_experience"), // Tennis experience step
    trainingGoals: jsonb("training_goals"), // Training goals step
    schedulePreferences: jsonb("schedule_preferences"), // Schedule preferences step
    physicalProfile: jsonb("physical_profile"), // Physical profile step
    welcome: jsonb("welcome"), // Welcome step
    welcomeSuccess: jsonb("welcome_success"), // Welcome success step
    personalization: jsonb("personalization"), // Personalization step
    background: jsonb("background"), // Background step
    challenges: jsonb("challenges"), // Challenges step
    analyzing: jsonb("analyzing"), // Analyzing step
    completion: jsonb("completion"), // Completion step

    // User Profile - Flat fields for easy access
    email: text("email"),
    name: text("name"),
    age: text("age"), // '18-24', '25-34', etc
    gender: text("gender"), // 'male', 'female', 'other', 'prefer_not_to_say'
    location: text("location"),
    whatsapp: text("whatsapp"),
    language: text("language").default("en"),

    // Tennis Profile - Flat fields
    tennisLevel: text("tennis_level"), // 'beginner', 'intermediate', 'advanced', 'professional'
    tennisGoal: text("tennis_goal"), // 'fitness', 'competitive', 'recreational', 'professional'
    yearsPlaying: text("years_playing"), // '<1', '1-3', '3-5', '5+'
    playsCompetitively: boolean("plays_competitively").default(false),
    playingStyle: text("playing_style"), // 'baseline', 'serve_volley', 'all_court'
    favoriteShot: text("favorite_shot"), // 'forehand', 'backhand', 'serve', 'volley'

    // Training Preferences - Flat fields
    timeAvailability: text("time_availability"), // '1-2days', '3-5days', '6-7days'
    preferredTimes: text("preferred_times").array(), // ['morning', 'afternoon', 'evening']
    focusAreas: text("focus_areas").array(), // ['technique', 'fitness', 'mental', 'strategy']
    primaryFocus: text("primary_focus"), // Single main focus area
    commitmentLevel: text("commitment_level"), // 'casual', 'serious', 'professional'

    // Physical Profile - Flat fields
    fitnessLevel: text("fitness_level"), // 'beginner', 'average', 'good', 'excellent'
    mainChallenges: text("main_challenges").array(), // ['consistency', 'fitness', 'technique', etc]
    injuries: text("injuries").array(), // ['shoulder', 'knee', 'back', etc]

    // Engagement Metrics - Flat fields
    microQuizEngagement: integer("micro_quiz_engagement"),
    goalsQuizEngagement: integer("goals_quiz_engagement"),
    timeQuizEngagement: integer("time_quiz_engagement"),
    focusQuizEngagement: integer("focus_quiz_engagement"),

    // Conversion Data - Flat fields
    acceptedTerms: boolean("accepted_terms").default(false),
    newsletter: boolean("newsletter").default(false),
    downloadedPdf: boolean("downloaded_pdf").default(false),

    // AI/Calculated fields
    userSegment: text("user_segment"), // 'beginner', 'intermediate', 'advanced', 'competitive'
    aiRecommendations: text("ai_recommendations").array(), // Array of recommendation strings
    personalizedPath: text("personalized_path"), // Recommended content path

    // Tags for export (ConvertKit, etc)
    tags: text("tags").array(), // ['spanish', 'competitive', 'morning-player', etc]

    // Raw data backup (for complex data that doesn't fit flat structure)
    rawData: jsonb("raw_data"), // Complete wizard data as backup

    // Metadata
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    referrer: text("referrer"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      sessionIdx: index("session_idx").on(table.sessionId),
      userIdx: index("user_idx").on(table.userId),
      emailIdx: index("wizard_email_idx").on(table.email),
      segmentIdx: index("segment_idx").on(table.userSegment),
      levelIdx: index("level_idx").on(table.tennisLevel),
      goalIdx: index("goal_idx").on(table.tennisGoal),
    };
  }
);

export const emailCaptures = pgTable(
  "email_captures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    source: text("source").notNull(), // 'wizard', 'popup', 'footer', etc
    metadata: jsonb("metadata"), // Any additional context
    // ConvertKit sync columns
    kitSubmitted: boolean("kit_submitted").default(false),
    kitSubscriberId: text("kit_subscriber_id"),
    kitSubmittedAt: timestamp("kit_submitted_at"),
    syncAttempts: integer("sync_attempts").default(0),
    lastSyncError: text("last_sync_error"),
    processingStartedAt: timestamp("processing_started_at"),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    // Legacy fields (for backward compatibility)
    capturedAt: timestamp("captured_at").defaultNow(),
    convertedToUser: boolean("converted_to_user").default(false),
  },
  (table) => {
    return {
      emailSourceIdx: index("email_source_idx").on(table.email, table.source),
      emailUniqueIdx: index("email_unique_idx").on(table.email),
    };
  }
);

export const conversionEvents = pgTable(
  "conversion_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    eventType: text("event_type").notNull(), // 'wizard_start', 'email_capture', 'wizard_complete', 'pdf_download'
    eventData: jsonb("event_data"),
    sessionId: text("session_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      eventTypeIdx: index("event_type_idx").on(table.eventType),
      sessionIdx: index("event_session_idx").on(table.sessionId),
    };
  }
);

export const appStats = pgTable(
  "app_stats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    statType: text("stat_type").notNull(), // 'balls_thrown', 'workouts_completed', 'exercises_viewed', etc.
    count: integer("count").notNull().default(0),
    sessionId: text("session_id"),
    userId: uuid("user_id").references(() => users.id),
    metadata: jsonb("metadata"), // Additional data like { ballsPerThrow: 3, device: 'mobile' }
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      typeIdx: index("stat_type_idx").on(table.statType),
      sessionIdx: index("stat_session_idx").on(table.sessionId),
      userIdx: index("stat_user_idx").on(table.userId),
      createdAtIdx: index("stat_created_idx").on(table.createdAt),
    };
  }
);

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type WizardSubmission = typeof wizardSubmissions.$inferSelect;
export type NewWizardSubmission = typeof wizardSubmissions.$inferInsert;
export type EmailCapture = typeof emailCaptures.$inferSelect;
export type NewEmailCapture = typeof emailCaptures.$inferInsert;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type NewConversionEvent = typeof conversionEvents.$inferInsert;

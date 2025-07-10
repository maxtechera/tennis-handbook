/**
 * Export utilities for wizard data
 * Converts flat wizard data to various formats for external services
 */

import { sql } from '@vercel/postgres';
import { toConvertKitFormat, toSpreadsheetRow, type FlatWizardData } from './flatten-wizard-data';

/**
 * Export data for a specific user to ConvertKit format
 */
export async function exportToConvertKit(email: string) {
  const result = await sql`
    SELECT * FROM wizard_submissions 
    WHERE email = ${email} 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  
  const submission = result.rows[0];
  const flat: FlatWizardData = {
    email: submission.email,
    name: submission.name,
    age: submission.age,
    gender: submission.gender,
    location: submission.location,
    whatsapp: submission.whatsapp,
    language: submission.language,
    tennisLevel: submission.tennis_level,
    tennisGoal: submission.tennis_goal,
    yearsPlaying: submission.years_playing,
    playsCompetitively: submission.plays_competitively,
    playingStyle: submission.playing_style,
    favoriteShot: submission.favorite_shot,
    timeAvailability: submission.time_availability,
    preferredTimes: submission.preferred_times,
    focusAreas: submission.focus_areas,
    primaryFocus: submission.primary_focus,
    commitmentLevel: submission.commitment_level,
    fitnessLevel: submission.fitness_level,
    mainChallenges: submission.main_challenges,
    injuries: submission.injuries,
    acceptedTerms: submission.accepted_terms,
    newsletter: submission.newsletter,
    downloadedPdf: submission.downloaded_pdf,
    userSegment: submission.user_segment,
    tags: submission.tags
  };
  
  return toConvertKitFormat(flat);
}

/**
 * Export all submissions to CSV format
 */
export async function exportAllToCSV(filters?: {
  segment?: string;
  language?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  let query = sql`
    SELECT * FROM wizard_submissions 
    WHERE completed_at IS NOT NULL
  `;
  
  if (filters?.segment) {
    query = sql`${query} AND user_segment = ${filters.segment}`;
  }
  if (filters?.language) {
    query = sql`${query} AND language = ${filters.language}`;
  }
  if (filters?.startDate) {
    query = sql`${query} AND created_at >= ${filters.startDate}`;
  }
  if (filters?.endDate) {
    query = sql`${query} AND created_at <= ${filters.endDate}`;
  }
  
  query = sql`${query} ORDER BY created_at DESC`;
  
  const result = await query;
  
  const rows = result.rows.map(submission => {
    const flat: FlatWizardData = {
      email: submission.email,
      name: submission.name,
      age: submission.age,
      gender: submission.gender,
      location: submission.location,
      whatsapp: submission.whatsapp,
      language: submission.language,
      tennisLevel: submission.tennis_level,
      tennisGoal: submission.tennis_goal,
      yearsPlaying: submission.years_playing,
      playsCompetitively: submission.plays_competitively,
      playingStyle: submission.playing_style,
      favoriteShot: submission.favorite_shot,
      timeAvailability: submission.time_availability,
      preferredTimes: submission.preferred_times,
      focusAreas: submission.focus_areas,
      primaryFocus: submission.primary_focus,
      commitmentLevel: submission.commitment_level,
      fitnessLevel: submission.fitness_level,
      mainChallenges: submission.main_challenges,
      injuries: submission.injuries,
      acceptedTerms: submission.accepted_terms,
      newsletter: submission.newsletter,
      downloadedPdf: submission.downloaded_pdf,
      userSegment: submission.user_segment,
      tags: submission.tags
    };
    
    return toSpreadsheetRow(flat);
  });
  
  // Convert to CSV
  if (rows.length === 0) return '';
  
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}

/**
 * Get tag statistics
 */
export async function getTagStats() {
  const result = await sql`
    SELECT 
      unnest(tags) as tag,
      COUNT(*) as count
    FROM wizard_submissions
    WHERE tags IS NOT NULL
    GROUP BY tag
    ORDER BY count DESC
  `;
  
  return result.rows;
}

/**
 * Get segment statistics
 */
export async function getSegmentStats() {
  const result = await sql`
    SELECT 
      user_segment,
      COUNT(*) as count,
      COUNT(CASE WHEN newsletter THEN 1 END) as newsletter_count,
      COUNT(CASE WHEN whatsapp IS NOT NULL THEN 1 END) as whatsapp_count,
      COUNT(CASE WHEN downloaded_pdf THEN 1 END) as pdf_count
    FROM wizard_submissions
    WHERE user_segment IS NOT NULL
    GROUP BY user_segment
    ORDER BY count DESC
  `;
  
  return result.rows;
}

/**
 * Export for email campaigns (e.g., specific segments)
 */
export async function exportSegmentForCampaign(segment: string, tags?: string[]) {
  let query = sql`
    SELECT email, name, language, tags, user_segment
    FROM wizard_submissions
    WHERE user_segment = ${segment}
    AND newsletter = true
    AND email IS NOT NULL
  `;
  
  if (tags && tags.length > 0) {
    query = sql`${query} AND tags && ${tags}`;
  }
  
  const result = await query;
  
  return result.rows.map(row => ({
    email: row.email,
    name: row.name,
    language: row.language,
    tags: row.tags,
    segment: row.user_segment
  }));
}

/**
 * Export for WhatsApp campaigns
 */
export async function exportWhatsAppContacts(language?: string) {
  let query = sql`
    SELECT 
      name, 
      whatsapp, 
      language, 
      tennis_level, 
      tennis_goal,
      user_segment,
      tags
    FROM wizard_submissions
    WHERE whatsapp IS NOT NULL
  `;
  
  if (language) {
    query = sql`${query} AND language = ${language}`;
  }
  
  query = sql`${query} ORDER BY created_at DESC`;
  
  const result = await query;
  return result.rows;
}
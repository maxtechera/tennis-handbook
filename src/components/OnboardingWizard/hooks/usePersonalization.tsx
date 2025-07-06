import { useMemo, useCallback } from 'react';
import { 
  WizardData, 
  UserProfile, 
  UserSegment,
  ContentRecommendation,
  EmailSequenceRecommendation,
  PersonalizationResult,
  Language,
  TrainingGoal
} from '../types';

interface UsePersonalizationProps {
  wizardData: WizardData;
  preferredLanguage?: Language;
}

// Content library (in production, this would come from a CMS or API)
const CONTENT_LIBRARY: ContentRecommendation[] = [
  // Beginner content
  {
    id: 'beginner-fundamentals',
    type: 'program',
    title: 'Tennis Fundamentals Program',
    description: 'Master the basics with our 8-week beginner program',
    path: '/programs/beginner-fundamentals',
    priority: 100,
    reason: 'Perfect starting point for new players'
  },
  {
    id: 'technique-basics',
    type: 'video',
    title: 'Essential Tennis Techniques',
    description: 'Video series covering grip, stance, and basic strokes',
    path: '/videos/technique-basics',
    priority: 90,
    reason: 'Build proper technique from the start'
  },
  
  // Intermediate content
  {
    id: 'intermediate-power',
    type: 'program',
    title: 'Power Development Program',
    description: '12-week program to increase shot power and speed',
    path: '/programs/intermediate-power',
    priority: 95,
    reason: 'Take your game to the next level'
  },
  {
    id: 'tactical-patterns',
    type: 'article',
    title: 'Winning Tactical Patterns',
    description: 'Learn the patterns used by professional players',
    path: '/articles/tactical-patterns',
    priority: 85,
    reason: 'Improve your match strategy'
  },
  
  // Advanced content
  {
    id: 'advanced-conditioning',
    type: 'program',
    title: 'Elite Conditioning Program',
    description: 'Professional-level fitness training program',
    path: '/programs/advanced-conditioning',
    priority: 100,
    reason: 'Train like the pros'
  },
  {
    id: 'mental-toughness',
    type: 'article',
    title: 'Mental Toughness Training',
    description: 'Psychological training for competitive players',
    path: '/articles/mental-toughness',
    priority: 90,
    reason: 'Develop championship mindset'
  },
  
  // Competitive content
  {
    id: 'tournament-prep',
    type: 'program',
    title: 'Tournament Preparation System',
    description: 'Complete tournament preparation program',
    path: '/programs/tournament-prep',
    priority: 100,
    reason: 'Optimize tournament performance'
  },
  {
    id: 'recovery-protocols',
    type: 'article',
    title: 'Professional Recovery Protocols',
    description: 'Recovery methods used by ATP/WTA players',
    path: '/articles/recovery-protocols',
    priority: 95,
    reason: 'Maintain peak performance'
  },

  // Injury prevention
  {
    id: 'injury-prevention',
    type: 'program',
    title: 'Injury Prevention Program',
    description: 'Comprehensive injury prevention exercises',
    path: '/programs/injury-prevention',
    priority: 100,
    reason: 'Stay healthy and play longer'
  },
  
  // Spanish content
  {
    id: 'programa-espanol',
    type: 'program',
    title: 'Programa de Tenis Elite',
    description: 'Programa completo en español',
    path: '/es/programs/elite-tennis',
    priority: 100,
    reason: 'Contenido en tu idioma preferido'
  }
];

// Email sequences
const EMAIL_SEQUENCES: EmailSequenceRecommendation[] = [
  {
    sequenceId: 'beginner-welcome',
    name: 'Welcome to Tennis Training',
    description: '7-day introduction to tennis fitness fundamentals',
    duration: '7 days',
    priority: 100
  },
  {
    sequenceId: 'intermediate-power',
    name: 'Power Development Series',
    description: '14-day email course on developing explosive power',
    duration: '14 days',
    priority: 95
  },
  {
    sequenceId: 'advanced-tactics',
    name: 'Advanced Tactical Training',
    description: '21-day deep dive into professional tactics',
    duration: '21 days',
    priority: 100
  },
  {
    sequenceId: 'competitive-edge',
    name: 'Competitive Edge Program',
    description: '30-day mental and physical tournament preparation',
    duration: '30 days',
    priority: 100
  },
  {
    sequenceId: 'injury-recovery',
    name: 'Injury Prevention & Recovery',
    description: '14-day series on staying healthy',
    duration: '14 days',
    priority: 100
  },
  {
    sequenceId: 'spanish-beginner',
    name: 'Bienvenido al Tenis Elite',
    description: 'Serie de 7 días en español',
    duration: '7 días',
    priority: 100
  }
];

export function usePersonalization({ 
  wizardData, 
  preferredLanguage = 'en' 
}: UsePersonalizationProps) {
  
  // Build user profile from wizard data
  const userProfile = useMemo((): UserProfile => {
    const {
      personalInfo,
      tennisExperience,
      trainingGoals,
      schedulePreferences,
      physicalProfile
    } = wizardData;

    return {
      segment: tennisExperience?.currentLevel || 'beginner',
      language: personalInfo?.language || preferredLanguage,
      goals: [
        trainingGoals?.primaryGoal,
        ...(trainingGoals?.secondaryGoals || [])
      ].filter(Boolean) as TrainingGoal[],
      commitment: schedulePreferences?.commitmentLevel || 'regular',
      hasCoaching: tennisExperience?.coachingHistory || false,
      hasInjuries: trainingGoals?.injuryHistory || false,
      fitnessLevel: physicalProfile?.fitnessLevel || 'moderate',
      trainingsPerWeek: schedulePreferences?.trainingsPerWeek || 3
    };
  }, [wizardData, preferredLanguage]);

  // Calculate user segment with more nuance
  const calculateSegment = useCallback((): UserSegment => {
    const { tennisExperience, physicalProfile, schedulePreferences } = wizardData;

    if (!tennisExperience) return 'beginner';

    // Check for competitive players
    if (
      tennisExperience.playsCompetitively &&
      tennisExperience.ranking &&
      schedulePreferences?.trainingsPerWeek >= 5
    ) {
      return 'competitive';
    }

    // Check for advanced players
    if (
      tennisExperience.currentLevel === 'advanced' ||
      (tennisExperience.yearsPlaying === '5+' && 
       physicalProfile?.fitnessLevel === 'excellent')
    ) {
      return 'advanced';
    }

    // Check for intermediate players
    if (
      tennisExperience.currentLevel === 'intermediate' ||
      tennisExperience.yearsPlaying === '3-5' ||
      (tennisExperience.yearsPlaying === '1-3' && 
       physicalProfile?.fitnessLevel === 'good')
    ) {
      return 'intermediate';
    }

    return 'beginner';
  }, [wizardData]);

  // Get content recommendations based on profile
  const getContentRecommendations = useCallback((): ContentRecommendation[] => {
    const segment = calculateSegment();
    const { language, goals, hasInjuries } = userProfile;

    let recommendations = [...CONTENT_LIBRARY];

    // Filter by segment
    recommendations = recommendations.filter(content => {
      const contentSegment = content.id.split('-')[0];
      return contentSegment === segment || 
             contentSegment === 'injury' && hasInjuries ||
             (language === 'es' && content.path.includes('/es/'));
    });

    // Boost priority based on goals
    recommendations = recommendations.map(content => {
      let priority = content.priority;
      
      // Boost content matching primary goals
      if (goals[0] && content.id.includes(goals[0])) {
        priority += 20;
      }
      
      // Boost Spanish content for Spanish speakers
      if (language === 'es' && content.path.includes('/es/')) {
        priority += 30;
      }
      
      // Boost injury content for those with injuries
      if (hasInjuries && content.id.includes('injury')) {
        priority += 25;
      }

      return { ...content, priority };
    });

    // Sort by priority and return top recommendations
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6);
  }, [userProfile, calculateSegment]);

  // Get email sequence recommendation
  const getEmailSequence = useCallback((): EmailSequenceRecommendation => {
    const segment = calculateSegment();
    const { language, hasInjuries, commitment } = userProfile;

    // Find matching sequences
    let sequences = [...EMAIL_SEQUENCES];

    // Prioritize by segment
    if (segment === 'competitive') {
      return sequences.find(s => s.sequenceId === 'competitive-edge')!;
    }

    // Check for injury sequence need
    if (hasInjuries) {
      return sequences.find(s => s.sequenceId === 'injury-recovery')!;
    }

    // Check for Spanish preference
    if (language === 'es' && segment === 'beginner') {
      return sequences.find(s => s.sequenceId === 'spanish-beginner')!;
    }

    // Default sequences by segment
    const segmentSequences: Record<UserSegment, string> = {
      beginner: 'beginner-welcome',
      intermediate: 'intermediate-power',
      advanced: 'advanced-tactics',
      competitive: 'competitive-edge'
    };

    const sequenceId = segmentSequences[segment];
    return sequences.find(s => s.sequenceId === sequenceId)!;
  }, [userProfile, calculateSegment]);

  // Generate user tags for CRM/email system
  const generateTags = useCallback((): string[] => {
    const tags: string[] = [];
    const segment = calculateSegment();
    const { 
      language, 
      goals, 
      commitment, 
      hasCoaching, 
      hasInjuries,
      trainingsPerWeek 
    } = userProfile;

    // Segment tags
    tags.push(`segment:${segment}`);
    
    // Language tag
    tags.push(`lang:${language}`);
    
    // Goal tags
    goals.forEach(goal => {
      if (goal) tags.push(`goal:${goal}`);
    });
    
    // Commitment tag
    tags.push(`commitment:${commitment}`);
    
    // Special tags
    if (hasCoaching) tags.push('has-coach');
    if (hasInjuries) tags.push('injury-history');
    if (trainingsPerWeek >= 5) tags.push('high-frequency');
    if (trainingsPerWeek <= 2) tags.push('low-frequency');
    
    // Spanish preference
    if (language === 'es') {
      tags.push('spanish-preferred');
      tags.push('high-engagement'); // Spanish users = 3x engagement
    }

    return tags;
  }, [userProfile, calculateSegment]);

  // Get complete personalization result
  const getPersonalization = useCallback((): PersonalizationResult => {
    const segment = calculateSegment();
    
    return {
      userProfile,
      segment,
      contentRecommendations: getContentRecommendations(),
      emailSequence: getEmailSequence(),
      tags: generateTags()
    };
  }, [
    userProfile,
    calculateSegment,
    getContentRecommendations,
    getEmailSequence,
    generateTags
  ]);

  // Get recommended starting path
  const getStartingPath = useCallback((): string => {
    const segment = calculateSegment();
    const { language } = userProfile;

    const paths: Record<UserSegment, string> = {
      beginner: '/programs/beginner-fundamentals',
      intermediate: '/programs/intermediate-power',
      advanced: '/programs/advanced-conditioning',
      competitive: '/programs/tournament-prep'
    };

    let path = paths[segment];
    
    // Add Spanish prefix if needed
    if (language === 'es') {
      path = `/es${path}`;
    }

    return path;
  }, [userProfile, calculateSegment]);

  return {
    userProfile,
    segment: calculateSegment(),
    getPersonalization,
    getContentRecommendations,
    getEmailSequence,
    generateTags,
    getStartingPath
  };
}
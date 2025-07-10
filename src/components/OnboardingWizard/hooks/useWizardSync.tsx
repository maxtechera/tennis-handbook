import { useCallback, useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { WizardData } from '../types';

interface UseWizardSyncProps {
  sessionId: string;
  currentStep: number;
  wizardData: WizardData;
  isComplete: boolean;
}

export function useWizardSync({ 
  sessionId, 
  currentStep, 
  wizardData,
  isComplete 
}: UseWizardSyncProps) {
  const hasStartedRef = useRef(false);
  const lastSyncedDataRef = useRef<string>('');
  
  // Get UTM params and metadata
  const getMetadata = useCallback(() => {
    if (typeof window === 'undefined') return {};
    
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
      referrer: document.referrer,
    };
  }, []);
  
  // Quick email capture on wizard start
  const captureEmail = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/wizard-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          sessionId,
          source: 'wizard'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to capture email');
      }
      
      hasStartedRef.current = true;
      return { success: true };
    } catch (error) {
      console.error('Email capture error:', error);
      return { success: false, error };
    }
  }, [sessionId]);
  
  // Sync wizard progress to database (debounced)
  const syncToDatabase = useDebouncedCallback(
    async (data: Partial<WizardData>) => {
      try {
        // Only sync if data has changed
        const dataString = JSON.stringify(data);
        if (dataString === lastSyncedDataRef.current) {
          return;
        }
        
        const response = await fetch('/api/wizard-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            step: currentStep,
            data,
            metadata: getMetadata()
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save progress');
        }
        
        lastSyncedDataRef.current = dataString;
      } catch (error) {
        console.error('Sync error:', error);
        // Don't throw - we want the wizard to continue even if sync fails
      }
    },
    1000 // 1 second debounce
  );
  
  // Complete wizard and sync all data
  const completeWizard = useCallback(async () => {
    try {
      const response = await fetch('/api/wizard-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          wizardData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete wizard');
      }
      
      const result = await response.json();
      return {
        success: true,
        ...result
      };
    } catch (error) {
      console.error('Completion error:', error);
      return { 
        success: false, 
        error,
        // Still return recommendations even if DB save fails
        recommendations: getLocalRecommendations(wizardData),
        segment: calculateLocalSegment(wizardData)
      };
    }
  }, [sessionId, wizardData]);
  
  // Auto-sync when data changes
  useEffect(() => {
    if (wizardData && Object.keys(wizardData).length > 0 && !isComplete) {
      syncToDatabase(wizardData);
    }
  }, [wizardData, syncToDatabase, isComplete]);
  
  // Load saved progress
  const loadProgress = useCallback(async () => {
    // For now, we'll rely on localStorage
    // In the future, we can load from database
    return null;
  }, []);
  
  return {
    captureEmail,
    syncToDatabase,
    completeWizard,
    loadProgress,
    hasStarted: hasStartedRef.current
  };
}

// Local fallback functions
function calculateLocalSegment(data: WizardData): string {
  const { tennisExperience, physicalProfile, schedulePreferences } = data;
  
  if (!tennisExperience) return 'beginner';
  
  if (
    tennisExperience.playsCompetitively &&
    tennisExperience.currentLevel !== 'beginner' &&
    physicalProfile?.fitnessLevel === 'excellent' &&
    schedulePreferences?.commitmentLevel === 'professional'
  ) {
    return 'competitive';
  }
  
  if (
    tennisExperience.currentLevel === 'advanced' ||
    (tennisExperience.yearsPlaying === '5+' && 
     physicalProfile?.fitnessLevel === 'good')
  ) {
    return 'advanced';
  }
  
  if (
    tennisExperience.currentLevel === 'intermediate' ||
    ['3-5', '1-3'].includes(tennisExperience.yearsPlaying)
  ) {
    return 'intermediate';
  }
  
  return 'beginner';
}

function getLocalRecommendations(wizardData: WizardData) {
  const recommendations = [];
  const { tennisExperience, trainingGoals } = wizardData;
  
  if (tennisExperience?.currentLevel === 'beginner') {
    recommendations.push({
      path: '/docs/training-philosophy/overview',
      title: 'Start with the Fundamentals',
      reason: 'Perfect for building a strong foundation',
    });
  }
  
  if (trainingGoals?.primaryGoal === 'fitness') {
    recommendations.push({
      path: '/docs/workouts/overview',
      title: '12-Week Training Program',
      reason: 'Structured fitness progression',
    });
  }
  
  return recommendations.slice(0, 3);
}
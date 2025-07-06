import { useEffect, useCallback, useRef } from 'react';
import { WizardData, WizardState } from '../types';

interface UseWizardPersistenceProps {
  state: WizardState;
  persistKey?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

interface PersistedWizardData {
  state: WizardState;
  expiresAt: string;
  version: string;
}

const STORAGE_VERSION = '1.0.0';
const DEFAULT_EXPIRY_DAYS = 30;

export function useWizardPersistence({
  state,
  persistKey = 'tennis-onboarding-wizard',
  autoSave = true,
  autoSaveDelay = 1000
}: UseWizardPersistenceProps) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  // Check if localStorage is available
  const isStorageAvailable = useCallback(() => {
    try {
      const testKey = '__wizard_persistence_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Calculate expiry date
  const getExpiryDate = useCallback(() => {
    const date = new Date();
    date.setDate(date.getDate() + DEFAULT_EXPIRY_DAYS);
    return date.toISOString();
  }, []);

  // Save state to localStorage
  const saveState = useCallback(() => {
    if (!isStorageAvailable()) return false;

    try {
      const dataToSave: PersistedWizardData = {
        state,
        expiresAt: getExpiryDate(),
        version: STORAGE_VERSION
      };

      const serialized = JSON.stringify(dataToSave);
      
      // Only save if data has changed
      if (serialized === lastSavedRef.current) {
        return true;
      }

      localStorage.setItem(persistKey, serialized);
      lastSavedRef.current = serialized;

      // Also save individual pieces for easier access
      localStorage.setItem(`${persistKey}-step`, state.currentStep.toString());
      localStorage.setItem(`${persistKey}-data`, JSON.stringify(state.data));
      localStorage.setItem(`${persistKey}-session`, state.sessionId);
      
      return true;
    } catch (error) {
      console.error('Failed to save wizard state:', error);
      return false;
    }
  }, [state, persistKey, isStorageAvailable, getExpiryDate]);

  // Load state from localStorage
  const loadState = useCallback((): WizardState | null => {
    if (!isStorageAvailable()) return null;

    try {
      const saved = localStorage.getItem(persistKey);
      if (!saved) return null;

      const parsed: PersistedWizardData = JSON.parse(saved);

      // Check version compatibility
      if (parsed.version !== STORAGE_VERSION) {
        console.warn('Saved wizard data version mismatch, ignoring saved state');
        clearState();
        return null;
      }

      // Check if data has expired
      if (new Date(parsed.expiresAt) < new Date()) {
        console.info('Saved wizard data has expired, clearing');
        clearState();
        return null;
      }

      // Validate the loaded state
      if (!parsed.state || !parsed.state.data) {
        console.warn('Invalid saved wizard state');
        return null;
      }

      return parsed.state;
    } catch (error) {
      console.error('Failed to load wizard state:', error);
      return null;
    }
  }, [persistKey, isStorageAvailable]);

  // Clear saved state
  const clearState = useCallback(() => {
    if (!isStorageAvailable()) return;

    try {
      localStorage.removeItem(persistKey);
      localStorage.removeItem(`${persistKey}-step`);
      localStorage.removeItem(`${persistKey}-data`);
      localStorage.removeItem(`${persistKey}-session`);
      lastSavedRef.current = '';
    } catch (error) {
      console.error('Failed to clear wizard state:', error);
    }
  }, [persistKey, isStorageAvailable]);

  // Check if there's saved state
  const hasSavedState = useCallback((): boolean => {
    if (!isStorageAvailable()) return false;
    return localStorage.getItem(persistKey) !== null;
  }, [persistKey, isStorageAvailable]);

  // Get saved session ID
  const getSavedSessionId = useCallback((): string | null => {
    if (!isStorageAvailable()) return null;
    return localStorage.getItem(`${persistKey}-session`);
  }, [persistKey, isStorageAvailable]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Don't save if wizard is complete
    if (state.isComplete) {
      clearState();
      return;
    }

    // Set up debounced save
    saveTimeoutRef.current = setTimeout(() => {
      saveState();
    }, autoSaveDelay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, autoSave, autoSaveDelay, saveState, clearState]);

  // Save on page unload
  useEffect(() => {
    if (!autoSave) return;

    const handleBeforeUnload = () => {
      if (!state.isComplete) {
        saveState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [autoSave, state.isComplete, saveState]);

  // Export saved data for debugging or migration
  const exportData = useCallback((): string | null => {
    const saved = loadState();
    if (!saved) return null;

    return JSON.stringify({
      data: saved.data,
      metadata: {
        exportedAt: new Date().toISOString(),
        wizardVersion: saved.data.wizardVersion,
        sessionId: saved.sessionId
      }
    }, null, 2);
  }, [loadState]);

  // Import data (for migration or testing)
  const importData = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.data || !parsed.metadata) {
        throw new Error('Invalid import data format');
      }

      const importedState: WizardState = {
        currentStep: 0,
        data: parsed.data,
        isComplete: false,
        startedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        sessionId: parsed.metadata.sessionId || `imported-${Date.now()}`
      };

      const dataToSave: PersistedWizardData = {
        state: importedState,
        expiresAt: getExpiryDate(),
        version: STORAGE_VERSION
      };

      localStorage.setItem(persistKey, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Failed to import wizard data:', error);
      return false;
    }
  }, [persistKey, getExpiryDate]);

  return {
    // Core functions
    saveState,
    loadState,
    clearState,
    hasSavedState,
    getSavedSessionId,

    // Utilities
    exportData,
    importData,
    isStorageAvailable: isStorageAvailable()
  };
}
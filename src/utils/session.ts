const SESSION_KEY = 'tennis_session_id';
const SESSION_DATA_KEY = 'tennis_session_data';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Simple UUID v4 generator without external dependency
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface SessionData {
  sessionId: string;
  createdAt: number;
  lastActivity: number;
  wizardData?: any;
  ballsThrown: number;
  deviceInfo?: {
    userAgent: string;
    language: string;
    screenSize: string;
  };
}

class SessionManager {
  private sessionId: string | null = null;
  private sessionData: SessionData | null = null;

  constructor() {
    this.initSession();
  }

  private initSession() {
    // Try to get existing session from localStorage
    const storedSessionId = localStorage.getItem(SESSION_KEY);
    const storedSessionData = localStorage.getItem(SESSION_DATA_KEY);

    if (storedSessionId && storedSessionData) {
      try {
        const data = JSON.parse(storedSessionData) as SessionData;
        
        // Check if session is still valid (not older than 30 days)
        if (Date.now() - data.createdAt < SESSION_DURATION) {
          this.sessionId = storedSessionId;
          this.sessionData = data;
          this.updateLastActivity();
          return;
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }

    // Create new session if none exists or is invalid
    this.createNewSession();
  }

  private createNewSession() {
    this.sessionId = `session_${Date.now()}_${generateUUID().slice(0, 8)}`;
    this.sessionData = {
      sessionId: this.sessionId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ballsThrown: 0,
      deviceInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`
      }
    };

    this.saveSession();
  }

  private saveSession() {
    if (this.sessionId && this.sessionData) {
      localStorage.setItem(SESSION_KEY, this.sessionId);
      localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(this.sessionData));
    }
  }

  private updateLastActivity() {
    if (this.sessionData) {
      this.sessionData.lastActivity = Date.now();
      this.saveSession();
    }
  }

  getSessionId(): string {
    return this.sessionId || '';
  }

  getSessionData(): SessionData | null {
    return this.sessionData;
  }

  updateWizardData(wizardData: any) {
    if (this.sessionData) {
      this.sessionData.wizardData = {
        ...this.sessionData.wizardData,
        ...wizardData
      };
      this.updateLastActivity();
    }
  }

  incrementBallsThrown(count: number) {
    if (this.sessionData) {
      this.sessionData.ballsThrown += count;
      this.updateLastActivity();
    }
  }

  getTotalBallsThrown(): number {
    return this.sessionData?.ballsThrown || 0;
  }

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_DATA_KEY);
    this.createNewSession();
  }

  // Sync session data with server
  async syncWithServer() {
    if (!this.sessionData) return;

    try {
      const response = await fetch('/api/sync-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.sessionData),
      });

      if (!response.ok) {
        throw new Error('Failed to sync session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error syncing session:', error);
      return null;
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
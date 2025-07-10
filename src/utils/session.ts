const SESSION_KEY = "tennis_session_id";
const SESSION_DATA_KEY = "tennis_session_data";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Check if we're in a browser environment
const isBrowser =
  typeof window !== "undefined" && typeof localStorage !== "undefined";

// Simple UUID v4 generator without external dependency
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
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
  private initialized: boolean = false;

  constructor() {
    // Don't initialize on server side - defer until first use
    if (isBrowser) {
      this.initSession();
    }
  }

  private ensureInitialized() {
    if (!this.initialized && isBrowser) {
      this.initSession();
    }
  }

  private initSession() {
    if (!isBrowser) {
      // On server side, create a temporary session that won't be persisted
      this.createServerSession();
      return;
    }

    try {
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
            this.initialized = true;
            return;
          }
        } catch (error) {
          console.error("Error parsing session data:", error);
        }
      }

      // Create new session if none exists or is invalid
      this.createNewSession();
    } catch (error) {
      console.error("Error initializing session:", error);
      // Fallback to server session if localStorage fails
      this.createServerSession();
    }
  }

  private createServerSession() {
    // Create a minimal session for server-side use
    this.sessionId = `server_session_${Date.now()}`;
    this.sessionData = {
      sessionId: this.sessionId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ballsThrown: 0,
      deviceInfo: {
        userAgent: "server",
        language: "en",
        screenSize: "0x0",
      },
    };
    this.initialized = true;
  }

  private createNewSession() {
    this.sessionId = `session_${Date.now()}_${generateUUID().slice(0, 8)}`;
    this.sessionData = {
      sessionId: this.sessionId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ballsThrown: 0,
      deviceInfo: this.getDeviceInfo(),
    };

    this.saveSession();
    this.initialized = true;
  }

  private getDeviceInfo() {
    if (!isBrowser) {
      return {
        userAgent: "server",
        language: "en",
        screenSize: "0x0",
      };
    }

    return {
      userAgent: navigator?.userAgent || "unknown",
      language: navigator?.language || "en",
      screenSize: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    };
  }

  private saveSession() {
    if (!isBrowser || !this.sessionId || !this.sessionData) {
      return;
    }

    try {
      localStorage.setItem(SESSION_KEY, this.sessionId);
      localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(this.sessionData));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }

  private updateLastActivity() {
    if (this.sessionData) {
      this.sessionData.lastActivity = Date.now();
      this.saveSession();
    }
  }

  getSessionId(): string {
    this.ensureInitialized();
    return this.sessionId || "";
  }

  getSessionData(): SessionData | null {
    this.ensureInitialized();
    return this.sessionData;
  }

  updateWizardData(wizardData: any) {
    this.ensureInitialized();
    if (this.sessionData) {
      this.sessionData.wizardData = {
        ...this.sessionData.wizardData,
        ...wizardData,
      };
      this.updateLastActivity();
    }
  }

  incrementBallsThrown(count: number) {
    this.ensureInitialized();
    if (this.sessionData) {
      this.sessionData.ballsThrown += count;
      this.updateLastActivity();
    }
  }

  getTotalBallsThrown(): number {
    this.ensureInitialized();
    return this.sessionData?.ballsThrown || 0;
  }

  clearSession() {
    this.ensureInitialized();
    if (isBrowser) {
      try {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_DATA_KEY);
      } catch (error) {
        console.error("Error clearing session:", error);
      }
    }
    this.createNewSession();
  }

  // Sync session data with server
  async syncWithServer() {
    this.ensureInitialized();
    if (!this.sessionData) return null;

    // Only attempt network requests in browser environment
    if (!isBrowser || typeof fetch === "undefined") {
      console.warn("Cannot sync session: not in browser environment");
      return null;
    }

    try {
      const response = await fetch("/api/sync-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.sessionData),
      });

      if (!response.ok) {
        throw new Error("Failed to sync session");
      }

      return await response.json();
    } catch (error) {
      console.error("Error syncing session:", error);
      return null;
    }
  }

  // Method to check if session is running in browser
  isBrowserSession(): boolean {
    return isBrowser && this.initialized;
  }
}

// Create singleton instance but don't initialize immediately on server
let sessionManagerInstance: SessionManager | null = null;

// Export factory function for safer access
export function getSessionManager(): SessionManager {
  if (!sessionManagerInstance) {
    sessionManagerInstance = new SessionManager();
  }
  return sessionManagerInstance;
}

// Export singleton instance for backward compatibility
export const sessionManager = getSessionManager();

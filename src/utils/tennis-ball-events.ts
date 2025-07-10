// Global event system for tennis ball animations
type TennisBallEventListener = (count: number) => void;

class TennisBallEventEmitter {
  private listeners: TennisBallEventListener[] = [];

  // Subscribe to ball explosion events
  subscribe(listener: TennisBallEventListener) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Trigger a ball explosion
  explode(count: number = 20) {
    this.listeners.forEach(listener => listener(count));
  }
}

// Global singleton instance
export const tennisBallEvents = new TennisBallEventEmitter();
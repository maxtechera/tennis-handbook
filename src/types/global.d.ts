// Global type declarations

interface Window {
  gtag?: (
    command: 'event' | 'config' | 'set' | 'consent',
    eventNameOrId: string,
    parameters?: {
      event_category?: string;
      event_label?: string;
      event_value?: number;
      method?: string;
      [key: string]: any;
    }
  ) => void;
}
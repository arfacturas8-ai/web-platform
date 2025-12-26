// Global type declarations

declare global {
  interface Window {
    google?: typeof google;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    gtag?: (...args: any[]) => void;
  }
}

export {};

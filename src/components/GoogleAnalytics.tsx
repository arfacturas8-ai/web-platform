import { useEffect } from 'react';
import { logger } from '@/utils/logger';

/**
 * Google Analytics 4 Initialization Component
 *
 * This component dynamically loads the Google Analytics script
 * and initializes GA4 tracking when the app loads.
 */
export const GoogleAnalytics = () => {
  useEffect(() => {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    // Only load if measurement ID is configured and valid
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      console.info('Google Analytics not configured. Set VITE_GA_MEASUREMENT_ID in .env');
      return;
    }

    // Check if already loaded
    if (window.gtag) {
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    // Load the GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Configure GA4
    script.onload = () => {
      // @ts-ignore - gtag 'js' command is valid but not in types
      window.gtag?.('js', new Date());
      window.gtag?.('config', measurementId, {
        send_page_view: false, // We handle page views manually in components
      });
      console.info('Google Analytics initialized:', measurementId);
    };

    script.onerror = () => {
      logger.error('Failed to load Google Analytics script');
    };

    return () => {
      // Cleanup: remove script if component unmounts (unlikely in App)
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // This component renders nothing
};

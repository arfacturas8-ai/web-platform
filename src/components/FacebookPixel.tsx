import { useEffect } from 'react';
import { logger } from '@/utils/logger';

/**
 * Facebook Pixel Initialization Component
 * Tracks conversions, page views, and custom events for Facebook Ads
 */

export const FacebookPixel = () => {
  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

    // Only load if pixel ID is configured
    if (!pixelId || pixelId === 'XXXXXXXXXXXXXXXXX') {
      console.info('Facebook Pixel not configured. Set VITE_FB_PIXEL_ID in .env');
      return;
    }

    // Check if already loaded
    if (window.fbq) {
      return;
    }

    // Initialize fbq
    const fbq: any = (window.fbq = function () {
      // @ts-ignore
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    });

    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];

    // Load the FB Pixel script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    script.onload = () => {
      window.fbq?.('init', pixelId);
      window.fbq?.('track', 'PageView');
      console.info('Facebook Pixel initialized:', pixelId);
    };

    script.onerror = () => {
      logger.error('Failed to load Facebook Pixel script');
    };

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, []);

  return null;
};

// Helper functions for tracking events
export const fbTrackEvent = (eventName: string, params?: Record<string, any>) => {
  window.fbq?.('track', eventName, params);
};

export const fbTrackCustomEvent = (eventName: string, params?: Record<string, any>) => {
  window.fbq?.('trackCustom', eventName, params);
};

// Pre-defined event helpers
export const fbTrackAddToCart = (contentId: string, contentName: string, value: number, currency = 'CRC') => {
  fbTrackEvent('AddToCart', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
    value,
    currency,
  });
};

export const fbTrackPurchase = (value: number, currency = 'CRC', contentIds?: string[]) => {
  fbTrackEvent('Purchase', {
    value,
    currency,
    content_ids: contentIds,
    content_type: 'product',
  });
};

export const fbTrackLead = (contentName?: string) => {
  fbTrackEvent('Lead', {
    content_name: contentName || 'Reservation',
  });
};

export const fbTrackViewContent = (contentId: string, contentName: string, value?: number) => {
  fbTrackEvent('ViewContent', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
    value,
    currency: 'CRC',
  });
};

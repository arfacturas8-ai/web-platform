/**
 * Google Analytics 4 Event Tracking Utilities
 *
 * This module provides type-safe event tracking functions for GA4.
 * All events are only sent if GA4 is properly configured.
 */

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// Check if GA is enabled
const isGAEnabled = (): boolean => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return !!(measurementId && measurementId !== 'G-XXXXXXXXXX' && window.gtag);
};

/**
 * Track a page view
 * @param path - The page path (e.g., '/menu', '/reservations')
 * @param title - The page title
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
};

/**
 * Track menu item view
 * @param itemId - Menu item ID
 * @param itemName - Menu item name
 * @param category - Menu category
 * @param price - Menu item price
 */
export const trackMenuItemView = (
  itemId: string,
  itemName: string,
  category?: string,
  price?: number
): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'view_item', {
    item_id: itemId,
    item_name: itemName,
    item_category: category,
    price: price,
  });
};

/**
 * Track menu search
 * @param searchTerm - The search term used
 */
export const trackMenuSearch = (searchTerm: string): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'search', {
    search_term: searchTerm,
  });
};

/**
 * Track category filter selection
 * @param categoryId - Category ID
 * @param categoryName - Category name
 */
export const trackCategoryFilter = (
  categoryId: string | null,
  categoryName: string
): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'category_filter', {
    category_id: categoryId || 'all',
    category_name: categoryName,
  });
};

/**
 * Track reservation form start
 */
export const trackReservationFormStart = (): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'begin_checkout', {
    checkout_type: 'reservation',
  });
};

/**
 * Track reservation form field interaction
 * @param fieldName - The form field name
 */
export const trackReservationFieldInteraction = (fieldName: string): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'form_interaction', {
    form_name: 'reservation',
    field_name: fieldName,
  });
};

/**
 * Track successful reservation completion
 * @param reservationData - Reservation details
 */
export const trackReservationComplete = (reservationData: {
  date: string;
  partySize: number;
  timeSlot: string;
}): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'purchase', {
    transaction_id: `reservation_${Date.now()}`,
    value: reservationData.partySize * 10, // Estimated value
    currency: 'USD',
    items: [{
      item_name: 'Table Reservation',
      item_category: 'Reservation',
      quantity: 1,
      price: reservationData.partySize * 10,
    }],
  });

  // Also track a custom completion event
  window.gtag?.('event', 'reservation_complete', {
    reservation_date: reservationData.date,
    party_size: reservationData.partySize,
    time_slot: reservationData.timeSlot,
  });
};

/**
 * Track custom event
 * @param eventName - The event name
 * @param parameters - Additional event parameters
 */
export const trackCustomEvent = (
  eventName: string,
  parameters?: Record<string, unknown>
): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', eventName, parameters);
};

/**
 * Track outbound link clicks
 * @param url - The destination URL
 * @param label - Optional label for the link
 */
export const trackOutboundLink = (url: string, label?: string): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'click', {
    event_category: 'outbound',
    event_label: label || url,
    transport_type: 'beacon',
  });
};

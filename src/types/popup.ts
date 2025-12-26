/**
 * Popup System Types
 * Fully customizable popup/modal system for Cafe 1973
 */

// Popup display types
export type PopupType = 'modal' | 'banner' | 'slide-in' | 'fullscreen' | 'toast' | 'floating';

// Position for slide-in and floating popups
export type PopupPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right';

// Trigger types for when popup should appear
export type PopupTrigger =
  | 'page_load'           // When page loads
  | 'time_delay'          // After X seconds on page
  | 'scroll_depth'        // When user scrolls X% of page
  | 'exit_intent'         // When user moves mouse to leave
  | 'button_click'        // On specific button/element click
  | 'custom_event'        // Custom JS event
  | 'inactivity'          // After X seconds of no activity
  | 'add_to_cart'         // When item added to cart
  | 'checkout_start'      // When checkout begins
  | 'first_visit'         // First time visitor
  | 'returning_visit';    // Returning visitor

// Button action types
export type ButtonAction =
  | 'close'               // Close popup
  | 'navigate'            // Navigate to URL
  | 'submit_form'         // Submit form data
  | 'add_to_cart'         // Add product to cart
  | 'apply_coupon'        // Apply discount code
  | 'custom';             // Custom callback

// Popup button configuration
export interface PopupButton {
  id: string;
  text: string;
  action: ButtonAction;
  actionData?: string;    // URL for navigate, coupon code, etc.
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

// Popup form field
export interface PopupFormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];  // For select type
}

// Popup styling configuration
export interface PopupStyle {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: number;
  padding: number;
  maxWidth: number;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// Popup targeting rules
export interface PopupTargeting {
  pages: string[];                    // URL patterns to show on ('*' for all, '/menu', '/reservations', etc.)
  excludePages?: string[];            // URLs to exclude
  devices?: ('mobile' | 'tablet' | 'desktop')[];
  languages?: string[];               // Target specific languages
  userType?: 'all' | 'new' | 'returning' | 'logged_in' | 'guest';
  minCartValue?: number;              // Only show if cart > X
  maxCartValue?: number;              // Only show if cart < X
}

// Popup scheduling
export interface PopupSchedule {
  startDate?: string;                 // ISO date string
  endDate?: string;                   // ISO date string
  daysOfWeek?: number[];              // 0-6 (Sunday-Saturday)
  startTime?: string;                 // HH:mm
  endTime?: string;                   // HH:mm
  timezone?: string;
}

// Popup frequency/display limits
export interface PopupFrequency {
  maxDisplaysPerSession?: number;     // Max times per session
  maxDisplaysPerDay?: number;         // Max times per day
  maxDisplaysTotal?: number;          // Max times ever
  cooldownMinutes?: number;           // Minutes between displays
  showOncePerPage?: boolean;          // Only once per page view
}

// Trigger configuration
export interface PopupTriggerConfig {
  type: PopupTrigger;
  delay?: number;                     // Seconds for time_delay
  scrollDepth?: number;               // Percentage for scroll_depth
  elementSelector?: string;           // CSS selector for button_click
  eventName?: string;                 // Event name for custom_event
  inactivityTime?: number;            // Seconds for inactivity
}

// Main Popup interface
export interface Popup {
  id: string;
  name: string;                       // Internal name for admin
  active: boolean;
  type: PopupType;
  position: PopupPosition;

  // Content
  title?: string;
  subtitle?: string;
  content?: string;                   // HTML content allowed
  image?: string;                     // Image URL
  imagePosition?: 'top' | 'left' | 'right' | 'background';
  videoUrl?: string;                  // Uploaded video URL or external embed
  videoType?: 'uploaded' | 'youtube' | 'vimeo';  // Video source type
  videoAutoplay?: boolean;            // Auto-play video
  videoLoop?: boolean;                // Loop video
  videoMuted?: boolean;               // Start muted

  // Buttons
  buttons?: PopupButton[];
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;

  // Form (optional)
  form?: {
    fields: PopupFormField[];
    submitButtonText: string;
    successMessage: string;
    webhookUrl?: string;              // URL to post form data
  };

  // Display logic
  trigger: PopupTriggerConfig;
  targeting: PopupTargeting;
  schedule?: PopupSchedule;
  frequency?: PopupFrequency;
  priority?: number;                  // Higher priority = shows first

  // Styling
  style: PopupStyle;
  customCSS?: string;

  // Tracking
  trackViews?: boolean;
  trackClicks?: boolean;
  conversionEvent?: string;           // Event name for conversion tracking

  // Multilingual content
  translations?: {
    [lang: string]: {
      title?: string;
      subtitle?: string;
      content?: string;
      buttons?: { id: string; text: string }[];
    };
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// Popup analytics
export interface PopupAnalytics {
  popupId: string;
  views: number;
  clicks: number;
  conversions: number;
  dismissals: number;
  formSubmissions?: number;
  conversionRate: number;
  lastViewed?: string;
}

// Popup display state (runtime)
export interface PopupDisplayState {
  popupId: string;
  displayCount: number;
  lastDisplayed?: string;
  dismissed?: boolean;
  converted?: boolean;
}

// Context state
export interface PopupContextState {
  popups: Popup[];
  activePopup: Popup | null;
  displayStates: Record<string, PopupDisplayState>;
  isLoading: boolean;
}

// Default popup style
export const DEFAULT_POPUP_STYLE: PopupStyle = {
  backgroundColor: '#ffffff',
  textColor: '#223833',
  accentColor: '#d1bd92',
  borderRadius: 16,
  padding: 24,
  maxWidth: 480,
  overlay: true,
  overlayColor: '#000000',
  overlayOpacity: 0.5,
  animation: 'scale',
  shadow: 'xl',
};

// Default popup frequency
export const DEFAULT_POPUP_FREQUENCY: PopupFrequency = {
  maxDisplaysPerSession: 1,
  maxDisplaysPerDay: 1,
  cooldownMinutes: 30,
  showOncePerPage: true,
};

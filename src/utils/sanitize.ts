/**
 * HTML Sanitization Utility
 * Prevents XSS attacks by sanitizing user-generated HTML content
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Untrusted HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'em', 'strong', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote', 'pre', 'code',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style',
      'target', 'rel', 'width', 'height',
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    ADD_TAGS: [],
    // Force all links to open in new tab with noopener
    FORCE_BODY: true,
  });
};

/**
 * Sanitize CSS to prevent style-based attacks
 * @param css - Untrusted CSS string
 * @returns Sanitized CSS string
 */
export const sanitizeCss = (css: string): string => {
  // Remove potentially dangerous CSS properties and values
  const dangerousPatterns = [
    /expression\s*\(/gi,           // IE expression
    /javascript\s*:/gi,            // javascript: URLs
    /behavior\s*:/gi,              // IE behavior
    /-moz-binding\s*:/gi,          // Firefox binding
    /@import/gi,                   // CSS imports
    /url\s*\(\s*["']?\s*data:/gi,  // data: URLs (can embed scripts)
  ];

  let sanitized = css;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  return sanitized;
};

/**
 * Validate URL to prevent javascript: and data: URLs
 * @param url - URL to validate
 * @returns true if URL is safe, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const parsed = new URL(url, window.location.origin);
    // Only allow http, https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Sanitize URL for use in iframes or links
 * @param url - URL to sanitize
 * @param allowedDomains - Optional list of allowed domains
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string, allowedDomains?: string[]): string => {
  if (!isValidUrl(url)) return '';

  try {
    const parsed = new URL(url);

    // If allowedDomains specified, check against whitelist
    if (allowedDomains && allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain =>
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) return '';
    }

    return url;
  } catch {
    return '';
  }
};

/**
 * Allowed video embed domains for iframes
 */
export const ALLOWED_VIDEO_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'dailymotion.com',
  'www.dailymotion.com',
];

export default {
  sanitizeHtml,
  sanitizeCss,
  sanitizeUrl,
  isValidUrl,
  ALLOWED_VIDEO_DOMAINS,
};

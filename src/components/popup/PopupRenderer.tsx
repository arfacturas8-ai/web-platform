/**
 * Popup Renderer Component
 * Renders the active popup based on its configuration
 */
import React, { useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';
import { sanitizeHtml, sanitizeCss, sanitizeUrl, ALLOWED_VIDEO_DOMAINS } from '@/utils/sanitize';
import { X } from 'lucide-react';
import { usePopup } from '@/contexts/PopupContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getImageUrl } from '@/utils/constants';
import type { Popup, PopupButton, PopupFormField } from '@/types/popup';

// Animation classes based on popup type
const getAnimationClasses = (animation?: string, isEntering: boolean = true): string => {
  const base = 'transition-all duration-300 ease-out';
  if (!isEntering) return `${base} opacity-0 scale-95`;

  switch (animation) {
    case 'fade':
      return `${base} animate-fade-in`;
    case 'slide':
      return `${base} animate-slide-up`;
    case 'scale':
      return `${base} animate-scale-in`;
    case 'bounce':
      return `${base} animate-bounce-in`;
    default:
      return `${base} animate-scale-in`;
  }
};

// Position classes for different popup positions
const getPositionClasses = (position: string, type: string): string => {
  if (type === 'modal' || type === 'fullscreen') {
    return 'fixed inset-0 flex items-center justify-center';
  }

  if (type === 'banner') {
    return position === 'bottom'
      ? 'fixed bottom-0 left-0 right-0'
      : 'fixed top-0 left-0 right-0';
  }

  if (type === 'toast') {
    const positions: Record<string, string> = {
      'top-left': 'fixed top-4 left-4',
      'top-right': 'fixed top-4 right-4',
      'top': 'fixed top-4 left-1/2 -translate-x-1/2',
      'bottom-left': 'fixed bottom-20 left-4',
      'bottom-right': 'fixed bottom-20 right-4',
      'bottom': 'fixed bottom-20 left-1/2 -translate-x-1/2',
    };
    return positions[position] || positions['bottom-right'];
  }

  if (type === 'slide-in' || type === 'floating') {
    const positions: Record<string, string> = {
      'left': 'fixed top-1/2 left-4 -translate-y-1/2',
      'right': 'fixed top-1/2 right-4 -translate-y-1/2',
      'bottom-left': 'fixed bottom-20 left-4',
      'bottom-right': 'fixed bottom-20 right-4',
      'top-left': 'fixed top-4 left-4',
      'top-right': 'fixed top-4 right-4',
    };
    return positions[position] || positions['bottom-right'];
  }

  return 'fixed inset-0 flex items-center justify-center';
};

// Shadow classes
const getShadowClass = (shadow?: string): string => {
  switch (shadow) {
    case 'none': return '';
    case 'sm': return 'shadow-sm';
    case 'md': return 'shadow-md';
    case 'lg': return 'shadow-lg';
    case 'xl': return 'shadow-xl';
    default: return 'shadow-xl';
  }
};

// Button component
const PopupButtonComponent: React.FC<{
  button: PopupButton;
  accentColor: string;
  onAction: (action: string, data?: string) => void;
}> = ({ button, accentColor, onAction }) => {
  const getButtonStyles = () => {
    switch (button.variant) {
      case 'primary':
        return {
          backgroundColor: accentColor,
          color: '#ffffff',
        };
      case 'secondary':
        return {
          backgroundColor: `${accentColor}20`,
          color: accentColor,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: `2px solid ${accentColor}`,
          color: accentColor,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: accentColor,
        };
      default:
        return {};
    }
  };

  return (
    <button
      onClick={() => onAction(button.action, button.actionData)}
      className={`px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90 active:scale-[0.98] ${
        button.fullWidth ? 'w-full' : ''
      }`}
      style={getButtonStyles()}
    >
      {button.text}
    </button>
  );
};

// Form field component
const FormFieldComponent: React.FC<{
  field: PopupFormField;
  value: string;
  onChange: (value: string) => void;
  accentColor: string;
}> = ({ field, value, onChange, accentColor }) => {
  const baseInputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 transition-all';

  switch (field.type) {
    case 'textarea':
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">{field.label}</label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
            style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            rows={4}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">{field.label}</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={baseInputClass}
            style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
          >
            <option value="">{field.placeholder || 'Seleccionar...'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'checkbox':
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
            required={field.required}
            className="w-5 h-5 rounded border-gray-300"
            style={{ accentColor }}
          />
          <span className="text-sm">{field.label}</span>
        </label>
      );

    default:
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">{field.label}</label>
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
            style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
          />
        </div>
      );
  }
};

export const PopupRenderer: React.FC = () => {
  const { activePopup, hidePopup, dismissPopup, trackConversion } = usePopup();
  const { language } = useLanguage();
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Handle escape key
  useEffect(() => {
    if (!activePopup?.closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hidePopup();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activePopup, hidePopup]);

  // Get translated content
  const getContent = useCallback((popup: Popup) => {
    const translation = popup.translations?.[language];
    return {
      title: translation?.title || popup.title,
      subtitle: translation?.subtitle || popup.subtitle,
      content: translation?.content || popup.content,
      buttons: popup.buttons?.map(btn => {
        const translatedBtn = translation?.buttons?.find(tb => tb.id === btn.id);
        return translatedBtn ? { ...btn, text: translatedBtn.text } : btn;
      }),
    };
  }, [language]);

  // Handle button actions
  const handleAction = useCallback(async (action: string, data?: string) => {
    if (!activePopup) return;

    switch (action) {
      case 'close':
        hidePopup();
        break;
      case 'navigate':
        trackConversion(activePopup.id);
        if (data) window.location.href = data;
        break;
      case 'apply_coupon':
        trackConversion(activePopup.id);
        // Store coupon in localStorage or apply to cart
        if (data) {
          localStorage.setItem('applied_coupon', data);
          alert(language === 'es' ? `Cupón ${data} aplicado!` : `Coupon ${data} applied!`);
        }
        hidePopup();
        break;
      case 'custom':
        trackConversion(activePopup.id);
        // Emit custom event
        if (data) {
          window.dispatchEvent(new CustomEvent(data, { detail: { popupId: activePopup.id } }));
        }
        hidePopup();
        break;
      default:
        hidePopup();
    }
  }, [activePopup, hidePopup, trackConversion, language]);

  // Handle form submission
  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePopup?.form) return;

    setIsSubmitting(true);

    try {
      if (activePopup.form.webhookUrl) {
        await fetch(activePopup.form.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            popupId: activePopup.id,
            ...formData,
            timestamp: new Date().toISOString(),
          }),
        });
      }

      trackConversion(activePopup.id);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        hidePopup();
        setFormData({});
      }, 2000);
    } catch (error) {
      logger.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [activePopup, formData, hidePopup, trackConversion]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && activePopup?.closeOnOverlayClick) {
      hidePopup();
    }
  }, [activePopup, hidePopup]);

  if (!activePopup) return null;

  const { style, type, position } = activePopup;
  const content = getContent(activePopup);

  // Popup container styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    borderRadius: `${style.borderRadius}px`,
    padding: `${style.padding}px`,
    maxWidth: type === 'fullscreen' ? '100%' : `${style.maxWidth}px`,
    width: type === 'banner' || type === 'fullscreen' ? '100%' : 'auto',
  };

  // Overlay styles
  const overlayStyle: React.CSSProperties = style.overlay ? {
    backgroundColor: style.overlayColor || '#000000',
    opacity: style.overlayOpacity || 0.5,
  } : {};

  return (
    <div
      className={`z-[9999] ${getPositionClasses(position, type)}`}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      {style.overlay && type !== 'toast' && type !== 'floating' && (
        <div
          className="absolute inset-0"
          style={overlayStyle}
        />
      )}

      {/* Popup Content */}
      <div
        className={`relative ${getAnimationClasses(style.animation)} ${getShadowClass(style.shadow)}`}
        style={containerStyle}
      >
        {/* Custom CSS - sanitized to prevent CSS-based attacks */}
        {activePopup.customCSS && (
          <style dangerouslySetInnerHTML={{ __html: sanitizeCss(activePopup.customCSS) }} />
        )}

        {/* Close Button */}
        {activePopup.showCloseButton !== false && (
          <button
            onClick={() => dismissPopup(activePopup.id)}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        {/* Image */}
        {activePopup.image && (
          <div className={`${
            activePopup.imagePosition === 'background'
              ? 'absolute inset-0 -z-10'
              : activePopup.imagePosition === 'left' || activePopup.imagePosition === 'right'
                ? 'flex-shrink-0 w-1/3'
                : 'w-full mb-4'
          }`}>
            <img
              src={getImageUrl(activePopup.image)}
              alt={content.title || 'Popup image'}
              className={`${
                activePopup.imagePosition === 'background'
                  ? 'w-full h-full object-cover opacity-20'
                  : 'w-full h-auto rounded-lg object-cover'
              }`}
            />
          </div>
        )}

        {/* Video */}
        {activePopup.videoUrl && (
          <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden bg-black">
            {activePopup.videoType === 'uploaded' || activePopup.videoUrl.startsWith('/uploads') ? (
              <video
                src={getImageUrl(activePopup.videoUrl)}
                className="w-full h-full object-contain"
                controls
                autoPlay={activePopup.videoAutoplay}
                loop={activePopup.videoLoop}
                muted={activePopup.videoMuted !== false}
                playsInline
              />
            ) : (
              // Validate video URL against allowed domains to prevent malicious iframes
              sanitizeUrl(activePopup.videoUrl, ALLOWED_VIDEO_DOMAINS) ? (
                <iframe
                  src={sanitizeUrl(activePopup.videoUrl, ALLOWED_VIDEO_DOMAINS)}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  Invalid video URL
                </div>
              )
            )}
          </div>
        )}

        {/* Text Content */}
        <div className={activePopup.image && (activePopup.imagePosition === 'left' || activePopup.imagePosition === 'right') ? 'flex-1' : ''}>
          {content.title && (
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
          )}

          {content.subtitle && (
            <p className="text-lg opacity-80 mb-4">{content.subtitle}</p>
          )}

          {content.content && (
            <div
              className="prose prose-sm max-w-none mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.content) }}
            />
          )}
        </div>

        {/* Form */}
        {activePopup.form && !showSuccess && (
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
            {activePopup.form.fields.map((field) => (
              <FormFieldComponent
                key={field.id}
                field={field}
                value={formData[field.id] || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}
                accentColor={style.accentColor}
              />
            ))}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: style.accentColor,
                color: '#ffffff',
              }}
            >
              {isSubmitting
                ? (language === 'es' ? 'Enviando...' : 'Sending...')
                : activePopup.form.submitButtonText
              }
            </button>
          </form>
        )}

        {/* Success Message */}
        {showSuccess && activePopup.form && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium">{activePopup.form.successMessage}</p>
          </div>
        )}

        {/* Buttons */}
        {content.buttons && content.buttons.length > 0 && !showSuccess && (
          <div className={`flex gap-3 mt-6 ${
            content.buttons.length === 1 ? 'justify-center' : 'justify-between'
          }`}>
            {content.buttons.map((button) => (
              <PopupButtonComponent
                key={button.id}
                button={button}
                accentColor={style.accentColor}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupRenderer;

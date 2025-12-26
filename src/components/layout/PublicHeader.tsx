/**
 * PublicHeader - Global floating header for public pages
 * Includes Language Selector and Currency Toggle
 */
import React from 'react';
import { Link } from '@/lib/router';
import { LanguageSelector } from '@/components/LanguageSelector';
import CurrencyToggle from '@/components/ui/CurrencyToggle';
import { Coffee, ArrowLeft } from 'lucide-react';

interface PublicHeaderProps {
  /** Show back button that navigates to home */
  showBackButton?: boolean;
  /** Custom back action */
  onBack?: () => void;
  /** Background style variant */
  variant?: 'light' | 'dark' | 'transparent';
  /** Show logo */
  showLogo?: boolean;
  /** Show currency toggle */
  showCurrency?: boolean;
  /** Custom className for the container */
  className?: string;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  showBackButton = false,
  onBack,
  variant = 'transparent',
  showLogo = false,
  showCurrency = false,
  className = '',
}) => {
  const variantStyles = {
    light: 'bg-white/90 backdrop-blur-md shadow-sm',
    dark: 'bg-black/40 backdrop-blur-md',
    transparent: '',
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Left side - Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            onBack ? (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-forest/80 hover:text-forest transition-colors touch-scale"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 text-forest/80 hover:text-forest transition-colors touch-scale"
              >
                <ArrowLeft size={20} />
              </Link>
            )
          )}
          {showLogo && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center">
                <Coffee className="w-4 h-4 text-sand" />
              </div>
            </Link>
          )}
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-2">
          {showCurrency && <CurrencyToggle className="hidden sm:flex" />}
          <LanguageSelector variant="compact" />
        </div>
      </div>
    </header>
  );
};

/**
 * FloatingLanguageSelector - Simple floating language selector
 * Use this when you just need the language selector without the full header
 */
export const FloatingLanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <LanguageSelector variant="compact" />
    </div>
  );
};

/**
 * FloatingControls - Combined language and currency controls
 * Floating in top-right corner
 */
export const FloatingControls: React.FC<{
  showCurrency?: boolean;
  className?: string;
}> = ({
  showCurrency = false,
  className = ''
}) => {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 ${className}`}>
      {showCurrency && <CurrencyToggle />}
      <LanguageSelector variant="compact" />
    </div>
  );
};

export default PublicHeader;

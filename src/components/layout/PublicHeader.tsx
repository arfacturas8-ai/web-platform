/**
 * Cafe 1973 - Public Header Components
 * Bisqueria-inspired design with Cafe 1973 brand colors
 * Includes floating language selector and header variants
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
    light: 'bg-cream/95 backdrop-blur-md shadow-soft border-b border-sand-light',
    dark: 'bg-forest/90 backdrop-blur-md',
    transparent: '',
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${variantStyles[variant]} ${className}`}>
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              onBack ? (
                <button
                  onClick={onBack}
                  className="nav-icon-btn"
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : (
                <Link
                  to="/"
                  className="nav-icon-btn"
                  aria-label="Go back home"
                >
                  <ArrowLeft size={20} />
                </Link>
              )
            )}
            {showLogo && (
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
                  <Coffee className="w-5 h-5 text-sand" />
                </div>
                <span className="font-bold text-forest hidden sm:block">Cafe 1973</span>
              </Link>
            )}
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-3">
            {showCurrency && <CurrencyToggle className="hidden sm:flex" />}
            <LanguageSelector variant="compact" />
          </div>
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
      <div className="bg-cream/90 backdrop-blur-md rounded-full shadow-soft p-1">
        <LanguageSelector variant="compact" />
      </div>
    </div>
  );
};

/**
 * FloatingControls - Combined language and currency controls
 * Floating in top-right corner with glass effect
 */
export const FloatingControls: React.FC<{
  showCurrency?: boolean;
  className?: string;
}> = ({
  showCurrency = false,
  className = ''
}) => {
  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className="flex items-center gap-2 bg-cream/90 backdrop-blur-md rounded-full shadow-soft px-2 py-1">
        {showCurrency && <CurrencyToggle />}
        <LanguageSelector variant="compact" />
      </div>
    </div>
  );
};

export default PublicHeader;

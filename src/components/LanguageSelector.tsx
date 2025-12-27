/**
 * Cafe 1973 - Language Selector
 * Bisqueria-inspired design with Cafe 1973 brand colors
 * Dropdown language switcher with multiple variants
 */
import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, LANGUAGE_FLAGS } from '@/utils/constants';
import type { Language } from '@/utils/i18n';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

export const LanguageSelector = ({ variant = 'default', className = '' }: LanguageSelectorProps) => {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: string) => {
    setLanguage(lang as Language);
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-sand/30 hover:bg-sand/50 transition-all duration-200"
          aria-label={t('selectLanguage')}
        >
          <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 bg-cream rounded-2xl shadow-elevated border border-sand-light overflow-hidden z-50 min-w-[160px] animate-scale-in">
            {supportedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-sand/20 transition-colors ${
                  language === lang ? 'bg-sand/30 text-forest font-semibold' : 'text-forest/80'
                }`}
              >
                <span className="text-lg">{LANGUAGE_FLAGS[lang]}</span>
                <span className="text-sm">{LANGUAGE_NAMES[lang]}</span>
                {language === lang && (
                  <Check size={16} className="ml-auto text-forest" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-sand/30 hover:bg-sand/50 transition-all duration-200"
          aria-label={t('selectLanguage')}
        >
          <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
          <span className="text-sm font-semibold text-forest">{language.toUpperCase()}</span>
          <ChevronDown size={14} className={`text-forest/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 bg-cream rounded-2xl shadow-elevated border border-sand-light overflow-hidden z-50 min-w-[180px] animate-scale-in">
            {supportedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-sand/20 transition-colors ${
                  language === lang ? 'bg-sand/30 text-forest font-semibold' : 'text-forest/80'
                }`}
              >
                <span className="text-lg">{LANGUAGE_FLAGS[lang]}</span>
                <span className="text-sm flex-1">{LANGUAGE_NAMES[lang]}</span>
                {language === lang && (
                  <Check size={16} className="text-forest" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default variant with full dropdown
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border-2 border-sand-light hover:border-forest/30 shadow-soft hover:shadow-card transition-all duration-200"
        aria-label={t('selectLanguage')}
      >
        <Globe className="w-4 h-4 text-forest/50" strokeWidth={2} />
        <span className="text-xl">{LANGUAGE_FLAGS[language]}</span>
        <span className="text-sm font-semibold text-forest">{LANGUAGE_NAMES[language]}</span>
        <ChevronDown size={16} className={`text-forest/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-cream rounded-2xl shadow-elevated border border-sand-light overflow-hidden z-50 min-w-[220px] animate-scale-in">
          <div className="px-4 py-3 bg-sand/20 border-b border-sand-light">
            <p className="text-xs font-bold text-forest/50 uppercase tracking-wider">{t('selectLanguage')}</p>
          </div>
          <div className="py-2">
            {supportedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-sand/20 transition-colors ${
                  language === lang ? 'bg-forest/5 text-forest font-semibold' : 'text-forest/70'
                }`}
              >
                <span className="text-xl">{LANGUAGE_FLAGS[lang]}</span>
                <span className="flex-1 text-left text-sm">{LANGUAGE_NAMES[lang]}</span>
                {language === lang && (
                  <div className="w-6 h-6 bg-forest rounded-full flex items-center justify-center">
                    <Check size={14} className="text-cream" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

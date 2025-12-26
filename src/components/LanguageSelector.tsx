import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
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
          className="flex items-center gap-1 p-2 rounded-lg hover:bg-sand/20 transition-colors touch-scale"
          aria-label={t('selectLanguage')}
        >
          <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-sand/30 overflow-hidden z-50 min-w-[140px] animate-scale-in">
            {supportedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors touch-scale ${
                  language === lang ? 'bg-cream text-forest font-medium' : 'text-forest/80'
                }`}
              >
                <span className="text-lg">{LANGUAGE_FLAGS[lang]}</span>
                <span className="text-sm">{LANGUAGE_NAMES[lang]}</span>
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
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sand/20 hover:bg-sand/30 transition-colors touch-scale"
          aria-label={t('selectLanguage')}
        >
          <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
          <span className="text-sm font-medium text-forest">{language.toUpperCase()}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-sand/30 overflow-hidden z-50 min-w-[160px] animate-scale-in">
            {supportedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors touch-scale ${
                  language === lang ? 'bg-cream text-forest font-medium' : 'text-forest/80'
                }`}
              >
                <span className="text-lg">{LANGUAGE_FLAGS[lang]}</span>
                <span className="text-sm">{LANGUAGE_NAMES[lang]}</span>
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-sand/50 hover:border-sand hover:shadow-md transition-all touch-scale"
        aria-label={t('selectLanguage')}
      >
        <Globe className="w-4 h-4 text-forest/60" />
        <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
        <span className="text-sm font-medium text-forest">{LANGUAGE_NAMES[language]}</span>
        <svg
          className={`w-4 h-4 text-forest/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-sand/30 overflow-hidden z-50 min-w-[200px] animate-scale-in">
          <div className="px-4 py-2 bg-cream/50 border-b border-sand/20">
            <p className="text-xs font-medium text-forest/60 uppercase tracking-wide">{t('selectLanguage')}</p>
          </div>
          <div className="py-1">
            {supportedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors touch-scale ${
                  language === lang ? 'bg-sand/20 text-forest font-medium' : 'text-forest/80'
                }`}
              >
                <span className="text-xl">{LANGUAGE_FLAGS[lang]}</span>
                <span className="flex-1 text-left">{LANGUAGE_NAMES[lang]}</span>
                {language === lang && (
                  <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
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

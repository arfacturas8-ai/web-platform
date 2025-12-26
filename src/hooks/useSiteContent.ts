/**
 * Site Content Hook
 * Loads dynamic content from Content Manager
 */
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import type {
  HeroBanner,
  FeatureItem,
  PromoBanner,
  Testimonial,
  GalleryImage,
  SiteContent,
} from '@/types/content';
import { DEFAULT_HERO, DEFAULT_FEATURES } from '@/types/content';

const CONTENT_STORAGE_KEY = 'cafe1973_site_content';

interface UseSiteContentReturn {
  hero: HeroBanner;
  features: FeatureItem[];
  promo: PromoBanner | null;
  testimonials: Testimonial[];
  gallery: GalleryImage[];
  isLoading: boolean;
  refresh: () => void;
}

export const useSiteContent = (): UseSiteContentReturn => {
  const [content, setContent] = useState<Partial<SiteContent>>({
    hero: DEFAULT_HERO,
    features: DEFAULT_FEATURES,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = () => {
    try {
      const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setContent({
          hero: parsed.hero || DEFAULT_HERO,
          features: parsed.features || DEFAULT_FEATURES,
          promo: parsed.promo || null,
          testimonials: parsed.testimonials || [],
          gallery: parsed.gallery || [],
        });
      }
    } catch (e) {
      logger.error('Error loading site content:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONTENT_STORAGE_KEY) {
        loadContent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    hero: content.hero || DEFAULT_HERO,
    features: (content.features || DEFAULT_FEATURES).filter(f => f.is_active),
    promo: content.promo?.is_active ? content.promo : null,
    testimonials: (content.testimonials || []).filter(t => t.is_active),
    gallery: (content.gallery || []).filter(g => g.is_active),
    isLoading,
    refresh: loadContent,
  };
};

export default useSiteContent;

/**
 * Content Management Types
 * For managing home page banners, sections, and dynamic content
 */

// Hero/Banner configuration
export interface HeroBanner {
  id: string;
  title: string;
  title_es: string;
  subtitle?: string;
  subtitle_es?: string;
  tagline?: string;
  tagline_es?: string;
  image_url?: string;
  video_url?: string;
  video_autoplay?: boolean;
  video_loop?: boolean;
  video_muted?: boolean;
  background_color?: string;
  text_color?: string;
  cta_primary_text?: string;
  cta_primary_text_es?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_text_es?: string;
  cta_secondary_link?: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
}

// Feature/highlight item
export interface FeatureItem {
  id: string;
  icon: string;  // lucide icon name
  title: string;
  title_es: string;
  description: string;
  description_es: string;
  is_active: boolean;
  display_order: number;
}

// Home section types
export type SectionType =
  | 'hero'
  | 'features'
  | 'featured_products'
  | 'testimonials'
  | 'gallery'
  | 'cta'
  | 'location'
  | 'hours'
  | 'custom';

// Home section configuration
export interface HomeSection {
  id: string;
  type: SectionType;
  title?: string;
  title_es?: string;
  subtitle?: string;
  subtitle_es?: string;
  content?: string;
  content_es?: string;
  background_color?: string;
  text_color?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  config?: Record<string, any>;  // Section-specific configuration
}

// Promotional banner (for top of page announcements)
export interface PromoBanner {
  id: string;
  text: string;
  text_es: string;
  link?: string;
  background_color: string;
  text_color: string;
  icon?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  dismissible: boolean;
}

// Testimonial/Review
export interface Testimonial {
  id: string;
  author_name: string;
  author_image?: string;
  rating: number;
  text: string;
  text_es?: string;
  source?: string;  // 'Google', 'TripAdvisor', etc.
  date?: string;
  is_active: boolean;
  display_order: number;
}

// Gallery item (image or video)
export interface GalleryImage {
  id: string;
  image_url: string;
  video_url?: string;
  media_type?: 'image' | 'video';
  alt_text: string;
  alt_text_es?: string;
  category?: string;  // 'food', 'interior', 'team', etc.
  is_active: boolean;
  display_order: number;
}

// Full site content configuration
export interface SiteContent {
  hero: HeroBanner;
  promo_banner?: PromoBanner;
  promo?: PromoBanner;
  features: FeatureItem[];
  sections: HomeSection[];
  testimonials: Testimonial[];
  gallery: GalleryImage[];
  updated_at: string;
}

// Default hero configuration
export const DEFAULT_HERO: HeroBanner = {
  id: 'default',
  title: 'Café 1973',
  title_es: 'Café 1973',
  subtitle: 'Moravia, Costa Rica',
  subtitle_es: 'Moravia, Costa Rica',
  tagline: 'Where every cup tells a story and every bite is a tradition.',
  tagline_es: 'Donde cada taza cuenta una historia y cada bocado es una tradición.',
  cta_primary_text: 'View Menu',
  cta_primary_text_es: 'Ver Menú',
  cta_primary_link: '/menu',
  cta_secondary_text: 'Book a Table',
  cta_secondary_text_es: 'Reservar Mesa',
  cta_secondary_link: '/reservations',
  is_active: true,
  display_order: 0,
};

// Default features
export const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: 'f1',
    icon: 'Coffee',
    title: 'Specialty Coffee',
    title_es: 'Café de Especialidad',
    description: 'Selected beans from the best farms in Costa Rica',
    description_es: 'Granos seleccionados de las mejores fincas de Costa Rica',
    is_active: true,
    display_order: 0,
  },
  {
    id: 'f2',
    icon: 'Leaf',
    title: 'Fresh Ingredients',
    title_es: 'Ingredientes Frescos',
    description: 'Products baked daily with local ingredients',
    description_es: 'Productos horneados diariamente con ingredientes locales',
    is_active: true,
    display_order: 1,
  },
  {
    id: 'f3',
    icon: 'Heart',
    title: 'Made with Love',
    title_es: 'Hecho con Amor',
    description: 'Traditional recipes since 1973',
    description_es: 'Recetas tradicionales desde 1973',
    is_active: true,
    display_order: 2,
  },
];

// Available icons for selection
export const AVAILABLE_ICONS = [
  'Coffee', 'Leaf', 'Heart', 'Award', 'Star', 'Clock',
  'MapPin', 'Phone', 'Cake', 'Cookie', 'Croissant',
  'UtensilsCrossed', 'Sparkles', 'Sun', 'Moon', 'Gift',
  'Users', 'Music', 'Wifi', 'ParkingCircle', 'Baby',
];

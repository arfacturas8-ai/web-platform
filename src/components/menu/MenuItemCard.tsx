/**
 * Cafe 1973 - Menu Item Card
 * Bisqueria-inspired design with Cafe 1973 brand colors
 * Display-only product card for menu viewing
 */
import React, { useState } from 'react';
import { ShoppingBag, Heart, Sparkles } from 'lucide-react';
import type { MenuItem } from '@/types/menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { getImageUrl } from '@/utils/constants';

interface MenuItemCardProps {
  item: MenuItem;
  index?: number;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, index = 0 }) => {
  const { language } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const name = language === 'es' && item.name_es ? item.name_es : item.name;
  const description = language === 'es' && item.description_es
    ? item.description_es
    : item.description;

  // Format price for Costa Rica (Colones)
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('es-CR')}`;
  };

  // Animation delay based on index
  const animationDelay = `${index * 75}ms`;

  return (
    <article
      className="product-card group animate-fade-in-up"
      style={{ animationDelay }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-sand/20">
        {/* Loading shimmer */}
        {!imageLoaded && item.image_url && (
          <div className="absolute inset-0 bg-gradient-to-r from-sand/20 via-sand/40 to-sand/20 animate-shimmer" />
        )}

        {item.image_url ? (
          <img
            src={getImageUrl(item.image_url || '')}
            alt={name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sand/30 to-sand/10">
            <ShoppingBag size={48} className="text-forest/20" strokeWidth={1} />
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-soft ${
            isFavorite
              ? 'bg-espresso text-cream scale-110'
              : 'bg-cream/95 backdrop-blur-sm text-forest hover:bg-cream hover:scale-105'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>

        {/* Featured Badge */}
        {item.is_featured && (
          <span className="absolute top-3 left-3 px-3 py-1.5 bg-forest text-cream text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-soft">
            <Sparkles size={12} />
            {language === 'es' ? 'Destacado' : 'Featured'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name and Price Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-forest leading-tight line-clamp-2 flex-1 group-hover:text-forest/80 transition-colors">
            {name}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="text-sm text-forest/50 font-medium">CRC</span>
            <span className="text-lg font-bold text-espresso ml-1">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-forest/60 line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.allergens.slice(0, 3).map((allergen) => (
              <span
                key={allergen.id}
                className="text-[10px] px-2.5 py-1 bg-sand/40 text-forest/70 rounded-full font-medium"
              >
                {language === 'es' && allergen.name_es ? allergen.name_es : allergen.name}
              </span>
            ))}
            {item.allergens.length > 3 && (
              <span className="text-[10px] px-2.5 py-1 bg-forest/10 text-forest/60 rounded-full font-medium">
                +{item.allergens.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

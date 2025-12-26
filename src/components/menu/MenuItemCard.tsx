/**
 * Café 1973 - Menu Item Card
 * Display-only product card for menu viewing
 */
import React, { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
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

  const name = language === 'es' && item.name_es ? item.name_es : item.name;
  const description = language === 'es' && item.description_es
    ? item.description_es
    : item.description;

  // Format price for Costa Rica (Colones)
  const formatPrice = (price: number) => {
    return `₡${price.toLocaleString('es-CR')}`;
  };

  // Animation delay based on index
  const animationDelay = `${index * 50}ms`;

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 animate-fade-in"
      style={{ animationDelay }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-sand/20">
        {item.image_url ? (
          <img
            src={getImageUrl(item.image_url || '')}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-sand" />
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite
              ? 'bg-espresso text-white'
              : 'bg-white/90 backdrop-blur-sm text-forest hover:bg-white'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Featured Badge */}
        {item.is_featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-espresso text-white text-xs font-medium rounded-full">
            {language === 'es' ? 'Destacado' : 'Featured'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name and Price Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-forest leading-tight line-clamp-2 flex-1">
            {name}
          </h3>
          <span className="text-base font-bold text-espresso whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-forest/60 line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.allergens.slice(0, 3).map((allergen) => (
              <span
                key={allergen.id}
                className="text-[10px] px-2 py-0.5 bg-sand/30 text-forest/70 rounded-full"
              >
                {language === 'es' && allergen.name_es ? allergen.name_es : allergen.name}
              </span>
            ))}
            {item.allergens.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 bg-sand/30 text-forest/70 rounded-full">
                +{item.allergens.length - 3}
              </span>
            )}
          </div>
        )}

      </div>
    </article>
  );
};

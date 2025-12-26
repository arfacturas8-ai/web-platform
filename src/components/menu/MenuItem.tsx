import React from 'react';
import type { MenuItem as MenuItemType } from '@/types/menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trackMenuItemView } from '@/utils/analytics';
import { SocialShare } from '@/components/SocialShare';
import { getImageUrl } from '@/utils/constants';

interface MenuItemProps {
  item: MenuItemType;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  const name = language === 'es' && item.name_es ? item.name_es : item.name;
  const description =
    language === 'es' && item.description_es
      ? item.description_es
      : item.description;

  // Track item view when card is clicked
  const handleCardClick = () => {
    trackMenuItemView(
      item.id,
      name,
      undefined, // Category name not available in this context
      item.price
    );
  };

  // Create shareable URL for this menu item
  const itemUrl = `${window.location.origin}/menu?item=${item.id}`;

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {item.image_url && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={getImageUrl(item.image_url || '')}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex-1">{name}</CardTitle>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-primary">
              {formatPrice(item.price)}
            </span>
            <SocialShare
              title={`${name} at Café 1973`}
              description={description}
              url={itemUrl}
              imageUrl={item.image_url}
            />
          </div>
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
          {item.allergens && item.allergens.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Allergens:
              </p>
              <div className="flex flex-wrap gap-1">
                {item.allergens.map((allergen) => (
                  <span
                    key={allergen.id}
                    className="text-xs px-2 py-1 bg-muted rounded-full"
                  >
                    {language === 'es' && allergen.name_es
                      ? allergen.name_es
                      : allergen.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {!item.is_available && (
            <div className="mt-3">
              <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full">
                Currently Unavailable
              </span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

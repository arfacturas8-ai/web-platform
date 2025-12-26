import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import type { MenuItem } from '@/types/menu';
import { trackMenuItemView } from '@/utils/analytics';
import { getImageUrl } from '@/utils/constants';

interface MenuItemCardProps {
  item: MenuItem;
  onViewDetails: (item: MenuItem) => void;
}

export const MenuItemCard = ({ item, onViewDetails }: MenuItemCardProps) => {
  const handleViewDetails = () => {
    // Track menu item view
    trackMenuItemView(
      item.id,
      item.name,
      undefined, // Category name not available in this context
      item.price
    );
    onViewDetails(item);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {item.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(item.image_url || '')}
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {item.is_featured && (
            <Badge className="absolute right-2 top-2" variant="success">
              Featured
            </Badge>
          )}
        </div>
      )}
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <span className="text-lg font-bold text-primary">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        )}

        {item.allergens && item.allergens.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {item.allergens.map((allergen) => (
              <Badge key={allergen.id} variant="outline" className="text-xs">
                {allergen.name}
              </Badge>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleViewDetails}
        >
          <Info className="mr-2 h-4 w-4" />
          View Details
        </Button>

        {!item.is_available && (
          <div className="mt-2 text-center text-sm text-destructive">
            Currently unavailable
          </div>
        )}
      </CardContent>
    </Card>
  );
};

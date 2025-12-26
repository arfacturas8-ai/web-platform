import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/types/menu';
import { getImageUrl } from '@/utils/constants';

interface MenuItemDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
}

export const MenuItemDetailDialog = ({
  open,
  onOpenChange,
  item,
}: MenuItemDetailDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {item.image_url && (
            <img
              src={getImageUrl(item.image_url || '')}
              alt={item.name}
              className="h-64 w-full rounded-lg object-cover"
            />
          )}

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-primary">
              ${item.price.toFixed(2)}
            </span>
            {item.is_featured && <Badge variant="success">Featured</Badge>}
          </div>

          {item.description && (
            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          )}

          {item.allergens && item.allergens.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen) => (
                  <Badge key={allergen.id} variant="outline">
                    {allergen.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!item.is_available && (
            <div className="rounded-lg bg-destructive/10 p-3 text-center text-destructive">
              This item is currently unavailable
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

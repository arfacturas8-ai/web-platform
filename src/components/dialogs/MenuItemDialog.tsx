import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { MediaUploader } from '@/components/admin/MediaUploader';
import type { MenuItem, CreateMenuItemDto, Category, Allergen } from '@/types/menu';

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: MenuItem;
  categories: Category[];
  allergens: Allergen[];
  onSave: (data: CreateMenuItemDto) => Promise<void>;
}

export const MenuItemDialog = ({
  open,
  onOpenChange,
  item,
  categories,
  allergens,
  onSave,
}: MenuItemDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateMenuItemDto>();

  const imageUrl = watch('image_url');
  const videoUrl = watch('video_url');
  const isAvailable = watch('is_available');
  const isFeatured = watch('is_featured');

  useEffect(() => {
    if (item) {
      reset({
        category_id: item.category_id,
        name: item.name,
        name_es: item.name_es,
        description: item.description,
        description_es: item.description_es,
        price: item.price,
        image_url: item.image_url,
        video_url: item.video_url,
        is_available: item.is_available,
        is_featured: item.is_featured,
        display_order: item.display_order,
        allergen_ids: item.allergens?.map(a => a.id) || [],
      });
    } else {
      reset({
        category_id: '',
        name: '',
        price: 0,
        is_available: true,
        is_featured: false,
        allergen_ids: [],
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: CreateMenuItemDto) => {
    await onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Create Menu Item'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_id">Category *</Label>
            <Select
              value={watch('category_id')}
              onValueChange={(value) => setValue('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-destructive">{errors.category_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (English) *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_es">Name (Spanish)</Label>
              <Input id="name_es" {...register('name_es')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description (English)</Label>
              <Textarea id="description" {...register('description')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_es">Description (Spanish)</Label>
              <Textarea id="description_es" {...register('description_es')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Price must be positive' },
                })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUploader
                value={imageUrl}
                onChange={(url) => setValue('image_url', url)}
              />
            </div>
            <div className="space-y-2">
              <Label>Video (Optional)</Label>
              <MediaUploader
                value={videoUrl}
                onChange={(url) => setValue('video_url', url)}
                accept="video"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allergens</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
              {allergens?.map((allergen) => (
                <div key={allergen.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergen-${allergen.id}`}
                    checked={watch('allergen_ids')?.includes(allergen.id) || false}
                    onCheckedChange={(checked) => {
                      const current = watch('allergen_ids') || [];
                      if (checked) {
                        setValue('allergen_ids', [...current, allergen.id]);
                      } else {
                        setValue('allergen_ids', current.filter((id) => id !== allergen.id));
                      }
                    }}
                  />
                  <Label htmlFor={`allergen-${allergen.id}`} className="font-normal cursor-pointer">
                    {allergen.icon} {allergen.name_en || allergen.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_available"
                checked={isAvailable}
                onChange={(e: any) => setValue('is_available', e.target.checked)}
              />
              <Label htmlFor="is_available">Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={isFeatured}
                onChange={(e: any) => setValue('is_featured', e.target.checked)}
              />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

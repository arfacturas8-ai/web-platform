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
import { Checkbox } from '@/components/ui/checkbox';
import type { Category, CreateCategoryDto } from '@/types/menu';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSave: (data: CreateCategoryDto) => Promise<void>;
}

export const CategoryDialog = ({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryDto>({
    defaultValues: {
      is_active: true,
    },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        name_es: category.name_es,
        description: category.description,
        description_es: category.description_es,
        display_order: category.display_order,
        is_active: category.is_active,
      });
    } else {
      reset({
        name: '',
        name_es: '',
        description: '',
        description_es: '',
        display_order: 0,
        is_active: true,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CreateCategoryDto) => {
    await onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="is_active"
                checked={isActive}
                onChange={(e: any) => setValue('is_active', e.target.checked)}
              />
              <Label htmlFor="is_active">Active</Label>
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

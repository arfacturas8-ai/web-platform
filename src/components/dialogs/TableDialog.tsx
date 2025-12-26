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
import { Checkbox } from '@/components/ui/checkbox';
import type { Table, CreateTableDto } from '@/types/reservation';

interface TableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: Table;
  onSave: (data: CreateTableDto) => Promise<void>;
}

export const TableDialog = ({ open, onOpenChange, table, onSave }: TableDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTableDto>({
    defaultValues: { is_active: true },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (table) {
      reset({
        table_number: table.table_number,
        capacity: table.capacity,
        location: table.location,
        is_active: table.is_active,
      });
    } else {
      reset({
        table_number: '',
        capacity: 2,
        location: '',
        is_active: true,
      });
    }
  }, [table, reset]);

  const onSubmit = async (data: CreateTableDto) => {
    await onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{table ? 'Edit Table' : 'Create Table'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table_number">Table Number *</Label>
            <Input
              id="table_number"
              {...register('table_number', { required: 'Table number is required' })}
            />
            {errors.table_number && (
              <p className="text-sm text-destructive">{errors.table_number.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              {...register('capacity', {
                required: 'Capacity is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Capacity must be at least 1' },
              })}
            />
            {errors.capacity && (
              <p className="text-sm text-destructive">{errors.capacity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} placeholder="e.g., Main floor, Patio" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={isActive}
              onChange={(e: any) => setValue('is_active', e.target.checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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

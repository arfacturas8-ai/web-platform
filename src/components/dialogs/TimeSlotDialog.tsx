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
import type { TimeSlot, CreateTimeSlotDto } from '@/types/reservation';

interface TimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeSlot?: TimeSlot;
  onSave: (data: CreateTimeSlotDto) => Promise<void>;
}

export const TimeSlotDialog = ({
  open,
  onOpenChange,
  timeSlot,
  onSave,
}: TimeSlotDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTimeSlotDto>({
    defaultValues: { is_active: true, max_reservations: 10 },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (timeSlot) {
      reset({
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        max_reservations: timeSlot.max_reservations,
        is_active: timeSlot.is_active,
      });
    } else {
      reset({
        start_time: '',
        end_time: '',
        max_reservations: 10,
        is_active: true,
      });
    }
  }, [timeSlot, reset]);

  const onSubmit = async (data: CreateTimeSlotDto) => {
    await onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{timeSlot ? 'Edit Time Slot' : 'Create Time Slot'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                {...register('start_time', { required: 'Start time is required' })}
              />
              {errors.start_time && (
                <p className="text-sm text-destructive">{errors.start_time.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                {...register('end_time', { required: 'End time is required' })}
              />
              {errors.end_time && (
                <p className="text-sm text-destructive">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_reservations">Max Reservations *</Label>
            <Input
              id="max_reservations"
              type="number"
              {...register('max_reservations', {
                required: 'Max reservations is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Must be at least 1' },
              })}
            />
            {errors.max_reservations && (
              <p className="text-sm text-destructive">{errors.max_reservations.message}</p>
            )}
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

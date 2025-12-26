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
import { Badge } from '@/components/ui/badge';
import { useTables } from '@/hooks/useTables';
import type { Reservation, UpdateReservationDto, ReservationStatus } from '@/types/reservation';
import { ReservationStatus as Status } from '@/types/reservation';

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
  onSave: (data: UpdateReservationDto) => Promise<void>;
}

export const ReservationDialog = ({
  open,
  onOpenChange,
  reservation,
  onSave,
}: ReservationDialogProps) => {
  const { data: tables } = useTables();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<UpdateReservationDto>();

  const status = watch('status');
  const tableId = watch('table_id');

  useEffect(() => {
    reset({
      table_id: reservation.table_id || '',
      status: reservation.status,
      special_requests: reservation.special_requests,
    });
  }, [reservation, reset]);

  const onSubmit = async (data: UpdateReservationDto) => {
    await onSave(data);
    onOpenChange(false);
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const variants: Record<ReservationStatus, any> = {
      [Status.PENDING]: 'warning',
      [Status.CONFIRMED]: 'success',
      [Status.CANCELLED]: 'destructive',
      [Status.COMPLETED]: 'secondary',
      [Status.NO_SHOW]: 'outline',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
        </DialogHeader>

        <div className="mb-4 space-y-2 rounded-lg bg-muted p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Customer:</span>{' '}
              {reservation.customer?.first_name} {reservation.customer?.last_name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {reservation.customer?.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {reservation.customer?.phone}
            </div>
            <div>
              <span className="font-medium">Party Size:</span> {reservation.party_size}
            </div>
            <div>
              <span className="font-medium">Date:</span>{' '}
              {new Date(reservation.reservation_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Time:</span> {reservation.time_slot?.start_time}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setValue('status', value as ReservationStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Status.PENDING}>Pending</SelectItem>
                <SelectItem value={Status.CONFIRMED}>Confirmed</SelectItem>
                <SelectItem value={Status.CANCELLED}>Cancelled</SelectItem>
                <SelectItem value={Status.COMPLETED}>Completed</SelectItem>
                <SelectItem value={Status.NO_SHOW}>No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="table_id">Assign Table</Label>
            <Select value={tableId || ''} onValueChange={(value) => setValue('table_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No table assigned</SelectItem>
                {tables?.filter(t => t.is_active).map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    Table {table.table_number} (Capacity: {table.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requests">Special Requests</Label>
            <Textarea id="special_requests" {...register('special_requests')} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

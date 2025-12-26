import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Clock } from 'lucide-react';
import type { AvailableSlot } from '@/types/reservation';

interface TimeSlotPickerProps {
  slots: AvailableSlot[];
  selectedSlot: string | null;
  onSelect: (slotId: string) => void;
  loading?: boolean;
}

export const TimeSlotPicker = ({
  slots,
  selectedSlot,
  onSelect,
  loading = false,
}: TimeSlotPickerProps) => {
  if (loading) {
    return <LoadingSpinner text="Loading available times..." />;
  }

  if (slots.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No available times"
        description="Please select a different date"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {slots.map((slot) => (
        <Button
          key={slot.time_slot_id}
          variant={selectedSlot === slot.time_slot_id ? 'default' : 'outline'}
          className="h-auto flex-col py-3"
          onClick={() => onSelect(slot.time_slot_id)}
          disabled={slot.available_tables === 0}
        >
          <div className="text-base font-semibold">{slot.start_time}</div>
          <div className="text-xs text-muted-foreground">
            {slot.available_tables > 0
              ? `${slot.available_tables} table${slot.available_tables > 1 ? 's' : ''}`
              : 'Fully booked'}
          </div>
        </Button>
      ))}
    </div>
  );
};

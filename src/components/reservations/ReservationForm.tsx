import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateReservation, useAvailability } from '@/hooks/useReservations';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import {
  trackReservationFormStart,
  trackReservationComplete,
} from '@/utils/analytics';

const reservationSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  reservation_date: z.string().min(1, 'Date is required'),
  time_slot_id: z.string().min(1, 'Time slot is required'),
  party_size: z.number().min(1).max(20),
  special_requests: z.string().optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

export const ReservationForm: React.FC = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [partySize, setPartySize] = useState<number>(2);
  const formStartTracked = useRef(false);

  // Time slots loaded for form
  const { data: availableSlots, isLoading: isCheckingAvailability } = useAvailability({
    date: selectedDate,
    party_size: partySize,
  });

  const createReservation = useCreateReservation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      party_size: 2,
    },
  });

  const watchedDate = watch('reservation_date');
  const watchedPartySize = watch('party_size');

  React.useEffect(() => {
    if (watchedDate) {
      setSelectedDate(watchedDate);
    }
  }, [watchedDate]);

  React.useEffect(() => {
    if (watchedPartySize) {
      setPartySize(Number(watchedPartySize));
    }
  }, [watchedPartySize]);

  // Track form start on first interaction
  const handleFormInteraction = () => {
    if (!formStartTracked.current) {
      trackReservationFormStart();
      formStartTracked.current = true;
    }
  };

  const onSubmit = async (data: ReservationFormData) => {
    try {
      await createReservation.mutateAsync(data);

      // Find the time slot for tracking
      const timeSlot = availableSlots?.find(
        (slot) => slot.time_slot_id === data.time_slot_id
      );

      // Track successful reservation
      trackReservationComplete({
        date: data.reservation_date,
        partySize: data.party_size,
        timeSlot: timeSlot
          ? `${timeSlot.start_time} - ${timeSlot.end_time}`
          : 'Unknown',
      });

      addToast({
        title: t('success'),
        description: t('reservationConfirmed'),
      });
      reset();
      formStartTracked.current = false; // Reset for next use
    } catch (error) {
      addToast({
        title: t('error'),
        description: 'Failed to create reservation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('makeReservation')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">{t('firstName')}</Label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="John"
                onFocus={handleFormInteraction}
              />
              {errors.first_name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">{t('lastName')}</Label>
              <Input
                id="last_name"
                {...register('last_name')}
                placeholder="Doe"
              />
              {errors.last_name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reservation_date">{t('date')}</Label>
              <Input
                id="reservation_date"
                type="date"
                min={minDate}
                {...register('reservation_date')}
              />
              {errors.reservation_date && (
                <p className="text-sm text-destructive mt-1">
                  {errors.reservation_date.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="party_size">{t('partySize')}</Label>
              <Select
                id="party_size"
                {...register('party_size', { valueAsNumber: true })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </Select>
              {errors.party_size && (
                <p className="text-sm text-destructive mt-1">
                  {errors.party_size.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="time_slot_id">{t('time')}</Label>
            {isCheckingAvailability ? (
              <div className="flex items-center justify-center py-4">
                <Spinner />
              </div>
            ) : availableSlots && availableSlots.length > 0 ? (
              <Select id="time_slot_id" {...register('time_slot_id')}>
                <option value="">Select a time</option>
                {availableSlots.map((slot) => (
                  <option key={slot.time_slot_id} value={slot.time_slot_id}>
                    {slot.start_time} - {slot.end_time} ({slot.available_tables}{' '}
                    available)
                  </option>
                ))}
              </Select>
            ) : selectedDate ? (
              <p className="text-sm text-muted-foreground py-2">
                No available time slots for this date and party size.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                Please select a date and party size to see available times.
              </p>
            )}
            {errors.time_slot_id && (
              <p className="text-sm text-destructive mt-1">
                {errors.time_slot_id.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="special_requests">{t('specialRequests')}</Label>
            <Textarea
              id="special_requests"
              {...register('special_requests')}
              placeholder="Any special requests or dietary requirements..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createReservation.isPending}
          >
            {createReservation.isPending ? <Spinner size="sm" /> : t('confirm')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

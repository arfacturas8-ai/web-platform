import React, { useState } from 'react';
import { useReservations, useUpdateReservation } from '@/hooks/useReservations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { ReservationStatus } from '@/types/reservation';
import { format } from 'date-fns';

export const ReservationDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const { data: reservations, isLoading } = useReservations({
    date: selectedDate,
  });
  const updateReservation = useUpdateReservation();

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    try {
      await updateReservation.mutateAsync({ id, data: { status } });
      addToast({
        title: t('success'),
        description: 'Reservation status updated',
      });
    } catch (error) {
      addToast({
        title: t('error'),
        description: 'Failed to update reservation',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t('reservations')}</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('phone')}</TableHead>
              <TableHead>{t('time')}</TableHead>
              <TableHead>{t('partySize')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations?.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">
                  {reservation.customer
                    ? `${reservation.customer.first_name} ${reservation.customer.last_name}`
                    : 'N/A'}
                </TableCell>
                <TableCell>{reservation.customer?.email}</TableCell>
                <TableCell>{reservation.customer?.phone}</TableCell>
                <TableCell>
                  {reservation.time_slot
                    ? `${reservation.time_slot.start_time} - ${reservation.time_slot.end_time}`
                    : 'N/A'}
                </TableCell>
                <TableCell>{reservation.party_size}</TableCell>
                <TableCell>
                  <Select
                    value={reservation.status}
                    onChange={(e) =>
                      handleStatusChange(
                        reservation.id,
                        e.target.value as ReservationStatus
                      )
                    }
                    className="h-8"
                  >
                    <option value={ReservationStatus.PENDING}>
                      {t('pending')}
                    </option>
                    <option value={ReservationStatus.CONFIRMED}>
                      {t('confirmed')}
                    </option>
                    <option value={ReservationStatus.CANCELLED}>
                      {t('cancelled')}
                    </option>
                    <option value={ReservationStatus.COMPLETED}>
                      {t('completed')}
                    </option>
                    <option value={ReservationStatus.NO_SHOW}>
                      {t('noShow')}
                    </option>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '@/services/reservationService';
import { QUERY_KEYS } from '@/utils/constants';
import type {
  CreateReservationDto,
  UpdateReservationDto,
  AvailabilityQuery,
} from '@/types/reservation';

// Reservations
export const useReservations = (params?: { date?: string; status?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESERVATIONS, params],
    queryFn: () => reservationService.getReservations(params),
  });
};

export const useReservation = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESERVATION, id],
    queryFn: () => reservationService.getReservation(id),
    enabled: !!id,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationDto) =>
      reservationService.createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS] });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReservationDto }) =>
      reservationService.updateReservation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS] });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationService.cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS] });
    },
  });
};

// Tables
export const useTables = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TABLES],
    queryFn: reservationService.getTables,
  });
};

// Time Slots
export const useTimeSlots = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIME_SLOTS],
    queryFn: reservationService.getTimeSlots,
  });
};

// Availability
export const useAvailability = (query: AvailabilityQuery) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AVAILABILITY, query],
    queryFn: () => reservationService.checkAvailability(query),
    enabled: !!query.date && !!query.party_size,
  });
};

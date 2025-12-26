import api from './api';
import type {
  Reservation,
  CreateReservationDto,
  UpdateReservationDto,
  Table,
  TimeSlot,
  AvailabilityQuery,
  AvailableSlot,
} from '@/types/reservation';

export const reservationService = {
  // Reservations
  async getReservations(params?: {
    date?: string;
    status?: string;
  }): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>('/reservations/', { params });
    return response.data;
  },

  async getReservation(id: string): Promise<Reservation> {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },

  async createReservation(data: CreateReservationDto): Promise<Reservation> {
    const response = await api.post<Reservation>('/reservations/', data);
    return response.data;
  },

  async updateReservation(
    id: string,
    data: UpdateReservationDto
  ): Promise<Reservation> {
    const response = await api.put<Reservation>(`/reservations/${id}`, data);
    return response.data;
  },

  async cancelReservation(id: string): Promise<Reservation> {
    const response = await api.put<Reservation>(`/reservations/${id}/cancel`);
    return response.data;
  },

  // Tables
  async getTables(): Promise<Table[]> {
    const response = await api.get<Table[]>('/reservations/tables');
    return response.data;
  },

  async createTable(data: Partial<Table>): Promise<Table> {
    const response = await api.post<Table>('/reservations/tables', data);
    return response.data;
  },

  async updateTable(id: string, data: Partial<Table>): Promise<Table> {
    const response = await api.put<Table>(`/reservations/tables/${id}`, data);
    return response.data;
  },

  async deleteTable(id: string): Promise<void> {
    await api.delete(`/reservations/tables/${id}`);
  },

  // Time Slots
  async getTimeSlots(): Promise<TimeSlot[]> {
    const response = await api.get<TimeSlot[]>('/reservations/time-slots');
    return response.data;
  },

  async createTimeSlot(data: Partial<TimeSlot>): Promise<TimeSlot> {
    const response = await api.post<TimeSlot>('/reservations/time-slots', data);
    return response.data;
  },

  async updateTimeSlot(id: string, data: Partial<TimeSlot>): Promise<TimeSlot> {
    const response = await api.put<TimeSlot>(`/reservations/time-slots/${id}`, data);
    return response.data;
  },

  async deleteTimeSlot(id: string): Promise<void> {
    await api.delete(`/reservations/time-slots/${id}`);
  },

  // Availability
  async checkAvailability(query: AvailabilityQuery): Promise<AvailableSlot[]> {
    const response = await api.get<AvailableSlot[]>('/reservations/availability', {
      params: query,
    });
    return response.data;
  },
};

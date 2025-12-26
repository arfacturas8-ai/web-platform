import api from './api';
import type { TimeSlot, CreateTimeSlotDto, UpdateTimeSlotDto } from '@/types/reservation';

export const timeSlotService = {
  getAll: async (): Promise<TimeSlot[]> => {
    const response = await api.get('/reservations/time-slots');
    return response.data;
  },

  getById: async (id: string): Promise<TimeSlot> => {
    const response = await api.get(`/reservations/time-slots/${id}`);
    return response.data;
  },

  create: async (data: CreateTimeSlotDto): Promise<TimeSlot> => {
    const response = await api.post('/reservations/time-slots', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTimeSlotDto): Promise<TimeSlot> => {
    const response = await api.put(`/reservations/time-slots/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reservations/time-slots/${id}`);
  },
};

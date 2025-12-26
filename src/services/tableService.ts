import api from './api';
import type { Table, CreateTableDto, UpdateTableDto } from '@/types/reservation';

export const tableService = {
  getAll: async (): Promise<Table[]> => {
    const response = await api.get('/reservations/tables');
    return response.data;
  },

  getById: async (id: string): Promise<Table> => {
    const response = await api.get(`/reservations/tables/${id}`);
    return response.data;
  },

  create: async (data: CreateTableDto): Promise<Table> => {
    const response = await api.post('/reservations/tables', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTableDto): Promise<Table> => {
    const response = await api.put(`/reservations/tables/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reservations/tables/${id}`);
  },
};

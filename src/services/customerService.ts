import api from './api';
import type {
  Customer,
  CustomerWithNotes,
  CreateCustomerDto,
  UpdateCustomerDto,
  Reservation
} from '@/types/reservation';

export const customerService = {
  getAll: async (search?: string): Promise<CustomerWithNotes[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/reservations/customers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<CustomerWithNotes> => {
    const response = await api.get(`/reservations/customers/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomerDto): Promise<Customer> => {
    const response = await api.post('/reservations/customers', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCustomerDto): Promise<Customer> => {
    const response = await api.put(`/reservations/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reservations/customers/${id}`);
  },

  getReservations: async (id: string): Promise<Reservation[]> => {
    const response = await api.get(`/reservations/customers/${id}/reservations`);
    return response.data;
  },

  search: async (query: string): Promise<Customer[]> => {
    const response = await api.get('/reservations/customers/search', { params: { q: query } });
    return response.data;
  },
};

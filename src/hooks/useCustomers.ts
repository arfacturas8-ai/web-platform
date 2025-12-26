import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import { QUERY_KEYS } from '@/utils/constants';
import type {
  Customer,
  CustomerWithNotes,
  CreateCustomerDto,
  UpdateCustomerDto,
  Reservation
} from '@/types/reservation';

export const useCustomers = (search?: string) => {
  return useQuery<CustomerWithNotes[]>({
    queryKey: [QUERY_KEYS.CUSTOMERS, search],
    queryFn: () => customerService.getAll(search),
  });
};

export const useCustomer = (id: string) => {
  return useQuery<CustomerWithNotes>({
    queryKey: [QUERY_KEYS.CUSTOMERS, id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
};

export const useCustomerReservations = (id: string) => {
  return useQuery<Reservation[]>({
    queryKey: [QUERY_KEYS.CUSTOMERS, id, 'reservations'],
    queryFn: () => customerService.getReservations(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) =>
      customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
    },
  });
};

export const useCustomerSearch = (query: string) => {
  return useQuery<Customer[]>({
    queryKey: [QUERY_KEYS.CUSTOMERS, 'search', query],
    queryFn: () => customerService.search(query),
    enabled: query.length > 2,
  });
};

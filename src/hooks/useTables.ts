import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tableService } from '@/services/tableService';
import { QUERY_KEYS } from '@/utils/constants';
import type { Table, CreateTableDto, UpdateTableDto } from '@/types/reservation';

export const useTables = () => {
  return useQuery<Table[]>({
    queryKey: [QUERY_KEYS.TABLES],
    queryFn: tableService.getAll,
  });
};

export const useTable = (id: string) => {
  return useQuery<Table>({
    queryKey: [QUERY_KEYS.TABLES, id],
    queryFn: () => tableService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTableDto) => tableService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableDto }) =>
      tableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tableService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
    },
  });
};

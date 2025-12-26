import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  WaitlistEntryType,
  WaitlistStatus,
  WaitlistSummary,
  WaitTimeEstimate,
  WaitlistPosition,
  WaitlistAnalytics,
  TurnoverData,
  AddToWaitlistRequest,
  UpdateWaitlistRequest,
  SeatPartyRequest,
  NotifyCustomerRequest,
  TableStatus,
  UpdateTableStatusRequest,
} from '@/types/waitlist';
import { Table } from '@/types/reservation';
import api from '@/services/api';

// API functions
const waitlistAPI = {
  // Waitlist entries
  getEntries: async (status?: WaitlistStatus): Promise<WaitlistEntryType[]> => {
    const params = status ? { status } : {};
    const { data } = await api.get('/waitlist/entries', { params });
    return data;
  },

  getEntry: async (id: string): Promise<WaitlistEntryType> => {
    const { data } = await api.get(`/waitlist/entries/${id}`);
    return data;
  },

  addEntry: async (request: AddToWaitlistRequest): Promise<WaitlistEntryType> => {
    const { data } = await api.post('/waitlist/entries', request);
    return data;
  },

  updateEntry: async (id: string, request: UpdateWaitlistRequest): Promise<WaitlistEntryType> => {
    const { data } = await api.put(`/waitlist/entries/${id}`, request);
    return data;
  },

  cancelEntry: async (id: string): Promise<void> => {
    await api.delete(`/waitlist/entries/${id}`);
  },

  // Public endpoints
  joinWaitlist: async (request: AddToWaitlistRequest): Promise<WaitlistEntryType> => {
    const { data } = await api.post('/waitlist/public/join', request);
    return data;
  },

  getPosition: async (id: string): Promise<WaitlistPosition> => {
    const { data } = await api.get(`/waitlist/public/position/${id}`);
    return data;
  },

  getEstimate: async (partySize: number, branchId?: string, preferredSeating?: string): Promise<WaitTimeEstimate> => {
    const { data } = await api.get('/waitlist/public/estimate', {
      params: { party_size: partySize, branch_id: branchId, preferred_seating: preferredSeating }
    });
    return data;
  },

  cancelPublic: async (id: string): Promise<void> => {
    await api.delete(`/waitlist/public/cancel/${id}`);
  },

  // Actions
  seatParty: async (request: SeatPartyRequest): Promise<WaitlistEntryType> => {
    const { data } = await api.post('/waitlist/entries/seat', request);
    return data;
  },

  notifyCustomer: async (request: NotifyCustomerRequest): Promise<any> => {
    const { data } = await api.post('/waitlist/entries/notify', request);
    return data;
  },

  // Summary and analytics
  getSummary: async (branchId?: string): Promise<WaitlistSummary> => {
    const { data } = await api.get('/waitlist/summary', {
      params: branchId ? { branch_id: branchId } : {}
    });
    return data;
  },

  getAnalytics: async (startDate?: Date, endDate?: Date, branchId?: string): Promise<WaitlistAnalytics[]> => {
    const { data } = await api.get('/waitlist/analytics', {
      params: {
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
        branch_id: branchId
      }
    });
    return data;
  },

  getTurnover: async (startDate?: Date, endDate?: Date, branchId?: string): Promise<TurnoverData> => {
    const { data } = await api.get('/waitlist/analytics/turnover', {
      params: {
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
        branch_id: branchId
      }
    });
    return data;
  },

  // Display endpoints
  getDisplayCurrent: async (branchId?: string): Promise<WaitlistEntryType[]> => {
    const { data } = await api.get('/waitlist/display/current', {
      params: branchId ? { branch_id: branchId } : {}
    });
    return data;
  },

  getDisplayNotified: async (branchId?: string): Promise<WaitlistEntryType[]> => {
    const { data } = await api.get('/waitlist/display/notified', {
      params: branchId ? { branch_id: branchId } : {}
    });
    return data;
  },

  // Table status
  getTableStatuses: async (branchId?: string): Promise<TableStatus[]> => {
    const { data } = await api.get('/waitlist/tables/status', {
      params: branchId ? { branch_id: branchId } : {}
    });
    return data;
  },

  updateTableStatus: async (tableId: string, request: UpdateTableStatusRequest): Promise<TableStatus> => {
    const { data } = await api.put(`/waitlist/tables/status/${tableId}`, request);
    return data;
  },

  markTableAvailable: async (tableId: string): Promise<TableStatus> => {
    const { data } = await api.post(`/waitlist/tables/status/${tableId}/available`);
    return data;
  },

  // Tables
  getTables: async (): Promise<Table[]> => {
    const { data } = await api.get('/reservations/tables');
    return data;
  },
};

// Hooks
export const useWaitlist = (status?: WaitlistStatus) => {
  return useQuery({
    queryKey: ['waitlist', 'entries', status],
    queryFn: () => waitlistAPI.getEntries(status),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useWaitlistEntry = (id: string) => {
  return useQuery({
    queryKey: ['waitlist', 'entry', id],
    queryFn: () => waitlistAPI.getEntry(id),
    enabled: !!id,
  });
};

export const useWaitlistSummary = (branchId?: string) => {
  return useQuery({
    queryKey: ['waitlist', 'summary', branchId],
    queryFn: () => waitlistAPI.getSummary(branchId),
    refetchInterval: 30000,
  });
};

export const useWaitlistEstimate = (partySize: number, preferredSeating?: string, branchId?: string) => {
  return useQuery({
    queryKey: ['waitlist', 'estimate', partySize, preferredSeating, branchId],
    queryFn: () => waitlistAPI.getEstimate(partySize, branchId, preferredSeating),
    enabled: partySize > 0,
  });
};

export const useWaitlistPosition = (id: string) => {
  return useQuery({
    queryKey: ['waitlist', 'position', id],
    queryFn: () => waitlistAPI.getPosition(id),
    enabled: !!id,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

export const useWaitlistDisplay = (type: 'waiting' | 'notified') => {
  return useQuery({
    queryKey: ['waitlist', 'display', type],
    queryFn: () => type === 'waiting' ? waitlistAPI.getDisplayCurrent() : waitlistAPI.getDisplayNotified(),
    refetchInterval: 15000,
  });
};

export const useWaitlistAnalytics = (startDate?: Date, endDate?: Date, branchId?: string) => {
  return useQuery({
    queryKey: ['waitlist', 'analytics', startDate, endDate, branchId],
    queryFn: () => waitlistAPI.getAnalytics(startDate, endDate, branchId),
    enabled: !!(startDate && endDate),
  });
};

export const useWaitlistTurnover = (startDate?: Date, endDate?: Date, branchId?: string) => {
  return useQuery({
    queryKey: ['waitlist', 'turnover', startDate, endDate, branchId],
    queryFn: () => waitlistAPI.getTurnover(startDate, endDate, branchId),
  });
};

export const useTableStatuses = (branchId?: string) => {
  return useQuery({
    queryKey: ['waitlist', 'table-statuses', branchId],
    queryFn: () => waitlistAPI.getTableStatuses(branchId),
    refetchInterval: 30000,
  });
};

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => waitlistAPI.getTables(),
  });
};

// Mutations
export const useAddToWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: waitlistAPI.addEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

export const useJoinWaitlist = () => {
  return useMutation({
    mutationFn: waitlistAPI.joinWaitlist,
  });
};

export const useUpdateWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWaitlistRequest }) =>
      waitlistAPI.updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

export const useCancelWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: waitlistAPI.cancelEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

export const useSeatParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: waitlistAPI.seatParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      queryClient.invalidateQueries({ queryKey: ['table-statuses'] });
    },
  });
};

export const useNotifyCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: waitlistAPI.notifyCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

export const useUpdateTableStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableId, data }: { tableId: string; data: UpdateTableStatusRequest }) =>
      waitlistAPI.updateTableStatus(tableId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-statuses'] });
    },
  });
};

export const useMarkTableAvailable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: waitlistAPI.markTableAvailable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-statuses'] });
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
};

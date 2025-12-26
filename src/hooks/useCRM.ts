import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';

// Types
export interface CustomerTag {
  id: string;
  name: string;
  color: string | null;
  category: string | null;
  created_at: string;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  user_id: string | null;
  note_text: string;
  is_important: boolean;
  created_at: string;
}

export interface CustomerInteraction {
  id: string;
  customer_id: string;
  interaction_type: string;
  channel: string | null;
  details: string | null;
  created_by: string | null;
  created_at: string;
}

export interface CustomerMetrics {
  lifetime_value: number;
  total_visits: number;
  average_spend: number;
  total_reservations: number;
  total_no_shows: number;
}

export interface CustomerJourneyEvent {
  type: string;
  timestamp: string;
  description: string;
  details: any;
}

export interface SegmentStatistics {
  high_value: number;
  at_risk: number;
  new: number;
  inactive: number;
  loyal: number;
  active: number;
}

// Get customers with filters
export const useCustomers = (
  segment?: string,
  tagId?: string,
  search?: string,
  skip: number = 0,
  limit: number = 50
) => {
  return useQuery({
    queryKey: ['crm', 'customers', segment, tagId, search, skip, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (segment) params.append('segment', segment);
      if (tagId) params.append('tag_id', tagId);
      if (search) params.append('search', search);
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/crm/customers?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    }
  });
};

// Get customer profile (360 view)
export const useCustomerProfile = (customerId: string) => {
  return useQuery({
    queryKey: ['crm', 'customer-profile', customerId],
    queryFn: async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    enabled: !!customerId
  });
};

// Get customer notes
export const useCustomerNotes = (customerId: string) => {
  return useQuery<CustomerNote[]>({
    queryKey: ['crm', 'customer-notes', customerId],
    queryFn: async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/notes`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    enabled: !!customerId
  });
};

// Add customer note
export const useAddCustomerNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      noteText,
      isImportant = false
    }: {
      customerId: string;
      noteText: string;
      isImportant?: boolean;
    }) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/notes`,
        {
          note_text: noteText,
          is_important: isImportant
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer-notes', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer-profile', variables.customerId] });
    }
  });
};

// Get customer interactions
export const useCustomerInteractions = (customerId: string) => {
  return useQuery<CustomerInteraction[]>({
    queryKey: ['crm', 'customer-interactions', customerId],
    queryFn: async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/interactions`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    enabled: !!customerId
  });
};

// Add customer interaction
export const useAddCustomerInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      interactionType,
      channel,
      details
    }: {
      customerId: string;
      interactionType: string;
      channel?: string;
      details?: string;
    }) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/interactions`,
        {
          interaction_type: interactionType,
          channel,
          details
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer-interactions', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer-journey', variables.customerId] });
    }
  });
};

// Get customer journey
export const useCustomerJourney = (customerId: string) => {
  return useQuery<CustomerJourneyEvent[]>({
    queryKey: ['crm', 'customer-journey', customerId],
    queryFn: async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/journey`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    enabled: !!customerId
  });
};

// Get all tags
export const useCustomerTags = () => {
  return useQuery<CustomerTag[]>({
    queryKey: ['crm', 'tags'],
    queryFn: async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/crm/tags`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    }
  });
};

// Create tag
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      color,
      category
    }: {
      name: string;
      color?: string;
      category?: string;
    }) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/crm/tags`,
        { name, color, category },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'tags'] });
    }
  });
};

// Add tag to customer
export const useTagCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      tagId
    }: {
      customerId: string;
      tagId: string;
    }) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/tags`,
        { tag_id: tagId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer-profile', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customers'] });
    }
  });
};

// Remove tag from customer
export const useUntagCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      tagId
    }: {
      customerId: string;
      tagId: string;
    }) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/tags/${tagId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer-profile', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customers'] });
    }
  });
};

// Get segments
export const useSegments = () => {
  return useQuery<SegmentStatistics>({
    queryKey: ['crm', 'segments'],
    queryFn: async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/crm/segments`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    }
  });
};

// Get at-risk customers
export const useAtRiskCustomers = () => {
  return useQuery({
    queryKey: ['crm', 'at-risk'],
    queryFn: async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/crm/at-risk`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    }
  });
};

// Calculate lifetime value
export const useCalculateLifetimeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/calculate-ltv`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: (_, customerId) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer-profile', customerId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customers'] });
    }
  });
};

// Update customer segment
export const useUpdateCustomerSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      segment
    }: {
      customerId: string;
      segment: string;
    }) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/crm/customers/${customerId}/segment`,
        { segment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer-profile', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'segments'] });
    }
  });
};

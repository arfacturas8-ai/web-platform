import api from './api';

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  is_active: boolean;
  timezone: string;
  opening_hours?: Record<string, any>;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BranchCreate {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager_id?: string;
  is_active?: boolean;
  timezone?: string;
  opening_hours?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface BranchUpdate extends Partial<BranchCreate> {}

export interface BranchStaff {
  id: string;
  branch_id: string;
  user_id: string;
  role?: string;
  assigned_date: string;
  created_at: string;
  updated_at: string;
}

export interface BranchStaffCreate {
  branch_id: string;
  user_id: string;
  role?: string;
}

export interface BranchInventory {
  id: string;
  branch_id: string;
  product_id: string;
  stock_level: number;
  reorder_point: number;
  last_restocked?: string;
  created_at: string;
  updated_at: string;
}

export interface BranchInventoryUpdate {
  stock_level?: number;
  reorder_point?: number;
  last_restocked?: string;
}

export interface InventoryTransfer {
  from_branch_id: string;
  to_branch_id: string;
  product_id: string;
  quantity: number;
}

export interface BranchPerformance {
  id: string;
  branch_id: string;
  date: string;
  revenue: number;
  orders_count: number;
  customers_count: number;
  avg_order_value: number;
  created_at: string;
  updated_at: string;
}

export interface BranchComparison {
  branch_id: string;
  branch_name: string;
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  avg_order_value: number;
  performance_trend: 'up' | 'down' | 'stable';
}

export interface BranchComparisonResponse {
  branches: BranchComparison[];
  date_range: string;
  best_performing?: string;
  total_system_revenue: number;
}

export interface MenuSyncRequest {
  menu_item_ids: string[];
  target_branch_ids: string[];
  overwrite?: boolean;
}

export const branchService = {
  // Branch Management
  async getBranches(isActive?: boolean): Promise<Branch[]> {
    const params = new URLSearchParams();
    if (isActive !== undefined) {
      params.append('is_active', String(isActive));
    }
    const response = await api.get<Branch[]>(`/branches?${params.toString()}`);
    return response.data;
  },

  async getBranch(branchId: string): Promise<Branch> {
    const response = await api.get<Branch>(`/branches/${branchId}`);
    return response.data;
  },

  async createBranch(data: BranchCreate): Promise<Branch> {
    const response = await api.post<Branch>('/branches', data);
    return response.data;
  },

  async updateBranch(branchId: string, data: BranchUpdate): Promise<Branch> {
    const response = await api.put<Branch>(`/branches/${branchId}`, data);
    return response.data;
  },

  async deleteBranch(branchId: string): Promise<void> {
    await api.delete(`/branches/${branchId}`);
  },

  // Branch Staff
  async getBranchStaff(branchId: string): Promise<BranchStaff[]> {
    const response = await api.get<BranchStaff[]>(`/branches/${branchId}/staff`);
    return response.data;
  },

  async assignStaffToBranch(branchId: string, data: BranchStaffCreate): Promise<BranchStaff> {
    const response = await api.post<BranchStaff>(`/branches/${branchId}/staff`, data);
    return response.data;
  },

  async removeStaffFromBranch(assignmentId: string): Promise<void> {
    await api.delete(`/branches/staff/${assignmentId}`);
  },

  // Branch Inventory
  async getBranchInventory(branchId: string, lowStockOnly?: boolean): Promise<BranchInventory[]> {
    const params = new URLSearchParams();
    if (lowStockOnly) {
      params.append('low_stock_only', 'true');
    }
    const response = await api.get<BranchInventory[]>(`/branches/${branchId}/inventory?${params.toString()}`);
    return response.data;
  },

  async updateBranchInventory(
    branchId: string,
    productId: string,
    data: BranchInventoryUpdate
  ): Promise<BranchInventory> {
    const response = await api.put<BranchInventory>(`/branches/${branchId}/inventory/${productId}`, data);
    return response.data;
  },

  async transferInventory(data: InventoryTransfer): Promise<any> {
    const response = await api.post('/branches/transfer', data);
    return response.data;
  },

  // Branch Performance
  async getBranchPerformance(
    branchId: string,
    startDate?: string,
    endDate?: string
  ): Promise<BranchPerformance[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const response = await api.get<BranchPerformance[]>(
      `/branches/${branchId}/performance?${params.toString()}`
    );
    return response.data;
  },

  async compareBranches(
    branchIds?: string[],
    startDate?: string,
    endDate?: string
  ): Promise<BranchComparisonResponse> {
    const params = new URLSearchParams();
    if (branchIds && branchIds.length > 0) {
      branchIds.forEach(id => params.append('branch_ids', id));
    }
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const response = await api.get<BranchComparisonResponse>(`/branches/compare?${params.toString()}`);
    return response.data;
  },

  // Menu Sync
  async syncMenuToBranches(data: MenuSyncRequest): Promise<any> {
    const response = await api.post('/branches/sync-menu', data);
    return response.data;
  },
};

export default branchService;

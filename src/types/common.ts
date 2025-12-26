export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface BulkActionPayload {
  ids: string[];
  action: string;
  value?: any;
}

export type ViewMode = 'grid' | 'list';
export type SortOrder = 'asc' | 'desc';

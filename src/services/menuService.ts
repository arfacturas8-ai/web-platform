import api from './api';
import type {
  Category,
  MenuItem,
  Allergen,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from '@/types/menu';

export const menuService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/menu/categories');
    return response.data;
  },

  async getCategory(id: string): Promise<Category> {
    const response = await api.get<Category>(`/menu/categories/${id}`);
    return response.data;
  },

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const response = await api.post<Category>('/menu/categories', data);
    return response.data;
  },

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await api.put<Category>(`/menu/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/menu/categories/${id}`);
  },

  // Menu Items
  async getMenuItems(categoryId?: string): Promise<MenuItem[]> {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get<MenuItem[]>('/menu/items', { params });
    return response.data;
  },

  async getMenuItem(id: string): Promise<MenuItem> {
    const response = await api.get<MenuItem>(`/menu/items/${id}`);
    return response.data;
  },

  async createMenuItem(data: CreateMenuItemDto): Promise<MenuItem> {
    const response = await api.post<MenuItem>('/menu/items', data);
    return response.data;
  },

  async updateMenuItem(id: string, data: UpdateMenuItemDto): Promise<MenuItem> {
    const response = await api.put<MenuItem>(`/menu/items/${id}`, data);
    return response.data;
  },

  async deleteMenuItem(id: string): Promise<void> {
    await api.delete(`/menu/items/${id}`);
  },

  // Allergens
  async getAllergens(): Promise<Allergen[]> {
    const response = await api.get<Allergen[]>('/menu/allergens');
    return response.data;
  },
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menuService';
import { QUERY_KEYS } from '@/utils/constants';
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from '@/types/menu';

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: menuService.getCategories,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, id],
    queryFn: () => menuService.getCategory(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => menuService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      menuService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
};

// Menu Items
export const useMenuItems = (categoryId?: string) => {
  return useQuery({
    queryKey: categoryId
      ? [QUERY_KEYS.MENU_ITEMS, categoryId]
      : [QUERY_KEYS.MENU_ITEMS],
    queryFn: () => menuService.getMenuItems(categoryId),
  });
};

export const useMenuItem = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MENU_ITEM, id],
    queryFn: () => menuService.getMenuItem(id),
    enabled: !!id,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMenuItemDto) => menuService.createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU_ITEMS] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemDto }) =>
      menuService.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU_ITEMS] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuService.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU_ITEMS] });
    },
  });
};

// Allergens
// Composite hook for menu management page
export const useMenu = () => {
  const { data: categories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
  const { data: menuItems, isLoading: itemsLoading, error: itemsError, refetch: refetchItems } = useMenuItems();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const createMenuItemMutation = useCreateMenuItem();
  const updateMenuItemMutation = useUpdateMenuItem();
  const deleteMenuItemMutation = useDeleteMenuItem();

  return {
    categories: { data: categories, isLoading: categoriesLoading, error: categoriesError },
    menuItems: { data: menuItems, isLoading: itemsLoading, error: itemsError },
    isLoading: categoriesLoading || itemsLoading,
    error: categoriesError || itemsError,
    createCategory: createCategoryMutation,
    updateCategory: updateCategoryMutation,
    deleteCategory: deleteCategoryMutation,
    createMenuItem: createMenuItemMutation,
    updateMenuItem: updateMenuItemMutation,
    deleteMenuItem: deleteMenuItemMutation,
    refetch: () => {
      refetchCategories();
      refetchItems();
    },
  };
};

export const useAllergens = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALLERGENS],
    queryFn: menuService.getAllergens,
  });
};

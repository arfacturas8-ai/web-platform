export interface Allergen {
  id: string;
  name: string;
  name_en: string;
  name_es?: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  name_es?: string;
  description?: string;
  description_es?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  name_en?: string;
  name_es?: string;
  description?: string;
  description_es?: string;
  price: number;
  image_url?: string;
  video_url?: string;
  is_available: boolean;
  is_featured: boolean;
  allergens: Allergen[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItemDto {
  category_id: string;
  name: string;
  name_es?: string;
  description?: string;
  description_es?: string;
  price: number;
  image_url?: string;
  video_url?: string;
  is_available?: boolean;
  is_featured?: boolean;
  allergen_ids?: string[];
  display_order?: number;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {}

export interface CreateCategoryDto {
  name: string;
  name_es?: string;
  description?: string;
  description_es?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

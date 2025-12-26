export const UserRole = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Settings {
  id: string;
  restaurant_name: string;
  restaurant_name_es?: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  opening_hours?: Record<string, { open: string; close: string }>;
  reservation_duration_minutes: number;
  advance_booking_days: number;
  cancellation_hours: number;
  // Third-party integrations
  tripadvisor_url?: string;
  tripadvisor_rating?: number;
  opentable_restaurant_id?: string;
  opentable_enabled?: boolean;
  waze_address?: string;
  business_latitude?: number;
  business_longitude?: number;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  whatsapp_number?: string;
  google_place_id?: string;
  updated_at: string;
}

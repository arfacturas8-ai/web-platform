export interface Table {
  id: string;
  table_number: string;
  capacity: number;
  is_active: boolean;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  max_reservations: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export const ReservationStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show'
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];

export interface Reservation {
  id: string;
  customer_id: string;
  customer?: Customer;
  table_id?: string;
  table?: Table;
  reservation_date: string;
  time_slot_id: string;
  time_slot?: TimeSlot;
  party_size: number;
  status: ReservationStatus;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReservationDto {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  time_slot_id: string;
  party_size: number;
  special_requests?: string;
}

export interface UpdateReservationDto {
  table_id?: string;
  status?: ReservationStatus;
  special_requests?: string;
}

export interface AvailabilityQuery {
  date: string;
  party_size: number;
}

export interface AvailableSlot {
  time_slot_id: string;
  start_time: string;
  end_time: string;
  available_tables: number;
}

export interface CreateTableDto {
  table_number: string;
  capacity: number;
  location?: string;
  is_active?: boolean;
}

export interface UpdateTableDto extends Partial<CreateTableDto> {}

export interface CreateTimeSlotDto {
  start_time: string;
  end_time: string;
  max_reservations: number;
  is_active?: boolean;
}

export interface UpdateTimeSlotDto extends Partial<CreateTimeSlotDto> {}

export interface CreateCustomerDto {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export interface CustomerWithNotes extends Customer {
  notes?: string;
  reservation_count?: number;
  last_reservation_date?: string;
}

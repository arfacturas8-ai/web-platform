export type WaitlistStatus = 'waiting' | 'notified' | 'seated' | 'cancelled' | 'no_show';
export type TableStatusType = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out_of_service';
export type NotificationType = 'sms' | 'whatsapp' | 'call' | 'email';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export interface WaitlistEntryType {
  id: string;
  branch_id?: string;
  customer_id?: string;
  customer_name: string;
  phone: string;
  email?: string;
  party_size: number;
  join_time: string;
  estimated_wait?: number;
  actual_wait?: number;
  status: WaitlistStatus;
  table_id?: string;
  special_requests?: string;
  notes?: string;
  quote_number: string;
  notified_at?: string;
  seated_at?: string;
  cancelled_at?: string;
  preferred_seating?: string;
  is_vip: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface WaitlistSettings {
  id: string;
  branch_id?: string;
  avg_dining_time: number;
  table_turn_time: number;
  seating_buffer: number;
  small_party_time: number;
  medium_party_time: number;
  large_party_time: number;
  xlarge_party_time: number;
  sms_notifications: boolean;
  whatsapp_notifications: boolean;
  email_notifications: boolean;
  call_notifications: boolean;
  auto_notify: boolean;
  notify_minutes_ahead: number;
  show_position: boolean;
  show_estimated_time: boolean;
  round_wait_time: number;
  auto_cancel_no_show: boolean;
  no_show_timeout: number;
  quote_prefix: string;
  quote_reset_daily: boolean;
  enable_kiosk: boolean;
  enable_sms_checkin: boolean;
  enable_waittime_sms: boolean;
  enable_ml_prediction: boolean;
  prediction_accuracy_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface WaitlistNotification {
  id: string;
  entry_id: string;
  notification_type: NotificationType;
  status: NotificationStatus;
  recipient: string;
  message?: string;
  sent_at?: string;
  delivered_at?: string;
  failed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface TableStatus {
  id: string;
  table_id: string;
  branch_id?: string;
  status: TableStatusType;
  current_party_size?: number;
  occupancy_start?: string;
  estimated_available?: string;
  last_cleaned?: string;
  server_id?: string;
  notes?: string;
  turnover_count_today: number;
  avg_turnover_time?: number;
  created_at: string;
  updated_at: string;
}

export interface WaitlistAnalytics {
  id: string;
  branch_id?: string;
  date: string;
  total_entries: number;
  total_seated: number;
  total_cancelled: number;
  total_no_shows: number;
  avg_wait_time?: number;
  min_wait_time?: number;
  max_wait_time?: number;
  median_wait_time?: number;
  avg_estimate_accuracy?: number;
  estimated_vs_actual?: Record<string, any>;
  peak_hour_start?: number;
  peak_hour_entries?: number;
  party_size_distribution?: Record<string, number>;
  avg_table_turnover?: number;
  total_covers: number;
  notifications_sent: number;
  notification_success_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface WaitlistSummary {
  total_waiting: number;
  total_notified: number;
  avg_wait_time?: number;
  longest_wait_minutes?: number;
  next_available_table?: string;
}

export interface WaitTimeEstimate {
  estimated_wait_minutes: number;
  parties_ahead: number;
  available_tables: number;
  confidence: number;
}

export interface WaitlistPosition {
  entry_id: string;
  position: number;
  parties_ahead: number;
  estimated_wait: number;
  quote_number: string;
  status: WaitlistStatus;
}

export interface TurnoverData {
  total_parties: number;
  avg_turnover_minutes: number;
  total_covers: number;
}

// Request types
export interface AddToWaitlistRequest {
  customer_name: string;
  phone: string;
  email?: string;
  party_size: number;
  special_requests?: string;
  preferred_seating?: string;
  is_vip?: boolean;
  branch_id?: string;
  customer_id?: string;
}

export interface UpdateWaitlistRequest {
  customer_name?: string;
  phone?: string;
  email?: string;
  party_size?: number;
  special_requests?: string;
  preferred_seating?: string;
  status?: WaitlistStatus;
  table_id?: string;
  notes?: string;
  priority?: number;
}

export interface SeatPartyRequest {
  entry_id: string;
  table_id: string;
}

export interface NotifyCustomerRequest {
  entry_id: string;
  notification_type: NotificationType;
  custom_message?: string;
}

export interface UpdateTableStatusRequest {
  status?: TableStatusType;
  current_party_size?: number;
  occupancy_start?: string;
  estimated_available?: string;
  server_id?: string;
  notes?: string;
}

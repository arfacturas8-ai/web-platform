export interface DashboardStats {
  today_reservations: number;
  today_revenue: number;
  pending_reservations: number;
  total_customers: number;
  popular_items: PopularItem[];
  recent_reservations: RecentReservation[];
  reservations_trend: ReservationTrend[];
}

export interface PopularItem {
  id: string;
  name: string;
  count: number;
}

export interface RecentReservation {
  id: string;
  customer_name: string;
  party_size: number;
  date: string;
  time: string;
  status: string;
}

export interface ReservationTrend {
  date: string;
  count: number;
}

export interface Analytics {
  total_reservations: number;
  total_revenue: number;
  total_customers: number;
  average_party_size: number;
  cancellation_rate: number;
  no_show_rate: number;
}

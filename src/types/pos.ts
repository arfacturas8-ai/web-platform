/**
 * POS TypeScript Types
 */

// Enums
export type OrderType = 'dine_in' | 'takeout' | 'delivery' | 'pickup';
export type OrderStatus = 'draft' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'split';
export type DiscountType = 'percentage' | 'fixed';

// Order Item
export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  menu_item_name: string;
  menu_item_price?: number;
  unit_price: number;
  quantity: number;
  subtotal: number;
  special_instructions: string | null;
  is_ready: boolean;
  created_at: string;
}

// Payment
export interface Payment {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  amount: number;
  transaction_id: string | null;
  status: PaymentStatus;
  card_last_four: string | null;
  processed_at: string | null;
  created_at: string;
  notes: string | null;
}

// Order
export interface Order {
  id: string;
  order_number: string;
  order_type: OrderType;
  table_number: string | null;
  customer_id: string | null;
  customer_name?: string | null;
  branch_id: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  subtotal: number;
  tax: number;
  discount: number;
  discount_amount?: number;
  tip: number;
  total: number;
  notes: string | null;
  items: OrderItem[];
  payments: Payment[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  sent_to_kitchen_at: string | null;
}

// Kitchen Order
export interface KitchenOrder {
  id: string;
  order_number: string;
  order_type: OrderType;
  table_number: string | null;
  status: OrderStatus;
  items: OrderItem[];
  notes: string | null;
  sent_to_kitchen_at: string | null;
  created_at: string;
  elapsed_minutes: number;
}

// Discount
export interface Discount {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
}

// Receipt
export interface Receipt {
  order_number: string;
  order_type: OrderType;
  table_number: string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  payment_method: PaymentMethod | null;
  payments: Payment[];
  created_at: string;
  completed_at: string | null;
  thank_you_message: string;
}

// Create/Update DTOs
export interface CreateOrderRequest {
  order_type: OrderType;
  table_number?: string;
  customer_id?: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  order_type?: OrderType;
  table_number?: string;
  customer_id?: string;
  status?: OrderStatus;
  notes?: string;
  tip?: number;
}

export interface AddOrderItemRequest {
  menu_item_id: string;
  quantity: number;
  special_instructions?: string;
}

export interface UpdateOrderItemRequest {
  quantity?: number;
  special_instructions?: string;
  is_ready?: boolean;
}

export interface ApplyDiscountRequest {
  discount_code: string;
}

export interface PaymentRequest {
  payment_method: PaymentMethod;
  amount: number;
  card_last_four?: string;
  transaction_id?: string;
  notes?: string;
}

export interface CashPaymentRequest {
  amount_tendered: number;
}

export interface CashPaymentResponse {
  payment: Payment;
  amount_tendered: number;
  change_due: number;
}

export interface SplitPaymentRequest {
  payments: PaymentRequest[];
}

export interface VoidOrderRequest {
  reason: string;
}

export interface RefundOrderRequest {
  reason: string;
}

export interface OrderCalculation {
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  items_count: number;
}

// State Management
export interface POSState {
  currentOrder: Order | null;
  activeOrders: Order[];
  kitchenOrders: KitchenOrder[];
  isLoading: boolean;
  error: string | null;
}

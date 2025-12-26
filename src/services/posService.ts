/**
 * POS Service - API client for POS endpoints
 */
import api from './api';
import type {
  Order,
  KitchenOrder,
  OrderItem,
  Payment,
  Receipt,
  OrderCalculation,
  CreateOrderRequest,
  UpdateOrderRequest,
  AddOrderItemRequest,
  UpdateOrderItemRequest,
  ApplyDiscountRequest,
  PaymentRequest,
  CashPaymentRequest,
  CashPaymentResponse,
  SplitPaymentRequest,
  VoidOrderRequest,
  RefundOrderRequest,
} from '../types/pos';

class POSService {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post('/pos/orders', data);
    return response.data;
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get(`/pos/orders/${orderId}`);
    return response.data;
  }

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get(`/pos/orders/number/${orderNumber}`);
    return response.data;
  }

  /**
   * List orders with filters
   */
  async listOrders(orderTypes?: string[], statuses?: string[]): Promise<Order[]> {
    const params = new URLSearchParams();
    if (orderTypes?.length) {
      params.append('order_types', orderTypes.join(','));
    }
    if (statuses?.length) {
      params.append('statuses', statuses.join(','));
    }
    const response = await api.get(`/pos/orders?${params.toString()}`);
    return response.data;
  }

  /**
   * Get active orders
   */
  async getActiveOrders(): Promise<Order[]> {
    const response = await api.get('/pos/orders/active');
    return response.data;
  }

  /**
   * Get kitchen orders
   */
  async getKitchenOrders(): Promise<KitchenOrder[]> {
    const response = await api.get('/pos/orders/kitchen');
    return response.data;
  }

  /**
   * Update order
   */
  async updateOrder(orderId: string, data: UpdateOrderRequest): Promise<Order> {
    const response = await api.put(`/pos/orders/${orderId}`, data);
    return response.data;
  }

  /**
   * Void order
   */
  async voidOrder(orderId: string, data: VoidOrderRequest): Promise<void> {
    await api.delete(`/pos/orders/${orderId}`, { data });
  }

  /**
   * Add item to order
   */
  async addItemToOrder(orderId: string, data: AddOrderItemRequest): Promise<OrderItem> {
    const response = await api.post(`/pos/orders/${orderId}/items`, data);
    return response.data;
  }

  /**
   * Update order item
   */
  async updateOrderItem(
    orderId: string,
    itemId: string,
    data: UpdateOrderItemRequest
  ): Promise<OrderItem> {
    const response = await api.put(`/pos/orders/${orderId}/items/${itemId}`, data);
    return response.data;
  }

  /**
   * Remove item from order
   */
  async removeItemFromOrder(orderId: string, itemId: string): Promise<void> {
    await api.delete(`/pos/orders/${orderId}/items/${itemId}`);
  }

  /**
   * Apply discount to order
   */
  async applyDiscount(orderId: string, data: ApplyDiscountRequest): Promise<Order> {
    const response = await api.post(`/pos/orders/${orderId}/discount`, data);
    return response.data;
  }

  /**
   * Process payment
   */
  async processPayment(orderId: string, data: PaymentRequest): Promise<Payment> {
    const response = await api.post(`/pos/orders/${orderId}/payments`, data);
    return response.data;
  }

  /**
   * Process cash payment
   */
  async processCashPayment(
    orderId: string,
    data: CashPaymentRequest
  ): Promise<CashPaymentResponse> {
    const response = await api.post(`/pos/orders/${orderId}/payments/cash`, data);
    return response.data;
  }

  /**
   * Process split payment
   */
  async processSplitPayment(
    orderId: string,
    data: SplitPaymentRequest
  ): Promise<Payment[]> {
    const response = await api.post(`/pos/orders/${orderId}/payments/split`, data);
    return response.data;
  }

  /**
   * Send order to kitchen
   */
  async sendToKitchen(orderId: string): Promise<Order> {
    const response = await api.post(`/pos/orders/${orderId}/send-kitchen`);
    return response.data;
  }

  /**
   * Complete order
   */
  async completeOrder(orderId: string): Promise<Order> {
    const response = await api.post(`/pos/orders/${orderId}/complete`);
    return response.data;
  }

  /**
   * Refund order
   */
  async refundOrder(orderId: string, data: RefundOrderRequest): Promise<Order> {
    const response = await api.post(`/pos/orders/${orderId}/refund`, data);
    return response.data;
  }

  /**
   * Get receipt
   */
  async getReceipt(orderId: string): Promise<Receipt> {
    const response = await api.get(`/pos/orders/${orderId}/receipt`);
    return response.data;
  }

  /**
   * Get order calculation
   */
  async getOrderCalculation(orderId: string): Promise<OrderCalculation> {
    const response = await api.get(`/pos/orders/${orderId}/calculate`);
    return response.data;
  }
}

export default new POSService();

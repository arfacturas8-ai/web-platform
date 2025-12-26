/**
 * usePOS Hook - React hook for POS operations
 */
import { useState, useEffect, useCallback } from 'react';
import posService from '../services/posService';
import type { Order, KitchenOrder, CreateOrderRequest, OrderType } from '../types/pos';

export function usePOS() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new order
   */
  const createOrder = useCallback(async (orderType: OrderType, tableNumber?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data: CreateOrderRequest = { order_type: orderType, table_number: tableNumber };
      const order = await posService.createOrder(data);
      setCurrentOrder(order);
      return order;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load an existing order
   */
  const loadOrder = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const order = await posService.getOrder(orderId);
      setCurrentOrder(order);
      return order;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add item to current order
   */
  const addItem = useCallback(async (menuItemId: string, quantity: number = 1) => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      await posService.addItemToOrder(currentOrder.id, { menu_item_id: menuItemId, quantity });
      // Reload order to get updated totals
      const updated = await posService.getOrder(currentOrder.id);
      setCurrentOrder(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Remove item from current order
   */
  const removeItem = useCallback(async (itemId: string) => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      await posService.removeItemFromOrder(currentOrder.id, itemId);
      // Reload order to get updated totals
      const updated = await posService.getOrder(currentOrder.id);
      setCurrentOrder(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to remove item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Update order item quantity
   */
  const updateItemQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      await posService.updateOrderItem(currentOrder.id, itemId, { quantity });
      // Reload order to get updated totals
      const updated = await posService.getOrder(currentOrder.id);
      setCurrentOrder(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update quantity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Apply discount to current order
   */
  const applyDiscount = useCallback(async (code: string) => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      const updated = await posService.applyDiscount(currentOrder.id, { discount_code: code });
      setCurrentOrder(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to apply discount');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Process cash payment
   */
  const processCashPayment = useCallback(async (amountTendered: number) => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      const result = await posService.processCashPayment(currentOrder.id, { amount_tendered: amountTendered });
      // Reload order to get updated payment status
      const updated = await posService.getOrder(currentOrder.id);
      setCurrentOrder(updated);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Process card payment
   */
  const processCardPayment = useCallback(async (amount: number, cardLastFour?: string) => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      await posService.processPayment(currentOrder.id, {
        payment_method: 'card',
        amount,
        card_last_four: cardLastFour
      });
      // Reload order to get updated payment status
      const updated = await posService.getOrder(currentOrder.id);
      setCurrentOrder(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Send order to kitchen
   */
  const sendToKitchen = useCallback(async () => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      const updated = await posService.sendToKitchen(currentOrder.id);
      setCurrentOrder(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send to kitchen');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Complete order
   */
  const completeOrder = useCallback(async () => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      const updated = await posService.completeOrder(currentOrder.id);
      setCurrentOrder(null); // Clear current order after completion
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to complete order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Void order
   */
  const voidOrder = useCallback(async (reason: string) => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      await posService.voidOrder(currentOrder.id, { reason });
      setCurrentOrder(null); // Clear current order after voiding
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to void order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Get receipt for current order
   */
  const getReceipt = useCallback(async () => {
    if (!currentOrder) throw new Error('No active order');

    try {
      setIsLoading(true);
      setError(null);
      return await posService.getReceipt(currentOrder.id);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get receipt');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  /**
   * Load active orders
   */
  const loadActiveOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const orders = await posService.getActiveOrders();
      setActiveOrders(orders);
      return orders;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load orders');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear current order
   */
  const clearOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  return {
    currentOrder,
    activeOrders,
    isLoading,
    error,
    createOrder,
    loadOrder,
    addItem,
    removeItem,
    updateItemQuantity,
    applyDiscount,
    processCashPayment,
    processCardPayment,
    sendToKitchen,
    completeOrder,
    voidOrder,
    getReceipt,
    loadActiveOrders,
    clearOrder,
  };
}

export function useKitchenOrders() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadKitchenOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const kitchenOrders = await posService.getKitchenOrders();
      setOrders(kitchenOrders);
      return kitchenOrders;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load kitchen orders');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markItemReady = useCallback(async (orderId: string, itemId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await posService.updateOrderItem(orderId, itemId, { is_ready: true });
      // Reload orders
      await loadKitchenOrders();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to mark item ready');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadKitchenOrders]);

  // Auto-refresh kitchen orders every 10 seconds
  useEffect(() => {
    loadKitchenOrders();
    const interval = setInterval(loadKitchenOrders, 10000);
    return () => clearInterval(interval);
  }, [loadKitchenOrders]);

  return {
    orders,
    isLoading,
    error,
    loadKitchenOrders,
    markItemReady,
  };
}

/**
 * POS Page - Point of Sale Interface
 */
import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { usePOS } from '../../hooks/usePOS';
import { useCurrency } from '../../contexts/CurrencyContext';
import { menuService } from '../../services/menuService';
import type { MenuItem } from '../../types/menu';
import type { OrderType } from '../../types/pos';

export default function POS() {
  const {
    currentOrder,
    isLoading,
    error,
    createOrder,
    addItem,
    removeItem,
    updateItemQuantity,
    processCashPayment,
    processCardPayment,
    sendToKitchen,
    clearOrder,
  } = usePOS();
  const { formatPrice } = useCurrency();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cashTendered, setCashTendered] = useState('');

  // Load menu items
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const items = await menuService.getMenuItems();
        setMenuItems(items.filter(item => item.is_available));
      } catch (err) {
        logger.error('Failed to load menu:', err);
      }
    };
    loadMenu();
  }, []);

  const handleNewOrder = async () => {
    try {
      await createOrder(orderType, orderType === 'dine_in' ? tableNumber : undefined);
    } catch (err) {
      logger.error('Failed to create order:', err);
    }
  };

  const handleAddItem = async (menuItem: MenuItem) => {
    if (!currentOrder) {
      await handleNewOrder();
    }
    try {
      await addItem(menuItem.id, 1);
    } catch (err) {
      logger.error('Failed to add item:', err);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      logger.error('Failed to remove item:', err);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await handleRemoveItem(itemId);
      return;
    }
    try {
      await updateItemQuantity(itemId, quantity);
    } catch (err) {
      logger.error('Failed to update quantity:', err);
    }
  };

  const handlePayment = async () => {
    if (!currentOrder) return;

    try {
      if (paymentMethod === 'cash') {
        const result = await processCashPayment(parseFloat(cashTendered));
        alert(`Payment successful! Change due: ${formatPrice(result.change_due)}`);
      } else {
        await processCardPayment(currentOrder.total);
        alert('Payment successful!');
      }
      await sendToKitchen();
      setShowPayment(false);
      clearOrder();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Payment failed');
    }
  };

  const categories = [...new Set(menuItems.map(item => item.category_id))];

  return (
    <div className="pos-container" style={{ display: 'flex', height: '100vh' }}>
      {/* Left: Menu Items */}
      <div style={{ flex: 2, padding: '20px', overflow: 'auto' }}>
        <h1>Point of Sale</h1>

        {!currentOrder && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
            <h3>New Order</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={() => setOrderType('dine_in')}
                style={{ padding: '10px', background: orderType === 'dine_in' ? '#4CAF50' : '#ddd' }}
              >
                Dine In
              </button>
              <button
                onClick={() => setOrderType('takeout')}
                style={{ padding: '10px', background: orderType === 'takeout' ? '#4CAF50' : '#ddd' }}
              >
                Takeout
              </button>
            </div>
            {orderType === 'dine_in' && (
              <input
                type="text"
                placeholder="Table Number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                style={{ padding: '10px', width: '200px' }}
              />
            )}
            <button
              onClick={handleNewOrder}
              style={{ padding: '10px 20px', marginLeft: '10px', background: '#2196F3', color: 'white', border: 'none' }}
            >
              Start Order
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleAddItem(item)}
              style={{
                padding: '15px',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.name_en}</div>
              <div style={{ color: '#666' }}>{formatPrice(item.price)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Current Order */}
      <div style={{ flex: 1, background: '#f9f9f9', padding: '20px', borderLeft: '1px solid #ddd' }}>
        <h2>Current Order</h2>

        {currentOrder ? (
          <>
            <div style={{ marginBottom: '10px' }}>
              <strong>Order #:</strong> {currentOrder.order_number}<br />
              <strong>Type:</strong> {currentOrder.order_type}<br />
              {currentOrder.table_number && <><strong>Table:</strong> {currentOrder.table_number}<br /></>}
            </div>

            <div style={{ marginBottom: '20px' }}>
              {currentOrder.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', background: 'white', borderRadius: '4px' }}>
                  <div style={{ flex: 1 }}>
                    <strong>{item.menu_item_name}</strong><br />
                    {formatPrice(item.unit_price)}
                  </div>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button onClick={() => handleRemoveItem(item.id)} style={{ marginLeft: '10px', color: 'red' }}></button>
                  </div>
                  <div style={{ minWidth: '60px', textAlign: 'right' }}>
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px solid #ddd', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Subtotal:</span>
                <span>{formatPrice(currentOrder.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Tax:</span>
                <span>{formatPrice(currentOrder.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span>{formatPrice(currentOrder.total)}</span>
              </div>

              {!showPayment ? (
                <button
                  onClick={() => setShowPayment(true)}
                  style={{ width: '100%', padding: '15px', background: '#4CAF50', color: 'white', border: 'none', fontSize: '1.1em', cursor: 'pointer' }}
                  disabled={currentOrder.items.length === 0}
                >
                  Payment (F2)
                </button>
              ) : (
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
                  <h3>Payment</h3>
                  <div style={{ marginBottom: '10px' }}>
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      style={{ padding: '10px', marginRight: '10px', background: paymentMethod === 'cash' ? '#4CAF50' : '#ddd' }}
                    >
                      Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      style={{ padding: '10px', background: paymentMethod === 'card' ? '#4CAF50' : '#ddd' }}
                    >
                      Card
                    </button>
                  </div>
                  {paymentMethod === 'cash' && (
                    <input
                      type="number"
                      placeholder="Amount Tendered"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                  )}
                  <button
                    onClick={handlePayment}
                    style={{ width: '100%', padding: '10px', background: '#2196F3', color: 'white', border: 'none' }}
                    disabled={paymentMethod === 'cash' && (!cashTendered || parseFloat(cashTendered) < currentOrder.total)}
                  >
                    Complete Payment
                  </button>
                  <button
                    onClick={() => setShowPayment(false)}
                    style={{ width: '100%', padding: '10px', marginTop: '10px', background: '#ddd', border: 'none' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            No active order<br />
            Start a new order to begin
          </div>
        )}

        {error && (
          <div style={{ marginTop: '10px', padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logger } from '@/utils/logger';
import { API_URL } from '@/utils/constants';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface CartItem {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  menu_item_price: number;
  quantity: number;
  customizations: Record<string, any>;
  special_instructions?: string;
  subtotal: number;
}

export interface Cart {
  id: string;
  session_id?: string;
  customer_id?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  item_count: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (menuItemId: string, quantity: number, customizations?: Record<string, any>, specialInstructions?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity?: number, customizations?: Record<string, any>, specialInstructions?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  validateCart: () => Promise<{ is_valid: boolean; errors: string[]; warnings: string[] }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Session ID management
const getSessionId = (): string => {
  if (typeof window === 'undefined') {
    return uuidv4(); // Return temporary ID during SSR
  }
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = getSessionId();

  // Get headers with session ID
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Session-Id': sessionId,
  });

  // Fetch cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  const refreshCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/cart`, {
        headers: getHeaders(),
      });

      setCart(response.data);
    } catch (err: any) {
      // If cart doesn't exist, it's okay - it will be created on first add
      if (err.response?.status !== 404) {
        setError(err.response?.data?.detail || 'Failed to fetch cart');
        logger.error('Error fetching cart:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    menuItemId: string,
    quantity: number,
    customizations?: Record<string, any>,
    specialInstructions?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/cart/items`,
        {
          menu_item_id: menuItemId,
          quantity,
          customizations: customizations || {},
          special_instructions: specialInstructions,
        },
        { headers: getHeaders() }
      );

      setCart(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add item to cart');
      logger.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (
    itemId: string,
    quantity?: number,
    customizations?: Record<string, any>,
    specialInstructions?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(
        `${API_URL}/cart/items/${itemId}`,
        {
          quantity,
          customizations,
          special_instructions: specialInstructions,
        },
        { headers: getHeaders() }
      );

      setCart(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update cart item');
      logger.error('Error updating cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(
        `${API_URL}/cart/items/${itemId}`,
        { headers: getHeaders() }
      );

      setCart(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to remove item from cart');
      logger.error('Error removing from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${API_URL}/cart`, {
        headers: getHeaders(),
      });

      setCart(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to clear cart');
      logger.error('Error clearing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateCart = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/validate`,
        {},
        { headers: getHeaders() }
      );

      return {
        is_valid: response.data.is_valid,
        errors: response.data.errors || [],
        warnings: response.data.warnings || [],
      };
    } catch (err: any) {
      logger.error('Error validating cart:', err);
      return {
        is_valid: false,
        errors: [err.response?.data?.detail || 'Failed to validate cart'],
        warnings: [],
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

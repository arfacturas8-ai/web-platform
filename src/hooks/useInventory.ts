import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import {
  Product,
  Supplier,
  Branch,
  StockLevel,
  InventoryTransaction,
  PurchaseOrder,
  StockAdjustment,
  MenuItemRecipe,
  LowStockAlert,
  InventoryValue,
  ProductFormData,
  SupplierFormData,
  BranchFormData,
  TransactionFormData,
  PurchaseOrderFormData,
  StockAdjustmentFormData,
  RecipeFormData,
} from '../types/inventory';

const API_BASE_URL = API_URL;

// ==================== Products ====================

export function useProducts(filters?: {
  category?: string;
  supplier_id?: string;
  is_active?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id);
      if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));

      const response = await axios.get(`${API_BASE_URL}/inventory/products?${params}`);
      setProducts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters?.category, filters?.supplier_id, filters?.is_active]);

  const createProduct = async (data: ProductFormData) => {
    const response = await axios.post(`${API_BASE_URL}/inventory/products`, data);
    await fetchProducts();
    return response.data;
  };

  const updateProduct = async (id: string, data: Partial<ProductFormData>) => {
    const response = await axios.put(`${API_BASE_URL}/inventory/products/${id}`, data);
    await fetchProducts();
    return response.data;
  };

  const deleteProduct = async (id: string) => {
    await axios.delete(`${API_BASE_URL}/inventory/products/${id}`);
    await fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

// ==================== Suppliers ====================

export function useSuppliers(is_active?: boolean) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (is_active !== undefined) params.append('is_active', String(is_active));

      const response = await axios.get(`${API_BASE_URL}/inventory/suppliers?${params}`);
      setSuppliers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [is_active]);

  const createSupplier = async (data: SupplierFormData) => {
    const response = await axios.post(`${API_BASE_URL}/inventory/suppliers`, data);
    await fetchSuppliers();
    return response.data;
  };

  const updateSupplier = async (id: string, data: Partial<SupplierFormData>) => {
    const response = await axios.put(`${API_BASE_URL}/inventory/suppliers/${id}`, data);
    await fetchSuppliers();
    return response.data;
  };

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    createSupplier,
    updateSupplier,
  };
}

// ==================== Branches ====================

export function useBranches(is_active?: boolean) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (is_active !== undefined) params.append('is_active', String(is_active));

      const response = await axios.get(`${API_BASE_URL}/inventory/branches?${params}`);
      setBranches(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [is_active]);

  const createBranch = async (data: BranchFormData) => {
    const response = await axios.post(`${API_BASE_URL}/inventory/branches`, data);
    await fetchBranches();
    return response.data;
  };

  const updateBranch = async (id: string, data: Partial<BranchFormData>) => {
    const response = await axios.put(`${API_BASE_URL}/inventory/branches/${id}`, data);
    await fetchBranches();
    return response.data;
  };

  return {
    branches,
    loading,
    error,
    refetch: fetchBranches,
    createBranch,
    updateBranch,
  };
}

// ==================== Stock Levels ====================

export function useStockLevels(filters?: {
  branch_id?: string;
  product_id?: string;
  low_stock_only?: boolean;
}) {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockLevels = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.branch_id) params.append('branch_id', filters.branch_id);
      if (filters?.product_id) params.append('product_id', filters.product_id);
      if (filters?.low_stock_only) params.append('low_stock_only', 'true');

      const response = await axios.get(`${API_BASE_URL}/inventory/stock-levels?${params}`);
      setStockLevels(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch stock levels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockLevels();
  }, [filters?.branch_id, filters?.product_id, filters?.low_stock_only]);

  return {
    stockLevels,
    loading,
    error,
    refetch: fetchStockLevels,
  };
}

// ==================== Transactions ====================

export function useTransactions(filters?: {
  product_id?: string;
  branch_id?: string;
  transaction_type?: string;
  start_date?: string;
  end_date?: string;
}) {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.product_id) params.append('product_id', filters.product_id);
      if (filters?.branch_id) params.append('branch_id', filters.branch_id);
      if (filters?.transaction_type) params.append('transaction_type', filters.transaction_type);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);

      const response = await axios.get(`${API_BASE_URL}/inventory/transactions?${params}`);
      setTransactions(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [
    filters?.product_id,
    filters?.branch_id,
    filters?.transaction_type,
    filters?.start_date,
    filters?.end_date,
  ]);

  const createTransaction = async (data: TransactionFormData) => {
    const response = await axios.post(`${API_BASE_URL}/inventory/transactions`, data);
    await fetchTransactions();
    return response.data;
  };

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
  };
}

// ==================== Purchase Orders ====================

export function usePurchaseOrders(filters?: {
  supplier_id?: string;
  branch_id?: string;
  status?: string;
}) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id);
      if (filters?.branch_id) params.append('branch_id', filters.branch_id);
      if (filters?.status) params.append('status', filters.status);

      const response = await axios.get(`${API_BASE_URL}/inventory/purchase-orders?${params}`);
      setPurchaseOrders(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [filters?.supplier_id, filters?.branch_id, filters?.status]);

  const createPurchaseOrder = async (data: PurchaseOrderFormData) => {
    const formattedData = {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        total_cost: item.quantity_ordered * item.unit_cost,
      })),
    };
    const response = await axios.post(`${API_BASE_URL}/inventory/purchase-orders`, formattedData);
    await fetchPurchaseOrders();
    return response.data;
  };

  const updatePurchaseOrder = async (id: string, data: Partial<PurchaseOrderFormData>) => {
    const response = await axios.put(`${API_BASE_URL}/inventory/purchase-orders/${id}`, data);
    await fetchPurchaseOrders();
    return response.data;
  };

  const receivePurchaseOrder = async (id: string, items: { id: string; quantity_received: number }[]) => {
    const response = await axios.put(`${API_BASE_URL}/inventory/purchase-orders/${id}/receive`, {
      items,
    });
    await fetchPurchaseOrders();
    return response.data;
  };

  return {
    purchaseOrders,
    loading,
    error,
    refetch: fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    receivePurchaseOrder,
  };
}

// ==================== Low Stock Alerts ====================

export function useLowStockAlerts() {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/inventory/low-stock`);
      setAlerts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch low stock alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
  };
}

// ==================== Inventory Value ====================

export function useInventoryValue(branch_id?: string) {
  const [inventoryValue, setInventoryValue] = useState<InventoryValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryValue = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (branch_id) params.append('branch_id', branch_id);

      const response = await axios.get(`${API_BASE_URL}/inventory/value?${params}`);
      setInventoryValue(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch inventory value');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryValue();
  }, [branch_id]);

  return {
    inventoryValue,
    loading,
    error,
    refetch: fetchInventoryValue,
  };
}

// ==================== Stock Adjustments ====================

export function useStockAdjustments() {
  const createAdjustment = async (data: StockAdjustmentFormData) => {
    const response = await axios.post(`${API_BASE_URL}/inventory/adjustments`, data);
    return response.data;
  };

  return {
    createAdjustment,
  };
}

// ==================== Recipes ====================

export function useRecipes(menu_item_id?: string) {
  const [recipes, setRecipes] = useState<MenuItemRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    if (!menu_item_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/inventory/recipes/${menu_item_id}`);
      setRecipes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [menu_item_id]);

  const addRecipeItem = async (data: RecipeFormData) => {
    const response = await axios.post(`${API_BASE_URL}/inventory/recipes`, data);
    await fetchRecipes();
    return response.data;
  };

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
    addRecipeItem,
  };
}

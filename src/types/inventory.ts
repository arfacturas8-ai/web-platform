export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category?: string;
  unit_of_measure: string;
  supplier_id?: string;
  supplier?: Supplier;
  cost_price?: number;
  reorder_point: number;
  reorder_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockLevel {
  id: string;
  product_id: string;
  branch_id: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  last_counted?: string;
  updated_at: string;
  product?: Product;
  branch?: Branch;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  branch_id: string;
  transaction_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  unit_cost?: number;
  total_cost?: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  product?: Product;
  branch?: Branch;
}

export interface PurchaseOrderItem {
  id?: string;
  product_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  total_cost: number;
  product?: Product;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id?: string;
  branch_id: string;
  order_date: string;
  expected_delivery?: string;
  status: 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
  branch?: Branch;
  items: PurchaseOrderItem[];
}

export interface StockAdjustment {
  id: string;
  product_id: string;
  branch_id: string;
  adjustment_type: 'count' | 'damage' | 'theft' | 'expired' | 'correction' | 'shrinkage';
  quantity: number;
  reason?: string;
  created_by?: string;
  created_at: string;
  product?: Product;
  branch?: Branch;
}

export interface MenuItemRecipe {
  id: string;
  menu_item_id: string;
  product_id: string;
  quantity_required: number;
  unit?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface LowStockAlert {
  product: Product;
  branch: Branch;
  current_stock: number;
  reorder_point: number;
  reorder_quantity: number;
  quantity_deficit: number;
}

export interface InventoryValue {
  total_value: number;
  total_products: number;
  total_items: number;
  by_category: {
    [category: string]: {
      value: number;
      items: number;
    };
  };
}

export interface StockMovementReport {
  product: Product;
  branch: Branch;
  stock_in: number;
  stock_out: number;
  adjustments: number;
  closing_stock: number;
  transactions: InventoryTransaction[];
}

// Form types
export interface ProductFormData {
  sku: string;
  name: string;
  category?: string;
  unit_of_measure: string;
  supplier_id?: string;
  cost_price?: number;
  reorder_point: number;
  reorder_quantity: number;
  is_active: boolean;
}

export interface SupplierFormData {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
  is_active: boolean;
}

export interface BranchFormData {
  name: string;
  code: string;
  address?: string;
  is_active: boolean;
}

export interface TransactionFormData {
  product_id: string;
  branch_id: string;
  transaction_type: 'in' | 'out';
  quantity: number;
  unit_cost?: number;
  notes?: string;
}

export interface PurchaseOrderFormData {
  supplier_id?: string;
  branch_id: string;
  order_date: string;
  expected_delivery?: string;
  notes?: string;
  items: {
    product_id: string;
    quantity_ordered: number;
    unit_cost: number;
  }[];
}

export interface StockAdjustmentFormData {
  product_id: string;
  branch_id: string;
  adjustment_type: 'count' | 'damage' | 'theft' | 'expired' | 'correction' | 'shrinkage';
  quantity: number;
  reason?: string;
}

export interface RecipeFormData {
  menu_item_id: string;
  product_id: string;
  quantity_required: number;
  unit?: string;
}

// Constants
export const UNIT_OF_MEASURE_OPTIONS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'lb', label: 'Pound (lb)' },
  { value: 'oz', label: 'Ounce (oz)' },
  { value: 'l', label: 'Liter (l)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'unit', label: 'Unit' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'box', label: 'Box' },
  { value: 'bag', label: 'Bag' },
];

export const ADJUSTMENT_TYPE_OPTIONS = [
  { value: 'count', label: 'Physical Count' },
  { value: 'damage', label: 'Damage' },
  { value: 'theft', label: 'Theft' },
  { value: 'expired', label: 'Expired' },
  { value: 'correction', label: 'Correction' },
  { value: 'shrinkage', label: 'Shrinkage' },
];

export const PO_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'partially_received', label: 'Partially Received' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
];

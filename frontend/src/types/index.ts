export interface Product {
  id?: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id?: number;
  product_id: number;
  quantity: number;
  min_stock: number;
  max_stock: number;
  location: string;
  last_updated?: string;
  product_name?: string;
  sku?: string;
  price?: number;
  total_value?: number;
  stock_status?: string;
}

export interface InventoryMovement {
  id?: number;
  product_id: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  created_at?: string;
  product_name?: string;
  sku?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  new_quantity?: number;
}

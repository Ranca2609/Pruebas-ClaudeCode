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
}

export interface InventoryMovement {
  id?: number;
  product_id: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  created_at?: string;
}

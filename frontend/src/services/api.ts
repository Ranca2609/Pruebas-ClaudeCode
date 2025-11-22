import axios from 'axios';
import { Product, InventoryItem, InventoryMovement, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsApi = {
  getAll: () => api.get<ApiResponse<Product[]>>('/api/products'),

  getById: (id: number) => api.get<ApiResponse<Product>>(`/api/products/${id}`),

  create: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<ApiResponse<Product>>('/api/products', product),

  update: (id: number, product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
    api.put<ApiResponse<Product>>(`/api/products/${id}`, product),

  delete: (id: number) => api.delete<ApiResponse<void>>(`/api/products/${id}`),

  search: (query: string) =>
    api.get<ApiResponse<Product[]>>(`/api/products/search?query=${query}`),
};

// Inventory API
export const inventoryApi = {
  getAll: () => api.get<ApiResponse<InventoryItem[]>>('/api/inventory'),

  getByProduct: (productId: number) =>
    api.get<ApiResponse<InventoryItem>>(`/api/inventory/product/${productId}`),

  update: (productId: number, data: Partial<InventoryItem>) =>
    api.put<ApiResponse<InventoryItem>>(`/api/inventory/product/${productId}`, data),

  getLowStock: () => api.get<ApiResponse<InventoryItem[]>>('/api/inventory/low-stock'),

  addMovement: (movement: Omit<InventoryMovement, 'id' | 'created_at'>) =>
    api.post<ApiResponse<InventoryMovement>>('/api/inventory/movements', movement),

  getMovements: (productId?: number) => {
    const url = productId
      ? `/api/inventory/movements/${productId}`
      : '/api/inventory/movements';
    return api.get<ApiResponse<InventoryMovement[]>>(url);
  },
};

export default api;

import api from './api';

export interface SupplierProduct {
  id: string;
  supplierId: string;
  productId: string;
  productName?: string;
  category?: string;
  subcategory?: string;
  unit?: string;
  basePrice: number;
  lastPrice?: number;
  lastSupplied?: string;
  totalQtySupplied?: number;
  status: string;
}

export const supplierProductService = {
  getAll: async (): Promise<SupplierProduct[]> => {
    const response = await api.get('/procurement/supplier-products');
    return response.data;
  },

  getBySupplierId: async (supplierId: string): Promise<SupplierProduct[]> => {
    const response = await api.get(`/procurement/suppliers/${supplierId}/products`);
    return response.data;
  },

  create: async (data: { supplierId: string, productId: string, basePrice: number, status?: string }): Promise<SupplierProduct> => {
    const response = await api.post('/procurement/supplier-products', data);
    return response.data;
  },

  update: async (productId: string, data: Partial<{ basePrice: number, status: string }>): Promise<SupplierProduct> => {
    const response = await api.put(`/procurement/supplier-products/${productId}`, data);
    return response.data;
  },

  delete: async (productId: string): Promise<void> => {
    await api.delete(`/procurement/supplier-products/${productId}`);
  }
};

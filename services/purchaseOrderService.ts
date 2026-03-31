import api from './api';

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  [key: string]: any;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  status: string;
  items: PurchaseOrderItem[];
}

export const purchaseOrderService = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    const response = await api.get('/procurement/purchase-orders');
    return response.data;
  },

  getById: async (id: string): Promise<PurchaseOrder> => {
    const response = await api.get(`/procurement/purchase-orders/${id}`);
    return response.data;
  },

  create: async (data: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
    const response = await api.post('/procurement/purchase-orders', data);
    return response.data;
  },

  update: async (id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
    const response = await api.put(`/procurement/purchase-orders/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/procurement/purchase-orders/${id}`);
  }
};

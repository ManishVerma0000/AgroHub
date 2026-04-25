import api from './api';

export interface MobileOrder {
  id: string;
  customerId: string;
  warehouseId: string;
  deliveryAddressId?: string;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: any[];
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  location?: string;
}

export const mobileOrderService = {
  create: async (data: any): Promise<MobileOrder> => {
    const response = await api.post('/mobile/orders/', data);
    return response.data;
  },

  getById: async (id: string): Promise<MobileOrder> => {
    const response = await api.get(`/mobile/orders/${id}`);
    return response.data;
  },
  
  getByCustomer: async (customerId: string, skip: number = 0, limit: number = 10): Promise<{items: MobileOrder[], total: number}> => {
    const response = await api.get(`/mobile/orders/?customer_id=${customerId}&skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getByWarehouse: async (warehouseId: string, skip: number = 0, limit: number = 10): Promise<{items: MobileOrder[], total: number}> => {
    const response = await api.get(`/mobile/orders/warehouse/${warehouseId}?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  confirmOrder: async (orderId: string): Promise<MobileOrder> => {
    const response = await api.patch(`/mobile/orders/${orderId}/confirm`);
    return response.data;
  },

  getByWarehouseAndStatus: async (warehouseId: string, status: string): Promise<MobileOrder[]> => {
    const response = await api.get(`/mobile/orders/warehouse/${warehouseId}/by-status?status=${encodeURIComponent(status)}`);
    return response.data;
  },

  startPicking: async (orderId: string): Promise<MobileOrder> => {
    const response = await api.patch(`/mobile/orders/${orderId}/start-picking`);
    return response.data;
  },

  startPacking: async (orderId: string): Promise<MobileOrder> => {
    const response = await api.patch(`/mobile/orders/${orderId}/start-packing`);
    return response.data;
  },

  readyForDispatch: async (orderId: string): Promise<MobileOrder> => {
    const response = await api.patch(`/mobile/orders/${orderId}/ready-for-dispatch`);
    return response.data;
  }
};

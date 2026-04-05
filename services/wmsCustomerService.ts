import api from './api';

export interface WmsCustomer {
  id: string;
  shopName: string;
  ownerName: string;
  mobileNumber: string;
  city: string;
  shopType: string;
  status: string;
  createdDate?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
}

export const wmsCustomerService = {
  getByWarehouse: async (warehouseId: string): Promise<WmsCustomer[]> => {
    const response = await api.get(`/wms-customers/warehouse/${warehouseId}`);
    return response.data;
  },
};

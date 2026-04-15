import api from './api';

export interface Customer {
  id: string;
  shopName: string;
  ownerName: string;
  mobileNumber: string;
  city?: string;
  shopType?: string;
  status: string;
  createdDate: string;
  
  // Analytics
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  customerType: string;
  customerStatus: string;
}

export interface AdminCustomerCreate {
  shopName: string;
  ownerName: string;
  mobileNumber: string;
  city?: string;
  shopType?: string;
  addressLocation?: string;
  nearbyLandmark?: string;
  isDefaultAddress?: boolean;
}

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },

  create: async (data: AdminCustomerCreate): Promise<Customer> => {
    const response = await api.post('/customers', data);
    return response.data;
  }
};

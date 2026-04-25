import api from './api';

export interface DispatchBatch {
  id: string;
  dispatchId: string;
  vehicleNumber: string;
  driverName: string;
  orderIds: string[];
  orderCount: number;
  route: string;
  dispatchTime: string;
  status: 'Out for Delivery' | 'Delivered' | 'Pending';
  warehouseId: string;
}

export const dispatchService = {
  getHistory: async (warehouseId: string): Promise<DispatchBatch[]> => {
    const response = await api.get(`/dispatch/?warehouse_id=${warehouseId}`);
    return response.data;
  },

  createBatch: async (data: {
    orderIds: string[];
    driverName: string;
    vehicleNumber: string;
    route: string;
    warehouseId: string;
  }): Promise<DispatchBatch> => {
    const response = await api.post('/dispatch/', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<DispatchBatch> => {
    const response = await api.patch(`/dispatch/${id}/status?status=${status}`);
    return response.data;
  }
};

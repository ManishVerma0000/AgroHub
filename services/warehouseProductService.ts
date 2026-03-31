import api from './api';

export const warehouseProductService = {
  getAll: async (warehouseId?: string) => {
    const params = warehouseId ? { warehouse_id: warehouseId } : {};
    const response = await api.get('/warehouse-products/', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/warehouse-products/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/warehouse-products/', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/warehouse-products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/warehouse-products/${id}`);
    return response.data;
  },
  stockAction: async (id: string, actionData: any) => {
    const response = await api.post(`/warehouse-products/${id}/stock-action`, actionData);
    return response.data;
  }
};

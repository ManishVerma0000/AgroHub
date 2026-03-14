import api from './api';

export const subcategoryService = {
  getAll: async () => {
    const response = await api.get('/subcategories/');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/subcategories/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/subcategories/', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/subcategories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/subcategories/${id}`);
    return response.data;
  }
};

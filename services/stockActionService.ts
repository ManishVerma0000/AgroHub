import api from './api';

export const stockActionService = {
  getAll: async () => {
    const response = await api.get('/stock-actions/');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/stock-actions/', data);
    return response.data;
  }
};

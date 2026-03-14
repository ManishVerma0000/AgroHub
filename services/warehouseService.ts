import api from './api';

const uploadFile = async (file: File): Promise<string | null> => {
  if (!file) return null;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await api.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.image_url || null;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

export const warehouseService = {
  getAll: async () => {
    const response = await api.get('/warehouses/');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
  },
  create: async (data: any, newImages?: File[], newDocuments?: File[]) => {
    let payload = { ...data };
    if (newImages && newImages.length > 0) {
      const urls = await Promise.all(newImages.map(f => uploadFile(f)));
      payload.images = [...(payload.images || []), ...urls.filter(Boolean)];
    }
    if (newDocuments && newDocuments.length > 0) {
      const urls = await Promise.all(newDocuments.map(f => uploadFile(f)));
      payload.documents = [...(payload.documents || []), ...urls.filter(Boolean)];
    }
    const response = await api.post('/warehouses/', payload);
    return response.data;
  },
  update: async (id: string, data: any, newImages?: File[], newDocuments?: File[]) => {
    let payload = { ...data };
    if (newImages && newImages.length > 0) {
      const urls = await Promise.all(newImages.map(f => uploadFile(f)));
      payload.images = [...(payload.images || []), ...urls.filter(Boolean)];
    }
    if (newDocuments && newDocuments.length > 0) {
      const urls = await Promise.all(newDocuments.map(f => uploadFile(f)));
      payload.documents = [...(payload.documents || []), ...urls.filter(Boolean)];
    }
    const response = await api.put(`/warehouses/${id}`, payload);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  }
};

import api from './api';

const uploadImage = async (file: File): Promise<string | null> => {
  if (!file) return null;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await api.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.image_url || null;
  } catch (error) {
    console.error('Failed to upload image to S3:', error);
    throw error;
  }
};

export const productService = {
  getAll: async (skip: number = 0, limit: number = 10) => {
    const response = await api.get(`/products/?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (data: any, imageFile?: File | null) => {
    let payload = { ...data };
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      if (imageUrl) payload.imageUrl = imageUrl;
    }
    const response = await api.post('/products/', payload);
    return response.data;
  },
  update: async (id: string, data: any, imageFile?: File | null) => {
    let payload = { ...data };
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      if (imageUrl) payload.imageUrl = imageUrl;
    }
    const response = await api.put(`/products/${id}`, payload);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

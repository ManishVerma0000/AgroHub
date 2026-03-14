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

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  create: async (data: any, imageFile?: File | null) => {
    let payload = { ...data };
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      if (imageUrl) payload.imageUrl = imageUrl;
    }
    const response = await api.post('/categories/', payload);
    return response.data;
  },
  update: async (id: string, data: any, imageFile?: File | null) => {
    let payload = { ...data };
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      if (imageUrl) payload.imageUrl = imageUrl;
    }
    const response = await api.put(`/categories/${id}`, payload);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

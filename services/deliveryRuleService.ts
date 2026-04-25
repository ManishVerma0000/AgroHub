import api from "./api";

export interface DeliveryRule {
  id: string;
  ruleName: string;
  minOrderValue: number;
  deliveryCharge: number;
  isFreeDelivery: boolean;
  bannerUrl?: string | null;
  warehouseId?: string | null;
  status: string;
  createdAt: string;
}

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
    console.error('Failed to upload image:', error);
    throw error;
  }
};

export const deliveryRuleService = {
  getAll: async (): Promise<DeliveryRule[]> => {
    const res = await api.get("/delivery-rules/");
    return res.data;
  },

  create: async (data: any, imageFile?: File | null): Promise<DeliveryRule> => {
    let payload = { ...data };
    if (imageFile) {
      const bannerUrl = await uploadImage(imageFile);
      if (bannerUrl) payload.bannerUrl = bannerUrl;
    }
    const res = await api.post("/delivery-rules/", payload);
    return res.data;
  },

  update: async (id: string, data: any, imageFile?: File | null): Promise<DeliveryRule> => {
    let payload = { ...data };
    if (imageFile) {
      const bannerUrl = await uploadImage(imageFile);
      if (bannerUrl) payload.bannerUrl = bannerUrl;
    }
    const res = await api.put(`/delivery-rules/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/delivery-rules/${id}`);
  },
};

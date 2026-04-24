import api from "./api";

export interface DeliveryRule {
  id: string;
  ruleName: string;
  minOrderValue: number;
  maxOrderValue: number | null;
  deliveryCharge: number;
  isFreeDelivery: boolean;
  status: string;
  createdAt: string;
}

export const deliveryRuleService = {
  getAll: async (): Promise<DeliveryRule[]> => {
    const res = await api.get("/delivery-rules/");
    return res.data;
  },

  create: async (data: Omit<DeliveryRule, "id" | "createdAt">): Promise<DeliveryRule> => {
    const res = await api.post("/delivery-rules/", data);
    return res.data;
  },

  update: async (id: string, data: Partial<DeliveryRule>): Promise<DeliveryRule> => {
    const res = await api.put(`/delivery-rules/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/delivery-rules/${id}`);
  },
};

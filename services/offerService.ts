import api from "./api";

export type OfferType = "CART VALUE" | "NEW CUSTOMER" | "WIN-BACK";
export type BenefitType = "L" | "M" | "H" | "Flat";
export type UsageType = "Monthly" | "Weekly" | "Once" | "Unlimited";

export interface Offer {
  id: string;
  offerName: string;
  offerType: OfferType;
  minOrderValue: number;
  benefitType: BenefitType;
  benefitValue: number;
  usageLimit: number;
  usageType: UsageType;
  validUntil: string;
  status: "Active" | "Inactive";
  imageUrl?: string;
  createdAt: string;
}

export const offerService = {
  getAll: async (): Promise<Offer[]> => {
    const res = await api.get("/offers/");
    return res.data;
  },

  create: async (data: Omit<Offer, "id" | "createdAt">): Promise<Offer> => {
    const res = await api.post("/offers/", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Offer>): Promise<Offer> => {
    const res = await api.put(`/offers/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/offers/${id}`);
  },
};

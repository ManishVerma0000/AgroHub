import api from './api';

export interface SendOtpPayload {
  email: string;
}

export interface SendOtpResponse {
  message?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: number;
}

export interface VerifyOtpResponse {
  message?: string;
  userdetails?: {
    token: string;
    [key: string]: any;
  };
}

export interface WarehouseProfile {
  id: string;
  name: string;
  manager: string;
  contact: string;
  location: string;
  email: string;
  state: string;
  city: string;
  pinCode: string;
  gstNo: string;
  fssaiNo: string;
  openTime: string;
  closeTime: string;
  gstOwner: string;
  latitudeLink: string;
  images: string[];
  documents: string[];
  status: string;
  createdDate: string;
  overheadCost: number;
  logisticCost: number;
}

export const wmsAuthService = {
  sendOtp: async (data: SendOtpPayload): Promise<SendOtpResponse> => {
    const response = await api.post('/users/send-warehouse-otp', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const response = await api.post('/users/login-warehouse-user', data);
    return response.data;
  },

  getProfile: async (token: string): Promise<WarehouseProfile> => {
    const response = await api.get('/users/warehouse/profile/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

import api from './api';

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  message?: string;
}

export const authService = {
  login: async (data: AdminLoginPayload): Promise<AdminLoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

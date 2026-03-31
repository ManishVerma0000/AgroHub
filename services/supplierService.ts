import api from './api';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  gstNumber?: string | null;
  address?: string | null;
  status: string;
  products: number;
  poCount: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
}

export interface SupplierCreate {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  gstNumber?: string | null;
  address?: string | null;
  status?: string;
}

export const supplierService = {
  // Get all suppliers
  getAllSuppliers: async (): Promise<Supplier[]> => {
    const response = await api.get('/procurement/suppliers');
    return response.data;
  },

  // Get a single supplier by ID
  getSupplierById: async (id: string): Promise<Supplier> => {
    const response = await api.get(`/procurement/suppliers/${id}`);
    return response.data;
  },

  // Create a new supplier
  createSupplier: async (data: SupplierCreate): Promise<Supplier> => {
    const response = await api.post('/procurement/suppliers', data);
    return response.data;
  },

  // Update a supplier
  updateSupplier: async (id: string, data: Partial<SupplierCreate>): Promise<Supplier> => {
    const response = await api.put(`/procurement/suppliers/${id}`, data);
    return response.data;
  },

  // Delete a supplier
  deleteSupplier: async (id: string): Promise<void> => {
    await api.delete(`/procurement/suppliers/${id}`);
  }
};

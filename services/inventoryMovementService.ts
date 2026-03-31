import api from './api';

export const getInventoryMovements = async (warehouseId?: string) => {
  try {
    const params = warehouseId ? { warehouse_id: warehouseId } : {};
    const response = await api.get('/inventory-movements/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory movements:', error);
    throw error;
  }
};

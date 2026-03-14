'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { WarehouseList, WarehouseData } from '@/components/Warehouse/WarehouseList';
import { WarehouseForm } from '@/components/Warehouse/WarehouseForm';
import toast from 'react-hot-toast';

import { warehouseService } from '@/services/warehouseService';

export default function WarehousePage() {
  const [data, setData] = useState<WarehouseData[]>([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const result = await warehouseService.getAll();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch warehouses:', error);
      }
    };
    fetchWarehouses();
  }, []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseData | null>(null);

  const handleEdit = (item: WarehouseData) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await warehouseService.delete(id);
      setData(data.filter(item => item.id !== id));
      toast.success('Warehouse deleted successfully');
    } catch (error) {
      console.error('Failed to delete warehouse:', error);
      toast.error('Failed to delete warehouse');
    }
  };

  const handleSave = async (savedData: any, newImages?: File[], newDocuments?: File[]) => {
    try {
      if (editingItem) {
        // Update existing
        const result = await warehouseService.update(editingItem.id, savedData, newImages, newDocuments);
        setData(data.map(item => item.id === editingItem.id ? result : item));
        toast.success('Warehouse updated successfully');
      } else {
        // Add new
        const newItem = await warehouseService.create({
          ...savedData,
          status: 'Active',
          createdDate: new Date().toISOString().split('T')[0]
        }, newImages, newDocuments);
        setData([newItem, ...data]);
        toast.success('Warehouse added successfully');
      }
    } catch (error) {
      console.error('Failed to save warehouse:', error);
      toast.error('Failed to save warehouse');
    }
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={isAdding ? (editingItem ? "Edit Warehouse" : "Add New Warehouse") : "All Warehouses"} 
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Warehouse Management" },
          ...(isAdding ? [{ label: editingItem ? "Edit Warehouse" : "Add Warehouse" }] : [])
        ]}
        action={
          !isAdding && (
            <Button onClick={() => setIsAdding(true)} icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }>
              New Warehouse
            </Button>
          )
        }
      />

      {isAdding ? (
        <WarehouseForm 
          initialData={editingItem} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <WarehouseList 
          data={data} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

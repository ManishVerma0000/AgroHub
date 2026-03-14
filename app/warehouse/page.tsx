'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { WarehouseList, WarehouseData } from '@/components/Warehouse/WarehouseList';
import { WarehouseForm } from '@/components/Warehouse/WarehouseForm';

const initialMockData: WarehouseData[] = [
  { id: '1', name: 'West Zone Hub', manager: 'Amit Desai', contact: '+91 9876543210', location: 'Navi Mumbai, Maharashtra', status: 'Active', createdDate: '2026-03-01' },
  { id: '2', name: 'North Region Cold', manager: 'Priya Sharma', contact: '+91 9123456780', location: 'Sonipat, Haryana', status: 'Active', createdDate: '2026-02-15' },
  { id: '3', name: 'South Transit', manager: 'Rahul Kumar', contact: '+91 8876543210', location: 'Bangalore, Karnataka', status: 'Inactive', createdDate: '2026-01-20' },
  { id: '4', name: 'East Main', manager: 'Sneha Roy', contact: '+91 7876543210', location: 'Kolkata, West Bengal', status: 'Active', createdDate: '2025-12-05' },
];

export default function WarehousePage() {
  const [data, setData] = useState<WarehouseData[]>(initialMockData);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseData | null>(null);

  const handleEdit = (item: WarehouseData) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleSave = (savedData: any) => {
    if (editingItem) {
      // Update existing
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...savedData } as WarehouseData : item));
    } else {
      // Add new
      const newItem: WarehouseData = {
        ...savedData,
        status: 'Active',
        id: Math.random().toString(36).substr(2, 9),
        createdDate: new Date().toISOString().split('T')[0]
      };
      setData([newItem, ...data]);
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

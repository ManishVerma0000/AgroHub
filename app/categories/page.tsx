'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { CategoryList, CategoryData } from '@/components/Categories/CategoryList';
import { CategoryForm } from '@/components/Categories/CategoryForm';

const initialMockData: CategoryData[] = [
  { id: '1', name: 'Fruits & Vegetables', description: 'Fresh fruits and vegetables', priority: 1, status: 'Active', createdDate: '2026-01-10' },
  { id: '2', name: 'Grains & Cereals', description: 'Rice, wheat, and other grains', priority: 2, status: 'Active', createdDate: '2026-01-12' },
  { id: '3', name: 'Spices & Herbs', description: 'All kinds of spices and herbs', priority: 3, status: 'Active', createdDate: '2026-01-15' },
  { id: '4', name: 'Pulses & Legumes', description: 'Dal, lentils, chickpeas', priority: 4, status: 'Inactive', createdDate: '2026-01-18' },
];

export default function CategoriesPage() {
  const [data, setData] = useState<CategoryData[]>(initialMockData);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryData | null>(null);

  const handleEdit = (item: CategoryData) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleSave = (savedData: any) => {
    if (editingItem) {
      // Update existing
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...savedData } as CategoryData : item));
    } else {
      // Add new
      const newItem: CategoryData = {
        ...savedData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'Active',
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
        title={isAdding ? (editingItem ? "Edit Category" : "Add New Category") : "All Categories"} 
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Category Management" },
          ...(isAdding ? [{ label: editingItem ? "Edit Category" : "Add Category" }] : [])
        ]}
        action={
          !isAdding && (
            <Button onClick={() => setIsAdding(true)} icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }>
              New Category
            </Button>
          )
        }
      />

      {isAdding ? (
        <CategoryForm 
          initialData={editingItem} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <CategoryList 
          data={data} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

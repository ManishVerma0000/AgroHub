'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SubcategoryList, SubcategoryData } from '@/components/Subcategories/SubcategoryList';
import { SubcategoryForm } from '@/components/Subcategories/SubcategoryForm';

const initialMockData: SubcategoryData[] = [
  { id: '1', name: 'Toor Dal', category: 'Pulses & Legumes', hsnCodesCount: 0, status: 'Inactive', createdDate: '2026-02-05', hsnCodes: [] },
  { id: '2', name: 'Turmeric Powder', category: 'Spices & Herbs', hsnCodesCount: 1, status: 'Active', createdDate: '2026-02-01', hsnCodes: [{ code: '0910', gst: '5' }] },
  { id: '3', name: 'Fresh Tomatoes', category: 'Fruits & Vegetables', hsnCodesCount: 1, status: 'Active', createdDate: '2026-01-18', hsnCodes: [{ code: '0702', gst: '0' }] },
  { id: '4', name: 'Basmati Rice', category: 'Grains & Cereals', hsnCodesCount: 1, status: 'Active', createdDate: '2026-01-15', hsnCodes: [{ code: '1006', gst: '5' }] },
];

export default function SubcategoriesPage() {
  const [data, setData] = useState<SubcategoryData[]>(initialMockData);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<SubcategoryData | null>(null);

  const handleEdit = (item: SubcategoryData) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleSave = (savedData: any) => {
    if (editingItem) {
      // Update existing
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...savedData, hsnCodesCount: savedData.hsnCodes.length } as SubcategoryData : item));
    } else {
      // Add new
      const newItem: SubcategoryData = {
        ...savedData,
        hsnCodesCount: savedData.hsnCodes.length,
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
        title={isAdding ? (editingItem ? "Edit Subcategory" : "Add New Subcategory") : "All Subcategories"} 
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Subcategory Management" },
          ...(isAdding ? [{ label: editingItem ? "Edit Subcategory" : "Add Subcategory" }] : [])
        ]}
        action={
          !isAdding && (
            <Button onClick={() => setIsAdding(true)} icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }>
              New Subcategory
            </Button>
          )
        }
      />

      {isAdding ? (
        <SubcategoryForm 
          initialData={editingItem} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <SubcategoryList 
          data={data} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

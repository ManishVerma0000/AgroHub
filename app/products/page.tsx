'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ProductList, ProductData } from '@/components/Products/ProductList';
import { ProductForm } from '@/components/Products/ProductForm';

const initialMockData: ProductData[] = [
  { id: '1', code: 'SP-001', name: 'Fresh Turmeric Powder', category: 'Spices & Herbs', hsn: '0910', basePrice: '₹80/Kg', b2b: 'Off', status: 'Active', createdDate: '2026-02-01' },
  { id: '2', code: 'GR-001', name: 'Organic Basmati Rice', category: 'Grains & Cereals', hsn: '1006', basePrice: '₹120/Kg', b2b: 'Enabled', status: 'Active', createdDate: '2026-01-15' },
];

export default function ProductsPage() {
  const [data, setData] = useState<ProductData[]>(initialMockData);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductData | null>(null);

  const handleEdit = (item: ProductData) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleSave = (savedData: any) => {
    if (editingItem) {
      // Update existing
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...savedData } as ProductData : item));
    } else {
      // Add new
      const newItem: ProductData = {
        ...savedData,
        code: `PR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
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
        title={isAdding ? (editingItem ? "Edit Product" : "Add New Product") : "All Products"} 
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Product Management" },
          ...(isAdding ? [{ label: editingItem ? "Edit Product" : "Add Product" }] : [])
        ]}
        action={
          !isAdding && (
            <Button onClick={() => setIsAdding(true)} icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }>
              New Product
            </Button>
          )
        }
      />

      {isAdding ? (
        <ProductForm 
          initialData={editingItem} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <ProductList 
          data={data} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

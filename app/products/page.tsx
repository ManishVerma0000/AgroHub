'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ProductList, ProductData } from '@/components/Products/ProductList';
import { ProductForm } from '@/components/Products/ProductForm';
import toast from 'react-hot-toast';

import { productService } from '@/services/productService';

export default function ProductsPage() {
  const [data, setData] = useState<ProductData[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.getAll();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductData | null>(null);

  const handleEdit = (item: ProductData) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id);
      setData(data.filter(item => item.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleSave = async (savedData: any, imageFile?: File | null) => {
    try {
      if (editingItem) {
        // Update existing — pass imageFile so service can upload to S3 and save URL
        const result = await productService.update(editingItem.id, savedData, imageFile);
        setData(data.map(item => item.id === editingItem.id ? result : item));
        toast.success('Product updated successfully');
      } else {
        // Add new — pass imageFile so service can upload to S3 and save URL
        const newItem = await productService.create({
          ...savedData,
          code: `PR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          createdDate: new Date().toISOString().split('T')[0]
        }, imageFile);
        setData([newItem, ...data]);
        toast.success('Product added successfully');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
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

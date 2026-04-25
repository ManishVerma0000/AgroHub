'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ProductList, ProductData } from '@/components/Products/ProductList';
import { ProductForm } from '@/components/Products/ProductForm';
import toast from 'react-hot-toast';

import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

export default function ProductsPage() {
  const [data, setData] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const skip = (currentPage - 1) * limit;
        const [productsRes, categoriesList] = await Promise.all([
          productService.getAll(skip, limit),
          categoryService.getAll()
        ]);
        
        setCategories(categoriesList);
        setTotalItems(productsRes.total);

        const categoryMap = new Map(categoriesList.map((c: any) => [c.id, c.name]));
        
        const mappedProducts = productsRes.items.map((p: any) => ({
          ...p,
          categoryName: categoryMap.get(p.categoryId) || undefined
        }));
        
        setData(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchProductsAndCategories();
  }, [currentPage]);
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
        const mappedResult = {
          ...result,
          categoryName: categories.find(c => c.id === result.categoryId)?.name
        };
        setData(data.map(item => item.id === editingItem.id ? mappedResult : item));
        toast.success('Product updated successfully');
      } else {
        // Add new — pass imageFile so service can upload to S3 and save URL
        const newItem = await productService.create({
          ...savedData,
          code: savedData.partcode || `PR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          createdDate: new Date().toISOString().split('T')[0]
        }, imageFile);
        const mappedNewItem = {
          ...newItem,
          categoryName: categories.find(c => c.id === newItem.categoryId)?.name
        };
        setData([mappedNewItem, ...data]);
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
          categories={categories}
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            onNext: () => setCurrentPage(p => Math.min(p + 1, Math.ceil(totalItems / limit))),
            onPrev: () => setCurrentPage(p => Math.max(p - 1, 1))
          }}
        />
      )}
    </div>
  );
}

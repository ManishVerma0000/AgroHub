'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { CategoryList, CategoryData } from '@/components/Categories/CategoryList';
import { CategoryForm } from '@/components/Categories/CategoryForm';
import toast from 'react-hot-toast';

import { categoryService } from '@/services/categoryService';

export default function CategoriesPage() {
  const [data, setData] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryService.getAll();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryData | null>(null);

  const handleEdit = (item: CategoryData) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.delete(id);
      setData(data.filter(item => item.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleSave = async (savedData: any, imageFile?: File | null) => {
    try {
      if (editingItem) {
        // Update existing — pass imageFile so service can upload to S3 and save URL
        const result = await categoryService.update(editingItem.id, savedData, imageFile);
        setData(data.map(item => item.id === editingItem.id ? result : item));
        toast.success('Category updated successfully');
      } else {
        // Add new — pass imageFile so service can upload to S3 and save URL
        const newItem = await categoryService.create({
          ...savedData,
          status: savedData.status,
          createdDate: new Date().toISOString().split('T')[0]
        }, imageFile);
        setData([newItem, ...data]);
        toast.success('Category added successfully');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error('Failed to save category');
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

'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SubcategoryList, SubcategoryData } from '@/components/Subcategories/SubcategoryList';
import { SubcategoryForm } from '@/components/Subcategories/SubcategoryForm';
import toast from 'react-hot-toast';

import { subcategoryService } from '@/services/subcategoryService';

export default function SubcategoriesPage() {
  const [data, setData] = useState<SubcategoryData[]>([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const result = await subcategoryService.getAll();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    };
    fetchSubcategories();
  }, []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<SubcategoryData | null>(null);

  const handleEdit = (item: SubcategoryData) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await subcategoryService.delete(id);
      setData(data.filter(item => item.id !== id));
      toast.success('Subcategory deleted successfully');
    } catch (error) {
      console.error('Failed to delete subcategory:', error);
      toast.error('Failed to delete subcategory');
    }
  };

  const handleSave = async (savedData: any, imageFile?: File | null) => {
    try {
      if (editingItem) {
        // Update existing
        const result = await subcategoryService.update(editingItem.id, { 
          ...savedData, 
          hsnCodesCount: savedData.hsnCodes.length 
        }, imageFile);
        setData(data.map(item => item.id === editingItem.id ? result : item));
        toast.success('Subcategory updated successfully');
      } else {
        // Add new
        const newItem = await subcategoryService.create({
          ...savedData,
          hsnCodesCount: savedData.hsnCodes.length,
          createdDate: new Date().toISOString().split('T')[0]
        }, imageFile);
        setData([newItem, ...data]);
        toast.success('Subcategory added successfully');
      }
    } catch (error) {
      console.error('Failed to save subcategory:', error);
      toast.error('Failed to save subcategory');
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

'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SubcategoryList, SubcategoryData } from '@/components/Subcategories/SubcategoryList';
import { SubcategoryForm } from '@/components/Subcategories/SubcategoryForm';
import toast from 'react-hot-toast';

import { subcategoryService } from '@/services/subcategoryService';
import { categoryService } from '@/services/categoryService';

export default function SubcategoriesPage() {
  const [data, setData] = useState<SubcategoryData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubcategoriesAndCategories = async () => {
      try {
        const [subcatsRes, catsRes] = await Promise.all([
          subcategoryService.getAll(),
          categoryService.getAll()
        ]);
        
        setCategories(catsRes);
        
        const categoryMap = new Map(catsRes.map((c: any) => [c.id, c.name]));
        
        const mappedSubcats = subcatsRes.map((sc: any) => ({
          ...sc,
          categoryName: categoryMap.get(sc.categoryId) || undefined
        }));
        
        setData(mappedSubcats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchSubcategoriesAndCategories();
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
        const mappedResult = {
          ...result,
          categoryName: categories.find(c => c.id === result.categoryId)?.name
        };
        setData(data.map(item => item.id === editingItem.id ? mappedResult : item));
        toast.success('Subcategory updated successfully');
      } else {
        // Add new
        const newItem = await subcategoryService.create({
          ...savedData,
          hsnCodesCount: savedData.hsnCodes.length,
          createdDate: new Date().toISOString().split('T')[0]
        }, imageFile);
        const mappedNewItem = {
          ...newItem,
          categoryName: categories.find(c => c.id === newItem.categoryId)?.name
        };
        setData([mappedNewItem, ...data]);
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
          categories={categories} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

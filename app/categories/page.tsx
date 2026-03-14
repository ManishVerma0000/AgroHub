'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { CategoryList } from '@/components/Categories/CategoryList';
import { CategoryForm } from '@/components/Categories/CategoryForm';

export default function CategoriesPage() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={isAdding ? "Add New Category" : "All Categories"} 
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Category Management" },
          ...(isAdding ? [{ label: "Add Category" }] : [])
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
        <CategoryForm onCancel={() => setIsAdding(false)} />
      ) : (
        <CategoryList />
      )}
    </div>
  );
}

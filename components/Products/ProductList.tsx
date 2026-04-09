'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';

export interface ProductData {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  categoryName?: string;
  hsn: string;
  basePrice: string;
  b2b: 'Enabled' | 'Off';
  status: 'Active' | 'Inactive';
  createdDate: string;
  imageUrl?: string | null;
}

interface ProductListProps {
  data: ProductData[];
  categories: any[];
  onEdit: (item: ProductData) => void;
  onDelete: (id: string) => void;
}

export function ProductList({ data, categories, onEdit, onDelete }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProductData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const columns: Column<ProductData>[] = [
    {
      header: 'Product',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {/* Clickable image/thumbnail */}
          {item.imageUrl ? (
            <button
              type="button"
              title="Click to preview image"
              onClick={() => setPreviewImage(item.imageUrl!)}
              className="w-10 h-10 rounded overflow-hidden border border-[#e5e7eb] hover:ring-2 hover:ring-[#07ac57]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#07ac57] group flex-shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded bg-[#dcfce7] flex items-center justify-center text-[#166534] bg-opacity-40 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-[#111827]">{item.name}</span>
            <span className="text-xs text-[#6b7280]">{item.code}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      cell: (item) => (
        <Badge variant="blue" className="font-normal border border-blue-200 bg-blue-50 text-center inline-block">
          {item.categoryName || item.categoryId}
        </Badge>
      )
    },
    {
      header: 'HSN',
      accessorKey: 'hsn',
    },
    {
      header: 'Base Price (Kg)',
      accessorKey: 'basePrice',
    },
    {
      header: 'B2B',
      cell: (item) => (
        <Badge variant={item.b2b === 'Enabled' ? 'blue' : 'neutral'} className={item.b2b === 'Enabled' ? 'bg-[#e0e7ff] text-[#3730a3]' : 'bg-[#f3f4f6] text-[#6b7280]'}>
          {item.b2b}
        </Badge>
      )
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.status === 'Active' ? 'success' : 'neutral'}>
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Created Date',
      cell: (item) => (
        <div className="flex flex-col text-sm text-[#4b5563]">
          <span>{item.createdDate}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex gap-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => onEdit(item)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => {
              setItemToDelete(item);
              setDeleteModalOpen(true);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? d.categoryId === categoryFilter : true;
    const matchesStatus = statusFilter ? d.status === statusFilter : true;
    const matchesDate = dateFilter ? d.createdDate === dateFilter : true;
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Search products..."
        onSearch={setSearchTerm}
        filters={
          <>
            <input 
              type="date"
              className="hidden sm:block border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] h-10 w-40 bg-white"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Select
              className="w-40"
              options={[
                { label: 'All Categories', value: '' },
                ...categories.map(c => ({ label: c.name, value: c.id }))
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              className="w-40"
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </>
        }
        pagination={{
          currentPage: 1,
          totalPages: 1,
          totalItems: filteredData.length,
          onNext: () => {},
          onPrev: () => {}
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          if (itemToDelete) {
            onDelete(itemToDelete.id);
          }
        }}
        itemName={itemToDelete?.name}
      />

      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
        altText="Product Image"
      />
    </>
  );
}

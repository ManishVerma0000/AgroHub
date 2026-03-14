'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

interface CategoryData {
  id: string;
  name: string;
  description: string;
  priority: number;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

const mockData: CategoryData[] = [
  { id: '1', name: 'Fruits & Vegetables', description: 'Fresh fruits and vegetables', priority: 1, status: 'Active', createdDate: '2026-01-10' },
  { id: '2', name: 'Grains & Cereals', description: 'Rice, wheat, and other grains', priority: 2, status: 'Active', createdDate: '2026-01-12' },
  { id: '3', name: 'Spices & Herbs', description: 'All kinds of spices and herbs', priority: 3, status: 'Active', createdDate: '2026-01-15' },
  { id: '4', name: 'Pulses & Legumes', description: 'Dal, lentils, chickpeas', priority: 4, status: 'Inactive', createdDate: '2026-01-18' },
];

export function CategoryList() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column<CategoryData>[] = [
    {
      header: 'Image',
      cell: () => (
        <div className="w-10 h-10 rounded bg-[#e5e7eb] flex items-center justify-center text-[#07ac57] bg-opacity-20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </div>
      )
    },
    {
      header: 'Category Name',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#111827]">{item.name}</span>
          <span className="text-xs text-[#6b7280]">{item.description}</span>
        </div>
      )
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
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
      accessorKey: 'createdDate',
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex gap-2">
          <button className="text-blue-500 hover:text-blue-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button className="text-red-500 hover:text-red-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      )
    }
  ];

  const filteredData = mockData.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DataTable 
      columns={columns} 
      data={filteredData} 
      searchPlaceholder="Search categories..."
      onSearch={setSearchTerm}
      filters={
        <>
          <Select 
            className="w-40"
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' }
            ]}
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
  );
}

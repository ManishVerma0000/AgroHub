'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

interface WarehouseData {
  id: string;
  name: string;
  manager: string;
  contact: string;
  location: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

const mockData: WarehouseData[] = [
  { id: '1', name: 'Central Hub', manager: 'John Doe', contact: '+91 9876543210', location: 'Mumbai, Maharashtra', status: 'Active', createdDate: '2026-01-15' },
  { id: '2', name: 'North Zone Facility', manager: 'Jane Smith', contact: '+91 9123456780', location: 'Delhi, Delhi', status: 'Active', createdDate: '2026-02-01' },
];

export function WarehouseList() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column<WarehouseData>[] = [
    {
      header: 'Warehouse Name',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#eff6ff] flex items-center justify-center text-[#2563eb] bg-opacity-40">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/><path d="m3 7 9-4 9 4v14H3V7z"/><path d="M12 11v6"/><path d="M8 11v6"/><path d="M16 11v6"/>
              </svg>
          </div>
          <span className="font-medium text-[#111827]">{item.name}</span>
        </div>
      )
    },
    {
      header: 'Manager Info',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="text-[#111827] font-medium text-sm">{item.manager}</span>
          <span className="text-xs text-[#6b7280]">{item.contact}</span>
        </div>
      )
    },
    {
      header: 'Location',
      cell: (item) => (
        <span className="text-[#4b5563] text-sm">{item.location}</span>
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
      accessorKey: 'createdDate',
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex gap-2">
          <button className="text-blue-500 hover:text-blue-700">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
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
      searchPlaceholder="Search warehouses..."
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

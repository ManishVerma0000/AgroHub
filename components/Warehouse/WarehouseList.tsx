'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';

export interface WarehouseData {
  id: string;
  name: string;
  manager: string;
  contact: string;
  location: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

interface WarehouseListProps {
  data: WarehouseData[];
  onEdit: (item: WarehouseData) => void;
  onDelete: (id: string) => void;
}




export function WarehouseList({ data, onEdit, onDelete }: WarehouseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WarehouseData | null>(null);

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

  const filteredData = data.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
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
    </>
  );
}

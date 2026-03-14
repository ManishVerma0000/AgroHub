'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface OrderData {
  id: string;
  orderId: string;
  date: string;
  customerName: string;
  totalAmount: string;
  status: 'Pending' | 'Confirmed' | 'Packing' | 'In-Transit' | 'Delivered' | 'Cancelled';
}

import { orderService } from '@/services/orderService';

const TABS = ['All', 'Pending', 'Confirmed', 'Packing', 'In-Transit', 'Delivered', 'Cancelled'];

export function OrderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [data, setData] = useState<OrderData[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await orderService.getAll();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const columns: Column<OrderData>[] = [
    {
      header: 'Order ID',
      cell: (item) => (
        <span className="font-medium text-[#111827]">{item.orderId}</span>
      )
    },
    {
      header: 'Date & Time',
      accessorKey: 'date',
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Total Amount',
      accessorKey: 'totalAmount',
    },
    {
      header: 'Status',
      cell: (item) => {
        let variant: 'success' | 'warning' | 'error' | 'neutral' | 'blue' = 'neutral';
        switch(item.status) {
          case 'Delivered': variant = 'success'; break;
          case 'Pending': variant = 'warning'; break;
          case 'Cancelled': variant = 'error'; break;
          case 'In-Transit': 
          case 'Packing':
          case 'Confirmed': variant = 'blue'; break;
        }
        return (
          <Badge variant={variant}>
            {item.status}
          </Badge>
        );
      }
    },
    {
      header: 'Actions',
      cell: () => (
         <div className="flex gap-2">
            <button className="text-[#07ac57] hover:text-[#069a4e] text-sm font-medium">
               View Details
            </button>
         </div>
      )
    }
  ];

  const filteredData = data.filter(d => {
    const matchesSearch = d.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || d.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#e5e7eb] hide-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[3px] ${
              activeTab === tab 
                ? 'text-[#07ac57] border-[#07ac57]' 
                : 'text-[#6b7280] border-transparent hover:text-[#374151]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        searchPlaceholder="Search by Order ID or Customer..."
        onSearch={setSearchTerm}
        filters={
           <Button variant="outline" className="hidden sm:flex border-[#d1d5db] font-normal items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            Date Range
          </Button>
        }
        pagination={{
          currentPage: 1,
          totalPages: 1,
          totalItems: filteredData.length,
          onNext: () => {},
          onPrev: () => {}
        }}
      />
    </div>
  );
}

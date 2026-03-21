"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function AllOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockOrders = [
    { id: "ORD-9921", customer: "Reliance Smart", date: "21 Oct 2026, 10:00 AM", amount: "₹12,400", items: 8, status: "Ready for Dispatch" },
    { id: "ORD-9922", customer: "D-Mart", date: "21 Oct 2026, 11:30 AM", amount: "₹45,000", items: 15, status: "Packing" },
    { id: "ORD-9923", customer: "Nature's Basket", date: "21 Oct 2026, 01:15 PM", amount: "₹8,500", items: 3, status: "Picking" },
    { id: "ORD-9924", customer: "Local Kirana Store", date: "21 Oct 2026, 02:20 PM", amount: "₹2,100", items: 2, status: "Pending" },
    { id: "ORD-9918", customer: "BigBazaar", date: "20 Oct 2026, 04:00 PM", amount: "₹89,000", items: 42, status: "Dispatched" },
    { id: "ORD-9910", customer: "More Supermarket", date: "19 Oct 2026, 09:00 AM", amount: "₹15,600", items: 10, status: "Delivered" },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]';
      case 'Picking': return 'bg-[#fdf4ff] text-[#c026d3] border-[#f5d0fe]';
      case 'Packing': return 'bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]';
      case 'Ready for Dispatch': return 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]';
      case 'Dispatched': return 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]';
      case 'Delivered': return 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]';
      default: return 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">All Orders</h1>
          <p className="text-sm text-[#6b7280] mt-1">Track the end-to-end fulfillment status of all customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#f3f4f6] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#f9fafb] bg-white">
            <FilterIcon className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#07ac57] text-white rounded-lg text-sm font-medium hover:opacity-90">
            <DownloadIcon className="w-4 h-4" />
            Export Selected
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
        <div className="p-4 border-b border-[#f3f4f6] flex justify-between items-center">
          <div className="relative w-[300px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f9fafb] text-[#6b7280] font-medium border-b border-[#f3f4f6]">
              <tr>
                <th className="px-6 py-4 font-semibold pb-4">
                  <input type="checkbox" className="rounded text-[#07ac57]" />
                </th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date Received</th>
                <th className="px-6 py-4 font-semibold text-right">Items</th>
                <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Fulfillment Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fcfcfc]">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded text-[#07ac57]" />
                  </td>
                  <td className="px-6 py-4 font-bold text-[#111827] cursor-pointer hover:underline hover:text-[#07ac57]">{order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-[#6b7280]">{order.date}</td>
                  <td className="px-6 py-4 text-right text-[#6b7280]">{order.items}</td>
                  <td className="px-6 py-4 text-right font-medium text-[#111827]">{order.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#07ac57] hover:underline font-medium text-sm">View details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}

function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

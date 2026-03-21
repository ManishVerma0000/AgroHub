"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function PurchaseOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockPOs = [
    { poNumber: "PO-2045", supplier: "AgroFarms Ltd.", date: "21 Oct 2026", delivery: "24 Oct 2026", amount: "₹45,000", items: 4, status: "Pending" },
    { poNumber: "PO-2044", supplier: "PureOils Central", date: "20 Oct 2026", delivery: "22 Oct 2026", amount: "₹18,500", items: 2, status: "Partially Received" },
    { poNumber: "PO-2043", supplier: "SweetRoots Co.", date: "18 Oct 2026", delivery: "20 Oct 2026", amount: "₹9,200", items: 1, status: "Received" },
    { poNumber: "PO-2042", supplier: "Spices Connect", date: "15 Oct 2026", delivery: "17 Oct 2026", amount: "₹21,000", items: 5, status: "Received" }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-[#fff7ed] text-[#ea580c]';
      case 'Partially Received': return 'bg-[#eff6ff] text-[#3b82f6]';
      case 'Received': return 'bg-[#ecfdf5] text-[#059669]';
      default: return 'bg-[#f3f4f6] text-[#6b7280]';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Purchase Orders</h1>
          <p className="text-sm text-[#6b7280] mt-1">Track and manage POs issued to your suppliers.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#07ac57] text-white rounded-lg text-sm font-medium hover:opacity-90">
          <PlusIcon className="w-4 h-4" />
          Create PO
        </button>
      </div>

      <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
        <div className="p-4 border-b border-[#f3f4f6] flex justify-between items-center">
          <div className="relative w-[300px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="Search by PO Number or Supplier..." 
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
                <th className="px-6 py-4 font-semibold">PO Number</th>
                <th className="px-6 py-4 font-semibold">Supplier</th>
                <th className="px-6 py-4 font-semibold">Issue Date</th>
                <th className="px-6 py-4 font-semibold">Est. Delivery</th>
                <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Items</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {mockPOs.map((po) => (
                <tr key={po.poNumber} className="hover:bg-[#fcfcfc]">
                  <td className="px-6 py-4 font-medium text-[#111827] cursor-pointer hover:underline hover:text-[#07ac57]">{po.poNumber}</td>
                  <td className="px-6 py-4 font-medium text-[#475569]">{po.supplier}</td>
                  <td className="px-6 py-4 text-[#6b7280]">{po.date}</td>
                  <td className="px-6 py-4 text-[#6b7280]">{po.delivery}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#111827]">{po.amount}</td>
                  <td className="px-6 py-4 text-center text-[#6b7280]">{po.items}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(po.status)}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#07ac57] hover:text-[#069a4e] transition-colors font-medium text-sm">View Details</button>
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

// Icons
function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
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

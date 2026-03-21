"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function MovementHistory() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockMovements = [
    { id: "MOV-1042", product: "Premium Basmati Rice", type: "IN", quantity: "+500", date: "21 Oct 2026, 10:30 AM", ref: "PO-2039", user: "Rajesh K." },
    { id: "MOV-1043", product: "Organic Toor Dal", type: "OUT", quantity: "-50", date: "21 Oct 2026, 11:15 AM", ref: "ORD-9921", user: "Arun V." },
    { id: "MOV-1044", product: "Whole Wheat Atta", type: "WASTAGE", quantity: "-5", date: "21 Oct 2026, 02:45 PM", ref: "-", user: "System" },
    { id: "MOV-1045", product: "Cold Pressed Mustard Oil", type: "RESERVED", quantity: "30", date: "22 Oct 2026, 09:00 AM", ref: "ORD-9934", user: "Arun V." },
    { id: "MOV-1046", product: "Organic Jaggery", type: "IN", quantity: "+100", date: "22 Oct 2026, 11:30 AM", ref: "PO-2041", user: "Rajesh K." }
  ];

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'IN': return 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]';
      case 'OUT': return 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]';
      case 'WASTAGE': return 'bg-[#f3f4f6] text-[#4b5563] border-[#d1d5db]';
      case 'RESERVED': return 'bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]';
      default: return 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Movement History</h1>
          <p className="text-sm text-[#6b7280] mt-1">Audit log of all stock entering and leaving the warehouse.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#f3f4f6] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#f9fafb] bg-white">
            <FilterIcon className="w-4 h-4" />
            Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-lg text-sm font-medium hover:bg-[#374151]">
            Export Log
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
        <div className="p-4 border-b border-[#f3f4f6] flex justify-between items-center">
          <div className="relative w-[300px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="Search by Product or Ref..." 
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
                <th className="px-6 py-4 font-semibold">Movement ID</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold text-right">Qty</th>
                <th className="px-6 py-4 font-semibold">Reference</th>
                <th className="px-6 py-4 font-semibold">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {mockMovements.map((item) => (
                <tr key={item.id} className="hover:bg-[#fcfcfc]">
                  <td className="px-6 py-4 font-medium text-[#111827]">{item.id}</td>
                  <td className="px-6 py-4 text-[#6b7280]">{item.date}</td>
                  <td className="px-6 py-4 font-medium">{item.product}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-bold ${getTypeStyle(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${item.quantity.startsWith('+') ? 'text-[#059669]' : item.quantity.startsWith('-') ? 'text-[#dc2626]' : 'text-[#ea580c]'}`}>
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-[#07ac57] cursor-pointer hover:underline font-medium">{item.ref}</td>
                  <td className="px-6 py-4 text-[#6b7280]">{item.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
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

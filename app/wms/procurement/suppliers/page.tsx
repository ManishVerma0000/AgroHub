"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockSuppliers = [
    { id: "V-1001", name: "AgroFarms Ltd.", contact: "Vivek Sharma", phone: "+91 9876543210", categories: "Grains, Pulses", lastOrder: "15 Oct 2026", status: "Active" },
    { id: "V-1002", name: "PureOils Central", contact: "Anita R.", phone: "+91 8765432109", categories: "Oils", lastOrder: "18 Oct 2026", status: "Active" },
    { id: "V-1003", name: "Spices Connect", contact: "Mohit D.", phone: "+91 7654321098", categories: "Spices", lastOrder: "02 Oct 2026", status: "Evaluation" },
    { id: "V-1004", name: "SweetRoots Co.", contact: "Priya Singh", phone: "+91 6543210987", categories: "Sweeteners", lastOrder: "20 Oct 2026", status: "Active" }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Suppliers Directory</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage all your verified suppliers and vendors.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#07ac57] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <PlusIcon className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
        <div className="p-4 border-b border-[#f3f4f6] flex justify-between items-center bg-[#fcfcfc]">
          <div className="relative w-[300px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="Search by ID, Name or Contact..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57]"
            />
          </div>
          <button className="p-2 border border-[#e2e8f0] rounded-lg text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb]">
            <FilterIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f9fafb] text-[#6b7280] font-medium border-b border-[#f3f4f6]">
              <tr>
                <th className="px-6 py-4 font-semibold">Supplier ID</th>
                <th className="px-6 py-4 font-semibold">Business Name</th>
                <th className="px-6 py-4 font-semibold">Contact Person</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Provides</th>
                <th className="px-6 py-4 font-semibold">Last Order</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {mockSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-[#fcfcfc]">
                  <td className="px-6 py-4 font-medium text-[#111827]">{supplier.id}</td>
                  <td className="px-6 py-4 font-semibold text-[#07ac57] cursor-pointer hover:underline">{supplier.name}</td>
                  <td className="px-6 py-4 text-[#6b7280]">{supplier.contact}</td>
                  <td className="px-6 py-4 text-[#6b7280]">{supplier.phone}</td>
                  <td className="px-6 py-4 flex flex-wrap gap-1">
                    {supplier.categories.split(',').map((cat, i) => (
                      <span key={i} className="px-2 py-0.5 border border-[#e2e8f0] rounded bg-[#f8fafc] text-xs text-[#475569]">{cat.trim()}</span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-[#6b7280]">{supplier.lastOrder}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                      supplier.status === 'Active' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fff7ed] text-[#ea580c]'
                    }`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#6b7280] hover:text-[#07ac57] transition-colors font-medium">Edit</button>
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

"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function PurchasePlanning() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockPlanning = [
    { id: 1, product: "Organic Toor Dal", stock: 150, reorder: 200, leadTime: "3 Days", avgDailyScale: 25, suggested: 300, supplier: "AgroFarms Ltd." },
    { id: 2, product: "Cold Pressed Mustard Oil", stock: 120, reorder: 150, leadTime: "5 Days", avgDailyScale: 15, suggested: 250, supplier: "PureOils Central" },
    { id: 3, product: "Organic Jaggery", stock: 20, reorder: 50, leadTime: "2 Days", avgDailyScale: 10, suggested: 100, supplier: "SweetRoots Co." }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Purchase Planning</h1>
          <p className="text-sm text-[#6b7280] mt-1">Smart replenishment suggestions based on current stock and run rates.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#07ac57] text-white rounded-lg text-sm font-medium hover:opacity-90">
          <FilePlusIcon className="w-4 h-4" />
          Generate Bulk PO
        </button>
      </div>

      <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
        <div className="p-4 border-b border-[#f3f4f6] flex justify-between items-center bg-[#fffbfa]">
          <div className="flex items-center gap-2 text-[#ea580c] font-semibold text-sm">
            <AlertIcon className="w-5 h-5" />
            3 Products require immediate replenishment
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f9fafb] text-[#6b7280] font-medium border-b border-[#f3f4f6]">
              <tr>
                <th className="px-6 py-4 font-semibold pb-4">
                  <input type="checkbox" className="rounded text-[#07ac57]" />
                </th>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold text-right">Current Stock</th>
                <th className="px-6 py-4 font-semibold text-right">Reorder Level</th>
                <th className="px-6 py-4 font-semibold text-right">Lead Time</th>
                <th className="px-6 py-4 font-semibold text-right">Velocity/Day</th>
                <th className="px-6 py-4 font-semibold text-right">Suggested Qty</th>
                <th className="px-6 py-4 font-semibold">Primary Supplier</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {mockPlanning.map((item) => (
                <tr key={item.id} className="hover:bg-[#fcfcfc]">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded text-[#07ac57]" />
                  </td>
                  <td className="px-6 py-4 font-medium text-[#111827]">{item.product}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#ef4444]">{item.stock}</td>
                  <td className="px-6 py-4 text-right text-[#6b7280]">{item.reorder}</td>
                  <td className="px-6 py-4 text-right text-[#6b7280]">{item.leadTime}</td>
                  <td className="px-6 py-4 text-right">{item.avgDailyScale}</td>
                  <td className="px-6 py-4 text-right">
                    <input 
                      type="number" 
                      defaultValue={item.suggested} 
                      className="w-20 px-2 py-1 border border-[#e2e8f0] rounded text-right outline-none focus:border-[#07ac57]"
                    />
                  </td>
                  <td className="px-6 py-4 text-[#6b7280]">{item.supplier}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm px-3 py-1.5 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] font-medium rounded transition-colors">
                      Create PO
                    </button>
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

function FilePlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16h16V8l-6-6z"/>
      <path d="M14 3v5h5M12 18v-6M9 15h6"/>
    </svg>
  );
}

function AlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

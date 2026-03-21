"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function PickingPage() {
  const mockPickingTasks = [
    { id: "ORD-9923", customer: "Nature's Basket", priority: "High", items: [
      { name: "Premium Basmati Rice - 5kg", qty: 2, location: "A-12", picked: false },
      { name: "Organic Toor Dal - 1kg", qty: 5, location: "B-04", picked: false },
      { name: "Cold Pressed Mustard Oil - 1L", qty: 3, location: "C-01", picked: false },
    ] },
    { id: "ORD-9924", customer: "Local Kirana Store", priority: "Normal", items: [
      { name: "Whole Wheat Atta - 10kg", qty: 1, location: "A-01", picked: false },
      { name: "Organic Jaggery - 500g", qty: 2, location: "D-15", picked: false },
    ] }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Combined Picking System</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage active picking routes and assignments for warehouse staff.</p>
        </div>
        <div className="flex bg-[#f3f4f6] p-1 rounded-lg">
           <button className="px-4 py-1.5 bg-white text-[#111827] text-sm font-medium rounded shadow-sm">Active (2)</button>
           <button className="px-4 py-1.5 text-[#6b7280] hover:text-[#111827] text-sm font-medium rounded transition-colors">Completed (14)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockPickingTasks.map((task) => (
          <div key={task.id} className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#f3f4f6] bg-[#fcfcfc] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-[#111827] text-lg">{task.id}</h2>
                  {task.priority === 'High' && (
                    <span className="px-2 py-0.5 bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] rounded text-[10px] font-bold uppercase tracking-wider">High Priority</span>
                  )}
                </div>
                <p className="text-sm text-[#475569]">Customer: <span className="font-medium text-[#111827]">{task.customer}</span></p>
              </div>
              <button className="text-sm text-[#07ac57] font-medium hover:underline">Print Pick List</button>
            </div>
            
            <div className="p-0">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f9fafb] text-[#6b7280] font-medium border-b border-[#f3f4f6]">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-10"></th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold w-full">Item Name</th>
                    <th className="px-4 py-3 font-semibold text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {task.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#f8fafc] group">
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" className="w-4 h-4 rounded text-[#07ac57] cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569] text-xs font-medium">
                          {item.location}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#111827] whitespace-normal break-words max-w-[200px]">{item.name}</td>
                      <td className="px-4 py-3 text-right font-bold text-[#111827]">x{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#f3f4f6] flex justify-end">
              <button className="px-6 py-2 bg-[#07ac57] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Complete Picking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

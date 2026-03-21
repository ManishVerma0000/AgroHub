"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function PackingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockPackingTasks = [
    { id: "ORD-9923", customer: "Nature's Basket", priority: "High", items: 3, weight: "6.5kg", pickedBy: "Rajesh K.", status: "In Packing" },
    { id: "ORD-9924", customer: "Local Kirana Store", priority: "Normal", items: 2, weight: "10.5kg", pickedBy: "Arun V.", status: "Waiting to Pack" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Packing Module</h1>
          <p className="text-sm text-[#6b7280] mt-1">Verify picked items, pack them into boxes, and generate shipping labels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Packing Queue */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white border text-center border-[#f3f4f6] rounded-xl shadow-sm p-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#f2fcf6] text-[#07ac57] rounded-full flex items-center justify-center mb-4">
              <ScanIcon className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#111827] mb-1">Scan to Pack</h2>
            <p className="text-[#6b7280] text-sm mb-4">Scan the order barcode from the pick list.</p>
            
            <input 
              type="text" 
              placeholder="Order ID..." 
              className="w-full border border-[#e2e8f0] rounded-lg px-4 py-2 outline-none focus:border-[#07ac57] text-center"
            />
          </div>

          <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#f3f4f6] bg-[#fcfcfc] flex items-center gap-2">
              <h2 className="font-bold text-[#111827]">Packing Queue</h2>
              <span className="px-2 py-0.5 bg-[#f1f5f9] text-[#475569] text-xs font-bold rounded-full">{mockPackingTasks.length}</span>
            </div>
            <div className="p-0 divide-y divide-[#f3f4f6]">
              {mockPackingTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-[#f8fafc] cursor-pointer transition-colors border-l-4 border-transparent hover:border-[#07ac57] flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#111827]">{task.id}</h3>
                    {task.priority === 'High' && (
                      <span className="px-2 py-0.5 bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] rounded text-[10px] font-bold uppercase tracking-wider">High</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#6b7280]">
                    <span>{task.items} Items</span>
                    <span>~{task.weight}</span>
                  </div>
                  <div className="text-xs text-[#94a3b8]">Picked by: {task.pickedBy}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Packing */}
        <div className="lg:col-span-2 bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
          <div className="p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ecfdf5] text-[#059669] rounded-lg border border-[#a7f3d0] flex items-center justify-center">
                  <BoxIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#111827]">ORD-9923</h2>
                  <p className="text-[#6b7280]">Nature's Basket</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#f9fafb]">Hold Order</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <p className="text-xs font-semibold uppercase text-[#94a3b8] mb-1">Total Items to Pack</p>
                <p className="text-2xl font-bold text-[#111827]">3</p>
              </div>
              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <p className="text-xs font-semibold uppercase text-[#94a3b8] mb-1">Est. Weight</p>
                <p className="text-2xl font-bold text-[#111827]">6.5 kg</p>
              </div>
            </div>

            <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
              <div className="p-3 bg-[#f8fafc] border-b border-[#e2e8f0] font-semibold text-sm text-[#475569]">Items Verification</div>
              <table className="w-full text-left text-sm whitespace-nowrap">
                <tbody className="divide-y divide-[#f3f4f6]">
                  <tr className="bg-[#fcfcfc]">
                    <td className="px-4 py-3 w-10 text-center"><span className="text-[#059669] font-bold">1.</span></td>
                    <td className="px-4 py-3 font-medium text-[#111827]">Premium Basmati Rice - 5kg</td>
                    <td className="px-4 py-3 text-right">x2</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-[#ecfdf5] text-[#059669] text-xs font-bold rounded">Packed</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 w-10 text-center"><span className="text-[#94a3b8] font-bold">2.</span></td>
                    <td className="px-4 py-3 font-medium text-[#111827]">Organic Toor Dal - 1kg</td>
                    <td className="px-4 py-3 text-right">x5</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-[#f1f5f9] text-[#64748b] text-xs font-bold rounded">Pending Scan</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 w-10 text-center"><span className="text-[#94a3b8] font-bold">3.</span></td>
                    <td className="px-4 py-3 font-medium text-[#111827]">Cold Pressed Mustard Oil - 1L</td>
                    <td className="px-4 py-3 text-right">x3</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-[#f1f5f9] text-[#64748b] text-xs font-bold rounded">Pending Scan</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-auto border-t border-[#f3f4f6] pt-6 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#111827]">Box Type: <span className="text-[#07ac57]">Medium Corrugated (30x30x30)</span></span>
              </div>
              <button disabled className="px-8 py-3 bg-[#e2e8f0] text-[#94a3b8] rounded-lg font-bold cursor-not-allowed">
                Mark Packed & Print Label
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
      <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
      <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
    </svg>
  );
}

function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
}

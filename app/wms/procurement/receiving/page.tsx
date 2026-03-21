"use client";

import React, { useState } from "react";
import { SVGProps } from "react";
import Link from "next/link";

export default function POReceivingPage() {
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <h1 className="text-[26px] font-bold text-[#1e293b]">PO Receiving</h1>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#64748b]" />
            28 Feb 24 - 31 Mar 25
            <ChevronDownIcon className="w-4 h-4 text-[#64748b]" />
          </button>
          
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pending to Receive Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[17px] font-bold text-[#0f172a]">Pending to Receive</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {/* Active Pending Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <Link href="/wms/procurement/orders/PO-002" className="text-[#2563eb] font-semibold hover:underline">
                PO-002
              </Link>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#fefce8] text-[#ca8a04] text-[11px] font-bold">
                Pending
              </span>
            </div>
            
            <div className="flex flex-col gap-1 mb-4">
              <h3 className="text-[#0f172a] font-bold text-[15px]">Green Valley Suppliers</h3>
              <span className="text-[#64748b] text-xs">Expected: 15 Mar 2024</span>
            </div>
            
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <span className="text-[#475569] text-sm">1 items</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffedd5] text-[#ea580c] text-[11px] font-semibold">
                  1 pending
                </span>
              </div>
              <span className="text-[#0f172a] font-bold">₹8,500</span>
            </div>
            
            <button 
              onClick={() => setShowReceiveModal(true)}
              className="w-full py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg transition-colors text-sm shadow-sm mt-auto"
            >
              Receive Stock
            </button>
          </div>

        </div>
      </div>

      {/* Recently Received Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[17px] font-bold text-[#0f172a]">Recently Received</h2>
        
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-6 py-4">PO ID</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Planned Amount</th>
                  <th className="px-6 py-4">Actual Amount</th>
                  <th className="px-6 py-4">Variance</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-4">
                    <Link href="/wms/procurement/orders/PO-001" className="text-[#2563eb] font-semibold hover:underline">
                      PO-001
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-[#0f172a] font-medium">Fresh Farms Ltd</td>
                  <td className="px-6 py-4 text-[#64748b]">10 Mar 2024</td>
                  <td className="px-6 py-4 text-[#475569]">2 items</td>
                  <td className="px-6 py-4 text-[#0f172a] font-bold">₹15,000</td>
                  <td className="px-6 py-4 text-[#16a34a] font-bold">₹15,200</td>
                  <td className="px-6 py-4 text-[#ef4444] font-bold">+₹200 <span className="text-xs ml-0.5">(+1.3%)</span></td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#dcfce7] text-[#16a34a] text-[11px] font-bold">
                       Completed
                     </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Receive Purchase Order Modal Overlay */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#e2e8f0]">
              <div className="flex flex-col">
                <h2 className="text-[20px] font-bold text-[#0f172a]">Receive Purchase Order</h2>
                <span className="text-sm text-[#64748b] mt-0.5">PO-002 - Green Valley Suppliers - Expected: 15 Mar 2024</span>
              </div>
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="text-[#64748b] hover:text-[#0f172a] transition-colors p-1"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-[#fafafa]">
              
              {/* Instructions Banner */}
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-4 text-sm text-[#1e40af]">
                <span className="font-bold">Instructions:</span> Enter the quantity received and actual procurement price for each item. Leave quantity as 0 for items not received. The system will update inventory and create stock movement records.
              </div>

              {/* Editable Receiving Form Block */}
              <div className="flex flex-col border border-[#e2e8f0] rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                      <tr>
                        <th className="px-5 py-4">Product</th>
                        <th className="px-5 py-4">Ordered</th>
                        <th className="px-5 py-4">Already Received</th>
                        <th className="px-5 py-4">Remaining</th>
                        <th className="px-5 py-4">Receive Qty<span className="text-[#94a3b8]">*</span></th>
                        <th className="px-5 py-4">Actual Price<span className="text-[#94a3b8]">*</span></th>
                        <th className="px-5 py-4 text-right">Line Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      <tr className="bg-[#f0fdf4]/30">
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#0f172a]">Onion</span>
                            <span className="text-xs text-[#64748b]">Kg</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#0f172a] font-semibold">150</td>
                        <td className="px-5 py-4 text-[#475569]">0</td>
                        <td className="px-5 py-4 text-[#ea580c] font-bold">150</td>
                        <td className="px-5 py-4">
                          <input type="number" defaultValue={150} className="w-full max-w-[120px] px-3 py-2 border border-[#cbd5e1] rounded-md text-sm outline-none focus:border-[#16a34a] bg-white transition-colors" />
                        </td>
                        <td className="px-5 py-4">
                          <input type="number" defaultValue={55} className="w-full max-w-[120px] px-3 py-2 border border-[#cbd5e1] rounded-md text-sm outline-none focus:border-[#16a34a] bg-white transition-colors" />
                        </td>
                        <td className="px-5 py-4 font-bold text-[#0f172a] text-right">₹8,250</td>
                      </tr>
                    </tbody>
                    <tfoot className="border-t border-[#e2e8f0] bg-white">
                      <tr>
                        <td colSpan={5}></td>
                        <td className="px-5 py-4 font-bold text-[#475569] text-right">Total Amount:</td>
                        <td className="px-5 py-4 font-bold text-[#0f172a] text-[15px] text-right">₹8,250</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Receiving Summary Stats */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm mt-2">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">Receiving Summary</h3>
                <div className="grid grid-cols-4 gap-8">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] text-[#64748b]">Items to Receive</span>
                    <span className="font-bold text-[#2563eb] text-[15px]">1</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] text-[#64748b]">Total Quantity</span>
                    <span className="font-bold text-[#0f172a] text-[15px]">150</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] text-[#64748b]">Total Amount</span>
                    <span className="font-bold text-[#16a34a] text-[15px]">₹8,250</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="px-6 py-2.5 border border-[#cbd5e1] text-[#0f172a] font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg transition-colors text-sm shadow-sm"
              >
                Confirm Receiving
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Icons
function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function MoreVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="12" cy="5" r="1"/>
      <circle cx="12" cy="19" r="1"/>
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

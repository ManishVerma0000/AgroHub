"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function POReceivingPage() {
  const mockPendingReceiving = [
    { poNumber: "PO-2044", supplier: "PureOils Central", expected: "22 Oct 2026", items: 2, qty: 150 },
    { poNumber: "PO-2050", supplier: "AgroFarms Ltd.", expected: "Today", items: 5, qty: 1200 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">PO Receiving</h1>
          <p className="text-sm text-[#6b7280] mt-1">Scan and record incoming shipments against Purchase Orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Deliveries */}
        <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#f3f4f6] bg-[#fcfcfc] flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-[#07ac57]" />
            <h2 className="font-bold text-[#111827]">Pending to Receive</h2>
          </div>
          
          <div className="p-4 flex flex-col gap-4">
            {mockPendingReceiving.map((po) => (
              <div key={po.poNumber} className="border border-[#e2e8f0] rounded-lg p-4 hover:border-[#07ac57] transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-[#111827] text-lg">{po.poNumber}</h3>
                    <p className="text-sm text-[#475569]">{po.supplier}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${po.expected === 'Today' ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
                    Expected: {po.expected}
                  </span>
                </div>
                
                <div className="flex justify-between items-end border-t border-[#f3f4f6] pt-3">
                  <div className="text-sm text-[#6b7280]">
                    <span className="font-medium text-[#111827]">{po.items}</span> Items | <span className="font-medium text-[#111827]">{po.qty}</span> Units
                  </div>
                  <button className="px-4 py-1.5 bg-[#07ac57] text-white rounded text-sm font-medium hover:opacity-90">
                    Receive Stock
                  </button>
                </div>
              </div>
            ))}
            
            {mockPendingReceiving.length === 0 && (
              <div className="text-center py-8 text-[#94a3b8] flex flex-col items-center">
                <BoxIcon className="w-12 h-12 mb-2 opacity-30" />
                <p>No shipments pending delivery today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Scan & Manual Entry placeholder */}
        <div className="bg-white border text-center border-[#f3f4f6] rounded-xl shadow-sm p-8 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-[#f2fcf6] text-[#07ac57] rounded-full flex items-center justify-center mb-6">
            <ScanIcon className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-[#111827] mb-2">Scan Shipment Barcode</h2>
          <p className="text-[#6b7280] mb-8 max-w-[300px]">Use barcode scanner or manually enter the PO number to begin receiving items.</p>
          
          <div className="flex w-full max-w-[350px]">
            <input 
              type="text" 
              placeholder="Enter PO Number..." 
              className="flex-1 border border-[#e2e8f0] rounded-l-lg px-4 py-3 outline-none focus:border-[#07ac57]"
            />
            <button className="bg-[#07ac57] text-white px-6 py-3 rounded-r-lg font-medium hover:opacity-90">
              Find
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
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

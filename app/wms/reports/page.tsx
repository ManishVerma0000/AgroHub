"use client";

import React, { SVGProps } from "react";

const inventoryReports = [
  { id: "REP-01", title: "Current Stock Report", desc: "Complete inventory status", generated: "16 Mar 2024" },
  { id: "REP-02", title: "Low Stock Report", desc: "Products below reorder level", generated: "16 Mar 2024" },
  { id: "REP-03", title: "Inventory Valuation", desc: "Total inventory value", generated: "15 Mar 2024" },
  { id: "REP-04", title: "Wastage Report", desc: "Product wastage analysis", generated: "15 Mar 2024" }
];

const procurementReports = [
  { id: "REP-05", title: "Purchase Order Summary", desc: "Overview of all purchase orders", generated: "16 Mar 2024" },
  { id: "REP-06", title: "Supplier Performance", desc: "Metrics on supplier delivery", generated: "14 Mar 2024" },
  { id: "REP-07", title: "Cost Variation Analysis", desc: "Track procurement cost changes", generated: "10 Mar 2024" }
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] font-bold text-[#0f172a]">Reports & Analytics</h1>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-[14px] font-medium rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm tracking-tight">
            <CalendarIcon className="w-4 h-4 text-[#64748b]" />
            28 Feb 24 - 31 Mar 25
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Group 1: Inventory Reports */}
      <div className="flex flex-col gap-5">
         
         {/* Category Header */}
         <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] bg-[#3b82f6] rounded flex items-center justify-center text-white shadow-sm shrink-0">
               <BoxIcon className="w-5 h-5" />
            </div>
            <h2 className="text-[17px] font-bold text-[#0f172a] tracking-tight">Inventory Reports</h2>
         </div>

         {/* Grid Cards Array */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inventoryReports.map((report) => (
              <div key={report.id} className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col pt-6">
                 
                 {/* Metadata Stack */}
                 <div className="flex flex-col gap-1 mb-6 flex-1">
                    <span className="text-[#0f172a] font-bold text-[15px]">{report.title}</span>
                    <span className="text-[#64748b] text-[13px]">{report.desc}</span>
                    <span className="text-[#94a3b8] text-[12px] mt-3">Last generated: {report.generated}</span>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex gap-3">
                    <button className="flex-1 py-2.5 border border-[#e2e8f0] text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] rounded-lg font-bold text-[13.5px] transition-colors shadow-sm flex items-center justify-center gap-2">
                       <FileIcon className="w-4 h-4 text-[#94a3b8]" />
                       View
                    </button>
                    <button className="flex-1 right-btn py-2.5 bg-[#16a34a] text-white hover:bg-[#15803d] rounded-lg font-bold text-[13.5px] transition-colors shadow-sm flex items-center justify-center gap-2">
                       <DownloadIcon className="w-4 h-4" />
                       Download
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Group 2: Procurement Reports */}
      <div className="flex flex-col gap-5">
         
         {/* Category Header */}
         <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] bg-[#a855f7] rounded flex items-center justify-center text-white shadow-sm shrink-0">
               <ShoppingCartIcon className="w-5 h-5" />
            </div>
            <h2 className="text-[17px] font-bold text-[#0f172a] tracking-tight">Procurement Reports</h2>
         </div>

         {/* Grid Cards Array */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {procurementReports.map((report) => (
              <div key={report.id} className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col pt-6">
                 
                 {/* Metadata Stack */}
                 <div className="flex flex-col gap-1 mb-6 flex-1">
                    <span className="text-[#0f172a] font-bold text-[15px]">{report.title}</span>
                    <span className="text-[#64748b] text-[13px]">{report.desc}</span>
                    <span className="text-[#94a3b8] text-[12px] mt-3">Last generated: {report.generated}</span>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex gap-3">
                    <button className="flex-1 py-2.5 border border-[#e2e8f0] text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] rounded-lg font-bold text-[13.5px] transition-colors shadow-sm flex items-center justify-center gap-2">
                       <FileIcon className="w-4 h-4 text-[#94a3b8]" />
                       View
                    </button>
                    <button className="flex-1 right-btn py-2.5 bg-[#16a34a] text-white hover:bg-[#15803d] rounded-lg font-bold text-[13.5px] transition-colors shadow-sm flex items-center justify-center gap-2">
                       <DownloadIcon className="w-4 h-4" />
                       Download
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

    </div>
  );
}

// Inline SVGs
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

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
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

function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function ShoppingCartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function FileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
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

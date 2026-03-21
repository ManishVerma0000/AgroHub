"use client";

import React from "react";
import Link from "next/link";
import { SVGProps } from "react";

const mockPackingList = [
  { id: "ORD-002", customer: "XYZ Hotel", initial: "X", avatarBg: "bg-[#0d9488]", items: "8 items", location: "Pune", date: "18 Mar 2024", status: "Packing" },
  { id: "ORD-003", customer: "Fresh Mart", initial: "F", avatarBg: "bg-[#0ea5e9]", items: "12 items", location: "Delhi", date: "17 Mar 2024", status: "Packing" },
  { id: "ORD-004", customer: "Green Grocers", initial: "G", avatarBg: "bg-[#10b981]", items: "6 items", location: "Bangalore", date: "17 Mar 2024", status: "Packed" }
];

export default function PackingListPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-[26px] font-bold text-[#0f172a]">Packing Module</h1>
          <span className="text-[#64748b] text-[20px] font-medium mr-1">3</span>
          <ChevronDownIcon className="w-5 h-5 text-[#64748b]" />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#64748b]" />
            28 Feb 24 - 31 Mar 25
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metric Dashboards Stack */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Ready to Pack</span>
          <span className="text-[#f97316] text-[32px] font-bold leading-none">2</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">In Packing</span>
          <span className="text-[#ea580c] text-[32px] font-bold leading-none">2</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Packed Today</span>
          <span className="text-[#16a34a] text-[32px] font-bold leading-none">3</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Avg Packing Time</span>
          <span className="text-[#0f172a] text-[32px] font-bold leading-none">12 min</span>
        </div>

      </div>

      {/* Main Table Payload Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4">ORDER ID</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">ITEMS</th>
                <th className="px-6 py-4">LOCATION</th>
                <th className="px-6 py-4">ORDER DATE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {mockPackingList.map((order) => (
                <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-5">
                    <Link href={`/wms/orders/packing`} className="text-[#2563eb] font-semibold hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[13px] ${order.avatarBg} shadow-sm`}>
                        {order.initial}
                      </div>
                      <span className="text-[#0f172a] font-medium text-[14px]">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[#475569]">
                    <span className="inline-flex items-center gap-1.5">
                      <CubeIcon className="w-4 h-4 text-[#94a3b8]" />
                      {order.items}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[#475569]">{order.location}</td>
                  <td className="px-6 py-5 text-[#475569]">{order.date}</td>
                  <td className="px-6 py-5">
                    {order.status === "Packing" ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#ffedd5] text-[#ea580c] text-[12px] font-bold">
                        {order.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dcfce3] text-[#16a34a] text-[12px] font-bold">
                        <CheckIcon className="w-3.5 h-3.5" />
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {order.status === "Packing" ? (
                      <button className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-lg transition-colors text-[13px] shadow-sm">
                        Mark Packed
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-white border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc] font-bold rounded-lg transition-colors text-[13px] shadow-sm">
                        View Details
                      </button>
                    )}
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

// Inline SVG Icons
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

function CubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21 16-9 5-9-5V8l9-5 9 5z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

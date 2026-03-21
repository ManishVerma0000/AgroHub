"use client";

import React from "react";
import Link from "next/link";
import { SVGProps } from "react";

// Mock Data reproducing Combined Picking System Figma screenshot
const mockPickingOrders = [
  { id: "ORD-002", customer: "XYZ Hotel", initial: "X", avatarBg: "bg-[#0d9488]", items: "8 items", location: "Pune", status: "Picking" },
];

export default function PickingOrdersPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-[26px] font-bold text-[#1e293b]">Combined Picking System</h1>
          <span className="text-[#64748b] text-[20px] font-medium mr-1">1</span>
          <ChevronDownIcon className="w-5 h-5 text-[#64748b]" />
        </div>
        
        <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
          <MoreVerticalIcon className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Metric Dashboards Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Ready to Pick */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Ready to Pick</span>
          <span className="text-[#d97706] text-[32px] font-bold leading-none">0</span>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">In Progress</span>
          <span className="text-[#2563eb] text-[32px] font-bold leading-none">1</span>
        </div>

        {/* Completed Today */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Completed Today</span>
          <span className="text-[#16a34a] text-[32px] font-bold leading-none">4</span>
        </div>

      </div>

      {/* Main Table Payload Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* Isolated Section Header */}
        <div className="px-6 py-5 border-b border-[#e2e8f0]">
          <h2 className="text-[17px] font-bold text-[#0f172a]">Today's Picking Orders</h2>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4">ORDER ID</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">ITEMS</th>
                <th className="px-6 py-4">LOCATION</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {mockPickingOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-6">
                    <Link href={`/wms/orders/${order.id}`} className="text-[#2563eb] font-semibold hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[13px] ${order.avatarBg} shadow-sm`}>
                        {order.initial}
                      </div>
                      <span className="text-[#0f172a] font-semibold">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[#475569]">{order.items}</td>
                  <td className="px-6 py-6 text-[#475569]">{order.location}</td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eff6ff] text-[#2563eb] text-[13px] font-bold">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <button className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-lg transition-colors text-sm shadow-sm inline-flex justify-center items-center">
                      Complete Picking
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

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

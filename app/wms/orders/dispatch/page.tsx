"use client";

import React from "react";
import Link from "next/link";
import { SVGProps } from "react";

const mockReadyOrders = [
  { id: "ORD-2024-0145", customer: "Fresh Mart Ltd", location: "Mumbai Central", items: "12 items", status: "Packed" },
  { id: "ORD-2024-0146", customer: "Green Valley", location: "Dadar West", items: "8 items", status: "Packed" },
  { id: "ORD-2024-0147", customer: "Nature's Basket", location: "Bandra", items: "15 items", status: "Packed" }
];

const mockDispatchHistory = [
  { id: "DIS-2024-045", vehicle: "MH-02-AB-1234", driver: "Ramesh Kumar", orders: "8 orders", route: "Mumbai Central Route", time: "11:00 AM", status: "Out for Delivery" },
  { id: "DIS-2024-044", vehicle: "MH-02-CD-5678", driver: "Suresh Patil", orders: "6 orders", route: "Pune Highway", time: "09:30 AM", status: "Delivered" },
  { id: "DIS-2024-043", vehicle: "MH-02-EF-9012", driver: "Vijay Singh", orders: "10 orders", route: "Thane-Kalyan", time: "08:00 AM", status: "Delivered" }
];

export default function DispatchManagementPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <h1 className="text-[26px] font-bold text-[#0f172a]">Dispatch Management</h1>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#64748b]" />
            28 Feb 24 - 31 Mar 25
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-lg transition-colors text-sm shadow-sm">
            <PlusIcon className="w-4 h-4" />
            New
          </button>
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metric Dashboards Stack */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Ready for Dispatch</span>
          <span className="text-[#d97706] text-[32px] font-bold leading-none">12</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Out for Delivery</span>
          <span className="text-[#2563eb] text-[32px] font-bold leading-none">8</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Delivered Today</span>
          <span className="text-[#16a34a] text-[32px] font-bold leading-none">45</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Active Vehicles</span>
          <span className="text-[#0f172a] text-[32px] font-bold leading-none">6</span>
        </div>

      </div>

      {/* List 1: Ready for Dispatch */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[18px] font-bold text-[#0f172a]">Ready for Dispatch</h2>
        
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb]" />
                  </th>
                  <th className="px-6 py-4">ORDER ID</th>
                  <th className="px-6 py-4">CUSTOMER</th>
                  <th className="px-6 py-4">LOCATION</th>
                  <th className="px-6 py-4">ITEMS</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {mockReadyOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-5">
                      <input type="checkbox" className="w-4 h-4 rounded border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb]" />
                    </td>
                    <td className="px-6 py-5">
                      <Link href={`/wms/orders/${order.id}`} className="text-[#2563eb] font-semibold hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-[#0f172a] font-medium">{order.customer}</td>
                    <td className="px-6 py-5 text-[#475569]">
                      <span className="inline-flex items-center gap-1.5">
                        <PinIcon className="w-4 h-4 text-[#94a3b8]" />
                        {order.location}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[#475569]">{order.items}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dcfce3] text-[#16a34a] text-[12px] font-bold">
                        <CheckIcon className="w-3.5 h-3.5" />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-[#e2e8f0]">
             <button className="px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-lg transition-colors text-sm shadow-sm">
               Create Dispatch Batch
             </button>
          </div>
        </div>
      </div>

      {/* List 2: Dispatch History */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[18px] font-bold text-[#0f172a]">Dispatch History</h2>
        
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-6 py-4">DISPATCH ID</th>
                  <th className="px-6 py-4">VEHICLE</th>
                  <th className="px-6 py-4">DRIVER</th>
                  <th className="px-6 py-4">ORDERS</th>
                  <th className="px-6 py-4">ROUTE</th>
                  <th className="px-6 py-4">DISPATCH TIME</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {mockDispatchHistory.map((dispatch, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-5">
                      <Link href={`/wms/orders/dispatch`} className="text-[#2563eb] font-semibold hover:underline">
                        {dispatch.id}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-[#0f172a] font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <TruckIcon className="w-4 h-4 text-[#94a3b8]" />
                        {dispatch.vehicle}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[#475569]">{dispatch.driver}</td>
                    <td className="px-6 py-5 text-[#475569]">{dispatch.orders}</td>
                    <td className="px-6 py-5 text-[#475569]">{dispatch.route}</td>
                    <td className="px-6 py-5 text-[#475569]">
                      <span className="inline-flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4 text-[#94a3b8]" />
                        {dispatch.time}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {dispatch.status === "Out for Delivery" ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#eff6ff] text-[#2563eb] text-[12px] font-bold">
                          {dispatch.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dcfce3] text-[#16a34a] text-[12px] font-bold">
                          <CheckIcon className="w-3.5 h-3.5" />
                          {dispatch.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <Link href={`/wms/orders/dispatch/${dispatch.id}`} className="inline-flex text-[#64748b] hover:text-[#0f172a] transition-colors p-1">
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
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

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );
}

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
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

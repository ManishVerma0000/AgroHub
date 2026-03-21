"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockDispatchOrders = [
    { id: "ORD-9921", customer: "Reliance Smart", location: "Mumbai North", packages: 2, weight: "24kg", status: "Ready for Dispatch" },
    { id: "ORD-9915", customer: "D-Mart", location: "Pune Central", packages: 5, weight: "120kg", status: "Out for Delivery" },
    { id: "ORD-9910", customer: "More Supermarket", location: "Thane West", packages: 1, weight: "5kg", status: "Delivered Today" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Dispatch Management</h1>
          <p className="text-sm text-[#6b7280] mt-1">Assign orders to delivery partners and track outgoing shipments.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#07ac57] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <TruckIcon className="w-4 h-4" />
          Create Dispatch Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280] mb-1">Ready for Dispatch</p>
            <p className="text-3xl font-bold text-[#111827]">18</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#f2fcf6] flex flex-col items-center justify-center text-[#07ac57]">
            <BoxIcon className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280] mb-1">Out for Delivery</p>
            <p className="text-3xl font-bold text-[#111827]">12</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex flex-col items-center justify-center text-[#3b82f6]">
            <TruckIcon className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280] mb-1">Delivered Today</p>
            <p className="text-3xl font-bold text-[#111827]">45</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex flex-col items-center justify-center text-[#16a34a]">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
        <div className="p-4 border-b border-[#f3f4f6] flex justify-between items-center bg-[#fcfcfc]">
          <div className="relative w-[300px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57]"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-[#e2e8f0] rounded-lg text-sm px-3 py-2 outline-none text-[#475569] bg-white">
              <option>All Statuses</option>
              <option>Ready for Dispatch</option>
              <option>Out for Delivery</option>
            </select>
            <button className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#f9fafb]">Bulk Assign</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f9fafb] text-[#6b7280] font-medium border-b border-[#f3f4f6]">
              <tr>
                <th className="px-6 py-4 font-semibold pb-4">
                  <input type="checkbox" className="rounded text-[#07ac57]" />
                </th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Destination area</th>
                <th className="px-6 py-4 font-semibold text-right">Packages</th>
                <th className="px-6 py-4 font-semibold text-right">Total Weight</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Assign Partner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {mockDispatchOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fcfcfc]">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded text-[#07ac57]" />
                  </td>
                  <td className="px-6 py-4 font-bold text-[#111827] cursor-pointer hover:underline hover:text-[#07ac57]">{order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-[#6b7280]">{order.location}</td>
                  <td className="px-6 py-4 text-right">{order.packages} Box(es)</td>
                  <td className="px-6 py-4 text-right text-[#475569]">{order.weight}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border
                      ${order.status === 'Ready for Dispatch' ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]' 
                      : order.status === 'Out for Delivery' ? 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]'
                      : 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'Ready for Dispatch' ? (
                      <select className="border border-[#e2e8f0] rounded text-sm px-2 py-1.5 outline-none text-[#07ac57] font-medium w-[120px]">
                        <option>Assign...</option>
                        <option>Delhivery</option>
                        <option>Bluedart</option>
                        <option>Own Fleet</option>
                      </select>
                    ) : (
                      <span className="text-sm text-[#94a3b8] italic">Assigned</span>
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

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

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

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

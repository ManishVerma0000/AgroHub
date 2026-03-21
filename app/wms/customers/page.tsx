"use client";

import React, { SVGProps } from "react";
import Link from "next/link";

const mockCustomers = [
  { id: "CUST-001", initials: "F", name: "Fresh Mart Ltd", email: "contact@freshmart.com", phone: "+91 98765 43210", location: "Mumbai Central", orders: 45, spent: "₹156,780", lastOrder: "Mar 15, 2024", status: "Active", color: "bg-[#2dd4bf]" },
  { id: "CUST-002", initials: "G", name: "Green Valley", email: "info@greenvalley.com", phone: "+91 98765 43211", location: "Dadar West", orders: 32, spent: "₹98,450", lastOrder: "Mar 14, 2024", status: "Active", color: "bg-[#0d9488]" },
  { id: "CUST-003", initials: "N", name: "Nature's Basket", email: "orders@naturesbasket.com", phone: "+91 98765 43212", location: "Bandra", orders: 68, spent: "₹234,560", lastOrder: "Mar 16, 2024", status: "Active", color: "bg-[#06b6d4]" },
  { id: "CUST-004", initials: "O", name: "Organic Store", email: "contact@organicstore.com", phone: "+91 98765 43213", location: "Andheri", orders: 28, spent: "₹76,890", lastOrder: "Mar 10, 2024", status: "Active", color: "bg-[#0891b2]" },
  { id: "CUST-005", initials: "F", name: "Fresh Foods Co.", email: "info@freshfoods.com", phone: "+91 98765 43214", location: "Borivali", orders: 51, spent: "₹187,650", lastOrder: "Mar 13, 2024", status: "Active", color: "bg-[#0ea5e9]" },
  { id: "CUST-006", initials: "V", name: "Veggie Mart", email: "orders@veggiemart.com", phone: "+91 98765 43215", location: "Malad", orders: 19, spent: "₹54,320", lastOrder: "Mar 11, 2024", status: "Active", color: "bg-[#0284c7]" },
  { id: "CUST-007", initials: "G", name: "Green Basket", email: "contact@greenbasket.com", phone: "+91 98765 43216", location: "Goregaon", orders: 37, spent: "₹123,450", lastOrder: "Mar 12, 2024", status: "Active", color: "bg-[#10b981]" },
  { id: "CUST-008", initials: "F", name: "Farm Fresh", email: "info@farmfresh.com", phone: "+91 98765 43217", location: "Kandivali", orders: 24, spent: "₹67,890", lastOrder: "Feb 28, 2024", status: "Inactive", color: "bg-[#059669]" }
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-bold text-[#0f172a]">Customers</h1>
          <span className="text-[20px] font-medium text-[#94a3b8]">8</span>
          <ChevronDownIcon className="w-5 h-5 text-[#64748b] mt-1" />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#64748b]" />
            28 Feb 24 - 31 Mar 25
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center justify-center p-2.5 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 mb-2">
         <span className="text-[#64748b] text-[14px]">Filter by:</span>
         <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e2e8f0] bg-white text-[#0f172a] text-[14px] font-medium rounded-lg shadow-sm hover:bg-[#f8fafc] transition-colors">
            All Status
            <ChevronDownIcon className="w-4 h-4 text-[#64748b]" />
         </button>
      </div>

      {/* KPI Metric Dashboards Stack - 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
             <UsersIcon className="w-4 h-4 text-[#3b82f6]" />
             <span className="text-[13px] font-semibold tracking-tight">Total Customers</span>
          </div>
          <span className="text-[#0f172a] text-[28px] font-bold leading-none">8</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
             <ActivityIcon className="w-4 h-4 text-[#16a34a]" />
             <span className="text-[13px] font-semibold tracking-tight">Active Customers</span>
          </div>
          <span className="text-[#16a34a] text-[28px] font-bold leading-none">7</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
             <ShoppingCartIcon className="w-4 h-4 text-[#a855f7]" />
             <span className="text-[13px] font-semibold tracking-tight">Total Orders</span>
          </div>
          <span className="text-[#0f172a] text-[28px] font-bold leading-none">304</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
           <div className="flex items-center gap-2 text-[#64748b]">
             <TrendingUpIcon className="w-4 h-4 text-[#3b82f6]" />
             <span className="text-[13px] font-semibold tracking-tight">Total Revenue</span>
          </div>
          <span className="text-[#0f172a] text-[28px] font-bold leading-none">₹999,990</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
             <ShoppingCartIcon className="w-4 h-4 text-[#f97316]" />
             <span className="text-[13px] font-semibold tracking-tight">Avg Order Value</span>
          </div>
          <span className="text-[#0f172a] text-[28px] font-bold leading-none">₹3289</span>
        </div>

      </div>

      {/* Main Customers Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden w-full mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">CONTACT</th>
                <th className="px-6 py-4">LOCATION</th>
                <th className="px-6 py-4">TOTAL ORDERS</th>
                <th className="px-6 py-4">TOTAL SPENT</th>
                <th className="px-6 py-4">LAST ORDER</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${customer.color} text-white flex items-center justify-center font-bold text-[17px] shadow-sm shrink-0`}>
                        {customer.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#0f172a] font-bold text-[14px]">
                          {customer.name}
                        </span>
                        <span className="text-[#64748b] text-[12px]">{customer.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1 text-[13px] text-[#475569]">
                       <div className="flex items-center gap-1.5">
                         <MailIcon className="w-3.5 h-3.5 text-[#94a3b8]" />
                         {customer.email}
                       </div>
                       <div className="flex items-center gap-1.5 px-0.5">
                         <PhoneIcon className="w-3.5 h-3.5 text-[#94a3b8]" />
                         {customer.phone}
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[#475569]">
                    <span className="inline-flex items-center gap-1.5 tracking-tight text-[13px]">
                      <PinIcon className="w-4 h-4 text-[#94a3b8]" />
                      {customer.location}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[#0f172a] font-bold text-[14px]">{customer.orders}</td>
                  <td className="px-6 py-5 text-[#0f172a] font-bold text-[14px]">{customer.spent}</td>
                  <td className="px-6 py-5 text-[#475569] font-medium text-[13px]">{customer.lastOrder}</td>
                  <td className="px-6 py-5">
                    {customer.status === "Active" ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded bg-[#dcfce3]/50 text-[#16a34a] text-[12px] font-bold tracking-tight">
                        {customer.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded bg-[#fee2e2]/60 text-[#ef4444] text-[12px] font-bold tracking-tight">
                        {customer.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center items-center">
                       <button className="text-[#64748b] hover:text-[#0f172a] transition-colors p-1.5">
                         <EyeIcon className="w-[18px] h-[18px]" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-between items-center bg-white">
          <span className="text-[13px] text-[#64748b]">Showing 1 to 8 of 8 results</span>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1.5 border border-transparent text-[#64748b] hover:text-[#0f172a] text-[13px] font-semibold transition-colors disabled:opacity-50">
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#16a34a] text-white rounded text-[13px] font-bold shadow-sm">
              1
            </button>
            <button className="px-3 py-1.5 border border-transparent text-[#64748b] hover:text-[#0f172a] text-[13px] font-semibold transition-colors disabled:opacity-50">
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

// Inline SVGs
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

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function ActivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
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

function TrendingUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

"use client";

import React, { useState, useEffect, useCallback, SVGProps } from "react";
import Link from "next/link";
import { wmsCustomerService, WmsCustomer } from "../../../services/wmsCustomerService";
import { wmsAuthService } from "../../../services/wmsAuthService";

const avatarColors = ["bg-[#2dd4bf]", "bg-[#0d9488]", "bg-[#06b6d4]", "bg-[#0891b2]", "bg-[#0ea5e9]", "bg-[#0284c7]", "bg-[#10b981]", "bg-[#059669]", "bg-[#8b5cf6]", "bg-[#db2777]"];
const getAvatarBg = (name: string) => {
  if (!name) return avatarColors[0];
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<WmsCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('wmsToken');
      if (!token) return;
      const profile = await wmsAuthService.getProfile(token);
      const data = await wmsCustomerService.getByWarehouse(profile.id);
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching warehouse customers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = statusFilter === "All"
    ? customers
    : customers.filter((c) => c.status === statusFilter);

  const activeCount = customers.filter((c) => c.status === "Active").length;
  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">

      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-bold text-[#0f172a]">Customers</h1>
          {!loading && <span className="text-[20px] font-medium text-[#94a3b8]">{customers.length}</span>}
          <ChevronDownIcon className="w-5 h-5 text-[#64748b] mt-1" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm"
          >
            <RefreshIcon className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center justify-center p-2.5 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2">
        <span className="text-[#64748b] text-[14px]">Filter by:</span>
        {["All", "Active", "Inactive"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 border text-[14px] font-medium rounded-lg shadow-sm transition-colors ${
              statusFilter === s
                ? "bg-[#0f172a] text-white border-[#0f172a]"
                : "bg-white text-[#0f172a] border-[#e2e8f0] hover:bg-[#f8fafc]"
            }`}
          >
            {s} Status
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
            <UsersIcon className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-[13px] font-semibold tracking-tight">Total Customers</span>
          </div>
          <span className="text-[#0f172a] text-[28px] font-bold leading-none">
            {loading ? "—" : customers.length}
          </span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
            <ActivityIcon className="w-4 h-4 text-[#16a34a]" />
            <span className="text-[13px] font-semibold tracking-tight">Active Customers</span>
          </div>
          <span className="text-[#16a34a] text-[28px] font-bold leading-none">
            {loading ? "—" : activeCount}
          </span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
            <ShoppingCartIcon className="w-4 h-4 text-[#a855f7]" />
            <span className="text-[13px] font-semibold tracking-tight">Total Orders</span>
          </div>
          <span className="text-[#0f172a] text-[28px] font-bold leading-none">
            {loading ? "—" : totalOrders}
          </span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
            <TrendingUpIcon className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-[13px] font-semibold tracking-tight">Total Revenue</span>
          </div>
          <span className="text-[#0f172a] text-[28px] font-bold leading-none">
            {loading ? "—" : `₹${totalRevenue.toLocaleString("en-IN")}`}
          </span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#64748b]">
            <ShoppingCartIcon className="w-4 h-4 text-[#f97316]" />
            <span className="text-[13px] font-semibold tracking-tight">Avg Order Value</span>
          </div>
          <span className="text-[#0f172a] text-[28px] font-bold leading-none">
            {loading ? "—" : `₹${avgOrderValue.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden w-full mt-2">
        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center text-[#64748b]">
            <UsersIcon className="w-10 h-10 text-[#bfdbfe]" />
            <p className="font-semibold text-[#0f172a]">No customers found</p>
            <p className="text-[13px]">No customers have ordered from this warehouse yet.</p>
          </div>
        ) : (
          <>
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
                  {filtered.map((customer) => {
                    const displayName = customer.shopName || customer.ownerName || "Unknown";
                    const initial = displayName.charAt(0).toUpperCase();

                    return (
                      <tr key={customer.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${getAvatarBg(displayName)} text-white flex items-center justify-center font-bold text-[17px] shadow-sm shrink-0`}>
                              {initial}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[#0f172a] font-bold text-[14px]">{displayName}</span>
                              <span className="text-[#64748b] text-[12px]">{customer.ownerName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1 text-[13px] text-[#475569]">
                            <div className="flex items-center gap-1.5">
                              <PhoneIcon className="w-3.5 h-3.5 text-[#94a3b8]" />
                              {customer.mobileNumber}
                            </div>
                            {customer.shopType && customer.shopType !== "N/A" && (
                              <div className="flex items-center gap-1.5 text-[#94a3b8] text-[12px]">
                                {customer.shopType}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-[#475569]">
                          <span className="inline-flex items-center gap-1.5 tracking-tight text-[13px]">
                            <PinIcon className="w-4 h-4 text-[#94a3b8]" />
                            {customer.city || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[#0f172a] font-bold text-[14px]">
                          {customer.totalOrders}
                        </td>
                        <td className="px-6 py-5 text-[#0f172a] font-bold text-[14px]">
                          ₹{customer.totalSpent.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-5 text-[#475569] font-medium text-[13px]">
                          {formatDate(customer.lastOrderDate)}
                        </td>
                        <td className="px-6 py-5">
                          {customer.status === "Active" ? (
                            <span className="inline-flex items-center px-3 py-1.5 rounded bg-[#dcfce3]/50 text-[#16a34a] text-[12px] font-bold tracking-tight">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1.5 rounded bg-[#fee2e2]/60 text-[#ef4444] text-[12px] font-bold tracking-tight">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center items-center">
                            <Link
                              href={`/wms/customers/${customer.id}`}
                              className="text-[#64748b] hover:text-[#0f172a] transition-colors p-1.5 flex items-center justify-center"
                            >
                              <EyeIcon className="w-[18px] h-[18px]" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-between items-center bg-white">
              <span className="text-[13px] text-[#64748b]">
                Showing {filtered.length} of {customers.length} customer{customers.length !== 1 ? "s" : ""}
              </span>
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
          </>
        )}
      </div>

    </div>
  );
}

// Icons
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
      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
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
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
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
function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
}

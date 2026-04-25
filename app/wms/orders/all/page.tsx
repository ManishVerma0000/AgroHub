"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { mobileOrderService, MobileOrder } from "../../../../services/mobileOrderService";
import { wmsAuthService } from "../../../../services/wmsAuthService";

// Helper for deterministic avatar color
const avatarColors = ["bg-[#0ea5e9]", "bg-[#0d9488]", "bg-[#38bdf8]", "bg-[#0284c7]", "bg-[#10b981]", "bg-[#14b8a6]", "bg-[#8b5cf6]", "bg-[#db2777]"];
const getAvatarBg = (name: string) => {
  if (!name) return avatarColors[0];
  const charCode = name.charCodeAt(0);
  return avatarColors[charCode % avatarColors.length];
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 10;

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('wmsToken');
      if (!token) return;
      const profile = await wmsAuthService.getProfile(token);
      const skip = (currentPage - 1) * limit;
      const data = await mobileOrderService.getByWarehouse(profile.id, skip, limit);
      setOrders(data.items);
      setTotalOrders(data.total);
    } catch (error) {
      console.error("Error fetching warehouse orders:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.location?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Function to determine Tailwind classes based on status string dynamically matching Figma dropdown bubbles
  const getStatusStyles = (status: string) => {
    switch(status) {
      case "New Order": case "Pending": case "Placed": return "bg-[#f1f5f9] border-[#e2e8f0] text-[#475569]";
      case "Picking": return "bg-[#f3e8ff] border-[#e9d5ff] text-[#9333ea]";
      case "Packing": return "bg-[#ffedd5] border-[#fed7aa] text-[#c2410c]";
      case "Ready for Dispatch": return "bg-[#ccfbf1] border-[#99f6e4] text-[#0d9488]";
      case "Out for Delivery": return "bg-[#e0e7ff] border-[#c7d2fe] text-[#4338ca]";
      case "Delivered": case "Completed": return "bg-[#dcfce7] border-[#bbf7d0] text-[#15803d]";
      default: return "bg-[#f1f5f9] border-[#e2e8f0] text-[#475569]";
    }
  };

  const toggleOrder = (id: string) => {
    const newSet = new Set(selectedOrders);
    if(newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedOrders(newSet);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-bold text-[#1e293b]">All Orders</h1>
          {!loading && <span className="text-[#64748b] text-[20px] font-medium">{filteredOrders.length}</span>}
          <ChevronDownIcon className="w-5 h-5 text-[#64748b]" />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg text-sm outline-none focus:border-[#2563eb] w-[250px] shadow-sm transition-all"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors shadow-sm">
            Bulk Action
            <ChevronDownIcon className="w-4 h-4 text-[#64748b] ml-1" />
          </button>
          
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-4 py-1">
        <span className="text-sm text-[#64748b] font-medium">Filter by:</span>
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-[#cbd5e1] rounded-lg text-sm text-[#0f172a] outline-none hover:bg-[#f8fafc] cursor-pointer focus:border-[#2563eb] bg-white min-w-[140px] shadow-sm"
          >
            <option value="All Status">All Status</option>
            <option value="Placed">Placed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Picking">Picking</option>
            <option value="Packing">Packing</option>
            <option value="Ready for Dispatch">Ready for Dispatch</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="appearance-none pl-4 pr-10 py-2 border border-[#cbd5e1] rounded-lg text-sm text-[#0f172a] outline-none hover:bg-[#f8fafc] cursor-pointer focus:border-[#2563eb] bg-white min-w-[170px] shadow-sm">
            <option value="All Payment Types">All Payment Types</option>
            <option value="Credit">Credit</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Table Payload */}
      {loading ? (
        <div className="py-24 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl p-10 text-center text-[#64748b]">
            {searchTerm || statusFilter !== "All Status" ? "No matching orders found." : "No mobile orders found for this warehouse."}
        </div>
      ) : (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                <tr>
                    <th className="px-6 py-4 w-[40px]">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb] cursor-pointer" />
                    </th>
                    <th className="px-6 py-4">ORDER ID</th>
                    <th className="px-6 py-4">CUSTOMER</th>
                    <th className="px-6 py-4">LOCATION</th>
                    <th className="px-6 py-4">ITEMS</th>
                    <th className="px-6 py-4">AMOUNT</th>
                    <th className="px-6 py-4">PAYMENT</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4">DATE</th>
                    <th className="px-6 py-4 text-center">ACTIONS</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                {filteredOrders.map((order) => {
                    const cName = order.customerName || "Unknown Customer";
                    const initial = cName.charAt(0).toUpperCase();

                    return (
                        <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors group">
                            <td className="px-6 py-4">
                                <input 
                                type="checkbox" 
                                checked={selectedOrders.has(order.id)}
                                onChange={() => toggleOrder(order.id)}
                                className="w-4 h-4 rounded border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb] cursor-pointer outline-none" 
                                />
                            </td>
                            <td className="px-6 py-4">
                                <Link href={`/wms/orders/${order.id}`} className="text-[#2563eb] font-semibold hover:underline">
                                {/* Slice ID strictly for visually clean order identifiers */}
                                {order.id.slice(-6).toUpperCase()}
                                </Link>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[13px] ${getAvatarBg(cName)} shadow-sm`}>
                                    {initial}
                                </div>
                                <span className="text-[#0f172a] font-semibold truncate max-w-[180px]">{cName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-[#475569] truncate max-w-[150px]">{order.location || "N/A"}</td>
                            <td className="px-6 py-4 text-[#475569]">{order.items?.length || 0} items</td>
                            <td className="px-6 py-4 text-[#0f172a] font-bold">₹{order.grandTotal?.toLocaleString('en-IN') || 0}</td>
                            <td className="px-6 py-4 text-[#475569]">{order.paymentMethod || "N/A"}</td>
                            <td className="px-6 py-4">
                                {/* Completely locked Graphical Badge Instead of interactive select */}
                                <span className={`inline-flex items-center justify-center px-4 py-1.5 border rounded-full text-[11px] font-bold shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${getStatusStyles(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-[#64748b] text-[13px]">{formatDate(order.createdAt)}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                <Link href={`/wms/orders/${order.id}`} className="text-[#64748b] hover:text-[#0f172a] transition-colors" title="View details">
                                    <EyeIcon className="w-[18px] h-[18px]" />
                                </Link>
                                <button className="text-[#64748b] hover:text-[#0f172a] transition-colors" title="Delivery Status">
                                    <TruckIcon className="w-[18px] h-[18px]" />
                                </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-white mt-auto">
            <span className="text-sm text-[#64748b]">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalOrders)} of {totalOrders} results
            </span>
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[#e2e8f0] text-[#64748b] text-sm font-medium rounded-md hover:bg-[#f8fafc] disabled:opacity-50 transition-colors shadow-sm"
                >
                Previous
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-[#16a34a] text-white text-sm font-bold rounded-md shadow-sm">
                {currentPage}
                </button>
                <button 
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage * limit >= totalOrders}
                  className="px-4 py-2 border border-[#e2e8f0] text-[#64748b] text-sm font-medium rounded-md hover:bg-[#f8fafc] disabled:opacity-50 transition-colors shadow-sm"
                >
                Next
                </button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
}

// Inline SVG Icons
function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
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

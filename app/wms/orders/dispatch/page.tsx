"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { mobileOrderService, MobileOrder } from "../../../../services/mobileOrderService";

const ACTIVE_WAREHOUSE_ID = "69b82ccf3709f6cca0ec8c41";

const avatarColors = ["bg-[#0ea5e9]", "bg-[#0d9488]", "bg-[#38bdf8]", "bg-[#0284c7]", "bg-[#10b981]", "bg-[#14b8a6]", "bg-[#8b5cf6]", "bg-[#db2777]"];
const getAvatarBg = (name: string) => {
  if (!name) return avatarColors[0];
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function DispatchManagementPage() {
  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatchingIds, setDispatchingIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mobileOrderService.getByWarehouseAndStatus(ACTIVE_WAREHOUSE_ID, "Packing");
      setOrders(data);
    } catch (err) {
      console.error("Error fetching packing orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleReadyForDispatch = async (orderId: string) => {
    if (dispatchingIds.has(orderId)) return;
    setDispatchingIds((prev) => new Set(prev).add(orderId));
    try {
      await mobileOrderService.readyForDispatch(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Error marking order ready for dispatch:", err);
    } finally {
      setDispatchingIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">

      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <h1 className="text-[26px] font-bold text-[#0f172a]">Dispatch Management</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm"
          >
            <RefreshIcon className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Ready to Dispatch</span>
          <span className="text-[#d97706] text-[32px] font-bold leading-none">
            {loading ? "—" : orders.length}
          </span>
          <span className="text-[#94a3b8] text-[13px]">Packed orders awaiting dispatch</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Out for Delivery</span>
          <span className="text-[#2563eb] text-[32px] font-bold leading-none">—</span>
          <span className="text-[#94a3b8] text-[13px]">Currently in transit</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Delivered Today</span>
          <span className="text-[#16a34a] text-[32px] font-bold leading-none">—</span>
          <span className="text-[#94a3b8] text-[13px]">Successfully delivered</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Active Vehicles</span>
          <span className="text-[#0f172a] text-[32px] font-bold leading-none">—</span>
          <span className="text-[#94a3b8] text-[13px]">Vehicles on road</span>
        </div>
      </div>

      {/* Packed Orders — Ready to Dispatch */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#0f172a]">Packed Orders — Ready for Dispatch</h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffedd5] border border-[#fed7aa] text-[#c2410c] text-[12px] font-bold">
            <BoxIcon className="w-3.5 h-3.5" />
            Packing Complete
          </span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          {loading ? (
            <div className="py-24 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d97706]"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center text-[#64748b]">
              <TruckIcon className="w-10 h-10 text-[#bfdbfe]" />
              <p className="font-semibold text-[#0f172a]">No packed orders awaiting dispatch</p>
              <p className="text-[13px]">All packed orders have been dispatched or none are ready yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                    <tr>
                      <th className="px-6 py-4">ORDER ID</th>
                      <th className="px-6 py-4">CUSTOMER</th>
                      <th className="px-6 py-4">LOCATION</th>
                      <th className="px-6 py-4">ITEMS</th>
                      <th className="px-6 py-4">AMOUNT</th>
                      <th className="px-6 py-4">DATE</th>
                      <th className="px-6 py-4">STATUS</th>
                      <th className="px-6 py-4">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {orders.map((order) => {
                      const cName = order.customerName || "Unknown Customer";
                      const initial = cName.charAt(0).toUpperCase();
                      const isLoading = dispatchingIds.has(order.id);

                      return (
                        <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="px-6 py-5">
                            <Link
                              href={`/wms/orders/${order.id}`}
                              className="text-[#2563eb] font-semibold hover:underline"
                            >
                              {order.id.slice(-6).toUpperCase()}
                            </Link>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[13px] ${getAvatarBg(cName)} shadow-sm`}>
                                {initial}
                              </div>
                              <span className="text-[#0f172a] font-medium text-[14px] truncate max-w-[160px]">{cName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-[#475569]">
                            <span className="inline-flex items-center gap-1.5">
                              <PinIcon className="w-4 h-4 text-[#94a3b8]" />
                              {order.location || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-[#475569]">{order.items?.length || 0} items</td>
                          <td className="px-6 py-5 text-[#0f172a] font-bold">₹{order.grandTotal?.toLocaleString("en-IN") || 0}</td>
                          <td className="px-6 py-5 text-[#475569]">{formatDate(order.createdAt)}</td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffedd5] text-[#c2410c] text-[12px] font-bold">
                              <BoxIcon className="w-3.5 h-3.5" />
                              Packing
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <button
                              id={`dispatch-${order.id}`}
                              onClick={() => handleReadyForDispatch(order.id)}
                              disabled={isLoading}
                              className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-[13px] shadow-sm inline-flex items-center gap-2 min-w-[160px] justify-center"
                            >
                              {isLoading ? (
                                <>
                                  <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <TruckIcon className="w-3.5 h-3.5" />
                                  Ready for Dispatch
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-white">
                <span className="text-sm text-[#64748b]">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} packed and ready for dispatch
                </span>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

// Icons
function MoreVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="12" cy="5" r="1"/>
      <circle cx="12" cy="19" r="1"/>
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

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
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

function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
}

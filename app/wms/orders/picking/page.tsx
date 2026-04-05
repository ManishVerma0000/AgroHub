"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { mobileOrderService, MobileOrder } from "../../../../services/mobileOrderService";

// Same warehouse as orders/all
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

export default function PickingOrdersPage() {
  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickingIds, setPickingIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mobileOrderService.getByWarehouseAndStatus(ACTIVE_WAREHOUSE_ID, "Confirmed");
      setOrders(data);
    } catch (err) {
      console.error("Error fetching confirmed orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStartPicking = async (orderId: string) => {
    if (pickingIds.has(orderId)) return;
    setPickingIds((prev) => new Set(prev).add(orderId));
    try {
      await mobileOrderService.startPicking(orderId);
      // Remove from list after successful status change
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Error starting picking:", err);
    } finally {
      setPickingIds((prev) => {
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
        <div className="flex items-center gap-2">
          <h1 className="text-[26px] font-bold text-[#1e293b]">Combined Picking System</h1>
          {!loading && (
            <span className="text-[#64748b] text-[20px] font-medium mr-1">{orders.length}</span>
          )}
          <ChevronDownIcon className="w-5 h-5 text-[#64748b]" />
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors shadow-sm"
        >
          <RefreshIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Ready to Pick</span>
          <span className="text-[#d97706] text-[32px] font-bold leading-none">
            {loading ? "—" : orders.length}
          </span>
          <span className="text-[#94a3b8] text-[13px]">Confirmed orders awaiting picking</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">In Progress</span>
          <span className="text-[#2563eb] text-[32px] font-bold leading-none">—</span>
          <span className="text-[#94a3b8] text-[13px]">Currently being picked</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Completed Today</span>
          <span className="text-[#16a34a] text-[32px] font-bold leading-none">—</span>
          <span className="text-[#94a3b8] text-[13px]">Moved to Picking status</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#0f172a]">Confirmed Orders — Ready to Pick</h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef9c3] border border-[#fde68a] text-[#ca8a04] text-[12px] font-bold">
            <ClockIcon className="w-3.5 h-3.5" />
            Awaiting Pick
          </span>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center text-[#64748b]">
            <CheckCircleIcon className="w-10 h-10 text-[#bbf7d0]" />
            <p className="font-semibold text-[#0f172a]">No confirmed orders waiting</p>
            <p className="text-[13px]">All confirmed orders have been moved to picking or none exist yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-6 py-4">ORDER ID</th>
                  <th className="px-6 py-4">CUSTOMER</th>
                  <th className="px-6 py-4">ITEMS</th>
                  <th className="px-6 py-4">LOCATION</th>
                  <th className="px-6 py-4">AMOUNT</th>
                  <th className="px-6 py-4">DATE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {orders.map((order) => {
                  const cName = order.customerName || "Unknown Customer";
                  const initial = cName.charAt(0).toUpperCase();
                  const isLoading = pickingIds.has(order.id);

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
                          <span className="text-[#0f172a] font-semibold truncate max-w-[160px]">{cName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[#475569]">{order.items?.length || 0} items</td>
                      <td className="px-6 py-5 text-[#475569] truncate max-w-[140px]">{order.location || "N/A"}</td>
                      <td className="px-6 py-5 text-[#0f172a] font-bold">₹{order.grandTotal?.toLocaleString("en-IN") || 0}</td>
                      <td className="px-6 py-5 text-[#64748b] text-[13px]">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fef9c3] border border-[#fde68a] text-[#ca8a04] text-[12px] font-bold">
                          <CheckBadgeIcon className="w-3.5 h-3.5" />
                          Confirmed
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          id={`complete-pick-${order.id}`}
                          onClick={() => handleStartPicking(order.id)}
                          disabled={isLoading}
                          className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm shadow-sm inline-flex items-center justify-center gap-2 min-w-[150px]"
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <PackageIcon className="w-4 h-4" />
                              Complete Pick
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
        )}

        {/* Footer */}
        {!loading && orders.length > 0 && (
          <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-white">
            <span className="text-sm text-[#64748b]">
              Showing {orders.length} confirmed order{orders.length !== 1 ? "s" : ""} ready for picking
            </span>
          </div>
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

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
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

function CheckBadgeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 12l2 2 4-4"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>
  );
}

function PackageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
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

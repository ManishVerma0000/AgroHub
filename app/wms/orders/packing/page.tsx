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

export default function PackingListPage() {
  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [packingIds, setPackingIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mobileOrderService.getByWarehouseAndStatus(ACTIVE_WAREHOUSE_ID, "Picking");
      setOrders(data);
    } catch (err) {
      console.error("Error fetching picking orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleMarkPacked = async (orderId: string) => {
    if (packingIds.has(orderId)) return;
    setPackingIds((prev) => new Set(prev).add(orderId));
    try {
      await mobileOrderService.startPacking(orderId);
      // Remove from list once status updated
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Error marking order as packed:", err);
    } finally {
      setPackingIds((prev) => {
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
          <h1 className="text-[26px] font-bold text-[#0f172a]">Packing Module</h1>
          {!loading && (
            <span className="text-[#64748b] text-[20px] font-medium mr-1">{orders.length}</span>
          )}
          <ChevronDownIcon className="w-5 h-5 text-[#64748b]" />
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm"
        >
          <RefreshIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Ready to Pack</span>
          <span className="text-[#f97316] text-[32px] font-bold leading-none">
            {loading ? "—" : orders.length}
          </span>
          <span className="text-[#94a3b8] text-[13px]">Picked orders awaiting packing</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">In Packing</span>
          <span className="text-[#ea580c] text-[32px] font-bold leading-none">—</span>
          <span className="text-[#94a3b8] text-[13px]">Currently being packed</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Packed Today</span>
          <span className="text-[#16a34a] text-[32px] font-bold leading-none">—</span>
          <span className="text-[#94a3b8] text-[13px]">Moved to Packing status</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Avg Packing Time</span>
          <span className="text-[#0f172a] text-[32px] font-bold leading-none">—</span>
          <span className="text-[#94a3b8] text-[13px]">Minutes per order</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#0f172a]">Picked Orders — Ready to Pack</h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3e8ff] border border-[#e9d5ff] text-[#9333ea] text-[12px] font-bold">
            <CubeIcon className="w-3.5 h-3.5" />
            Picking Complete
          </span>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center text-[#64748b]">
            <CheckIcon className="w-10 h-10 text-[#bbf7d0]" />
            <p className="font-semibold text-[#0f172a]">No orders awaiting packing</p>
            <p className="text-[13px]">All picked orders have been packed or none are ready yet.</p>
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
                  <th className="px-6 py-4">ORDER DATE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {orders.map((order) => {
                  const cName = order.customerName || "Unknown Customer";
                  const initial = cName.charAt(0).toUpperCase();
                  const isLoading = packingIds.has(order.id);

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
                          <CubeIcon className="w-4 h-4 text-[#94a3b8]" />
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[#475569] truncate max-w-[140px]">{order.location || "N/A"}</td>
                      <td className="px-6 py-5 text-[#0f172a] font-bold">₹{order.grandTotal?.toLocaleString("en-IN") || 0}</td>
                      <td className="px-6 py-5 text-[#475569]">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3e8ff] text-[#9333ea] text-[12px] font-bold">
                          <CubeIcon className="w-3.5 h-3.5" />
                          Picking
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          id={`mark-packed-${order.id}`}
                          onClick={() => handleMarkPacked(order.id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-[13px] shadow-sm inline-flex items-center gap-2 min-w-[130px] justify-center"
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                              Packing...
                            </>
                          ) : (
                            <>
                              <CheckIcon className="w-3.5 h-3.5" />
                              Mark Packed
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

        {!loading && orders.length > 0 && (
          <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-white">
            <span className="text-sm text-[#64748b]">
              Showing {orders.length} order{orders.length !== 1 ? "s" : ""} ready for packing
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

function CubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21 16-9 5-9-5V8l9-5 9 5z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"/>
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

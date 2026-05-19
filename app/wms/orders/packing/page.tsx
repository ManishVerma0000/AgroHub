"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { mobileOrderService, MobileOrder } from "../../../../services/mobileOrderService";
import { wmsAuthService } from "../../../../services/wmsAuthService";

const avatarColors = ["bg-[#0ea5e9]", "bg-[#0d9488]", "bg-[#38bdf8]", "bg-[#0284c7]", "bg-[#10b981]", "bg-[#14b8a6]", "bg-[#8b5cf6]", "bg-[#db2777]"];
const getAvatarBg = (name: string) => {
  if (!name) return avatarColors[0];
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const getOrderItemKey = (item: unknown, index: number) => {
  if (item && typeof item === "object") {
    const value = item as { id?: string; productId?: string };
    return value.id || value.productId || String(index);
  }
  return String(index);
};

const getOrderItemName = (item: unknown) => {
  if (item && typeof item === "object") {
    const value = item as { productName?: string; name?: string; title?: string };
    return value.productName || value.name || value.title || "Product";
  }
  return "Product";
};

const getOrderItemQuantity = (item: unknown) => {
  if (item && typeof item === "object") {
    const value = item as { quantity?: number; qty?: number };
    return value.quantity || value.qty || 0;
  }
  return 0;
};

export default function PackingListPage() {
  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [packingIds, setPackingIds] = useState<Set<string>>(new Set());
  const [verifyOrder, setVerifyOrder] = useState<MobileOrder | null>(null);
  const [verifiedItems, setVerifiedItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('wmsToken');
      if (!token) return;
      const profile = await wmsAuthService.getProfile(token);
      const data = await mobileOrderService.getByWarehouseAndStatus(profile.id, "Picking");
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
    if (packingIds.has(orderId)) return false;
    setPackingIds((prev) => new Set(prev).add(orderId));
    setError(null);
    try {
      await mobileOrderService.startPacking(orderId);
      // Remove from list once status updated
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      return true;
    } catch (err: any) {
      console.error("Error marking order as packed:", err);
      const errMsg = err.response?.data?.detail || "Items stock is not available or partially available";
      setError(errMsg);
      return false;
    } finally {
      setPackingIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  const openVerifyPacking = (order: MobileOrder) => {
    setVerifyOrder(order);
    setVerifiedItems(new Set());
    setError(null);
  };

  const closeVerifyPacking = () => {
    setVerifyOrder(null);
    setVerifiedItems(new Set());
    setError(null);
  };

  const verifyItems = verifyOrder?.items || [];
  const verifiedCount = verifiedItems.size;
  const allItemsVerified = verifyItems.length === 0 || verifiedCount === verifyItems.length;

  const toggleVerifiedItem = (key: string) => {
    setVerifiedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleMarkAll = () => {
    if (allItemsVerified && verifyItems.length > 0) {
      setVerifiedItems(new Set());
      return;
    }

    setVerifiedItems(new Set(verifyItems.map((item, index) => getOrderItemKey(item, index))));
  };

  const confirmVerifiedPacking = async () => {
    if (!verifyOrder || !allItemsVerified) return;
    const success = await handleMarkPacked(verifyOrder.id);
    if (success) {
      closeVerifyPacking();
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Error:</span>
            <span className="text-sm font-semibold">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold text-sm px-2">
            ✕
          </button>
        </div>
      )}

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
                          onClick={() => openVerifyPacking(order)}
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

      {verifyOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[760px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e2e8f0] px-7 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff7ed] text-[#f97316]">
                  <CubeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-[22px] font-bold text-[#0f172a]">Verify Packing</h2>
                  <p className="mt-0.5 text-sm text-[#64748b]">
                    Order: {verifyOrder.id.slice(-6).toUpperCase()} &bull; Customer: {verifyOrder.customerName || "Unknown Customer"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeVerifyPacking}
                className="rounded-lg p-2 text-[#94a3b8] transition-colors hover:bg-[#f8fafc] hover:text-[#0f172a]"
                aria-label="Close verify packing"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="px-7 py-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative flex justify-between items-center animate-in fade-in zoom-in duration-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Error:</span>
                    <span className="text-sm font-semibold">{error}</span>
                  </div>
                  <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold text-sm px-2">
                    ✕
                  </button>
                </div>
              )}
              <div className={`mb-6 flex items-center justify-between rounded-xl border px-5 py-4 ${
                allItemsVerified ? "border-[#86efac] bg-[#f0fdf4]" : "border-[#fed7aa] bg-[#fff7ed]"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    allItemsVerified ? "text-[#16a34a]" : "text-[#f97316]"
                  }`}>
                    {allItemsVerified ? <CheckCircleIcon className="h-8 w-8" /> : <CubeIcon className="h-8 w-8" />}
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-[#0f172a]">
                      {allItemsVerified ? "All Items Verified" : "Reverify Items"}
                    </p>
                    <p className={`text-sm ${allItemsVerified ? "text-[#15803d]" : "text-[#c2410c]"}`}>
                      {allItemsVerified ? "Ready to mark as packed" : "Confirm every item before packing"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#0f172a]">{verifiedCount}/{verifyItems.length}</p>
                  <p className="text-sm text-[#64748b]">Items Packed</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#e2e8f0]">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-5 py-4">
                  <h3 className="text-[16px] font-bold text-[#0f172a]">Items to Pack ({verifyItems.length})</h3>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[#475569]">
                    <input
                      type="checkbox"
                      checked={allItemsVerified}
                      onChange={toggleMarkAll}
                      className="h-4 w-4 rounded border-[#cbd5e1] text-[#16a34a]"
                    />
                    Mark All
                  </label>
                </div>

                {verifyItems.length === 0 ? (
                  <div className="flex min-h-[150px] flex-col items-center justify-center gap-3 text-[#94a3b8]">
                    <CubeIcon className="h-14 w-14 text-[#cbd5e1]" />
                    <p className="text-sm font-medium">No items to pack</p>
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-[#e2e8f0]">
                    {verifyItems.map((item, index) => {
                      const key = getOrderItemKey(item, index);
                      const isVerified = verifiedItems.has(key);

                      return (
                        <label key={key} className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 hover:bg-[#f8fafc]">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isVerified}
                              onChange={() => toggleVerifiedItem(key)}
                              className="h-4 w-4 rounded border-[#cbd5e1] text-[#16a34a]"
                            />
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff7ed] text-[#f97316]">
                              <CubeIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-[#0f172a]">{getOrderItemName(item)}</p>
                              <p className="text-xs text-[#64748b]">Item #{index + 1}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-sm font-bold text-[#475569]">
                            Qty: {getOrderItemQuantity(item)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-[#f8fafc] px-7 py-4">
              <span className={`text-sm font-bold ${allItemsVerified ? "text-[#10b981]" : "text-[#f97316]"}`}>
                {allItemsVerified ? "✓ All items verified and ready" : "Verify all items to continue"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={closeVerifyPacking}
                  className="rounded-xl border border-[#e2e8f0] bg-white px-6 py-3 text-sm font-bold text-[#475569] transition-colors hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmVerifiedPacking}
                  disabled={!allItemsVerified || packingIds.has(verifyOrder.id)}
                  className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {packingIds.has(verifyOrder.id) ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Packed"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
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

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { dispatchService, DispatchBatch } from "../../../../../services/dispatchService";
import { mobileOrderService, MobileOrder } from "../../../../../services/mobileOrderService";
import toast from "react-hot-toast";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric"
  });
};

const formatTime = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true
  });
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
};

const avatarColors = ["bg-[#0ea5e9]", "bg-[#0d9488]", "bg-[#38bdf8]", "bg-[#0284c7]", "bg-[#10b981]", "bg-[#14b8a6]", "bg-[#8b5cf6]", "bg-[#db2777]"];
const getAvatarBg = (name: string) => {
  if (!name) return avatarColors[0];
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
};

type BatchWithOrders = DispatchBatch & { orders?: MobileOrder[] };

export default function DispatchDetailsPage({ params: paramsProp }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsProp);
  const [batch, setBatch] = useState<BatchWithOrders | null>(null);
  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const batchData = await dispatchService.getById(params.id);
      setBatch(batchData);

      // If the API returns populated orders, use them; otherwise fetch individually
      if (batchData.orders && batchData.orders.length > 0) {
        setOrders(batchData.orders);
      } else if (batchData.orderIds && batchData.orderIds.length > 0) {
        const orderResults = await Promise.all(
          batchData.orderIds.map((oid) => mobileOrderService.getById(oid).catch(() => null))
        );
        setOrders(orderResults.filter(Boolean) as MobileOrder[]);
      }
    } catch (err) {
      console.error("Error fetching dispatch details:", err);
      toast.error("Failed to load dispatch details");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const inTransitCount = orders.length - deliveredCount;
  const totalItems = orders.reduce((sum, o) => sum + (o.items?.length || 0), 0);
  const codOrders = orders.filter((o) => o.paymentMethod === "COD");
  const totalCOD = codOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  const driverInitial = batch?.driverName?.charAt(0).toUpperCase() || "?";

  const statusStyle =
    batch?.status === "Delivered"
      ? "bg-[#dcfce7] text-[#16a34a]"
      : batch?.status === "Pending"
      ? "bg-[#fef9c3] text-[#ca8a04]"
      : "bg-[#eff6ff] text-[#2563eb]";

  if (loading) {
    return (
      <div className="flex flex-col gap-8 max-w-[1400px]">
        <div className="flex flex-col gap-4">
          <Link href="/wms/orders/dispatch" className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#0f172a] text-[14px] font-semibold transition-colors w-max">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dispatch
          </Link>
          <div className="h-8 w-64 bg-[#f1f5f9] rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm h-28 animate-pulse bg-[#f8fafc]" />
          ))}
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm h-64 animate-pulse bg-[#f8fafc]" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="flex flex-col gap-8 max-w-[1400px]">
        <Link href="/wms/orders/dispatch" className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#0f172a] text-[14px] font-semibold transition-colors w-max">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dispatch
        </Link>
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <TruckIcon className="w-12 h-12 text-[#bfdbfe]" />
          <p className="font-bold text-[#0f172a] text-[18px]">Dispatch not found</p>
          <p className="text-[#64748b] text-[14px]">The dispatch batch you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">

      {/* Top Banner Row */}
      <div className="flex flex-col gap-4">
        <Link href="/wms/orders/dispatch" className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#0f172a] text-[14px] font-semibold transition-colors w-max">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dispatch
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-bold text-[#0f172a]">Dispatch Details</h1>
            <span className="text-[#64748b] text-[14px]">
              Dispatch ID: {batch.dispatchId} &bull; Dispatched on {formatDate(batch.dispatchTime)}
            </span>
          </div>
          <span className={`px-5 py-2 rounded-full text-[14px] font-bold shadow-sm ${statusStyle}`}>
            {batch.status}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#64748b]">
            <CubeIcon className="w-4 h-4 text-[#2563eb]" />
            <span className="text-[14px] font-medium">Total Orders</span>
          </div>
          <span className="text-[#0f172a] text-[32px] font-bold leading-none">{batch.orderCount}</span>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#16a34a]">
            <CheckCircleIcon className="w-4 h-4" />
            <span className="text-[14px] font-medium text-[#64748b]">Delivered</span>
          </div>
          <span className="text-[#16a34a] text-[32px] font-bold leading-none">{deliveredCount}</span>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#2563eb]">
            <TruckIcon className="w-4 h-4" />
            <span className="text-[14px] font-medium text-[#64748b]">In Transit</span>
          </div>
          <span className="text-[#2563eb] text-[32px] font-bold leading-none">{inTransitCount}</span>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#64748b]">
            <CubeIcon className="w-4 h-4" />
            <span className="text-[14px] font-medium">Total Items</span>
          </div>
          <span className="text-[#0f172a] text-[32px] font-bold leading-none">{totalItems}</span>
        </div>
      </div>

      {/* Main Grid: Orders & Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Span: Orders List */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden w-full">
            <div className="px-6 py-5 border-b border-[#e2e8f0] flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-[#0f172a]">Orders in this Dispatch</h2>
              {totalCOD > 0 && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#fef08a]/40 border border-[#fef08a] text-[#ca8a04] rounded-lg text-sm font-bold shadow-sm">
                  <CreditCardIcon className="w-4 h-4" />
                  Total COD: ₹{totalCOD.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3 text-center text-[#64748b]">
                <CubeIcon className="w-10 h-10 text-[#bfdbfe]" />
                <p className="font-semibold text-[#0f172a]">No order details available</p>
                <p className="text-[13px]">Order information could not be loaded for this dispatch.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                    <tr>
                      <th className="px-6 py-4">ORDER ID</th>
                      <th className="px-6 py-4">CUSTOMER</th>
                      <th className="px-6 py-4 min-w-[200px]">DELIVERY ADDRESS</th>
                      <th className="px-6 py-4">ITEMS</th>
                      <th className="px-6 py-4">PAYMENT</th>
                      <th className="px-6 py-4">AMOUNT</th>
                      <th className="px-6 py-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {orders.map((order) => {
                      const isCOD = order.paymentMethod === "COD";
                      const isPaid = order.paymentStatus === "Paid" || !isCOD;
                      return (
                        <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="px-6 py-6 border-l-4 border-l-transparent hover:border-l-[#2563eb] transition-all">
                            <Link href={`/wms/orders/${order.id}`} className="text-[#2563eb] font-bold hover:underline flex flex-col w-[80px] break-words whitespace-normal leading-tight">
                              {order.id.slice(-8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="px-6 py-6">
                            <span className="text-[#0f172a] font-semibold flex flex-col whitespace-normal break-words w-[100px]">
                              {order.customerName || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-6 whitespace-normal max-w-[200px]">
                            <div className="flex gap-2 items-start text-[#475569] text-[13px] leading-relaxed">
                              <PinIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span>{order.location || "N/A"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-[#0f172a] font-medium leading-tight w-[60px] whitespace-normal break-words">
                            {order.items?.length || 0} items
                          </td>
                          <td className="px-6 py-6">
                            {isCOD ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fef08a]/40 border border-[#fef08a]/50 text-[#ca8a04] text-[11px] font-bold uppercase rounded shadow-sm">
                                <CreditCardIcon className="w-3 h-3" />
                                COD
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dcfce3]/40 border border-[#dcfce3]/50 text-[#16a34a] text-[11px] font-bold uppercase rounded shadow-sm">
                                <CreditCardIcon className="w-3 h-3" />
                                Prepaid
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex flex-col gap-1 w-[90px]">
                              <span className="text-[#0f172a] font-bold text-[14px]">
                                ₹{order.grandTotal?.toLocaleString("en-IN") || 0}
                              </span>
                              <span className={`text-[11px] font-bold uppercase ${isCOD ? "text-[#ca8a04]" : "text-[#16a34a]"}`}>
                                {isCOD ? "To Collect" : "Paid"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            {order.status === "Delivered" ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dcfce3] text-[#16a34a] text-[12px] font-bold shadow-sm">
                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                {order.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#eff6ff] text-[#2563eb] text-[12px] font-bold shadow-sm">
                                {order.status || "Out for Delivery"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Vehicle Information */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Vehicle Information</h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <TruckIcon className="w-5 h-5 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#64748b] text-[12px] font-semibold">Vehicle Number</span>
                  <span className="text-[#0f172a] text-[15px] font-bold">{batch.vehicleNumber || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PinIcon className="w-5 h-5 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#64748b] text-[12px] font-semibold">Route</span>
                  <span className="text-[#0f172a] text-[15px] font-bold">{batch.route || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ClockIcon className="w-5 h-5 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#64748b] text-[12px] font-semibold">Dispatch Time</span>
                  <span className="text-[#0f172a] text-[15px] font-bold">{formatDateTime(batch.dispatchTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Driver Information</h3>
            <div className="flex items-center gap-4">
              <div className={`w-[50px] h-[50px] rounded-full text-white flex items-center justify-center font-bold text-[20px] shadow-sm ${getAvatarBg(batch.driverName || "")}`}>
                {driverInitial}
              </div>
              <div className="flex flex-col">
                <span className="text-[#0f172a] font-bold text-[16px]">{batch.driverName || "Unknown Driver"}</span>
                <span className="text-[#64748b] text-[13px]">Driver</span>
              </div>
            </div>
          </div>

          {/* Route Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Delivery Route</h3>
            <div className="w-full h-[160px] rounded-xl border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] flex flex-col items-center justify-center gap-2">
              <NavigationIcon className="w-8 h-8 text-[#94a3b8]" />
              <div className="flex flex-col items-center">
                <span className="text-[#475569] font-medium text-[14px]">Route Map</span>
                <span className="text-[#64748b] text-[12px]">{batch.route || "N/A"}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Inline SVGs
function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

function CubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21 16-9 5-9-5V8l9-5 9 5z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
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

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
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

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function NavigationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
    </svg>
  );
}

function CreditCardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  );
}

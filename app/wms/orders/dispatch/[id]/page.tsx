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
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

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
  
  const handleUpdatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      await mobileOrderService.updatePaymentStatus(orderId, newStatus);
      toast.success(`Payment status updated to ${newStatus}`);
      fetchDetails(); // Refresh data
    } catch (err) {
      console.error("Error updating payment status:", err);
      toast.error("Failed to update payment status");
    }
  };

  const handleMarkSelectedDelivered = async () => {
    if (!batch) return;
    
    // Determine which orders to update: either selected ones or ALL if none selected
    const idsToUpdate = selectedOrderIds.length > 0 
      ? selectedOrderIds 
      : orders.map(o => o.id);

    if (idsToUpdate.length === 0) {
      toast.error("No orders to update");
      return;
    }

    try {
      await mobileOrderService.bulkUpdateStatus(idsToUpdate, "Delivered");
      toast.success(`${idsToUpdate.length} orders marked as delivered`);
      setSelectedOrderIds([]); // Clear selection
      fetchDetails();
    } catch (err) {
      console.error("Error marking selected as delivered:", err);
      toast.error("Failed to update status");
    }
  };

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

  const handleDownloadPDF = async () => {
    if (!batch) {
      toast.error("Dispatch details are not loaded yet.");
      return;
    }
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const formatDateInvoice = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const formatTimeInvoice = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", hour12: true
        });
      };

      // Create a temporary hidden container styled like a professional dispatch slip
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "850px";
      container.style.padding = "40px";
      container.style.background = "#ffffff";
      container.style.color = "#0f172a";
      container.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
      container.style.boxSizing = "border-box";

      // Orders HTML list
      const ordersHtml = orders.map((order, index) => {
        const isCOD = order.paymentMethod === "COD";
        const itemsCount = order.items?.length || 0;
        const formattedAmount = `₹${(order.grandTotal || 0).toLocaleString("en-IN")}`;
        const paymentStatusText = order.paymentStatus || (isCOD ? "Unpaid" : "Paid");
        const deliveryStatusText = order.status || "Out for Delivery";

        return `
          <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #334155;">
            <td style="padding: 10px; font-weight: bold; color: #0f172a; text-align: left;">${index + 1}</td>
            <td style="padding: 10px; font-weight: bold; color: #2563eb; text-align: left;">${order.id.slice(-8).toUpperCase()}</td>
            <td style="padding: 10px; text-align: left; font-weight: 600;">${order.customerName || "Unknown"}</td>
            <td style="padding: 10px; text-align: left; white-space: normal; max-width: 200px;">${order.location || "N/A"}</td>
            <td style="padding: 10px; text-align: center;">${itemsCount}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; color: ${isCOD ? '#ca8a04' : '#16a34a'};">${isCOD ? 'COD' : 'Prepaid'}</td>
            <td style="padding: 10px; text-align: right; font-weight: 700; color: #0f172a;">${formattedAmount}</td>
            <td style="padding: 10px; text-align: center; font-weight: 600; color: ${paymentStatusText === 'Paid' ? '#16a34a' : '#ca8a04'}">${paymentStatusText}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; color: ${deliveryStatusText === 'Delivered' ? '#16a34a' : '#2563eb'};">${deliveryStatusText}</td>
          </tr>
        `;
      }).join("");

      container.innerHTML = `
        <div style="width: 100%;">
          <!-- Header Row -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
            <div>
              <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 5px 0; letter-spacing: -0.5px;">DISPATCH SLIP</h1>
              <div style="font-size: 14px; font-weight: bold; color: #475569; margin-bottom: 4px;">DVM Solution</div>
              <div style="font-size: 12px; color: #64748b;">Warehouse Management System</div>
            </div>
            <div style="text-align: right; font-size: 12px; line-height: 1.6;">
              <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 6px;">Batch Info:</div>
              <div><strong>Dispatch ID:</strong> ${batch.dispatchId}</div>
              <div><strong>Status:</strong> ${batch.status}</div>
              <div><strong>Dispatched:</strong> ${formatDateInvoice(batch.dispatchTime)}, ${formatTimeInvoice(batch.dispatchTime)}</div>
            </div>
          </div>

          <!-- Trip / Logistics Details -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px 20px; margin-bottom: 25px; display: flex; justify-content: space-between;">
            <div style="flex: 1;">
              <div style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Driver Information</div>
              <div style="font-size: 14px; font-weight: bold; color: #0f172a;">${batch.driverName || "N/A"}</div>
              <div style="font-size: 12px; color: #475569; margin-top: 2px;">Phone: ${batch.driverPhone || "N/A"}</div>
            </div>
            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 20px;">
              <div style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Vehicle & Route</div>
              <div style="font-size: 14px; font-weight: bold; color: #0f172a;">Vehicle: ${batch.vehicleNumber || "N/A"}</div>
              <div style="font-size: 12px; color: #475569; margin-top: 2px;">Route: ${batch.route || "N/A"}</div>
            </div>
            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 20px; text-align: right;">
              <div style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Batch Summary</div>
              <div style="font-size: 14px; font-weight: bold; color: #0f172a;">Total Orders: ${batch.orderCount}</div>
              <div style="font-size: 12px; color: #475569; margin-top: 2px;">Total COD: ₹${totalCOD.toLocaleString("en-IN")}</div>
            </div>
          </div>

          <!-- Orders Table -->
          <h3 style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 12px;">Orders List</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #475569; font-size: 10px; font-weight: bold; text-transform: uppercase;">
                <th style="padding: 10px; text-align: left;">#</th>
                <th style="padding: 10px; text-align: left;">Order ID</th>
                <th style="padding: 10px; text-align: left;">Customer</th>
                <th style="padding: 10px; text-align: left; width: 220px;">Address</th>
                <th style="padding: 10px; text-align: center;">Items</th>
                <th style="padding: 10px; text-align: center;">Payment</th>
                <th style="padding: 10px; text-align: right;">Amount</th>
                <th style="padding: 10px; text-align: center;">Payment Status</th>
                <th style="padding: 10px; text-align: center;">Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              ${ordersHtml}
            </tbody>
          </table>

          <!-- Footer/Disclaimer -->
          <div style="font-size: 11px; color: #64748b; line-height: 1.5; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; display: flex; justify-content: space-between;">
            <div>
              <div style="font-weight: bold; color: #0f172a; margin-bottom: 4px;">Warehouse Operations Signature</div>
              <div style="margin-top: 35px; border-top: 1px dashed #94a3b8; width: 200px;"></div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold; color: #0f172a; margin-bottom: 4px;">Driver Signature</div>
              <div style="margin-top: 35px; border-top: 1px dashed #94a3b8; width: 200px; margin-left: auto;"></div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`dispatch_slip_${batch.dispatchId}.pdf`);
      toast.success("Dispatch Slip downloaded as PDF!");
    } catch (error) {
      console.error("Failed to generate dispatch slip PDF:", error);
      toast.error("Failed to download PDF dispatch slip.");
    }
  };

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
                      <th className="px-6 py-4 w-[40px]">
                        <input 
                          type="checkbox" 
                          className="rounded border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb]"
                          checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrderIds(orders.map(o => o.id));
                            } else {
                              setSelectedOrderIds([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-4">ORDER ID</th>
                      <th className="px-6 py-4">CUSTOMER</th>
                      <th className="px-6 py-4 min-w-[200px]">DELIVERY ADDRESS</th>
                      <th className="px-6 py-4">ITEMS</th>
                      <th className="px-6 py-4">PAYMENT</th>
                      <th className="px-6 py-4">AMOUNT</th>
                      <th className="px-6 py-4">PAYMENT STATUS</th>
                      <th className="px-6 py-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {orders.map((order) => {
                      const isCOD = order.paymentMethod === "COD";
                      const isPaid = order.paymentStatus === "Paid" || !isCOD;
                      return (
                        <tr key={order.id} className={`hover:bg-[#f8fafc] transition-colors ${selectedOrderIds.includes(order.id) ? 'bg-[#eff6ff]' : ''}`}>
                          <td className="px-6 py-6 text-center">
                            <input 
                              type="checkbox" 
                              className="rounded border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb]"
                              checked={selectedOrderIds.includes(order.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrderIds([...selectedOrderIds, order.id]);
                                } else {
                                  setSelectedOrderIds(selectedOrderIds.filter(id => id !== order.id));
                                }
                              }}
                            />
                          </td>
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
                          <td className="px-6 py-6 text-[#0f172a] font-bold text-[14px]">
                            ₹{order.grandTotal?.toLocaleString("en-IN") || 0}
                          </td>
                          <td className="px-6 py-6">
                            <select 
                              value={order.paymentStatus || (isCOD ? "Unpaid" : "Paid")}
                              onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                              className={`text-[11px] font-bold uppercase bg-transparent border-none focus:ring-0 cursor-pointer p-0 w-full outline-none transition-colors ${
                                (order.paymentStatus === "Paid" || (!order.paymentStatus && !isCOD)) ? "text-[#16a34a]" : 
                                (order.paymentStatus === "Unpaid" || order.paymentStatus === "Pending" || (!order.paymentStatus && isCOD)) ? "text-[#ca8a04]" :
                                order.paymentStatus === "Failed" ? "text-[#ef4444]" : "text-[#64748b]"
                              }`}
                            >
                              <option value="Unpaid">Unpaid</option>
                              <option value="Paid">Paid</option>
                              <option value="Pending">Pending</option>
                              <option value="Failed">Failed</option>
                              <option value="Refunded">Refunded</option>
                            </select>
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

          {/* Actions Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Actions</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleMarkSelectedDelivered}
                disabled={batch.status === "Delivered" && selectedOrderIds.length === 0}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] shadow-sm transition-all ${
                  (batch.status === "Delivered" && selectedOrderIds.length === 0)
                  ? "bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed" 
                  : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.98]"
                }`}
              >
                <CheckCircleIcon className="w-4 h-4" />
                {selectedOrderIds.length > 0 ? `Mark Selected (${selectedOrderIds.length}) Delivered` : "Mark All Delivered"}
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#16a34a] text-white rounded-xl font-bold text-[14px] shadow-sm hover:bg-[#15803d] transition-all active:scale-[0.98]"
              >
                <PrinterIcon className="w-4 h-4" />
                Generate Dispatch Slip
              </button>
            </div>
          </div>

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
                <div className="flex items-center gap-1.5 mt-0.5">
                  <PhoneIcon className="w-3.5 h-3.5 text-[#64748b]" />
                  <span className="text-[#64748b] text-[13px]">{batch.driverPhone || "No Phone"}</span>
                </div>
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

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );
}

function PrinterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
  );
}

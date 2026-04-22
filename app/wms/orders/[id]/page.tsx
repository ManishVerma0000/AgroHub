"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { mobileOrderService, MobileOrder } from "../../../../services/mobileOrderService";

const avatarColors = ["bg-[#0ea5e9]", "bg-[#0d9488]", "bg-[#38bdf8]", "bg-[#0284c7]", "bg-[#10b981]", "bg-[#14b8a6]", "bg-[#8b5cf6]", "bg-[#db2777]"];
const getAvatarBg = (name: string) => {
  if (!name) return avatarColors[0];
  const charCode = name.charCodeAt(0);
  return avatarColors[charCode % avatarColors.length];
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const formatShortDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.id;
  
  const [order, setOrder] = useState<MobileOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await mobileOrderService.getById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleConfirmOrder = async () => {
    if (!orderId || confirming) return;
    setConfirming(true);
    try {
      const updated = await mobileOrderService.confirmOrder(orderId);
      setOrder(updated);
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#0f172a]">Order not found</h2>
        <Link href="/wms/orders/all" className="text-[#2563eb] hover:underline">Return to all orders</Link>
      </div>
    );
  }

  const orderStatus = order.status || "Placed";

  // Tracker Logic Nodes
  const statusHierarchy = ["Placed", "Confirmed", "Processing", "Picking", "Packing", "Ready for Dispatch", "Out for Delivery", "Delivered", "Completed"];
  const currentIndex = statusHierarchy.indexOf(orderStatus);
  
  const isPastOrCurrent = (status: string) => {
    const index = statusHierarchy.indexOf(status);
    return index <= currentIndex;
  };
  
  const isCurrent = (status: string) => {
    return statusHierarchy.indexOf(status) === currentIndex;
  };

  const customerName = order.customerName || "Unknown Customer";
  const initial = customerName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-4">
        <Link href="/wms/orders/all" className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0f172a] transition-colors w-fit text-sm font-semibold">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Orders
        </Link>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-bold text-[#0f172a]">Order Details</h1>
            <span className="text-[#64748b] text-[15px]">Order ID: {orderId} • Placed on {formatShortDate(order.createdAt)}</span>
          </div>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f1f5f9] text-[#475569] text-sm font-bold shadow-sm uppercase tracking-wide">
            {orderStatus}
          </span>
        </div>
      </div>

      {/* Main 70/30 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN - Primary Dashboard Elements */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Order Items Generic Array Grid */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-[#e2e8f0] bg-white">
              <h2 className="text-[18px] font-bold text-[#0f172a]">Order Items</h2>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                  <tr>
                    <th className="px-6 py-4">PRODUCT</th>
                    <th className="px-6 py-4">QUANTITY</th>
                    <th className="px-6 py-4">UNIT PRICE</th>
                    <th className="px-6 py-4">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {order.items?.map((item, i) => {
                    const itemName = item.name || item.productName || "Unknown Product";
                    const price = item.basePrice || item.unitPrice || 0;
                    const total = (item.quantity || 0) * price;
                    
                    return (
                      <tr key={i} className="bg-white hover:bg-[#f8fafc] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0 shadow-sm border border-[#bfdbfe]">
                              <CubeIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[#0f172a] font-bold text-[15px]">{itemName}</span>
                              <span className="text-[#64748b] text-[13px]">{item.productId?.slice(-6).toUpperCase() || 'SYS-N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#475569]">{item.quantity}</td>
                        <td className="px-6 py-4 text-[#0f172a] font-medium">₹{price.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-[#0f172a] font-bold">₹{total.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  }) || (
                    <tr><td colSpan={4} className="text-center py-6 text-[#64748b]">No items recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Block natively rendered matching bottom border alignments */}
            <div className="flex flex-col items-end px-6 py-6 border-t border-[#e2e8f0] bg-[#fafafa]">
              <div className="w-full max-w-[300px] flex flex-col gap-4">
                <div className="flex justify-between items-center text-[#475569] text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#0f172a]">₹{order.subtotal?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between items-center text-[#475569] text-sm">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#0f172a]">₹{order.deliveryFee?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#cbd5e1] mt-1">
                  <span className="font-bold text-[#0f172a] text-[15px]">Total Amount</span>
                  <span className="font-bold text-[#16a34a] text-[20px]">₹{order.grandTotal?.toLocaleString('en-IN') || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Order Timeline Stepper Array */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-[#0f172a]">Order Timeline</h2>
            
            <div className="flex flex-col relative pt-2">
              <div className="absolute top-[18px] bottom-6 left-[15px] w-0.5 bg-[#e2e8f0] -z-10"></div>
              
              {/* Node: Order Placed */}
              <div className="flex gap-4 mb-6 relative">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0 shadow-sm border border-[#bbf7d0]">
                  <div className="w-2.5 h-2.5 bg-[#16a34a] rounded-full"></div>
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-[#0f172a] font-bold text-[15px] leading-none">Order Placed</span>
                  <span className="text-[#64748b] text-[13px] mt-1">{formatDate(order.createdAt)}</span>
                </div>
              </div>

               {/* Array of dynamic trailing nodes */}
               {statusHierarchy.slice(1).map((statusName, idx) => {
                 const pastOrCurrent = isPastOrCurrent(statusName);
                 const current = isCurrent(statusName);
                 
                 return (
                    <div key={statusName} className={`flex gap-4 mb-${idx === statusHierarchy.length-2 ? '0' : '6'} relative ${pastOrCurrent ? '' : 'opacity-60'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${pastOrCurrent ? 'bg-[#dcfce7] border-[#bbf7d0] shadow-sm' : 'bg-[#f1f5f9] border-[#e2e8f0]/50'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${pastOrCurrent ? 'bg-[#16a34a]' : 'bg-[#cbd5e1]'}`}></div>
                        </div>
                        <div className="flex items-center gap-2 pt-1.5 leading-none">
                        <span className={`${pastOrCurrent ? 'text-[#0f172a] font-bold' : 'text-[#64748b] font-semibold'} text-[15px]`}>{statusName}</span>
                        {current && <span className="text-[#16a34a] text-xs font-bold">(Current)</span>}
                        </div>
                    </div>
                 )
               })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Secondary Sidebar Formats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Customer Information Block */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Customer Information</h3>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${getAvatarBg(customerName)} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
                {initial}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#0f172a] text-[15px]">{customerName}</span>
                <span className="text-[#64748b] text-[13px]">Customer</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-4 border-t border-[#f1f5f9]">
              <div className="flex gap-3 items-start">
                <MailIcon className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col leading-tight gap-0.5">
                  <span className="text-[#64748b] text-[13px]">Email</span>
                  <span className="text-[#0f172a] text-sm">{order.customerEmail || "N/A"}</span>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <PhoneIcon className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col leading-tight gap-0.5">
                  <span className="text-[#64748b] text-[13px]">Phone</span>
                  <span className="text-[#0f172a] text-sm">{order.customerPhone || "N/A"}</span>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <MapPinIcon className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col leading-tight gap-0.5 max-w-[200px]">
                  <span className="text-[#64748b] text-[13px]">Delivery Location</span>
                  <span className="text-[#0f172a] text-sm">{order.location || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information Block */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Payment Information</h3>
            
            <div className="flex justify-between items-center">
              <span className="text-[#475569] text-sm">Payment Method</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] text-[13px] font-bold">
                <CreditCardIcon className="w-3.5 h-3.5 text-[#64748b]" />
                {order.paymentMethod || "N/A"}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-5 border-t border-[#f1f5f9]">
              <span className="text-[#475569] text-sm">Payment Status</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fefce8] text-[#ca8a04] border border-[#fef08a] text-[12px] font-bold">
                <CloseCircleIcon className="w-3.5 h-3.5" />
                Pending
              </span>
            </div>
          </div>

          {/* Order Summary Formats */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] text-[13px]">Amount Due</span>
              <span className="text-[#ca8a04] font-bold">₹{order.grandTotal?.toLocaleString('en-IN') || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] text-[13px]">Order Date</span>
              <span className="flex items-center gap-1.5 text-[#0f172a] font-medium text-[13px]">
                <CalendarIcon className="w-3.5 h-3.5 text-[#94a3b8]" />
                {formatShortDate(order.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] text-[13px]">Total Items</span>
              <span className="text-[#0f172a] font-bold">{order.items?.length || 0} items</span>
            </div>
          </div>

          {/* Action Trigger Stack */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Actions</h3>
            <div className="flex flex-col gap-3">
              {orderStatus === "Placed" && (
                <button
                  id="confirm-order-btn"
                  onClick={handleConfirmOrder}
                  disabled={confirming}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
                >
                  {confirming ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Confirm Order
                    </>
                  )}
                </button>
              )}
              <button 
                onClick={() => setShowTrackModal(true)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
              >
                <TruckIcon className="w-4 h-4" />
                Track Order
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-lg transition-colors text-sm shadow-sm">
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Track Order Modal Overlay */}
      {showTrackModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#e2e8f0]">
              <h2 className="text-[20px] font-bold text-[#0f172a]">Track Order</h2>
              <button 
                onClick={() => setShowTrackModal(false)}
                className="text-[#64748b] hover:text-[#0f172a] transition-colors p-1"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col bg-[#fafafa]">
              
              {/* Order Context Banner */}
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 flex flex-col mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#1e40af] font-bold text-[15px]">Order ID: {orderId.slice(-8).toUpperCase()}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dbeafe] text-[#1e40af] text-xs font-bold">
                    {orderStatus}
                  </span>
                </div>
              </div>

              {/* Advanced Tracking Stepper */}
              <div className="flex flex-col relative pl-[42px] gap-2">
                <div className="absolute top-[32px] bottom-[32px] left-[27px] w-0.5 bg-[#e2e8f0] -z-10"></div>
                
                {/* Visual progression track height mapped roughly to index. */}
                <div className="absolute top-[32px] left-[27px] w-0.5 bg-[#16a34a] -z-10 transition-all duration-500" style={{ height: `calc(${currentIndex * 32}px + ${currentIndex * 42}px)` }}></div>

                {statusHierarchy.map((statusName, idx) => {
                    const past = idx < currentIndex;
                    const current = idx === currentIndex;
                    const future = idx > currentIndex;
                    
                    let bgClasses = "bg-[#f1f5f9] border border-[#e2e8f0] opacity-80 text-[#64748b] iconBg-[#cbd5e1] iconBgWrap-[#fafafa]";
                    
                    if (current) {
                        bgClasses = "bg-[#eff6ff] border border-[#bfdbfe] text-[#0f172a] iconBg-[#2563eb] iconBgWrap-[#fafafa]";
                    } else if (past) {
                        bgClasses = "bg-[#f0fdf4] border border-[#bbf7d0] text-[#0f172a] iconBg-[#16a34a] iconBgWrap-[#fafafa]";
                    }

                    return (
                        <div key={statusName} className={`${bgClasses.split(' ')[0]} ${bgClasses.split(' ')[1]} ${bgClasses.split(' ')[2]} rounded-xl p-4 flex gap-4 w-full relative ${future ? 'opacity-70' : ''}`}>
                            <div className={`w-10 h-10 rounded-full ${past || current ? (current ? 'bg-[#2563eb]' : 'bg-[#16a34a]') : 'bg-[#cbd5e1]'} flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]`}>
                                {past ? <CheckCircleIcon className="w-[18px] h-[18px]" /> : (current ? <ClockIcon className="w-[18px] h-[18px]" /> : <CubeIcon className="w-[18px] h-[18px]" />)}
                            </div>
                            <div className="flex flex-col ml-3 w-full">
                                <div className="flex justify-between items-start w-full">
                                    <span className={`font-bold ${future ? 'text-[#475569]' : 'text-[#0f172a]'} text-[15px]`}>{statusName}</span>
                                    {current && <span className="text-[#2563eb] text-[13px] font-bold">In Progress</span>}
                                </div>
                                {!future && idx === 0 && <span className="text-[#16a34a] text-[13px] mt-1">{formatDate(order.createdAt)}</span>}
                            </div>
                        </div>
                    )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-end bg-white">
              <button 
                onClick={() => setShowTrackModal(false)}
                className="px-8 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Layout Icons
function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function CubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
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

function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
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

function CloseCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
}

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
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

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
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

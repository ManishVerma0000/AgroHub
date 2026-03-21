"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SVGProps } from "react";

// Mock Data reproducing Order Details from Figma
const mockItems = [
  { id: "INV-001", name: "Tomato", qty: "50 Kg", price: "₹75.00", total: "₹3750.00" },
  { id: "INV-002", name: "Potato", qty: "30 Kg", price: "₹65.00", total: "₹1950.00" },
  { id: "INV-003", name: "Onion", qty: "40 Kg", price: "₹70.00", total: "₹2800.00" },
  { id: "INV-004", name: "Carrot", qty: "25 Kg", price: "₹60.00", total: "₹1500.00" },
  { id: "INV-005", name: "Cabbage", qty: "20 Kg", price: "₹55.00", total: "₹1100.00" },
];

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.id || "ORD-001";
  
  const [orderStatus, setOrderStatus] = useState("New Order");
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Helper flags
  const isConfirmed = orderStatus === "Confirmed Order";

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
            <span className="text-[#64748b] text-[15px]">Order ID: {orderId} • Placed on 18 Mar 2024</span>
          </div>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f1f5f9] text-[#475569] text-sm font-bold shadow-sm">
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
                  {mockItems.map((item) => (
                    <tr key={item.id} className="bg-white hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 shadow-sm border border-[#bbf7d0]">
                            <CubeIcon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[#0f172a] font-bold text-[15px]">{item.name}</span>
                            <span className="text-[#64748b] text-[13px]">{item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#475569]">{item.qty}</td>
                      <td className="px-6 py-4 text-[#0f172a] font-medium">{item.price}</td>
                      <td className="px-6 py-4 text-[#0f172a] font-bold">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Block natively rendered matching bottom border alignments */}
            <div className="flex flex-col items-end px-6 py-6 border-t border-[#e2e8f0] bg-[#fafafa]">
              <div className="w-full max-w-[300px] flex flex-col gap-4">
                <div className="flex justify-between items-center text-[#475569] text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#0f172a]">₹11100.00</span>
                </div>
                <div className="flex justify-between items-center text-[#475569] text-sm">
                  <span>GST (5%)</span>
                  <span className="font-bold text-[#0f172a]">₹555.00</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#cbd5e1] mt-1">
                  <span className="font-bold text-[#0f172a] text-[15px]">Total Amount</span>
                  <span className="font-bold text-[#16a34a] text-[20px]">₹11655.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Order Timeline Stepper Array */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-[#0f172a]">Order Timeline</h2>
            
            <div className="flex flex-col relative pt-2">
              {/* Native Generic CSS Timeline Border mapped absolutely spanning left gap */}
              <div className="absolute top-[18px] bottom-6 left-[15px] w-0.5 bg-[#e2e8f0] -z-10"></div>
              
              {/* Node: Order Placed */}
              <div className="flex gap-4 mb-6 relative">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0 shadow-sm border border-[#bbf7d0]">
                  <div className="w-2.5 h-2.5 bg-[#16a34a] rounded-full"></div>
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-[#0f172a] font-bold text-[15px] leading-none">Order Placed</span>
                  <span className="text-[#64748b] text-[13px] mt-1">18 Mar 2024 • 09:30 AM</span>
                </div>
              </div>

              {/* Node: New Order */}
              <div className="flex gap-4 mb-6 relative">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0 shadow-sm border border-[#bbf7d0]">
                  <div className="w-2.5 h-2.5 bg-[#16a34a] rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 pt-1.5 leading-none">
                  <span className="text-[#0f172a] font-bold text-[15px]">New Order</span>
                  {!isConfirmed && <span className="text-[#16a34a] text-xs font-bold">(Current)</span>}
                </div>
              </div>

              {/* Node: Confirmed Order */}
              <div className={`flex gap-4 mb-6 relative ${isConfirmed ? '' : 'opacity-60'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isConfirmed ? 'bg-[#dcfce7] border-[#bbf7d0] shadow-sm' : 'bg-[#f1f5f9] border-[#e2e8f0]/50'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${isConfirmed ? 'bg-[#16a34a]' : 'bg-[#cbd5e1]'}`}></div>
                </div>
                <div className="flex items-center gap-2 pt-1.5 leading-none">
                  <span className={`${isConfirmed ? 'text-[#0f172a] font-bold' : 'text-[#64748b] font-semibold'} text-[15px]`}>Confirmed Order</span>
                  {isConfirmed && <span className="text-[#16a34a] text-xs font-bold">(Current)</span>}
                </div>
              </div>

               {/* Node: Processing */}
              <div className="flex gap-4 mb-6 relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 border border-[#e2e8f0]/50">
                  <div className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-full"></div>
                </div>
                <div className="flex flex-col pt-1.5 leading-none">
                  <span className="text-[#64748b] font-semibold text-[15px]">Processing</span>
                </div>
              </div>

              {/* Node: Picking */}
              <div className="flex gap-4 mb-6 relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 border border-[#e2e8f0]/50">
                  <div className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-full"></div>
                </div>
                <div className="flex flex-col pt-1.5 leading-none">
                  <span className="text-[#64748b] font-semibold text-[15px]">Picking</span>
                </div>
              </div>

              {/* Node: Packing */}
              <div className="flex gap-4 mb-6 relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 border border-[#e2e8f0]/50">
                  <div className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-full"></div>
                </div>
                <div className="flex flex-col pt-1.5 leading-none">
                  <span className="text-[#64748b] font-semibold text-[15px]">Packing</span>
                </div>
              </div>

              {/* Node: Ready for Dispatch */}
              <div className="flex gap-4 mb-6 relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 border border-[#e2e8f0]/50">
                  <div className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-full"></div>
                </div>
                <div className="flex flex-col pt-1.5 leading-none">
                  <span className="text-[#64748b] font-semibold text-[15px]">Ready for Dispatch</span>
                </div>
              </div>

              {/* Node: Out for Delivery */}
              <div className="flex gap-4 mb-6 relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 border border-[#e2e8f0]/50">
                  <div className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-full"></div>
                </div>
                <div className="flex flex-col pt-1.5 leading-none">
                  <span className="text-[#64748b] font-semibold text-[15px]">Out for Delivery</span>
                </div>
              </div>

              {/* Node: Delivered */}
              <div className="flex gap-4 relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 border border-[#e2e8f0]/50">
                  <div className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-full"></div>
                </div>
                <div className="flex flex-col pt-1.5 leading-none">
                  <span className="text-[#64748b] font-semibold text-[15px]">Delivered</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Secondary Sidebar Formats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Customer Information Block */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Customer Information</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#0f172a] text-[15px]">ABC Restaurant</span>
                <span className="text-[#64748b] text-[13px]">Customer</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-4 border-t border-[#f1f5f9]">
              <div className="flex gap-3 items-start">
                <MailIcon className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col leading-tight gap-0.5">
                  <span className="text-[#64748b] text-[13px]">Email</span>
                  <span className="text-[#0f172a] text-sm">customer@example.com</span>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <PhoneIcon className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col leading-tight gap-0.5">
                  <span className="text-[#64748b] text-[13px]">Phone</span>
                  <span className="text-[#0f172a] text-sm">+91 98765 43210</span>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <MapPinIcon className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col leading-tight gap-0.5">
                  <span className="text-[#64748b] text-[13px]">Delivery Location</span>
                  <span className="text-[#0f172a] text-sm">Mumbai, India</span>
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
                Credit
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
              <span className="text-[#64748b] text-[13px]">Pending Amount</span>
              <span className="text-[#ca8a04] font-bold">₹0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] text-[13px]">Order Date</span>
              <span className="flex items-center gap-1.5 text-[#0f172a] font-medium text-[13px]">
                <CalendarIcon className="w-3.5 h-3.5 text-[#94a3b8]" />
                18 Mar 2024
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] text-[13px]">Total Items</span>
              <span className="text-[#0f172a] font-bold">5 items</span>
            </div>
          </div>

           {/* Offer Applied Target Block */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Offer Applied</h3>
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 flex items-start gap-4">
               <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                  <TagIcon className="w-4 h-4 text-[#16a34a]" />
               </div>
               <div className="flex flex-col w-full">
                  <span className="text-[#0f172a] font-bold text-[13px] mb-1.5">Bulk Order Discount - 20% Off</span>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex px-2 py-0.5 rounded bg-[#16a34a] text-white text-[10px] font-bold uppercase">BULK20</span>
                    <span className="text-[#64748b] text-[12px]">20% discount</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#bbf7d0]/60">
                    <span className="text-[#64748b] text-[12px]">You saved</span>
                    <span className="text-[#16a34a] font-bold">₹2220.00</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Action Trigger Stack */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Actions</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setOrderStatus("Confirmed Order")}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Confirm Order
              </button>
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
                  <span className="text-[#1e40af] font-bold text-[15px]">Order ID: {orderId}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dbeafe] text-[#1e40af] text-xs font-bold">
                    {orderStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#2563eb] text-sm font-medium">
                  <MapPinIcon className="w-4 h-4" />
                  Delivery to: Mumbai
                </div>
              </div>

              {/* Advanced Tracking Stepper */}
              <div className="flex flex-col relative pl-[42px] gap-2">
                {/* Native Generic CSS line spanning down from node to node */}
                <div className="absolute top-[32px] bottom-[32px] left-[27px] w-0.5 bg-[#e2e8f0] -z-10"></div>
                <div className="absolute top-[32px] bottom-[280px] left-[27px] w-0.5 bg-[#16a34a] -z-10"></div>

                {/* Tracking Node: Order Placed (Green) */}
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex gap-4 w-full relative group">
                  <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]">
                    <CubeIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="font-bold text-[#0f172a] text-[15px]">Order Placed</span>
                    <span className="text-[#475569] text-[13px] mb-1">Your order has been placed successfully</span>
                    <span className="text-[#16a34a] text-[13px]">18 Mar 2024, 09:30 AM</span>
                  </div>
                </div>

                {/* Tracking Node: Order Confirmed (Green) */}
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex gap-4 w-full relative">
                  <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]">
                    <CheckCircleIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="font-bold text-[#0f172a] text-[15px]">Order Confirmed</span>
                    <span className="text-[#475569] text-[13px] mb-1">Order has been confirmed and is ready for processing</span>
                    <span className="text-[#16a34a] text-[13px]">18 Mar 2024, 09:45 AM</span>
                  </div>
                </div>

                {/* Tracking Node: Processing (Blue / Current) */}
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 flex gap-4 w-full relative">
                  <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]">
                    <CubeIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex justify-between items-start w-full ml-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0f172a] text-[15px]">Processing</span>
                      <span className="text-[#475569] text-[13px]">Order is being processed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#2563eb] text-[13px] font-bold">
                       <ClockIcon className="w-3.5 h-3.5" />
                       In Progress
                    </div>
                  </div>
                </div>

                {/* Tracking Node: Picking (Grey) */}
                <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl p-4 flex gap-4 w-full relative opacity-80">
                  <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]">
                    <CubeIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="font-bold text-[#475569] text-[15px]">Picking</span>
                    <span className="text-[#64748b] text-[13px]">Items are being picked from warehouse</span>
                  </div>
                </div>

                {/* Tracking Node: Packing (Grey) */}
                <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl p-4 flex gap-4 w-full relative opacity-80">
                  <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]">
                    <CubeIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="font-bold text-[#475569] text-[15px]">Packing</span>
                    <span className="text-[#64748b] text-[13px]">Items are being packed</span>
                  </div>
                </div>

                {/* Tracking Node: Ready for Dispatch (Grey) */}
                <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl p-4 flex gap-4 w-full relative opacity-80">
                  <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]">
                    <CheckCircleIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="font-bold text-[#475569] text-[15px]">Ready for Dispatch</span>
                    <span className="text-[#64748b] text-[13px]">Package is ready for dispatch</span>
                  </div>
                </div>

                {/* Tracking Node: Out for Delivery (Grey) */}
                <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl p-4 flex gap-4 w-full relative opacity-80">
                  <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]">
                    <TruckIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="font-bold text-[#475569] text-[15px]">Out for Delivery</span>
                    <span className="text-[#64748b] text-[13px]">On the way to Mumbai</span>
                  </div>
                </div>

                {/* Tracking Node: Delivered (Grey) */}
                <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl p-4 flex gap-4 w-full relative opacity-80">
                  <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center text-white shrink-0 absolute -left-[35px] top-1/2 -translate-y-1/2 shadow-sm border-[4px] border-[#fafafa]">
                    <CheckCircleIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="font-bold text-[#475569] text-[15px]">Delivered</span>
                    <span className="text-[#64748b] text-[13px]">Package will be delivered soon</span>
                  </div>
                </div>
              </div>

               {/* Estimated Delivery Block */}
              <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-5 flex items-start gap-3 mt-8">
                <ClockIcon className="w-5 h-5 text-[#ca8a04] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[#713f12] font-bold text-[15px] mb-1">Estimated Delivery</span>
                  <span className="text-[#a16207] text-[13px]">Your order is expected to be delivered by 18 Mar 2024, 05:00 PM</span>
                </div>
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

function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
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

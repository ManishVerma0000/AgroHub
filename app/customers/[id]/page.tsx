"use client";

import React, { SVGProps, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { customerService, Customer } from "@/services/customerService";

export default function CustomerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await customerService.getById(id);
        setCustomer(data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-xl font-bold text-[#0f172a]">Customer not found</h2>
        <Link href="/customers" className="text-[#16a34a] font-semibold hover:underline">Back to Customers</Link>
      </div>
    );
  }

  const initials = customer.shopName?.charAt(0).toUpperCase() || "C";

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Header Row / Back Button */}
      <div className="flex flex-col gap-5">
        <Link href="/customers" className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#0f172a] text-[14px] font-semibold transition-colors w-max">
           <ArrowLeftIcon className="w-4 h-4" />
           Back to Customers
        </Link>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
             <div className="w-[60px] h-[60px] rounded-full bg-[#2dd4bf] text-white flex items-center justify-center font-bold text-[24px] shadow-sm">
               {initials}
             </div>
             <div className="flex flex-col gap-1">
                <h1 className="text-[28px] font-bold text-[#0f172a] leading-none">{customer.shopName}</h1>
                <span className="text-[#64748b] text-[14px]">Customer ID: {customer.id.slice(-8).toUpperCase()} &bull; Joined {new Date(customer.createdDate).toLocaleDateString()}</span>
             </div>
          </div>
          <span className={`px-5 py-1.5 rounded-full text-[14px] font-bold shadow-sm ${customer.customerStatus === 'Active' ? 'bg-[#dcfce3] text-[#16a34a]' : 'bg-[#fee2e2] text-[#ef4444]'}`}>
            {customer.customerStatus}
          </span>
        </div>
      </div>

      {/* KPI 4-Card Module */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center gap-2 text-[#64748b]">
             <ShoppingCartIcon className="w-[18px] h-[18px] text-[#3b82f6]" />
             <span className="text-[13.5px] font-medium tracking-tight">Total Orders</span>
          </div>
          <span className="text-[#0f172a] text-[30px] font-bold leading-none">{customer.totalOrders}</span>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center gap-2 text-[#64748b]">
             <TrendingUpIcon className="w-[18px] h-[18px] text-[#16a34a]" />
             <span className="text-[13.5px] font-medium tracking-tight">Total Spent</span>
          </div>
          <span className="text-[#16a34a] text-[30px] font-bold leading-none">₹{customer.totalSpent.toLocaleString()}</span>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center gap-2 text-[#64748b]">
             <CalendarIcon className="w-[18px] h-[18px] text-[#a855f7]" />
             <span className="text-[13.5px] font-medium tracking-tight">Last Order</span>
          </div>
          <span className="text-[#0f172a] text-[20px] font-bold pt-1.5">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "No orders"}</span>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center gap-2 text-[#64748b]">
             <BoxIcon className="w-[18px] h-[18px] text-[#f97316]" />
             <span className="text-[13.5px] font-medium tracking-tight">Avg Order Value</span>
          </div>
          <span className="text-[#0f172a] text-[26px] font-bold pt-1">₹{customer.totalOrders > 0 ? Math.round(customer.totalSpent / customer.totalOrders).toLocaleString() : "0"}</span>
        </div>
      </div>

      {/* Layout Grid: 70/30 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Order History Table - Placeholder for now as we don't have separate orders API for one customer yet in this component */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden w-full">
            <div className="px-6 py-5 border-b border-[#e2e8f0] flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-[#0f172a]">Order History</h2>
              <span className="text-xs text-[#64748b] bg-[#f8fafc] px-2 py-1 rounded">Recent 5 Orders</span>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                  <tr>
                    <th className="px-6 py-4">ORDER ID</th>
                    <th className="px-6 py-4">DATE</th>
                    <th className="px-6 py-4">AMOUNT</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {/* Since real orders aren't linked here yet, showing a message or mock if empty */}
                  {customer.totalOrders === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-[#64748b]">No orders found for this customer.</td>
                    </tr>
                  ) : (
                    <tr className="hover:bg-[#f8fafc] transition-colors">
                      <td colSpan={5} className="px-6 py-10 text-center text-[#64748b]">Order tracking is available in the Orders module.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Metadata / Docs */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 flex flex-col gap-6">
             <h2 className="text-[18px] font-bold text-[#0f172a]">Documents & Verification</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                   <span className="text-[13px] font-semibold text-[#64748b] uppercase tracking-wider">Aadhar Card (Front)</span>
                   {customer.aadharCardFront ? (
                      <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] h-48 bg-[#f8fafc] group">
                         <img src={customer.aadharCardFront} alt="Aadhar Front" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <EyeIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                         </div>
                      </div>
                   ) : (
                      <div className="rounded-xl border-2 border-dashed border-[#e2e8f0] h-48 flex items-center justify-center text-[#94a3b8] text-sm bg-white">
                         Not Uploaded
                      </div>
                   )}
                </div>
                <div className="flex flex-col gap-3">
                   <span className="text-[13px] font-semibold text-[#64748b] uppercase tracking-wider">Aadhar Card (Back)</span>
                   {customer.aadharCardBack ? (
                      <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] h-48 bg-[#f8fafc] group">
                         <img src={customer.aadharCardBack} alt="Aadhar Back" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <EyeIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                         </div>
                      </div>
                   ) : (
                      <div className="rounded-xl border-2 border-dashed border-[#e2e8f0] h-48 flex items-center justify-center text-[#94a3b8] text-sm bg-white">
                         Not Uploaded
                      </div>
                   )}
                </div>
             </div>
          </div>

        </div>

        {/* RIGHT METADATA COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Contact Information */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Contact Information</h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <MailIcon className="w-5 h-5 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#64748b] text-[12.5px] font-semibold">Owner Name</span>
                  <span className="text-[#0f172a] text-[14px] font-medium">{customer.ownerName}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PhoneIcon className="w-5 h-5 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#64748b] text-[12.5px] font-semibold">Phone</span>
                  <span className="text-[#0f172a] text-[14px] font-medium">+91 {customer.mobileNumber}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PinIcon className="w-5 h-5 text-[#94a3b8] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#64748b] text-[12.5px] font-semibold">City / Region</span>
                  <span className="text-[#0f172a] text-[14px] font-medium">{customer.city || "Not Specified"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 flex flex-col gap-5">
            <h3 className="text-[17px] font-bold text-[#0f172a]">Business Details</h3>
            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-center text-[13.5px]">
                  <span className="text-[#64748b] font-medium">Business Type</span>
                  <span className="text-[#0f172a] font-bold">{customer.shopType || "N/A"}</span>
               </div>
               <div className="flex justify-between items-center text-[13.5px]">
                  <span className="text-[#64748b] font-medium">Customer Since</span>
                  <span className="text-[#0f172a] font-bold">{new Date(customer.createdDate).toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between items-center text-[13.5px]">
                  <span className="text-[#64748b] font-medium">Engagement Level</span>
                  <span className={`inline-flex items-center px-3 py-1 text-[12px] font-bold rounded-full ${
                    customer.customerType === 'High' ? 'bg-[#dcfce3] text-[#16a34a]' : 
                    customer.customerType === 'Medium' ? 'bg-[#fef3c7] text-[#d97706]' : 
                    'bg-[#f1f5f9] text-[#64748b]'
                  }`}>
                    {customer.customerType}
                  </span>
               </div>
            </div>
          </div>

          {/* Addresses Component */}
          {customer.addresses && customer.addresses.length > 0 && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col pt-6 pb-2">
               <h3 className="text-[17px] font-bold text-[#0f172a] px-6 mb-4">Saved Addresses ({customer.addresses.length})</h3>
               <div className="flex flex-col gap-4 px-6 pb-6">
                  {customer.addresses.map((addr: any, idx) => (
                    <div key={idx} className={`rounded-xl p-5 flex flex-col gap-3 ${addr.isDefault ? 'bg-[#f0fdf4] border border-[#bbf7d0]' : 'bg-[#f8fafc] border border-[#e2e8f0]'}`}>
                       <div className="flex justify-between items-start">
                          <div className={`flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase ${addr.isDefault ? 'text-[#16a34a]' : 'text-[#64748b]'}`}>
                             <PinIcon className="w-3.5 h-3.5" />
                             {addr.isDefault ? "Primary Address" : "Additional Address"}
                          </div>
                       </div>
                       <span className="text-[#0f172a] font-bold text-[14px]">
                          {addr.shopName || customer.shopName}
                       </span>
                       <div className="flex items-start gap-2.5 text-[#475569] text-[13px] leading-relaxed relative -mt-1">
                          <PinIcon className="w-3.5 h-3.5 mt-1 shrink-0 text-[#94a3b8]" />
                          <span className="whitespace-pre-line">{addr.location}</span>
                       </div>
                       {addr.nearbyLandmark && (
                          <div className="text-[#64748b] text-[12px] -mt-1 pl-6 italic">
                             Near {addr.nearbyLandmark}
                          </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Quick Actions Component */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 flex flex-col gap-4">
             <h3 className="text-[17px] font-bold text-[#0f172a]">Quick Actions</h3>
             <div className="flex flex-col gap-3">
                <button className="w-full flex justify-center items-center gap-2 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-lg transition-colors text-sm shadow-sm">
                   <ShoppingCartAddIcon className="w-4 h-4" />
                   Create New Order
                </button>
                <a href={`tel:${customer.mobileNumber}`} className="w-full flex justify-center items-center gap-2 py-2.5 bg-white border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc] font-semibold rounded-lg transition-colors text-sm shadow-sm">
                   <PhoneIcon className="w-4 h-4 text-[#64748b]" />
                   Call Customer
                </a>
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

function ShoppingCartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function ShoppingCartAddIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      <line x1="12" y1="6" x2="12" y2="10"/>
      <line x1="10" y1="8" x2="14" y2="8"/>
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

function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
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

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
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

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M8 10h.01M8 14h.01M12 14h.01M16 14h.01"/>
    </svg>
  );
}

function TruckEmptyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

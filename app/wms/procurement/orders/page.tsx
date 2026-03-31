"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { purchaseOrderService, PurchaseOrder } from "../../../../services/purchaseOrderService";

export default function PurchaseOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await purchaseOrderService.getAll();
      // Sort newest first
      data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch purchase orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (selectedStatus !== "All Status" && o.status !== selectedStatus) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return ["-", ""];
    try {
      const d = new Date(dateString);
      const day = d.getDate();
      const month = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      return [`${day} ${month}`, `${year}`];
    } catch {
      return [dateString, ""];
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-bold text-[#1e293b]">Purchase Orders</h1>
          <div className="flex items-center gap-1 text-[#64748b]">
            <span className="text-xl">{filteredOrders.length}</span>
            <ChevronDownIcon className="w-5 h-5 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors shadow-sm">
            Bulk Action
            <ChevronDownIcon className="w-4 h-4 text-[#64748b]" />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#64748b]" />
            All Time
            <ChevronDownIcon className="w-4 h-4 text-[#64748b]" />
          </button>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#15803d] text-white rounded-lg text-sm font-semibold hover:bg-[#166534] transition-colors shadow-[0_4px_12px_-2px_rgba(21,128,61,0.2)]"
          >
            <PlusIcon className="w-4 h-4" />
            New
          </button>
          
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#64748b] mr-1">Filter by:</span>
        
        <div className="relative">
          <select 
            value={selectedStatus} 
            onChange={e => setSelectedStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[#1e293b] text-sm font-medium transition-colors outline-none cursor-pointer shadow-sm min-w-[130px]"
          >
            <option value="All Status">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#64748b] font-semibold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-5 py-4 w-12">
                  <div className="w-4 h-4 border-2 border-[#cbd5e1] rounded cursor-pointer hover:border-[#94a3b8] transition-colors"></div>
                </th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8]">PO ID</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8]">Supplier</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8]">Order<br/>Date</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8]">Expected<br/>Delivery</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8]">Items</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8]">PO Amount<br/>(Planned)</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8]">Actual PO<br/>Amount</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8] text-center">Status</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-[#94a3b8] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-5 py-8 text-center text-[#64748b]">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-8 text-center text-[#64748b]">No purchase orders found.</td>
                </tr>
              ) : filteredOrders.map((order) => {
                const [orderDay, orderYear] = formatDate(order.orderDate);
                const [delDay, delYear] = formatDate(order.expectedDelivery);
                
                return (
                <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-4 h-4 border-2 border-[#cbd5e1] rounded cursor-pointer hover:border-[#94a3b8] transition-colors"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[#2563eb] font-semibold cursor-pointer hover:underline">
                      <span>{order.poNumber.split('-')[0]}-</span>
                      <span>{order.poNumber.split('-')[1]}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col font-bold text-[#0f172a] text-[14px] whitespace-normal md:whitespace-nowrap max-w-[200px] truncate">
                      <span>{order.supplierName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[#64748b] font-medium">
                      <span>{orderDay}</span>
                      <span>{orderYear}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#64748b] font-medium">
                    {order.expectedDelivery ? `${delDay} ${delYear}` : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[#1e293b] font-semibold">
                      <span>{order.items?.length || 0}</span>
                      <span className="text-[#64748b] font-normal text-xs">{order.items?.length === 1 ? 'item' : 'items'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-[#1e293b]">
                    ₹{(order.totalAmount || 0).toLocaleString()}
                  </td>
                  <td className={`px-5 py-4 font-bold ${order.status !== 'Completed' ? 'text-[#16a34a]' : 'text-[#16a34a]'}`}>
                    {order.status !== 'Completed' ? '-' : `₹${(order.totalAmount || 0).toLocaleString()}`}
                  </td>
                  <td className="px-5 py-4 text-center">
                     <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                       order.status === 'Completed' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fefce8] text-[#ca8a04]'
                     }`}>
                       {order.status}
                     </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                       <Link href={`/wms/procurement/orders/${order.id}`} className="text-[#64748b] hover:text-[#1e293b] transition-colors" title="View">
                         <EyeIcon className="w-4 h-4" />
                       </Link>
                       {order.status === 'Pending' && (
                         <Link href={`/wms/procurement/orders/${order.id}`} className="text-[#64748b] hover:text-[#1e293b] transition-colors" title="Edit">
                           <EditPencilIcon className="w-4 h-4" />
                         </Link>
                       )}
                       <button 
                          onClick={async () => {
                            if(confirm("Are you sure you want to delete this PO?")) {
                              await purchaseOrderService.delete(order.id);
                              fetchOrders();
                            }
                          }}
                          className="text-[#ef4444] hover:text-[#dc2626] transition-colors" 
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#e2e8f0] flex justify-between items-center bg-white">
          <span className="text-sm text-[#475569]">Showing 1 to {filteredOrders.length} of {filteredOrders.length} results</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-[#e2e8f0] text-[#64748b] text-sm rounded-md hover:bg-[#f8fafc] transition-colors">Previous</button>
            <button className="px-3 py-1.5 border border-[#15803d] bg-[#15803d] text-white font-semibold text-sm rounded-md shadow-sm">1</button>
            <button className="px-3 py-1.5 border border-[#e2e8f0] text-[#64748b] text-sm rounded-md hover:bg-[#f8fafc] transition-colors">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}

// SVG Icons
function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
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

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EditPencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  );
}

function DocumentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

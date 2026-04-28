"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { mobileOrderService, MobileOrder } from "../../../../services/mobileOrderService";
import { wmsAuthService } from "../../../../services/wmsAuthService";
import { dispatchService, DispatchBatch } from "../../../../services/dispatchService";
import toast from "react-hot-toast";


const avatarColors = ["bg-[#0ea5e9]", "bg-[#0d9488]", "bg-[#38bdf8]", "bg-[#0284c7]", "bg-[#10b981]", "bg-[#14b8a6]", "bg-[#8b5cf6]", "bg-[#db2777]"];
const getAvatarBg = (name: string) => {
  if (!name) return avatarColors[0];
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function DispatchManagementPage() {
  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [history, setHistory] = useState<DispatchBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [warehouseId, setWarehouseId] = useState<string | null>(null);

  // Batch Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batchFormData, setBatchFormData] = useState({
    vehicleNumber: "",
    driverName: "",
    route: ""
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('wmsToken');
      if (!token) return;
      const profile = await wmsAuthService.getProfile(token);
      setWarehouseId(profile.id);
      
      const [orderData, historyData] = await Promise.all([
        mobileOrderService.getByWarehouseAndStatus(profile.id, "Packing"),
        dispatchService.getHistory(profile.id)
      ]);
      
      setOrders(orderData);
      setHistory(historyData);
    } catch (err) {
      console.error("Error fetching dispatch data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);



  const handleCreateBatch = async () => {
    if (!batchFormData.driverName || !batchFormData.vehicleNumber || !batchFormData.route) {
      toast.error("Please fill all fields");
      return;
    }

    if (!warehouseId) return;

    setIsSubmitting(true);
    try {
      await dispatchService.createBatch({
        orderIds: Array.from(selectedOrderIds),
        driverName: batchFormData.driverName,
        vehicleNumber: batchFormData.vehicleNumber,
        route: batchFormData.route,
        warehouseId: warehouseId
      });
      
      toast.success("Dispatch batch created successfully");
      setIsBatchModalOpen(false);
      setSelectedOrderIds(new Set());
      setBatchFormData({ driverName: "", vehicleNumber: "", route: "" });
      fetchOrders();
    } catch (err) {
      console.error("Error creating batch:", err);
      toast.error("Failed to create dispatch batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === orders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(orders.map(o => o.id)));
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] pb-10">

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
          <span className="text-[#2563eb] text-[32px] font-bold leading-none">
            {history.filter(h => h.status === 'Out for Delivery').length || "—"}
          </span>
          <span className="text-[#94a3b8] text-[13px]">Currently in transit</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Delivered Today</span>
          <span className="text-[#16a34a] text-[32px] font-bold leading-none">
            {history.filter(h => h.status === 'Delivered').length || "—"}
          </span>
          <span className="text-[#94a3b8] text-[13px]">Successfully delivered</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-2">
          <span className="text-[#64748b] text-[15px] font-medium">Active Vehicles</span>
          <span className="text-[#0f172a] text-[32px] font-bold leading-none">
            {new Set(history.filter(h => h.status === 'Out for Delivery').map(h => h.vehicleNumber)).size || "—"}
          </span>
          <span className="text-[#94a3b8] text-[13px]">Vehicles on road</span>
        </div>
      </div>

      {/* Packed Orders — Ready for Dispatch */}
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
                      <th className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]"
                          checked={selectedOrderIds.size === orders.length && orders.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </th>
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
                      const isSelected = selectedOrderIds.has(order.id);

                      return (
                        <tr key={order.id} className={`hover:bg-[#f8fafc] transition-colors ${isSelected ? 'bg-[#f0fdf4]' : ''}`}>
                          <td className="px-6 py-5">
                             <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]"
                              checked={isSelected}
                              onChange={() => toggleSelectOrder(order.id)}
                            />
                          </td>
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
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dcfce7] text-[#16a34a] text-[12px] font-bold">
                              <BoxIcon className="w-3.5 h-3.5" />
                              Packed
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <button
                              id={`dispatch-${order.id}`}
                              onClick={() => {
                                setSelectedOrderIds(new Set([order.id]));
                                setIsBatchModalOpen(true);
                              }}
                              className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-lg transition-all active:scale-95 text-[13px] shadow-sm inline-flex items-center gap-2 min-w-[160px] justify-center"
                            >
                              <TruckIcon className="w-3.5 h-3.5" />
                              Create Dispatch Batch (1)
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
                {selectedOrderIds.size > 0 && (
                  <button 
                    onClick={() => setIsBatchModalOpen(true)}
                    className="px-6 py-2 bg-[#16a34a] text-white text-sm font-bold rounded-lg hover:bg-[#15803d] transition-all active:scale-95 shadow-md"
                  >
                    Create Dispatch Batch ({selectedOrderIds.size})
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dispatch History Section */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-[18px] font-bold text-[#0f172a]">Dispatch History</h2>
        
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-6 py-4">DISPATCH ID</th>
                  <th className="px-6 py-4">VEHICLE</th>
                  <th className="px-6 py-4">DRIVER</th>
                  <th className="px-6 py-4">ORDERS</th>
                  <th className="px-6 py-4">ROUTE</th>
                  <th className="px-6 py-4">DISPATCH TIME</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-[#94a3b8]">No dispatch history available</td>
                  </tr>
                ) : (
                  history.map((batch) => (
                    <tr key={batch.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-5">
                        <span className="text-[#2563eb] font-semibold">{batch.dispatchId}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-[#475569]">
                           <TruckIcon className="w-4 h-4 text-[#94a3b8]" />
                           <span>{batch.vehicleNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[#0f172a] font-medium">{batch.driverName}</td>
                      <td className="px-6 py-5 text-[#475569]">{batch.orderCount} orders</td>
                      <td className="px-6 py-5 text-[#475569]">{batch.route}</td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2 text-[#475569]">
                            <ClockIcon className="w-4 h-4 text-[#94a3b8]" />
                            <span>{batch.dispatchTime ? formatTime(batch.dispatchTime) : "N/A"}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${
                          batch.status === 'Delivered' 
                            ? 'bg-[#dcfce7] text-[#16a34a]' 
                            : 'bg-[#dbeafe] text-[#2563eb]'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="p-1.5 text-[#94a3b8] hover:text-[#0f172a] transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Batch Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
             <div className="px-6 py-4 flex items-center justify-between border-b border-[#f1f5f9]">
                <h2 className="text-lg font-bold text-[#111827]">Create Dispatch Batch</h2>
                <button onClick={() => setIsBatchModalOpen(false)} className="text-[#94a3b8] hover:text-[#111827]">
                   <XIcon className="w-5 h-5" />
                </button>
             </div>

             <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Driver Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter driver name"
                    value={batchFormData.driverName}
                    onChange={(e) => setBatchFormData({ ...batchFormData, driverName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Vehicle Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. MH-02-AB-1234"
                    value={batchFormData.vehicleNumber}
                    onChange={(e) => setBatchFormData({ ...batchFormData, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Delivery Route <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai Central Route"
                    value={batchFormData.route}
                    onChange={(e) => setBatchFormData({ ...batchFormData, route: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                  />
                </div>

                <div className="mt-2 p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-[#64748b]">Selected Orders:</span>
                      <span className="font-bold text-[#111827]">{selectedOrderIds.size}</span>
                   </div>
                </div>
             </div>

             <div className="px-6 py-4 border-t border-[#f1f5f9] flex gap-3">
                <button
                  onClick={() => setIsBatchModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-semibold hover:bg-[#f8fafc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBatch}
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-[#16a34a] text-white rounded-xl text-sm font-semibold hover:bg-[#15803d] transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Creating...
                    </>
                  ) : (
                    "Confirm Dispatch"
                  )}
                </button>
             </div>
          </div>
        </div>
      )}

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
      <path d="M1 3h15v13H1z"/>
      <path d="M16 8h4l3 3v5h-7V8z"/>
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

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
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

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}


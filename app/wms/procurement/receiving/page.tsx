"use client";

import React, { useState, useEffect } from "react";
import { SVGProps } from "react";
import Link from "next/link";
import { purchaseOrderService, PurchaseOrder, PurchaseOrderItem } from "../../../../services/purchaseOrderService";
import { warehouseProductService } from "../../../../services/warehouseProductService";

// Helper to format dates cleanly
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function POReceivingPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  
  // receiveData holds form data keyed by the item index
  const [receiveData, setReceiveData] = useState<Record<number, { qty: number; price: number }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await purchaseOrderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching purchase orders", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingOrders = orders.filter(o => o.status === "Pending");
  const receivedOrders = orders.filter(o => o.status === "Completed" || o.status === "Received");

  const openReceiveModal = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    
    // Initialize form states
    const initData: Record<number, { qty: number; price: number }> = {};
    order.items?.forEach((item, index) => {
      initData[index] = {
        qty: item.quantity || 0,
        price: item.unitPrice || 0
      };
    });
    setReceiveData(initData);
    setShowReceiveModal(true);
  };

  const handleInputChange = (index: number, field: "qty" | "price", value: number) => {
    setReceiveData(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value
      }
    }));
  };

  // Compute stats for modal
  const modalTotalQty = Object.values(receiveData).reduce((sum, data) => sum + (data.qty || 0), 0);
  const modalTotalAmt = Object.values(receiveData).reduce((sum, data) => sum + ((data.qty || 0) * (data.price || 0)), 0);

  const confirmReceiving = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      // 1. Prepare updated items
      const updatedItems = selectedOrder.items?.map((item, index) => ({
        ...item,
        receivedQuantity: receiveData[index].qty,
        actualUnitPrice: receiveData[index].price,
        receivedAmount: receiveData[index].qty * receiveData[index].price
      }));

      // 2. Call PUT update with 'Completed' status + the augmented items
      // We keep the original totalAmount as "planned" but calculate Actual on the fly in history
      await purchaseOrderService.update(selectedOrder.id, {
        status: "Completed",
        items: updatedItems
      });
      
      // 3. Update Warehouse Product Base Prices
      // Use the default WMS warehouse ID
      const targetWarehouseId = "69b82ccf3709f6cca0ec8c41"; 
      try {
        const warehouseProducts = await warehouseProductService.getAll(targetWarehouseId);
        
        for (const item of updatedItems || []) {
          if (item.actualUnitPrice && item.productId) {
            const wp = warehouseProducts.find((p: any) => p.productId === item.productId);
            if (wp) {
              await warehouseProductService.update(wp.id, {
                basePrice: item.actualUnitPrice
              });
            }
          }
        }
      } catch (wpError) {
        console.error("Failed to update inventory prices:", wpError);
        // We don't block the UI if inventory price update fails, but we log it
      }

      // 3. Close modal & Refetch
      setShowReceiveModal(false);
      fetchOrders();
    } catch (error) {
      console.error("Failed to receive PO", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute stats for Recently Received table
  const computeActualAmount = (order: PurchaseOrder) => {
    let actual = 0;
    order.items?.forEach((i: any) => {
      if (i.receivedQuantity !== undefined && i.actualUnitPrice !== undefined) {
        actual += i.receivedQuantity * i.actualUnitPrice;
      } else {
        actual += (i.quantity || 0) * (i.unitPrice || 0);
      }
    });
    return actual;
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <h1 className="text-[26px] font-bold text-[#1e293b]">PO Receiving</h1>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]"></div>
        </div>
      ) : (
        <>
          {/* Pending to Receive Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[17px] font-bold text-[#0f172a]">Pending to Receive</h2>
            
            {pendingOrders.length === 0 ? (
                <div className="bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl p-8 text-center text-[#64748b]">
                    No pending purchase orders available.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pendingOrders.map(order => (
                    <div key={order.id} className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                        <span className="text-[#2563eb] font-semibold">
                            {order.poNumber}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#fefce8] text-[#ca8a04] text-[11px] font-bold">
                            {order.status}
                        </span>
                        </div>
                        
                        <div className="flex flex-col gap-1 mb-4">
                        <h3 className="text-[#0f172a] font-bold text-[15px]">{order.supplierName}</h3>
                        <span className="text-[#64748b] text-xs">Expected: {formatDate(order.expectedDelivery)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <span className="text-[#475569] text-sm">{order.items?.length || 0} items</span>
                        </div>
                        <span className="text-[#0f172a] font-bold">₹{order.totalAmount?.toLocaleString('en-IN') || 0}</span>
                        </div>
                        
                        <button 
                        onClick={() => openReceiveModal(order)}
                        className="w-full py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg transition-colors text-sm shadow-sm mt-auto"
                        >
                        Receive Stock
                        </button>
                    </div>
                ))}
                </div>
            )}
          </div>

          {/* Recently Received Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[17px] font-bold text-[#0f172a]">Recently Received</h2>
            
            {receivedOrders.length === 0 ? (
                <div className="bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl p-8 text-center text-[#64748b]">
                    No recently received orders history available.
                </div>
            ) : (
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                        <tr>
                        <th className="px-6 py-4">PO ID</th>
                        <th className="px-6 py-4">Supplier</th>
                        <th className="px-6 py-4">Order Date</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Planned Amount</th>
                        <th className="px-6 py-4">Actual Amount</th>
                        <th className="px-6 py-4">Variance</th>
                        <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                        {receivedOrders.map(order => {
                            const actualAmt = computeActualAmount(order);
                            const variance = actualAmt - order.totalAmount;
                            const perc = order.totalAmount ? (variance / order.totalAmount) * 100 : 0;
                            const varianceColor = variance > 0 ? "text-[#ef4444]" : variance < 0 ? "text-[#16a34a]" : "text-[#64748b]";
                            const varianceSign = variance > 0 ? "+" : "";

                            return (
                                <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors">
                                <td className="px-6 py-4">
                                    <span className="text-[#2563eb] font-semibold">{order.poNumber}</span>
                                </td>
                                <td className="px-6 py-4 text-[#0f172a] font-medium">{order.supplierName}</td>
                                <td className="px-6 py-4 text-[#64748b]">{formatDate(order.orderDate)}</td>
                                <td className="px-6 py-4 text-[#475569]">{order.items?.length || 0} items</td>
                                <td className="px-6 py-4 text-[#0f172a] font-bold">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4 text-[#16a34a] font-bold">₹{actualAmt.toLocaleString('en-IN')}</td>
                                <td className={`px-6 py-4 font-bold ${varianceColor}`}>
                                    {variance === 0 ? "₹0" : `${varianceSign}₹${Math.abs(variance).toLocaleString('en-IN')}`} 
                                    {variance !== 0 && <span className="text-xs ml-0.5">({varianceSign}{perc.toFixed(1)}%)</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#dcfce7] text-[#16a34a] text-[11px] font-bold">
                                    Completed
                                    </span>
                                </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
                </div>
                </div>
            )}
          </div>
        </>
      )}

      {/* Receive Purchase Order Modal Overlay */}
      {showReceiveModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#e2e8f0]">
              <div className="flex flex-col">
                <h2 className="text-[20px] font-bold text-[#0f172a]">Receive Purchase Order</h2>
                <span className="text-sm text-[#64748b] mt-0.5">{selectedOrder.poNumber} - {selectedOrder.supplierName} - Expected: {formatDate(selectedOrder.expectedDelivery)}</span>
              </div>
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="text-[#64748b] hover:text-[#0f172a] transition-colors p-1"
                disabled={isSubmitting}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-[#fafafa]">
              
              {/* Instructions Banner */}
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-4 text-sm text-[#1e40af]">
                <span className="font-bold">Instructions:</span> Enter the quantity received and actual procurement price for each item. Leave quantity as 0 for items not received.
              </div>

              {/* Editable Receiving Form Block */}
              <div className="flex flex-col border border-[#e2e8f0] rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
                      <tr>
                        <th className="px-5 py-4">Product</th>
                        <th className="px-5 py-4">Ordered</th>
                        <th className="px-5 py-4">Planned Price</th>
                        <th className="px-5 py-4">Receive Qty<span className="text-[#94a3b8]">*</span></th>
                        <th className="px-5 py-4">Actual Price<span className="text-[#94a3b8]">*</span></th>
                        <th className="px-5 py-4 text-right">Line Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {selectedOrder.items?.map((item, index) => {
                         const lineAmt = (receiveData[index]?.qty || 0) * (receiveData[index]?.price || 0);

                         return (
                            <tr key={index} className="bg-[#f0fdf4]/30 hover:bg-[#f0fdf4]/60 transition-colors">
                                <td className="px-5 py-4">
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#0f172a]">{item.productName}</span>
                                </div>
                                </td>
                                <td className="px-5 py-4 text-[#0f172a] font-semibold">{item.quantity}</td>
                                <td className="px-5 py-4 text-[#0f172a]">₹{item.unitPrice}</td>
                                <td className="px-5 py-4">
                                <input 
                                    type="number" 
                                    value={receiveData[index]?.qty ?? ""}
                                    onChange={(e) => handleInputChange(index, "qty", Number(e.target.value))}
                                    className="w-full max-w-[120px] px-3 py-2 border border-[#cbd5e1] rounded-md text-sm outline-none focus:border-[#16a34a] bg-white transition-colors" 
                                    min="0"
                                />
                                </td>
                                <td className="px-5 py-4">
                                <input 
                                    type="number" 
                                    value={receiveData[index]?.price ?? ""}
                                    onChange={(e) => handleInputChange(index, "price", Number(e.target.value))}
                                    className="w-full max-w-[120px] px-3 py-2 border border-[#cbd5e1] rounded-md text-sm outline-none focus:border-[#16a34a] bg-white transition-colors" 
                                    min="0"
                                />
                                </td>
                                <td className="px-5 py-4 font-bold text-[#0f172a] text-right">₹{lineAmt.toLocaleString('en-IN')}</td>
                            </tr>
                         )
                      })}
                    </tbody>
                    <tfoot className="border-t border-[#e2e8f0] bg-white">
                      <tr>
                        <td colSpan={4}></td>
                        <td className="px-5 py-4 font-bold text-[#475569] text-right">Actual Total:</td>
                        <td className="px-5 py-4 font-bold text-[#16a34a] text-[15px] text-right">₹{modalTotalAmt.toLocaleString('en-IN')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Receiving Summary Stats */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm mt-2">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">Receiving Summary</h3>
                <div className="grid grid-cols-4 gap-8">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] text-[#64748b]">Items to Receive</span>
                    <span className="font-bold text-[#2563eb] text-[15px]">{selectedOrder.items?.length || 0}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] text-[#64748b]">Total Quantity</span>
                    <span className="font-bold text-[#0f172a] text-[15px]">{modalTotalQty}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] text-[#64748b]">Total Amount</span>
                    <span className="font-bold text-[#16a34a] text-[15px]">₹{modalTotalAmt.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="px-6 py-2.5 border border-[#cbd5e1] text-[#0f172a] font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmReceiving}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:bg-[#86efac] text-white font-semibold rounded-lg transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Processing..." : "Confirm Receiving"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Icons
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

function MoreVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="12" cy="5" r="1"/>
      <circle cx="12" cy="19" r="1"/>
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
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

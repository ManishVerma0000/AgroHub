"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { purchaseOrderService, PurchaseOrder } from "../../../../../services/purchaseOrderService";

// Helper to format dates cleanly
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function PurchaseOrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const pId = resolvedParams.id;
  
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (pId) {
      fetchOrder();
    }
  }, [pId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await purchaseOrderService.getById(pId);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching purchase order details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
          <p className="text-[#64748b]">Purchase Order not found.</p>
          <Link href="/wms/procurement/orders" className="text-[#2563eb] hover:underline font-medium">Back to Orders</Link>
      </div>
    );
  }

  const isPending = order.status === "Pending";
  
  // Calculate Totals
  const computeActualAmount = () => {
    let actual = 0;
    order.items?.forEach((i: any) => {
      if (i.receivedQuantity !== undefined && i.actualUnitPrice !== undefined) {
        actual += Number(i.receivedQuantity) * Number(i.actualUnitPrice);
      } else {
        actual += (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0);
      }
    });
    return actual;
  };

  const actualTotal = order.status === "Pending" ? 0 : computeActualAmount();
  const plannedTotal = order.totalAmount || 0;
  const totalVariance = actualTotal - plannedTotal;

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Navigation & Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/wms/procurement/orders" className="p-2 hover:bg-[#f1f5f9] rounded-lg transition-colors text-[#0f172a]">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-[26px] font-bold text-[#1e293b]">Purchase Order Details</h1>
            <p className="text-sm text-[#64748b] mt-0.5">View and manage purchase order information</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isPending && (
            <button 
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white font-semibold rounded-lg text-sm hover:bg-[#1d4ed8] transition-colors shadow-sm"
            >
              <EditPencilIcon className="w-4 h-4" />
              Edit PO
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#0f172a] font-semibold rounded-lg text-sm hover:bg-[#f8fafc] transition-colors shadow-sm">
            <DownloadIcon className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-4 gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#64748b]">PO ID</span>
            <span className="font-bold text-[#2563eb] text-[15px]">{order.poNumber}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#64748b]">Supplier</span>
            <span className="font-semibold text-[#0f172a] text-[15px]">{order.supplierName}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#64748b]">Order Date</span>
            <span className="font-semibold text-[#0f172a] text-[15px]">{formatDate(order.orderDate)}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#64748b]">Expected Delivery</span>
            <span className="font-semibold text-[#0f172a] text-[15px]">{formatDate(order.expectedDelivery)}</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-6 mt-2 border-t border-[#f1f5f9]">
            <span className="text-[13px] text-[#64748b]">Status</span>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isPending ? 'bg-[#fefce8] text-[#ca8a04]' : 'bg-[#dcfce7] text-[#16a34a]'}`}>
                {order.status}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pt-6 mt-2 border-t border-[#f1f5f9]">
            <span className="text-[13px] text-[#64748b]">PO Amount (Planned)</span>
            <span className="font-bold text-[#0f172a] text-[15px]">₹{plannedTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex flex-col gap-1.5 pt-6 mt-2 border-t border-[#f1f5f9]">
            <span className="text-[13px] text-[#64748b]">Actual PO Amount</span>
            <span className="font-bold text-[#16a34a] text-[15px]">₹{actualTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex flex-col gap-1.5 pt-6 mt-2 border-t border-[#f1f5f9]">
            <span className="text-[13px] text-[#64748b]">Total Difference</span>
            <div className={`flex items-center gap-1.5 font-bold text-[15px] ${totalVariance <= 0 ? 'text-[#16a34a]' : 'text-[#ef4444]'}`}>
              <span>₹{Math.abs(totalVariance).toLocaleString('en-IN')}</span>
              {totalVariance <= 0 ? <TrendingDownIcon className="w-4 h-4" /> : <TrendingUpIcon className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table Section */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden mt-2">
        <div className="p-5 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-bold text-[#0f172a]">Order Items</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[#64748b] font-semibold text-[11px] uppercase tracking-wider">
              <tr className="bg-[#f8fafc]">
                <th rowSpan={2} className="px-6 py-4 align-bottom border-b border-[#e2e8f0]">Product Name</th>
                <th rowSpan={2} className="px-6 py-4 align-bottom border-b border-[#e2e8f0]">Unit</th>
                
                <th colSpan={3} className="px-6 py-3 text-center border-b border-l border-[#e2e8f0]">Planned</th>
                
                <th colSpan={3} className="px-6 py-3 text-center border-b border-l border-[#e2e8f0]">Actual</th>
                
                <th colSpan={2} className="px-6 py-3 text-center border-b border-l border-[#e2e8f0]">Variance</th>
              </tr>
              <tr className="bg-[#fcfcfc]">
                <th className="px-6 py-3 border-b border-l border-[#e2e8f0] text-center">Qty</th>
                <th className="px-6 py-3 border-b border-[#e2e8f0] text-center">Price</th>
                <th className="px-6 py-3 border-b border-[#e2e8f0] text-center">Amount</th>
                
                <th className="px-6 py-3 border-b border-l border-[#e2e8f0] text-center">Received</th>
                <th className="px-6 py-3 border-b border-[#e2e8f0] text-center">Price</th>
                <th className="px-6 py-3 border-b border-[#e2e8f0] text-center">Amount</th>
                
                <th className="px-6 py-3 border-b border-l border-[#e2e8f0] text-center">Price Diff</th>
                <th className="px-6 py-3 border-b border-[#e2e8f0] text-center">Amount Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {order.items?.map((item: any, idx: number) => {
                const pQty = Number(item.quantity || 0);
                const pPrice = Number(item.unitPrice || 0);
                const pAmt = pQty * pPrice;

                const aQty = order.status === "Pending" ? 0 : Number(item.receivedQuantity ?? 0);
                const aPrice = order.status === "Pending" ? 0 : Number(item.actualUnitPrice ?? 0);
                const aAmt = aQty * aPrice;

                const priceVar = aPrice - pPrice;
                const amtVar = aAmt - pAmt;

                return (
                  <tr key={idx} className="hover:bg-[#f8fafc] transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#0f172a]">{item.productName}</td>
                    <td className="px-6 py-4 text-[#64748b]">{item.unit || "Kg"}</td>
                    
                    <td className="px-6 py-4 text-center text-[#475569] border-l border-[#f1f5f9] group-hover:border-[#e2e8f0] transition-colors">{pQty}</td>
                    <td className="px-6 py-4 text-center text-[#475569]">₹{pPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center font-bold text-[#0f172a]">₹{pAmt.toLocaleString()}</td>
                    
                    <td className={`px-6 py-4 text-center text-[#475569] border-l border-[#f1f5f9] group-hover:border-[#e2e8f0] transition-colors ${order.status === 'Pending' ? 'text-[#94a3b8]' : ''}`}>
                      {order.status === 'Pending' ? '-' : aQty}
                    </td>
                    <td className={`px-6 py-4 text-center text-[#475569] ${order.status === 'Pending' ? 'text-[#94a3b8]' : ''}`}>
                      {order.status === 'Pending' ? '-' : `₹${aPrice.toLocaleString()}`}
                    </td>
                    <td className={`px-6 py-4 text-center font-bold ${order.status === 'Pending' ? 'text-[#94a3b8]' : 'text-[#16a34a]'}`}>
                      {order.status === 'Pending' ? '-' : `₹${aAmt.toLocaleString()}`}
                    </td>
                    
                    <td className={`px-6 py-4 text-center font-bold border-l border-[#f1f5f9] group-hover:border-[#e2e8f0] transition-colors ${priceVar > 0 ? 'text-[#ef4444]' : priceVar < 0 ? 'text-[#16a34a]' : 'text-[#64748b]'}`}>
                      {order.status === 'Pending' ? '-' : `${priceVar > 0 ? '+' : ''}₹${priceVar.toLocaleString()}`}
                    </td>
                    <td className={`px-6 py-4 text-center font-bold ${amtVar > 0 ? 'text-[#ef4444]' : amtVar < 0 ? 'text-[#16a34a]' : 'text-[#64748b]'}`}>
                      {order.status === 'Pending' ? '-' : `${amtVar > 0 ? '+' : ''}₹${amtVar.toLocaleString()}`}
                    </td>
                  </tr>
                );
              })}
              
              {/* Footer Total Row */}
              <tr className="bg-[#fcfcfc]">
                <td colSpan={2}></td>
                <td className="px-6 py-5 text-right border-l border-[#e2e8f0]"></td>
                <td className="px-6 py-5 text-right font-bold text-[#0f172a]">Total:</td>
                <td className="px-6 py-5 text-center font-bold text-[#0f172a] text-[15px]">₹{plannedTotal.toLocaleString()}</td>
                
                <td className="px-6 py-5 border-l border-[#e2e8f0]"></td>
                <td className="px-6 py-5"></td>
                <td className="px-6 py-5 text-center font-bold text-[#16a34a] text-[15px]">₹{actualTotal.toLocaleString()}</td>
                
                <td className="px-6 py-5 border-l border-[#e2e8f0]"></td>
                <td className={`px-6 py-5 text-center font-bold text-[15px] ${totalVariance > 0 ? 'text-[#ef4444]' : 'text-[#16a34a]'}`}>
                  {totalVariance > 0 ? '+' : ''}₹{totalVariance.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Purchase Order Modal Overlay */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#e2e8f0]">
              <div className="flex flex-col">
                <h2 className="text-[20px] font-bold text-[#0f172a]">Edit Purchase Order</h2>
                <span className="text-sm text-[#64748b]">Update PO details - {pId}</span>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-[#64748b] hover:text-[#0f172a] transition-colors p-1"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {/* Top Meta Form */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Supplier<span className="text-[#64748b] ml-0.5">*</span></label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-2.5 border border-[#cbd5e1] rounded-lg text-sm text-[#0f172a] outline-none cursor-pointer focus:border-[#2563eb]">
                      <option value="Green Valley Suppliers">Green Valley Suppliers</option>
                      <option value="Fresh Farms Ltd">Fresh Farms Ltd</option>
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Expected Delivery Date<span className="text-[#64748b] ml-0.5">*</span></label>
                  <input type="text" defaultValue="15 Mar 2024" className="w-full px-4 py-2.5 border border-[#cbd5e1] rounded-lg text-sm text-[#0f172a] outline-none focus:border-[#2563eb]" />
                </div>
              </div>

              {/* Editable Items Block */}
              <div className="flex flex-col gap-2 border border-[#e2e8f0] rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-white">
                  <h3 className="text-sm font-bold text-[#0f172a]">Order Items</h3>
                </div>
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider border-y border-[#e2e8f0]">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Unit</th>
                      <th className="px-4 py-3">Quantity<span className="text-[#94a3b8]">*</span></th>
                      <th className="px-4 py-3">Price<span className="text-[#94a3b8]">*</span></th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-4 py-4 font-bold text-[#0f172a]">Onion</td>
                      <td className="px-4 py-4 text-[#64748b] font-medium">Kg</td>
                      <td className="px-4 py-4">
                        <input type="number" defaultValue={150} className="w-full max-w-[120px] px-3 py-2 border border-[#cbd5e1] rounded-md text-sm outline-none focus:border-[#2563eb]" />
                      </td>
                      <td className="px-4 py-4">
                        <input type="number" defaultValue={55} className="w-full max-w-[120px] px-3 py-2 border border-[#cbd5e1] rounded-md text-sm outline-none focus:border-[#2563eb]" />
                      </td>
                      <td className="px-4 py-4 font-bold text-[#0f172a] text-right">₹8,250</td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t border-[#e2e8f0] bg-white">
                    <tr>
                      <td colSpan={3}></td>
                      <td className="px-4 py-3 font-bold text-[#0f172a] text-right">Total:</td>
                      <td className="px-4 py-3 font-bold text-[#0f172a] text-right">₹8,250</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Warning Banner */}
              <div className="bg-[#fefce8] border border-[#fef08a] rounded-lg p-4 text-sm text-[#854d0e]">
                <span className="font-bold text-[#713f12]">Note:</span> Changes to quantity or price will update the planned amount. This PO can only be edited while in Pending status.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2.5 border border-[#cbd5e1] text-[#0f172a] font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg transition-colors text-sm shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Icons
function EditPencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function TrendingDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/>
      <polyline points="16 17 22 17 22 11"/>
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

function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
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

function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function TrendingUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}

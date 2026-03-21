"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function MovementHistory() {
  const [selectedMovementType, setSelectedMovementType] = useState("Movement Type");
  const [selectedProduct, setSelectedProduct] = useState("Product");

  const [dateRange, setDateRange] = useState("Loading...");

  React.useEffect(() => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' '); 
    setDateRange(`${formatDate(today)} - ${formatDate(nextYear)}`);
  }, []);

  const mockMovements = [
    { id: 1, type: "Stock In", product: "Tomato", quantity: "+200 kg", prevStock: "250 kg", newStock: "450 kg", ref: "PO-2024-0123", user: "John Doe", date: "16 Mar 2024 10:30 AM" },
    { id: 2, type: "Order Fulfillment", product: "Potato", quantity: "-80 kg", prevStock: "380 kg", newStock: "300 kg", ref: "ORD-2024-0456", user: "System", date: "16 Mar 2024 09:15 AM" },
    { id: 3, type: "Stock Adjustment", product: "Onion", quantity: "+25 kg", prevStock: "85 kg", newStock: "110 kg", ref: "ADJ-2024-0089", user: "Jane Smith", date: "15 Mar 2024 04:20 PM" },
    { id: 4, type: "Wastage", product: "Carrot", quantity: "-5 kg", prevStock: "225 kg", newStock: "220 kg", ref: "WST-2024-0012", user: "Mike Johnson", date: "15 Mar 2024 02:45 PM" },
    { id: 5, type: "Stock In", product: "Cabbage", quantity: "+150 kg", prevStock: "100 kg", newStock: "250 kg", ref: "PO-2024-0122", user: "John Doe", date: "14 Mar 2024 11:30 AM" },
    { id: 6, type: "Missing Stock", product: "Apple", quantity: "-2 kg", prevStock: "47 kg", newStock: "45 kg", ref: "MSS-2024-0003", user: "Sarah Lee", date: "14 Mar 2024 10:15 AM" }
  ];

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'Stock In': return 'bg-[#dcfce7] text-[#166534]'; // Light green
      case 'Order Fulfillment': return 'bg-[#dbeafe] text-[#1e40af]'; // Light blue
      case 'Stock Adjustment': return 'bg-[#f3e8ff] text-[#6b21a8]'; // Light purple
      case 'Wastage': return 'bg-[#fee2e2] text-[#991b1b]'; // Light red
      case 'Missing Stock': return 'bg-[#ffedd5] text-[#c2410c]'; // Light orange
      default: return 'bg-[#f1f5f9] text-[#475569]';
    }
  };

  const getQuantityStyle = (quantity: string) => {
    if (quantity.startsWith('+')) return 'text-[#16a34a] font-semibold'; // Green rx
    if (quantity.startsWith('-')) return 'text-[#dc2626] font-semibold'; // Red rx
    return 'text-[#111827] font-semibold';
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* TOP ROW: Title & Actions */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-[#111827]">Inventory Movement History</h1>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white rounded-lg text-sm font-medium text-[#475569] hover:bg-[#f8fafc] transition-colors shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#64748b]" />
            {dateRange}
            <ChevronDownIcon className="w-4 h-4 ml-1 text-[#64748b]" />
          </button>
          
          <button className="flex items-center justify-center w-[36px] h-[36px] border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] bg-white transition-colors shadow-sm">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SECOND ROW: Filters */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-[#64748b]">Filter by:</span>
        
        <div className="relative">
          <select 
            value={selectedMovementType} 
            onChange={e => setSelectedMovementType(e.target.value)}
            className="appearance-none flex items-center justify-between min-w-[150px] px-3 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f8fafc] text-[#111827] transition-colors outline-none focus:border-[#07ac57] cursor-pointer"
          >
            <option value="Movement Type">Movement Type</option>
            <option value="Stock In">Stock In</option>
            <option value="Order Fulfillment">Order Fulfillment</option>
            <option value="Stock Adjustment">Stock Adjustment</option>
            <option value="Wastage">Wastage</option>
            <option value="Missing Stock">Missing Stock</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        
        <div className="relative">
          <select 
            value={selectedProduct} 
            onChange={e => setSelectedProduct(e.target.value)}
            className="appearance-none flex items-center justify-between min-w-[120px] px-3 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f8fafc] text-[#111827] transition-colors outline-none focus:border-[#07ac57] cursor-pointer"
          >
            <option value="Product">Product</option>
            <option value="Tomato">Tomato</option>
            <option value="Potato">Potato</option>
            <option value="Onion">Onion</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#64748b] font-semibold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4 uppercase text-[11px] tracking-wider">Movement Type</th>
                <th className="px-6 py-4 uppercase text-[11px] tracking-wider">Product</th>
                <th className="px-6 py-4 uppercase text-[11px] tracking-wider">Quantity</th>
                <th className="px-6 py-4 uppercase text-[11px] tracking-wider">Previous Stock</th>
                <th className="px-6 py-4 uppercase text-[11px] tracking-wider">New Stock</th>
                <th className="px-6 py-4 uppercase text-[11px] tracking-wider">Reference</th>
                <th className="px-6 py-4 uppercase text-[11px] tracking-wider">Updated By</th>
                <th className="px-6 py-4 uppercase text-[11px] tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {mockMovements.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeStyle(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#111827]">{item.product}</td>
                  <td className={`px-6 py-4 ${getQuantityStyle(item.quantity)}`}>{item.quantity}</td>
                  <td className="px-6 py-4 text-[#475569]">{item.prevStock}</td>
                  <td className="px-6 py-4 font-bold text-[#111827]">{item.newStock}</td>
                  <td className="px-6 py-4 text-[#2563eb] cursor-pointer hover:underline font-medium">{item.ref}</td>
                  <td className="px-6 py-4 text-[#475569]">{item.user}</td>
                  <td className="px-6 py-4 text-[#475569]">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-[#e2e8f0]">
          <span className="text-sm text-[#64748b]">Showing 1 to 6 of 342 results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm font-medium text-[#111827] border border-[#e2e8f0] rounded-md hover:bg-[#f8fafc] transition-colors">Previous</button>
            <button className="px-3 py-1.5 text-sm font-bold text-white bg-[#15803d] rounded-md">1</button>
            <button className="px-3 py-1.5 text-sm font-medium text-[#111827] border border-transparent hover:bg-[#f1f5f9] rounded-md transition-colors">2</button>
            <button className="px-3 py-1.5 text-sm font-medium text-[#111827] border border-transparent hover:bg-[#f1f5f9] rounded-md transition-colors">3</button>
            <button className="px-3 py-1.5 text-sm font-medium text-[#111827] border border-[#e2e8f0] rounded-md hover:bg-[#f8fafc] transition-colors">Next</button>
          </div>
        </div>
      </div>
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

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
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

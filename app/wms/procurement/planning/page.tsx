"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function PurchasePlanning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All Subcategories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showGeneratePO, setShowGeneratePO] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Derived mock data to match Figma exactly
  const mockPlanning = [
    { 
      id: "PP-001", 
      product: "Tomato", 
      subtext: "PP-001",
      category: "Vegetables", 
      subcategory: "Fresh Vegetables",
      unit: "Kg", 
      current: 150, 
      reserved: 50, 
      available: 100, 
      ordered: 0,
      reorder: 200, 
      suggested: 100, 
      status: "Low Stock" 
    },
    { 
      id: "PP-002", 
      product: "Potato", 
      subtext: "PP-002",
      category: "Vegetables", 
      subcategory: "Root Vegetables",
      unit: "Kg", 
      current: 0, 
      reserved: 0, 
      available: 0, 
      ordered: 0,
      reorder: 150, 
      suggested: 150, 
      status: "Out of Stock" 
    },
    { 
      id: "PP-003", 
      product: "Onion", 
      subtext: "PP-003",
      category: "Vegetables", 
      subcategory: "Fresh Vegetables",
      unit: "Kg", 
      current: 85, 
      reserved: 20, 
      available: 65, 
      ordered: 50,
      reorder: 150, 
      suggested: 35, 
      status: "Low Stock" 
    }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedItems(mockPlanning.map(i => i.id));
    else setSelectedItems([]);
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) setSelectedItems(selectedItems.filter(i => i !== id));
    else setSelectedItems([...selectedItems, id]);
  };

  const getRowStyle = (status: string) => {
    switch (status) {
      case 'Out of Stock': return 'border-l-[4px] border-l-[#ef4444] bg-[#fef2f2]';
      case 'Low Stock': return 'border-l-[4px] border-l-[#eab308] bg-[#fefce8]';
      default: return 'border-l-[4px] border-l-transparent bg-white';
    }
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case 'Out of Stock': return <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#fee2e2] text-[#991b1b] text-xs font-semibold whitespace-nowrap">Out of Stock</span>;
      case 'Low Stock': return <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#fef08a] text-[#854d0e] text-xs font-semibold whitespace-nowrap">Low Stock</span>;
      default: return <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#dcfce7] text-[#166534] text-xs font-semibold whitespace-nowrap">{status}</span>;
    }
  };

  if (showGeneratePO) {
    const selectedProducts = mockPlanning.filter(p => selectedItems.includes(p.id));
    const totalQty = selectedProducts.reduce((sum, p) => sum + p.suggested, 0);
    const mockBasePrice = 60; // From figma mock
    const totalAmount = totalQty * mockBasePrice;

    return (
      <div className="flex flex-col gap-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowGeneratePO(false)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#111827]">Generate Purchase Order</h1>
            <p className="text-sm text-[#64748b] mt-0.5">Create purchase order with selected products</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            
            {/* Supplier Selection */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#111827] mb-4">Supplier Selection</h2>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-2.5 border border-[#e2e8f0] rounded-lg text-sm font-medium text-[#111827] outline-none focus:border-[#07ac57] cursor-pointer">
                  <option>Fresh Harvest Suppliers (Primary)</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] pointer-events-none" />
              </div>
            </div>

            {/* Selected Products */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-[#e2e8f0]">
                <h2 className="text-base font-bold text-[#111827]">Selected Products</h2>
                <p className="text-sm text-[#64748b] mt-1">{selectedItems.length} products selected &middot; Quantity and price are editable</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#f8fafc] text-[#64748b] font-semibold border-b border-[#e2e8f0]">
                    <tr>
                      <th className="px-5 py-3 uppercase text-[11px] tracking-wider">Product Name</th>
                      <th className="px-5 py-3 uppercase text-[11px] tracking-wider text-center">Suggested Qty</th>
                      <th className="px-5 py-3 uppercase text-[11px] tracking-wider text-center">Base Procurement Price</th>
                      <th className="px-5 py-3 uppercase text-[11px] tracking-wider text-center">Total Amount</th>
                      <th className="px-5 py-3 uppercase text-[11px] tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {selectedProducts.map(item => (
                      <tr key={item.id} className="bg-white hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#dcfce7] flex items-center justify-center shrink-0">
                              <BoxIcon className="w-5 h-5 text-[#16a34a]" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#0f172a]">{item.product}</span>
                              <span className="text-[#64748b] text-xs leading-none mt-1">{item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex justify-center">
                            <input 
                              type="number"
                              defaultValue={item.suggested}
                              className="w-[80px] h-[36px] border border-[#e2e8f0] text-[#111827] font-semibold text-center rounded-lg outline-none focus:border-[#15803d]"
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="relative w-[100px]">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-sm font-semibold">₹</span>
                              <input 
                                type="number"
                                defaultValue={mockBasePrice}
                                className="w-full h-[36px] pl-7 pr-3 border border-[#e2e8f0] text-[#111827] font-semibold text-left rounded-lg outline-none focus:border-[#15803d]"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-[#111827]">
                          ₹{(item.suggested * mockBasePrice).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button 
                            onClick={() => handleSelectItem(item.id)}
                            className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {selectedProducts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-[#64748b]">
                          No products selected. Go back to planning.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Purchase Order Details */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#111827] mb-5">Purchase Order Details</h2>
              
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-2">Expected Delivery Date <span className="text-[#ef4444]">*</span></label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full appearance-none px-4 py-2.5 border border-[#e2e8f0] rounded-lg text-sm text-[#111827] outline-none focus:border-[#07ac57] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-2">Notes (Optional)</label>
                  <textarea 
                    placeholder="Add any special instructions or notes..."
                    rows={3}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg text-sm text-[#111827] placeholder-[#94a3b8] outline-none focus:border-[#07ac57] resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: PO Summary */}
          <div className="w-full lg:w-1/3">
             <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm sticky top-6">
                <div className="p-5 border-b border-[#e2e8f0]">
                  <h2 className="text-base font-bold text-[#111827]">PO Summary</h2>
                </div>
                
                <div className="p-5 flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#64748b]">Supplier</span>
                    <span className="font-semibold text-[#111827]">Fresh Harvest Suppliers</span>
                  </div>

                  <div className="h-[1px] bg-[#e2e8f0]"></div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Total Products</span>
                    <span className="font-semibold text-[#111827]">{selectedProducts.length}</span>
                  </div>

                  <div className="h-[1px] bg-[#f1f5f9]"></div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Total Quantity</span>
                    <span className="font-semibold text-[#111827]">{totalQty}</span>
                  </div>

                  <div className="h-[1px] bg-[#f1f5f9]"></div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-[#64748b]">Total PO Amount</span>
                    <span className="text-2xl font-bold text-[#16a34a]">₹{totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <button 
                      onClick={() => setShowSuccessModal(true)}
                      disabled={selectedProducts.length === 0}
                      className="w-full py-3 bg-[#15803d] hover:bg-[#166534] disabled:bg-[#86efac] text-white rounded-lg font-bold transition-colors shadow-sm"
                    >
                      Confirm & Create PO
                    </button>
                    <button 
                      onClick={() => setShowGeneratePO(false)}
                      className="w-full py-2.5 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#475569] rounded-lg font-semibold transition-colors shadow-sm"
                    >
                      Back to Planning
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Success Modal Overlay */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-[#22c55e] rounded-full flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-[#111827] mb-2">Purchase Order Created!</h2>
              <p className="text-[#64748b] text-sm mb-6">
                Your purchase order has been successfully created and sent to Fresh Harvest Suppliers.
              </p>

              <div className="bg-[#f8fafc] rounded-xl p-4 mb-6 flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748b]">Total Products:</span>
                  <span className="font-semibold text-[#111827]">{selectedProducts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748b]">Total Quantity:</span>
                  <span className="font-semibold text-[#111827]">{totalQty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748b]">Total Amount:</span>
                  <span className="font-bold text-[#16a34a]">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  setShowGeneratePO(false);
                  setSelectedItems([]);
                }}
                className="w-full py-3 bg-[#07ac57] hover:bg-[#06934a] text-white rounded-lg font-bold transition-colors shadow-sm"
              >
                Back to Purchase Planning
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* TOP ROW: Title & Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-semibold text-[#111827]">Purchase Planning</h1>
          {selectedItems.length > 0 && <span className="text-sm font-medium text-[#64748b]">{selectedItems.length} items selected</span>}
        </div>
        
        <button 
          onClick={() => setShowGeneratePO(true)}
          disabled={selectedItems.length === 0}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            selectedItems.length > 0 
              ? 'bg-[#15803d] text-white hover:bg-[#166534] shadow-[0_4px_12px_-2px_rgba(21,128,61,0.2)]'
              : 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
          }`}
        >
          Generate PO
        </button>
      </div>

      {/* FILTERS ROW */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-grow max-w-[400px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#07ac57] bg-white shadow-sm"
          />
        </div>
        
        <div className="relative">
          <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="appearance-none pl-9 pr-10 py-2 border border-[#e2e8f0] bg-white rounded-xl hover:bg-[#f8fafc] text-[#475569] text-sm transition-colors outline-none cursor-pointer shadow-sm w-[180px]"
          >
            <option value="All Categories">All Categories</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <select 
            value={selectedSubcategory} 
            onChange={e => setSelectedSubcategory(e.target.value)}
            className="appearance-none pl-9 pr-10 py-2 border border-[#e2e8f0] bg-white rounded-xl hover:bg-[#f8fafc] text-[#475569] text-sm transition-colors outline-none cursor-pointer shadow-sm w-[200px]"
          >
            <option value="All Subcategories">All Subcategories</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <AlertTriangleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <select 
            value={selectedStatus} 
            onChange={e => setSelectedStatus(e.target.value)}
            className="appearance-none pl-9 pr-10 py-2 border border-[#e2e8f0] bg-white rounded-xl hover:bg-[#f8fafc] text-[#475569] text-sm transition-colors outline-none cursor-pointer shadow-sm w-[160px]"
          >
            <option value="All Status">All Status</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* SUMMARY CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-[#64748b] font-medium mb-1">Total Products</p>
            <h3 className="text-3xl font-bold text-[#0f172a]">6</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] flex items-center justify-center">
            <BoxIcon className="w-6 h-6 text-[#4338ca]" />
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-[#fef08a] rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-[#64748b] font-medium mb-1">Low Stock Items</p>
            <h3 className="text-3xl font-bold text-[#ca8a04]">2</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fef08a] flex items-center justify-center">
            <AlertTriangleIcon className="w-6 h-6 text-[#ca8a04]" />
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-[#fecaca] rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-[#64748b] font-medium mb-1">Out of Stock Items</p>
            <h3 className="text-3xl font-bold text-[#dc2626]">2</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fee2e2] flex items-center justify-center">
            <XCircleIcon className="w-6 h-6 text-[#dc2626]" />
          </div>
        </div>

        {/* Suggested */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(21,128,61,0.08)]">
          <div>
            <p className="text-sm text-[#64748b] font-medium mb-1">Total Suggested Qty</p>
            <h3 className="text-3xl font-bold text-[#16a34a]">345</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#dcfce7] flex items-center justify-center">
            <TrendingUpIcon className="w-6 h-6 text-[#16a34a]" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#475569] font-semibold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-5 py-4 w-12">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedItems.length === mockPlanning.length && mockPlanning.length > 0}
                    className="w-4 h-4 rounded border-[#cbd5e1] text-[#15803d]" 
                  />
                </th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider">Product</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider">Category</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider">Unit</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider text-center">Current<br/>Stock</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider text-center">Reserved<br/>Stock</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider text-center">Available<br/>Stock</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider text-center">Already<br/>Ordered Qty</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider text-center">Reorder<br/>Level</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider text-center">Suggested<br/>Purchase Qty</th>
                <th className="px-4 py-4 uppercase text-[11px] tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {mockPlanning.map((item) => (
                <tr key={item.id} className={`${getRowStyle(item.status)}`}>
                  <td className="px-5 py-4 border-r border-[#e2e8f0]/30 w-12">
                    <input 
                      type="checkbox" 
                      onChange={() => handleSelectItem(item.id)}
                      checked={selectedItems.includes(item.id)}
                      className="w-4 h-4 rounded border-[#cbd5e1] text-[#15803d]" 
                    />
                  </td>
                  <td className="px-4 py-4 border-r border-[#e2e8f0]/30">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0f172a] text-[15px]">{item.product}</span>
                      <span className="text-[#64748b] text-xs">{item.subtext}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-[#e2e8f0]/30">
                    <div className="flex flex-col">
                      <span className="text-[#0f172a]">{item.category}</span>
                      <span className="text-[#64748b] text-xs leading-none">{item.subcategory}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#475569]">{item.unit}</td>
                  <td className="px-4 py-4 text-center text-[#475569]">{item.current}</td>
                  <td className="px-4 py-4 text-center text-[#475569]">{item.reserved}</td>
                  <td className="px-4 py-4 text-center text-[#475569]">{item.available}</td>
                  <td className="px-4 py-4 text-center text-[#475569]">{item.ordered}</td>
                  <td className="px-4 py-4 text-center text-[#475569]">{item.reorder}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <input 
                        type="number"
                        defaultValue={item.suggested}
                        className="w-[80px] h-[32px] border border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a] font-bold text-center rounded-md outline-none focus:border-[#22c55e]"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusPill(item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// SVG Icons
function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
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

function AlertTriangleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
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

function XCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
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

function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
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

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

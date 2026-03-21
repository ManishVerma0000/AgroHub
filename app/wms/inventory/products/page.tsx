"use client";

import React, { useState } from "react";
import { SVGProps } from "react";

export default function WMSProductInventory() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [selectedGlobalProducts, setSelectedGlobalProducts] = useState<number[]>([]);
  
  // Dropdown states
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const initialColumns = [
    { id: 'product', label: 'Product', required: true, visible: true },
    { id: 'category', label: 'Category', required: false, visible: true },
    { id: 'currentStock', label: 'Current Stock', required: true, visible: true },
    { id: 'available', label: 'Available', required: false, visible: true },
    { id: 'reserved', label: 'Reserved', required: false, visible: true },
    { id: 'stockIn', label: 'Stock In', required: false, visible: true },
    { id: 'stockOut', label: 'Stock Out', required: false, visible: true },
    { id: 'missing', label: 'Missing', required: false, visible: true },
    { id: 'wastage', label: 'Wastage', required: false, visible: true },
    { id: 'reorder', label: 'Reorder', required: false, visible: true },
    { id: 'basePrice', label: 'Base Price', required: false, visible: true },
    { id: 'sellingPrice', label: 'Selling Price', required: false, visible: true },
    { id: 'location', label: 'Location', required: false, visible: true },
    { id: 'status', label: 'Status', required: false, visible: true }
  ];
  const [columns, setColumns] = useState(initialColumns);

  const toggleColumn = (id: string) => {
    setColumns(columns.map(col => {
      if (col.id === id && !col.required) {
        return { ...col, visible: !col.visible };
      }
      return col;
    }));
  };

  const showAllColumns = () => setColumns(columns.map(c => ({ ...c, visible: true })));
  const resetColumns = () => setColumns(initialColumns);

  const mockInventory = [
    { id: 1, name: "Tomato Kg", category: "Vegetables", stock: 450, available: 370, reserved: 80, stockIn: 1200, stockOut: 750, missing: 15, wastage: 25, reorder: 100, basePrice: "$60.00", sellingPrice: "$80.00", location: "A-12" },
    { id: 2, name: "Potato Kg", category: "Vegetables", stock: 380, available: 320, reserved: 60, stockIn: 980, stockOut: 600, missing: 8, wastage: 12, reorder: 150, basePrice: "$50.00", sellingPrice: "$70.00", location: "A-15" },
    { id: 3, name: "Onion Kg", category: "Vegetables", stock: 85, available: 65, reserved: 20, stockIn: 450, stockOut: 365, missing: 5, wastage: 8, reorder: 100, basePrice: "$55.00", sellingPrice: "$75.00", location: "A-18" },
    { id: 4, name: "Carrot Kg", category: "Vegetables", stock: 220, available: 175, reserved: 45, stockIn: 650, stockOut: 430, missing: 3, wastage: 7, reorder: 80, basePrice: "$48.00", sellingPrice: "$65.00", location: "B-02" },
  ];

  const globalProducts = [
    { id: 101, name: "Spinach", category: "Vegetables", unit: "kg", hsn: "0709", gst: "0%" },
    { id: 102, name: "Cabbage", category: "Vegetables", unit: "kg", hsn: "0704", gst: "0%" },
    { id: 103, name: "Cauliflower", category: "Vegetables", unit: "kg", hsn: "0704", gst: "0%" },
  ];

  const filteredInventory = mockInventory.filter((item) => {
    const isLowStock = item.available <= item.reorder;
    const itemStatus = isLowStock ? 'Low Stock' : 'In Stock';
    
    if (selectedCategory !== "All Categories" && item.category !== selectedCategory) return false;
    if (selectedStatus !== "All Status" && itemStatus !== selectedStatus) return false;
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedItems(filteredInventory.map(item => item.id));
    else setSelectedItems([]);
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) setSelectedItems(selectedItems.filter(i => i !== id));
    else setSelectedItems([...selectedItems, id]);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* TOP ROW: Title & Actions */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#111827]">Warehouse Inventory</h1>
          <span className="text-xl text-[#94a3b8] font-medium">5</span>
          <ChevronDownIcon className="w-5 h-5 text-[#94a3b8] cursor-pointer" />
        </div>

        <div className="flex items-center gap-4">

          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white rounded-lg text-sm font-medium text-[#111827] hover:bg-[#f9fafb] transition-colors">
            <CalendarIcon className="w-4 h-4 text-[#6b7280]" />
            28 Feb 24 - 31 Mar 25
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>

          <button 
            onClick={() => { setIsAddModalOpen(true); setAddStep(1); }}
            className="flex items-center justify-center min-w-[36px] h-[36px] px-3 bg-[#07ac57] text-white rounded-lg font-medium hover:opacity-90 transition-opacity gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm">New</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="flex items-center justify-center w-[36px] h-[36px] border border-[#e2e8f0] rounded-lg text-[#6b7280] hover:bg-[#f9fafb] bg-white transition-colors"
            >
              <MoreVerticalIcon className="w-5 h-5" />
            </button>
            {showMoreActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e2e8f0] rounded-xl shadow-lg py-1 z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]">Download Sample</button>
                <button className="w-full text-left px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]">Bulk Upload</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECOND ROW: Filters */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowColumnsModal(!showColumnsModal)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f9fafb] text-[#111827] text-sm font-medium transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
            Columns
          </button>
          
          {/* Columns Customization Modal */}
          {showColumnsModal && (
            <div className="absolute left-0 top-full mt-2 w-[360px] bg-white border border-[#e2e8f0] rounded-xl shadow-2xl z-20 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4 border-b border-[#f3f4f6]">
                <h3 className="font-bold text-[#111827] text-lg">Customize Columns</h3>
                <button onClick={() => setShowColumnsModal(false)} className="text-[#94a3b8] hover:text-[#111827] transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-5 py-4 bg-white border-b border-[#f3f4f6]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#475569]">Select which columns to display in the table</span>
                  <span className="text-xs font-medium text-[#6b7280]">{columns.filter(c => c.visible).length} of {columns.length} visible</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={showAllColumns} className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#111827] hover:bg-[#f9fafb] transition-colors">Show All</button>
                  <button onClick={resetColumns} className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#111827] hover:bg-[#f9fafb] transition-colors">Reset to Default</button>
                </div>
              </div>
              
              <div className="max-h-[350px] overflow-y-auto px-5 py-3 flex flex-col gap-2">
                {columns.map(col => (
                  <div 
                    key={col.id} 
                    onClick={() => toggleColumn(col.id)}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-all select-none ${
                      col.required 
                        ? 'border-[#f1f5f9] bg-[#f8fafc] cursor-not-allowed opacity-80' 
                        : col.visible 
                          ? 'border-[#a7f3d0] bg-[#f2fcf6] cursor-pointer hover:border-[#34d399]' 
                          : 'border-[#f1f5f9] bg-white cursor-pointer hover:border-[#cbd5e1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        col.required 
                          ? 'bg-[#cbd5e1]' 
                          : col.visible 
                            ? 'bg-[#07ac57]' 
                            : 'bg-white border border-[#cbd5e1]'
                      }`}>
                        {(col.required || col.visible) && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-semibold ${col.required ? 'text-[#111827]' : col.visible ? 'text-[#07ac57]' : 'text-[#111827]'}`}>{col.label}</span>
                    </div>
                    {col.required && (
                      <span className="text-[10px] uppercase font-bold text-[#64748b] bg-[#e2e8f0] px-2 py-1 rounded">Required</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#94a3b8]">Filter by:</span>
          
          <div className="relative">
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="appearance-none flex items-center justify-between min-w-[140px] px-3 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f9fafb] text-[#111827] transition-colors outline-none focus:border-[#07ac57] cursor-pointer font-medium"
            >
              <option value="All Categories">All Categories</option>
              {Array.from(new Set(mockInventory.map(i => i.category))).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-[#6b7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select 
              value={selectedStatus} 
              onChange={e => setSelectedStatus(e.target.value)}
              className="appearance-none flex items-center justify-between min-w-[120px] px-3 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f9fafb] text-[#111827] transition-colors outline-none focus:border-[#07ac57] cursor-pointer font-medium"
            >
              <option value="All Status">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 text-[#6b7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* THIRD ROW: Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-nowrap overflow-x-auto gap-4 pb-2">
        <StatMini icon={<BoxIcon className="w-5 h-5" />} title="Total Inventory" value="5" unit="Products" color="text-[#3b82f6]" borderHighlight="border-l-[3px] border-l-[#3b82f6]" />
        <StatMini icon={<CheckCircleIcon className="w-5 h-5" />} title="Current Stock" value="1,325" unit="Units" color="text-[#111827]" iconColor="text-[#07ac57]" />
        <StatMini icon={<TrendingUpIcon className="w-5 h-5" />} title="Stock In" value="3,860" unit="Units" color="text-[#07ac57]" iconColor="text-[#07ac57]" />
        <StatMini icon={<TrendingDownIcon className="w-5 h-5" />} title="Stock Out" value="2,535" unit="Units" color="text-[#ea580c]" iconColor="text-[#ea580c]" />
        <StatMini icon={<InboxIcon className="w-5 h-5" />} title="Reserved" value="240" unit="Units" color="text-[#a855f7]" iconColor="text-[#a855f7]" />
        <StatMini icon={<AlertCircleIcon className="w-5 h-5" />} title="Missing" value="33" unit="Units" color="text-[#d97706]" iconColor="text-[#d97706]" />
        <StatMini icon={<XCircleIcon className="w-5 h-5" />} title="Wastage" value="57" unit="Units" color="text-[#dc2626]" iconColor="text-[#dc2626]" />
      </div>
      {/* Bulk Action Dynamic Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-5 py-3 flex justify-between items-center -mb-2">
          <span className="text-sm font-semibold text-[#1e40af]">{selectedItems.length} item(s) selected</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none border border-[#e2e8f0] rounded-lg pl-4 pr-10 py-2 text-sm outline-none w-48 bg-white text-[#111827] cursor-pointer">
                <option>Bulk Actions</option>
                <option>Update Base Price</option>
                <option>Update Reorder Level</option>
                <option>Update Missing Stock</option>
                <option>Update Wastage</option>
              </select>
              <ChevronDownIcon className="w-4 h-4 text-[#6b7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button className="bg-[#dc2626] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#b91c1c] transition-colors">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#fcfcfc] text-[#6b7280] font-medium border-b border-[#f3f4f6]">
              <tr>
                <th className="px-6 py-4 font-semibold w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                    className="rounded border-[#cbd5e1] text-[#07ac57] cursor-pointer" 
                  />
                </th>
                {columns.find(c => c.id === 'product')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Product</th>}
                {columns.find(c => c.id === 'category')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Category</th>}
                {columns.find(c => c.id === 'currentStock')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Current Stock</th>}
                {columns.find(c => c.id === 'available')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Available</th>}
                {columns.find(c => c.id === 'reserved')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Reserved</th>}
                {columns.find(c => c.id === 'stockIn')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Stock In</th>}
                {columns.find(c => c.id === 'stockOut')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Stock Out</th>}
                {columns.find(c => c.id === 'missing')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Missing</th>}
                {columns.find(c => c.id === 'wastage')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Wastage</th>}
                {columns.find(c => c.id === 'reorder')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Reorder</th>}
                {columns.find(c => c.id === 'basePrice')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Base Price</th>}
                {columns.find(c => c.id === 'sellingPrice')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Selling Price</th>}
                {columns.find(c => c.id === 'location')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Location</th>}
                {columns.find(c => c.id === 'status')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-center">Status</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={columns.filter(c => c.visible).length + 1} className="px-6 py-12 text-center text-[#6b7280]">
                    No products found matching the selected filters.
                  </td>
                </tr>
              ) : filteredInventory.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                const isLowStock = item.available <= item.reorder;
                return (
                  <tr key={item.id} className={`hover:bg-[#f9fafb] transition-colors ${isSelected ? 'bg-[#f2fcf6]' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-[#cbd5e1] text-[#07ac57] cursor-pointer" 
                      />
                    </td>
                    {columns.find(c => c.id === 'product')?.visible && (
                      <td className="px-6 py-4 font-bold text-[#111827] cursor-pointer hover:text-[#07ac57]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#f2fcf6] text-[#07ac57] flex items-center justify-center border border-[#dcfce7]">
                            <BoxIcon className="w-4 h-4" />
                          </div>
                          {item.name}
                        </div>
                      </td>
                    )}
                    {columns.find(c => c.id === 'category')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.category}</td>}
                    {columns.find(c => c.id === 'currentStock')?.visible && <td className="px-6 py-4 font-bold text-[#111827]">{item.stock}</td>}
                    {columns.find(c => c.id === 'available')?.visible && <td className="px-6 py-4 text-[#07ac57]">{item.available}</td>}
                    {columns.find(c => c.id === 'reserved')?.visible && <td className="px-6 py-4 text-[#a855f7]">{item.reserved}</td>}
                    {columns.find(c => c.id === 'stockIn')?.visible && <td className="px-6 py-4 text-[#059669]">{item.stockIn}</td>}
                    {columns.find(c => c.id === 'stockOut')?.visible && <td className="px-6 py-4 text-[#ea580c]">{item.stockOut}</td>}
                    {columns.find(c => c.id === 'missing')?.visible && <td className="px-6 py-4 text-[#d97706]">{item.missing > 0 ? item.missing : '-'}</td>}
                    {columns.find(c => c.id === 'wastage')?.visible && <td className="px-6 py-4 text-[#ef4444]">{item.wastage > 0 ? item.wastage : '-'}</td>}
                    {columns.find(c => c.id === 'reorder')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.reorder}</td>}
                    {columns.find(c => c.id === 'basePrice')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.basePrice}</td>}
                    {columns.find(c => c.id === 'sellingPrice')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.sellingPrice}</td>}
                    {columns.find(c => c.id === 'location')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.location}</td>}
                    {columns.find(c => c.id === 'status')?.visible && <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-bold ${
                        isLowStock ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-[#ecfdf5] text-[#059669]'
                      }`}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Products Modal overlays */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#f3f4f6] flex justify-between items-center bg-white">
              <h2 className="text-lg font-semibold text-[#111827]">
                {addStep === 1 ? "Step 1: Add Products to Inventory" : "Setup Inventory - Configure Products"}
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#94a3b8] hover:text-[#111827] p-1 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Step 1 */}
            {addStep === 1 && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-white">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                    <input type="text" placeholder="Search product catalogue..." className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57]" />
                  </div>
                  <select className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm outline-none w-48 bg-white text-[#111827]">
                    <option>All Categories</option>
                    <option>Vegetables</option>
                  </select>
                </div>
                
                <div className="border border-[#e2e8f0] rounded-xl overflow-hidden mt-2">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f9fafb] text-[#6b7280] font-medium border-b border-[#f3f4f6]">
                      <tr>
                        <th className="px-4 py-3 w-10"></th>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Unit</th>
                        <th className="px-4 py-3">HSN</th>
                        <th className="px-4 py-3">GST</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {globalProducts.map(gp => (
                        <tr key={gp.id} className="hover:bg-[#fcfcfc] cursor-pointer" onClick={() => {
                          if (selectedGlobalProducts.includes(gp.id)) setSelectedGlobalProducts(selectedGlobalProducts.filter(id => id !== gp.id));
                          else setSelectedGlobalProducts([...selectedGlobalProducts, gp.id]);
                        }}>
                          <td className="px-4 py-3">
                            <input 
                              type="checkbox" 
                              checked={selectedGlobalProducts.includes(gp.id)}
                              readOnly
                              className="rounded text-[#07ac57] pointer-events-none" 
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-[#111827]">{gp.name}</td>
                          <td className="px-4 py-3 text-[#6b7280]">{gp.category}</td>
                          <td className="px-4 py-3 text-[#6b7280]">{gp.unit}</td>
                          <td className="px-4 py-3 text-[#6b7280]">{gp.hsn}</td>
                          <td className="px-4 py-3 text-[#6b7280]">{gp.gst}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Content - Step 2 */}
            {addStep === 2 && (
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-3 mb-6 flex items-start gap-2">
                  <p className="text-[#1e40af] text-sm">
                    <span className="font-bold">Setup Instructions:</span> Configure initial stock, reorder level, location, and base price for each product before adding to inventory.
                  </p>
                </div>
                
                <div className="overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f8fafc] text-[#64748b] font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">PRODUCT</th>
                        <th className="px-4 py-3">INITIAL STOCK</th>
                        <th className="px-4 py-3">REORDER LEVEL *</th>
                        <th className="px-4 py-3">BASE PRICE * (₹)</th>
                        <th className="px-4 py-3">LOCATION *</th>
                        <th className="px-4 py-3">STATUS</th>
                        <th className="px-4 py-3 text-center rounded-tr-lg">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {selectedGlobalProducts.map(gid => {
                        const gp = globalProducts.find(p => p.id === gid);
                        if (!gp) return null;
                        return (
                          <tr key={gp.id}>
                            <td className="px-4 py-4">
                              <p className="font-bold text-[#111827] text-base">{gp.name}</p>
                              <p className="text-xs text-[#94a3b8] mt-0.5">Box</p>
                            </td>
                            <td className="px-4 py-4"><input type="number" placeholder="0" className="w-[100px] border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"/></td>
                            <td className="px-4 py-4"><input type="number" placeholder="0" className="w-[100px] border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"/></td>
                            <td className="px-4 py-4"><input type="number" placeholder="0.00" className="w-[120px] border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"/></td>
                            <td className="px-4 py-4"><input type="text" placeholder="A-12" className="w-[100px] border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"/></td>
                            <td className="px-4 py-4">
                              <div className="relative w-[110px]">
                                <select className="w-full appearance-none border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white cursor-pointer font-medium">
                                  <option>Active</option>
                                  <option>Inactive</option>
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button 
                                onClick={() => setSelectedGlobalProducts(selectedGlobalProducts.filter(id => id !== gp.id))}
                                className="text-[#ef4444] hover:bg-[#fef2f2] p-2 rounded-lg transition-colors flex items-center justify-center mx-auto"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {selectedGlobalProducts.length === 0 && (
                    <div className="p-8 text-center text-[#94a3b8] italic border-t border-[#f1f5f9]">No products selected. Please go back to Step 1.</div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t border-[#f3f4f6] bg-white flex ${addStep === 2 ? 'justify-between' : 'justify-end'} gap-3`}>
              {addStep === 2 ? (
                <button 
                  onClick={() => setAddStep(1)}
                  className="px-5 py-2.5 border border-[#e2e8f0] text-[#111827] rounded-lg text-sm font-semibold hover:bg-[#f9fafb] transition-colors flex items-center gap-2"
                >
                  &larr; Back to Selection
                </button>
              ) : null}
              
              <div className="flex gap-3">
                {addStep === 2 && (
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 border border-[#e2e8f0] text-[#111827] bg-white rounded-lg text-sm font-semibold hover:bg-[#f9fafb] transition-colors"
                  >
                    Cancel
                  </button>
                )}
                {addStep === 1 ? (
                  <button 
                    onClick={() => setAddStep(2)}
                    disabled={selectedGlobalProducts.length === 0}
                    className="px-6 py-2 bg-[#07ac57] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Setup
                  </button>
                ) : (
                  <button 
                    onClick={() => { setIsAddModalOpen(false); setSelectedGlobalProducts([]); setAddStep(1); }}
                    disabled={selectedGlobalProducts.length === 0}
                    className="px-6 py-2.5 bg-[#07ac57] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add {selectedGlobalProducts.length} Product(s) to Inventory
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function StatMini({ icon, title, value, unit, color, iconColor, borderHighlight }: { icon: React.ReactNode, title: string, value: string, unit: string, color: string, iconColor?: string, borderHighlight?: string }) {
  return (
    <div className={`bg-white min-w-[160px] flex-1 border border-[#f3f4f6] rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-[#e2e8f0] transition-colors ${borderHighlight || ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={iconColor || color}>{icon}</div>
        <p className="text-sm font-medium text-[#6b7280]">{title}</p>
      </div>
      <div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-[#94a3b8] mt-1">{unit}</p>
      </div>
    </div>
  );
}

// Icons
function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
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

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function ColumnsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="12" y1="3" x2="12" y2="21"/>
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
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

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
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

function TrendingDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  );
}

function InboxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  );
}

function AlertCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
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

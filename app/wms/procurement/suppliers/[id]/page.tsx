"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SVGProps } from "react";
import { supplierService, Supplier } from "../../../../../services/supplierService";
import { supplierProductService, SupplierProduct } from "../../../../../services/supplierProductService";
import { productService } from "../../../../../services/productService";
import { categoryService } from "../../../../../services/categoryService";

// Mock data strictly for PO history right now until that backend is ready
const mockPOHistory = [
  { id: "PO-001", orderDate: "10 Mar 2024", expectedDelivery: "12 Mar 2024", items: "2 items", plannedAmount: 15000, actualAmount: 15200, status: "Completed" },
];

export default function SupplierProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [suppliedProducts, setSuppliedProducts] = useState<SupplierProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [selectedGlobalProducts, setSelectedGlobalProducts] = useState<string[]>([]);
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modalSearchValue, setModalSearchValue] = useState("");
  const [modalSelectedCategory, setModalSelectedCategory] = useState("All Categories");
  const [setupData, setSetupData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchAllData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [supplierData, productsData, globalProds, globalCats] = await Promise.all([
        supplierService.getSupplierById(id),
        supplierProductService.getBySupplierId(id),
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setSupplier(supplierData);
      setSuppliedProducts(productsData);
      setGlobalProducts(globalProds);
      setCategories(globalCats);
    } catch (err) {
      console.error("Failed to fetch supplier details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const handleSetupChange = (productId: string, field: string, value: any) => {
    setSetupData(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value
      }
    }));
  };

  const handleAddProducts = async () => {
    setIsSubmitting(true);
    try {
      const promises = selectedGlobalProducts.map(gid => {
        const itemData = setupData[gid] || {};
        const gp = globalProducts.find(p => p.id === gid);
        const payload = {
          supplierId: id,
          productId: gid,
          basePrice: itemData.basePrice !== undefined ? Number(itemData.basePrice) : (gp?.basePrice ? Number(gp.basePrice) : 0),
          status: itemData.status || "Active",
        };
        return supplierProductService.create(payload);
      });
      await Promise.all(promises);
      
      // Refresh only the supplied products local state
      const refreshedProducts = await supplierProductService.getBySupplierId(id);
      setSuppliedProducts(refreshedProducts);
      
      setIsAddModalOpen(false);
      setSelectedGlobalProducts([]);
      setAddStep(1);
      setSetupData({});
    } catch (err) {
      console.error("Error creating supplier products:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGlobalProducts = globalProducts.filter(gp => {
    if (modalSelectedCategory !== "All Categories" && gp.category !== modalSelectedCategory) return false;
    if (modalSearchValue && !gp.name.toLowerCase().includes(modalSearchValue.toLowerCase())) return false;
    // Don't show products the supplier already supplies
    if (suppliedProducts.some(sp => sp.productId === gp.id)) return false; 
    return true;
  });

  if (isLoading) {
    return <div className="text-[#64748b] p-8">Loading supplier profile...</div>;
  }

  if (!supplier) {
    return <div className="text-[#ef4444] p-8">Supplier not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Back Button */}
      <button 
        onClick={() => router.push('/wms/procurement/suppliers')}
        className="flex items-center gap-2 text-[#475569] hover:text-[#0f172a] transition-colors w-fit font-semibold text-sm"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Suppliers
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">{supplier.name}</h1>
          <p className="text-[#64748b] text-sm font-semibold mt-1">SUP-{supplier.id.slice(-6).toUpperCase()}</p>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#dcfce7] text-[#16a34a] font-bold text-sm">
            {supplier.status === "Active" ? "Active" : supplier.status}
          </span>
        </div>
      </div>

      {/* Supplier Information Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#1e293b] mb-6">Supplier Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
          <div>
            <p className="text-[#64748b] text-sm mb-1.5">Contact Person</p>
            <p className="font-bold text-[#1e293b] text-[15px]">{supplier.contactPerson}</p>
          </div>
          <div>
            <p className="text-[#64748b] text-sm mb-1.5">Phone Number</p>
            <p className="font-bold text-[#1e293b] text-[15px]">{supplier.phone}</p>
          </div>
          <div>
            <p className="text-[#64748b] text-sm mb-1.5">Email</p>
            <p className="font-bold text-[#1e293b] text-[15px]">{supplier.email}</p>
          </div>
          <div>
            <p className="text-[#64748b] text-sm mb-1.5">GST Number</p>
            <p className="font-bold text-[#1e293b] text-[15px]">{supplier.gstNumber || '-'}</p>
          </div>
          <div>
            <p className="text-[#64748b] text-sm mb-1.5">Location</p>
            <p className="font-bold text-[#1e293b] text-[15px]">{supplier.location}</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[#64748b] text-sm mb-1.5">Address</p>
            <p className="font-bold text-[#1e293b] text-[15px]">{supplier.address || '-'}</p>
          </div>
        </div>
      </div>

      {/* Metric Tiles (Matching the 5 cards exact UI) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] flex items-center justify-center shrink-0">
            <BoxIcon className="w-6 h-6 text-[#4338ca]" />
          </div>
          <div>
            <p className="text-xs text-[#64748b] font-medium mb-1">Total Products</p>
            <h3 className="text-xl font-bold text-[#1e293b]">{supplier.products || 0}</h3>
          </div>
        </div>

        {/* Total PO Count */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center shrink-0">
            <CartIcon className="w-6 h-6 text-[#9333ea]" />
          </div>
          <div>
            <p className="text-xs text-[#64748b] font-medium mb-1">Total PO Count</p>
            <h3 className="text-xl font-bold text-[#1e293b]">{supplier.poCount || 0}</h3>
          </div>
        </div>

        {/* Total PO Amount */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] flex items-center justify-center shrink-0">
            <DollarSignIcon className="w-6 h-6 text-[#4338ca]" />
          </div>
          <div>
            <p className="text-xs text-[#64748b] font-medium mb-1">Total PO Amount</p>
            <h3 className="text-xl font-bold text-[#1e293b]">₹{(supplier.totalAmount || 0).toLocaleString()}</h3>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#ffedd5] flex items-center justify-center shrink-0">
            <AlertCircleIcon className="w-6 h-6 text-[#ea580c]" />
          </div>
          <div>
            <p className="text-xs text-[#64748b] font-medium mb-1">Pending Amount</p>
            <h3 className="text-xl font-bold text-[#ea580c]">₹{(supplier.pendingAmount || 0).toLocaleString()}</h3>
          </div>
        </div>

        {/* Paid Amount */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#dcfce7] flex items-center justify-center shrink-0">
            <CreditCardIcon className="w-6 h-6 text-[#16a34a]" />
          </div>
          <div>
            <p className="text-xs text-[#64748b] font-medium mb-1">Paid Amount</p>
            <h3 className="text-xl font-bold text-[#16a34a]">₹{(supplier.paidAmount || 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Supplied Products Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#e2e8f0] flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-[#1e293b]">Supplied Products</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#15803d] text-white rounded-lg text-sm font-bold hover:bg-[#166534] transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Product
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#64748b] font-semibold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Product Name</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Category</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Unit</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Base Price</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Last Price</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Last Supplied</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-right">Total Qty Supplied</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Status</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {suppliedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-[#64748b]">
                    No supplied products found. Click 'Add Product' to begin.
                  </td>
                </tr>
              ) : suppliedProducts.map(p => (
                <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4 font-bold text-[#1e293b]">{p.productName || 'Unknown'}</td>
                  <td className="px-5 py-4 text-[#475569]">{p.category || '-'}</td>
                  <td className="px-5 py-4 text-[#475569]">{p.unit || '-'}</td>
                  <td className="px-5 py-4 font-bold text-[#1e293b]">₹{(p.basePrice || 0).toFixed(2)}</td>
                  <td className="px-5 py-4 text-[#475569]">{p.lastPrice ? `₹${p.lastPrice.toFixed(2)}` : '-'}</td>
                  <td className="px-5 py-4 text-[#475569]">{p.lastSupplied || '-'}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#1e293b]">{(p.totalQtySupplied || 0).toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold w-fit mx-auto ${
                      p.status === 'Active' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#f1f5f9] text-[#64748b]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                     <div className="flex items-center justify-center gap-3">
                       <button className="text-[#3b82f6] hover:text-[#2563eb] transition-colors" title="Edit Product">
                         <EditPencilIcon className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={async () => {
                           if(confirm("Are you sure you want to remove this product from the supplier?")) {
                             await supplierProductService.delete(p.id);
                             setSuppliedProducts(prev => prev.filter(item => item.id !== p.id));
                           }
                         }}
                         className="text-[#ef4444] hover:text-[#dc2626] transition-colors" 
                         title="Delete Product"
                       >
                         <TrashIcon className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Order History Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden mb-8">
        <div className="p-5 border-b border-[#e2e8f0] bg-white">
          <h2 className="text-lg font-bold text-[#1e293b]">Purchase Order History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#64748b] font-semibold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">PO ID</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Order Date</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Expected Delivery</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Items</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">PO Amount (Planned)</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Actual PO Amount</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Status</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {mockPOHistory.map(po => (
                <tr key={po.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4 font-bold text-[#3b82f6]">{po.id}</td>
                  <td className="px-5 py-4 text-[#475569]">{po.orderDate}</td>
                  <td className="px-5 py-4 text-[#475569]">{po.expectedDelivery}</td>
                  <td className="px-5 py-4 text-[#475569]">{po.items}</td>
                  <td className="px-5 py-4 font-bold text-[#1e293b]">₹{po.plannedAmount.toLocaleString()}</td>
                  <td className="px-5 py-4 font-bold text-[#16a34a]">₹{po.actualAmount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#dcfce7] text-[#16a34a] text-xs font-bold w-fit mx-auto border border-[#bbf7d0]">
                      {po.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                     <div className="flex items-center justify-center">
                       <button className="text-[#64748b] hover:text-[#1e293b] transition-colors" title="View PO">
                         <EyeIcon className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                {addStep === 1 ? "Step 1: Add Products to Supplier" : "Setup Supplier - Configure Products"}
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
                    <input 
                      type="text" 
                      placeholder="Search product catalogue..." 
                      value={modalSearchValue}
                      onChange={(e) => setModalSearchValue(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57]" 
                    />
                  </div>
                  <select 
                    value={modalSelectedCategory}
                    onChange={(e) => setModalSelectedCategory(e.target.value)}
                    className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm outline-none w-48 bg-white text-[#111827]"
                  >
                    <option value="All Categories">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
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
                      {isLoadingProducts ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-[#6b7280]">
                            Loading products...
                          </td>
                        </tr>
                      ) : filteredGlobalProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-[#6b7280]">
                            No products found matching the criteria.
                          </td>
                        </tr>
                      ) : filteredGlobalProducts.map(gp => (
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
                          <td className="px-4 py-3 text-[#6b7280]">{gp.category || '-'}</td>
                          <td className="px-4 py-3 text-[#6b7280]">{gp.baseUnit || '-'}</td>
                          <td className="px-4 py-3 text-[#6b7280]">{gp.hsn || '-'}</td>
                          <td className="px-4 py-3 text-[#6b7280]">{gp.gstRate ? `${gp.gstRate}%` : '-'}</td>
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
                    <span className="font-bold">Setup Instructions:</span> Configure the negotiated base price for each product from this supplier before completing the link.
                  </p>
                </div>
                
                <div className="overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f8fafc] text-[#64748b] font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">PRODUCT</th>
                        <th className="px-4 py-3">BASE PRICE * (₹)</th>
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
                            <td className="px-4 py-4 w-1/3">
                              <p className="font-bold text-[#111827] text-base">{gp.name}</p>
                              <p className="text-xs text-[#94a3b8] mt-0.5">{gp.baseUnit || 'Unit'}</p>
                            </td>
                            <td className="px-4 py-4 w-1/3">
                              <input 
                                type="number" 
                                value={setupData[gp.id]?.basePrice !== undefined ? setupData[gp.id].basePrice : (gp.basePrice || '')} 
                                onChange={e => handleSetupChange(gp.id, 'basePrice', e.target.value)} 
                                placeholder="0.00" 
                                className="w-full border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="relative w-[140px]">
                                <select 
                                  value={setupData[gp.id]?.status || 'Active'} 
                                  onChange={e => handleSetupChange(gp.id, 'status', e.target.value)} 
                                  className="w-full appearance-none border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white cursor-pointer font-medium"
                                >
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
                    onClick={handleAddProducts}
                    disabled={selectedGlobalProducts.length === 0 || isSubmitting}
                    className="px-6 py-2.5 bg-[#07ac57] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : `Add ${selectedGlobalProducts.length} Product(s) to Supplier`}
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

// SVG Icons (Matching Figma)
function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
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

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
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

function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function DollarSignIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
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

function CreditCardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
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
    </svg>
  );
}

"use client";

import React, { SVGProps, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { customerService, Customer } from "@/services/customerService";
import { warehouseProductService } from "@/services/warehouseProductService";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { subcategoryService } from "@/services/subcategoryService";

interface CartItem {
  id: string; // warehouse product id
  productId: string; // global product id
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

export default function CustomerOrderPage() {
  const params = useParams();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All Subcategory");
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState("7:00 - 8:00 AM");

  const WAREHOUSE_ID = "69b82ccf3709f6cca0ec8c41"; // Static ID as requested

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [customerData, inventoryData, globalProducts, categoriesData, subcategoriesData] = await Promise.all([
          customerService.getById(id),
          warehouseProductService.getAll(WAREHOUSE_ID),
          productService.getAll(),
          categoryService.getAll(),
          subcategoryService.getAll()
        ]);

        setCustomer(customerData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);

        // Map inventory with global product details (slabs, unit, etc.)
        const mappedProducts = inventoryData.map((invItem: any) => {
          const gp = globalProducts.find((p: any) => p.id === invItem.productId) || {};
          return {
            ...invItem,
            name: invItem.productName || gp.name || "Unknown Product",
            unit: gp.baseUnit || "kg",
            category: gp.category || "General",
            subcategory: gp.subcategory || "General",
            slabs: gp.b2bBulkSlabs || [],
            mrp: gp.mrp || 0,
            imageUrl: gp.imageUrl
          };
        });
        setProducts(mappedProducts);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInitialData();
  }, [id]);

  const addToCart = (product: any) => {
    // For demo/simplicity, using a default unit price or first slab rate
    // In real app, we'd calculate based on quantity but let's follow the image's layout
    const price = product.sellingPrice || 22; // fallback to 22 as in image
    const newItem: CartItem = {
      id: product.id,
      productId: product.productId,
      name: product.name,
      unit: `Crate (25 Kg)`, // Mocked from image
      quantity: 10, // Mocked from image
      price: price,
      total: price * 10
    };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-bold text-[#0f172a]">Customer not found</h2>
        <Link href="/customers" className="text-[#16a34a] font-semibold hover:underline">Back to Customers</Link>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const deliveryFee = 0; // FREE as in image
  const grandTotal = subtotal + deliveryFee;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Category" || p.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "All Subcategory" || p.subcategory === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const initials = customer.ownerName?.split(' ').map(n => n[0]).join('').toUpperCase() || "DK";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8 font-sans text-[#0f172a]">
      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto mb-8">
        <Link href="/customers" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#0f172a] transition-colors mb-6 font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Customer
        </Link>
        
        <div className="flex items-center gap-5">
           <div className="w-[60px] h-[60px] rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-[22px] shadow-sm">
             {initials}
           </div>
           <div className="flex flex-col gap-0.5">
              <h1 className="text-[28px] font-bold leading-tight">{customer.ownerName || customer.shopName}</h1>
              <div className="flex items-center gap-2 text-[#64748b] text-[14px]">
                 <span>Customer ID: CUST-{customer.id.slice(-3).toUpperCase()}</span>
                 <span>&bull;</span>
                 <span>Joined {new Date(customer.createdDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Product Selection and Cart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Product Search & Filters */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e8f0] flex items-center gap-4">
            <div className="relative flex-1">
               <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
               <input 
                 type="text" 
                 placeholder="Search Product" 
                 className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#16a34a]/10"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-3 bg-white border border-[#e2e8f0] rounded-xl text-sm font-medium text-[#475569] outline-none cursor-pointer hover:border-[#cbd5e1] transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-3 bg-white border border-[#e2e8f0] rounded-xl text-sm font-medium text-[#475569] outline-none cursor-pointer hover:border-[#cbd5e1] transition-all"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              >
                <option>All Subcategory</option>
                {subcategories.map(sc => <option key={sc.id} value={sc.name}>{sc.name}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
            <div className="divide-y divide-[#f1f5f9]">
              {filteredProducts.length === 0 ? (
                <div className="p-10 text-center text-[#64748b]">No products found matching filters.</div>
              ) : filteredProducts.map((product) => (
                <div key={product.id} className="p-5 flex items-center justify-between hover:bg-[#f8fafc] transition-colors group">
                  <div className="flex items-center gap-4 flex-1">
                     <div className="w-[44px] h-[44px] rounded-xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center font-bold text-lg shadow-sm border border-[#dbeafe]">
                       {product.name[0]}
                     </div>
                     <div className="flex flex-col gap-0.5">
                        <h3 className="font-bold text-[16px] text-[#0f172a]">{product.name}</h3>
                        <span className="text-[#f97316] text-[13px] font-bold">₹{product.sellingPrice || 22}<span className="text-[#94a3b8] font-normal ml-0.5">/kg</span></span>
                     </div>
                  </div>

                  {/* Slabs Chips */}
                  <div className="flex items-center gap-2 flex-[2] justify-center">
                    {(product.slabs && product.slabs.length > 0 ? product.slabs : [
                      { minQty: 1, maxQty: 20, rate: 22 },
                      { minQty: 1, maxQty: 20, rate: 22 },
                      { minQty: 1, maxQty: 20, rate: 22 }
                    ]).slice(0, 3).map((slab: any, idx: number) => (
                      <div key={idx} className={`px-4 py-1.5 rounded-lg text-[12px] font-bold border transition-all ${idx === 0 ? 'bg-[#f0fdf4] border-[#dcfce7] text-[#16a34a]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8]'}`}>
                        {slab.minQty}-{slab.maxQty} {product.unit} ₹{slab.rate}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => addToCart(product)}
                    className="px-8 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-[14px] font-bold rounded-lg transition-all shadow-md shadow-[#16a34a]/10"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden mt-2">
            <div className="p-5 border-b border-[#f1f5f9]">
              <h2 className="text-[18px] font-bold text-[#0f172a]">Order Item ({cart.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8fafc] text-[#64748b] font-bold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">PRODUCT</th>
                    <th className="px-6 py-4">UNIT</th>
                    <th className="px-6 py-4">QUANTITY</th>
                    <th className="px-6 py-4">PRICE</th>
                    <th className="px-6 py-4">TOTAL</th>
                    <th className="px-6 py-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#94a3b8] italic">No items in cart. Start adding products above.</td>
                    </tr>
                  ) : cart.map((item, index) => (
                    <tr key={index} className="hover:bg-[#fcf8ff]/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center font-bold text-sm shadow-sm">
                            {item.name[0]}
                          </div>
                          <span className="font-bold text-[#1e293b]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[#475569] font-medium">{item.unit}</td>
                      <td className="px-6 py-5 font-bold text-[#0f172a]">{item.quantity}</td>
                      <td className="px-6 py-5 font-bold text-[#1e293b]">₹{item.price}</td>
                      <td className="px-6 py-5 font-bold text-[#0f172a]">₹{item.total}</td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg transition-colors border border-transparent hover:border-[#fecaca]"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Address and Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
             <h3 className="text-[17px] font-bold mb-5">Delivery Address</h3>
             <div className="relative mb-6">
                <select className="w-full appearance-none pl-4 pr-10 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm font-medium text-[#475569] outline-none cursor-pointer">
                  <option>All Subcategory</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
             </div>

             <div className="p-5 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-2xl border border-[#bae6fd]">
                <div className="flex flex-col gap-3">
                   <h4 className="font-bold text-[#0369a1] text-[16px]">Fresh Veg Restaurent.</h4>
                   <div className="flex items-start gap-2.5 text-[#0c4a6e] text-[13.5px] leading-relaxed">
                      <PinIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#0369a1]" />
                      <span>Shop No. 12, Market Complex, Sector 45, Gurugram - 3443444</span>
                   </div>
                   <div className="flex items-center gap-2.5 text-[#0c4a6e] text-[13.5px]">
                      <PhoneIcon className="w-4 h-4 shrink-0 text-[#0369a1]" />
                      <span className="font-medium">88488484884</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Bill Summary Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
             <h3 className="text-[17px] font-bold mb-5">Bill Summary</h3>
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-[15px]">
                   <span className="text-[#64748b] font-medium">Subtotal</span>
                   <span className="font-bold text-[#0f172a]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[15px]">
                   <span className="text-[#64748b] font-medium">Delivery</span>
                   <div className="flex items-center gap-2">
                      <span className="text-[#94a3b8] line-through text-xs font-semibold">₹500</span>
                      <span className="text-[#16a34a] font-bold text-[14px]">FREE</span>
                   </div>
                </div>
                <div className="pt-4 border-t border-[#f1f5f9] mt-2 flex justify-between items-center">
                   <span className="text-[18px] font-bold text-[#0f172a]">Grand Total</span>
                   <span className="text-[22px] font-bold text-[#f97316]">₹{grandTotal.toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* Preferred Delivery Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
             <h3 className="text-[17px] font-bold mb-5">Preferred Delivery</h3>
             <div className="grid grid-cols-3 gap-3">
                {["7:00 - 8:00 AM", "8:00 - 9:00 AM", "9:00 - 10:00 AM"].map(slot => (
                  <button 
                    key={slot}
                    onClick={() => setSelectedDeliverySlot(slot)}
                    className={`px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                      selectedDeliverySlot === slot 
                        ? 'bg-[#f0fdf4] border-[#16a34a] text-[#16a34a] shadow-sm' 
                        : 'bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8] hover:border-[#cbd5e1]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
             </div>
          </div>

          <button className="w-full py-4 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#16a34a]/20 text-[16px] lg:mt-2">
             Create Order
          </button>

        </div>
      </div>
    </div>
  );
}

// Icons
function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  );
}

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
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

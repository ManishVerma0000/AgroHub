"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { stockActionService } from "../../../../../services/stockActionService";
import { productService } from "../../../../../services/productService";
import { warehouseProductService } from "../../../../../services/warehouseProductService";
import { StockActionModal, StockActionType } from "../../../../../components/Products/StockActionModal";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [stockActions, setStockActions] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [activeStockAction, setActiveStockAction] = useState<StockActionType | null>(null);

  useEffect(() => {
    fetchStockActions();
    fetchProductDetails();
  }, [unwrappedParams.id]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const warehouseId = unwrappedParams.id;
      const wpResponse = await warehouseProductService.getById(warehouseId);
      const baseProduct = await productService.getById(wpResponse.productId);
      
      setProduct({
        id: warehouseId,
        productId: wpResponse.productId,
        name: wpResponse.productName || baseProduct.name,
        inventoryId: wpResponse.id.substring(0, 8).toUpperCase(),
        basePrice: `₹${wpResponse.basePrice} / ${baseProduct.unit || 'Unit'}`,
        sellingPrice: `₹${baseProduct.price || wpResponse.basePrice} / ${baseProduct.unit || 'Unit'}`,
        status: wpResponse.status,
        category: wpResponse.category || baseProduct.category || "N/A",
        subcategory: wpResponse.subcategory || baseProduct.subcategory || "N/A",
        unit: baseProduct.baseUnit || baseProduct.unit || "Units",
        hsnCode: wpResponse.hsnCode || baseProduct.hsnCode || "N/A",
        gstRate: baseProduct.gstRate ? `${baseProduct.gstRate}%` : "5%",
        warehouseLocation: wpResponse.location,
        lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        currentStock: wpResponse.currentStock ?? wpResponse.initialStock ?? 0,
        available: wpResponse.availableStock ?? wpResponse.initialStock ?? 0,
        reserved: wpResponse.reservedStock ?? 0,
        totalStockIn: wpResponse.stockIn ?? wpResponse.initialStock ?? 0,
        totalStockOut: wpResponse.stockOut ?? 0,
        missingStock: wpResponse.missingStock ?? 0,
        wastageStock: wpResponse.wastageStock ?? 0,
        reorderLevel: wpResponse.reorderLevel ?? 0,
        stockStatus: (wpResponse.availableStock ?? wpResponse.initialStock ?? 0) <= (wpResponse.reorderLevel ?? 0) ? "Low Stock" : "Healthy" ,
        productStatus: wpResponse.status,
        updatedBy: "Admin",
      });
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockActionSubmit = async (actionType: StockActionType, quantity: number, reason: string, notes: string) => {
    if (!product) return;
    try {
      await warehouseProductService.stockAction(product.id, {
        actionType,
        quantity,
        reason,
        notes
      });
      await fetchProductDetails(); // refresh details
    } catch (error) {
      console.error("Failed to submit stock action", error);
      throw error;
    }
  };

  const fetchStockActions = async () => {
    try {
      const data = await stockActionService.getAll();
      setStockActions(data);
    } catch (error) {
      console.error("Failed to fetch stock actions:", error);
    }
  };

  const iconMap: Record<string, React.ReactNode> = {
    PlusIcon: <PlusIcon className="w-4 h-4" />,
    MinusIcon: <MinusIcon className="w-4 h-4" />,
    AlertCircleIcon: <AlertCircleIcon className="w-4 h-4" />,
    TrashIcon: <TrashIcon className="w-4 h-4" />,
    SettingsIcon: <SettingsIcon className="w-4 h-4" />,
  };
  
  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  const b2bSlabs = [
    { range: "1 - 100 Kg", price: "₹75" },
    { range: "101 - 500 Kg", price: "₹70" },
    { range: "501 - 1000 Kg", price: "₹65" },
  ];

  const consumptionData = [
    { month: "Jan", value: 330 },
    { month: "Feb", value: 380 },
    { month: "Mar", value: 410 },
    { month: "Apr", value: 390 },
    { month: "May", value: 450 },
    { month: "Jun", value: 480 },
  ];
  const maxConsumption = Math.max(...consumptionData.map(d => d.value));

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] w-full mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/wms/inventory/products" className="flex items-center gap-2 text-sm text-[#4b5563] hover:text-[#111827] transition-colors w-fit font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Inventory
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">{product.name}</h1>
            <p className="text-sm text-[#6b7280] mt-1 font-medium">
              Inventory ID: {product.inventoryId} &bull; Base Price: {product.basePrice}
            </p>
          </div>
          <span className="px-5 py-2 rounded-lg bg-[#dcfce7] text-[#059669] font-bold text-sm">
            {product.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Product Information */}
          <div className="bg-white rounded-xl border border-[#f3f4f6] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-6">Product Information</h2>
            <div className="grid grid-cols-2 gap-y-6 text-sm">
              <InfoField label="Product Name" value={product.name} />
              <InfoField label="Category" value={product.category} />
              <InfoField label="Subcategory" value={product.subcategory} />
              <InfoField label="Unit" value={product.unit} />
              <InfoField label="HSN Code" value={product.hsnCode} />
              <InfoField label="GST Rate" value={product.gstRate} />
              <InfoField label="Warehouse Location" value={product.warehouseLocation} />
              <InfoField label="Last Updated" value={product.lastUpdated} />
            </div>
          </div>

          {/* Stock Overview */}
          <div className="bg-white rounded-xl border border-[#f3f4f6] shadow-sm p-6 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-[#111827]">Stock Overview</h2>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#6b7280]">Current Stock vs Reorder Level</span>
                <span className="text-[#111827]">{product.currentStock} / {product.reorderLevel} {product.unit}</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#10b981] h-full rounded-full" 
                  style={{ width: `${Math.min(100, (product.currentStock / (product.reorderLevel * 2)) * 100)}%` }} // Just a visual mock calculation
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard title="Current Stock" value={product.currentStock} unit={product.unit} bg="bg-[#eff6ff]" textColor="text-[#3b82f6]" />
              <StatCard title="Available" value={product.available} unit={product.unit} bg="bg-[#f0fdf4]" textColor="text-[#10b981]" />
              <StatCard title="Reserved" value={product.reserved} unit={product.unit} bg="bg-[#faf5ff]" textColor="text-[#a855f7]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Total Stock In" value={product.totalStockIn} unit={product.unit} bg="bg-[#f0fdf4]" textColor="text-[#10b981]" size="large" />
              <StatCard title="Total Stock Out" value={product.totalStockOut} unit={product.unit} bg="bg-[#fff7ed]" textColor="text-[#ea580c]" size="large" />
              <StatCard title="Missing Stock" value={product.missingStock} unit={product.unit} bg="bg-[#fefce8]" textColor="text-[#d97706]" />
              <StatCard title="Wastage Stock" value={product.wastageStock} unit={product.unit} bg="bg-[#fef2f2]" textColor="text-[#ef4444]" />
            </div>

            <div className="flex items-center justify-between bg-[#faf5ff] p-4 rounded-xl border border-[#f3e8ff] mt-2">
              <div>
                <p className="text-[#a855f7] text-xs font-semibold uppercase tracking-wider mb-1">Reorder Level (Threshold)</p>
                <p className="text-[#7e22ce] text-xl font-bold">{product.reorderLevel} {product.unit}</p>
              </div>
              <button 
                onClick={() => {
                  setActiveStockAction('Update Reorder Level');
                  setIsStockModalOpen(true);
                }}
                className="bg-[#9333ea] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#7e22ce] transition-colors"
              >
                Update
              </button>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white rounded-xl border border-[#f3f4f6] shadow-sm p-6 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-[#111827]">Pricing Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#eff6ff] rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[#3b82f6] text-xs font-semibold">Base Price</span>
                <span className="text-[#1e3a8a] text-2xl font-bold">₹{parseInt(product.basePrice.replace(/\D/g,''))}</span>
                <span className="text-[#3b82f6] text-xs font-medium">per {product.unit}</span>
              </div>
              <div className="bg-[#f0fdf4] rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[#10b981] text-xs font-semibold">Selling Price</span>
                <span className="text-[#065f46] text-2xl font-bold">₹{parseInt(product.sellingPrice.replace(/\D/g,''))}</span>
                <span className="text-[#10b981] text-xs font-medium">per {product.unit}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#111827] mb-3">B2B Pricing Slabs</h3>
              <div className="flex flex-col gap-3">
                {b2bSlabs.map((slab, idx) => (
                  <div key={idx} className="flex items-center justify-between border border-[#f3f4f6] rounded-xl p-4 hover:border-[#e2e8f0] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#10b981] flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#111827] text-sm">{slab.range}</span>
                        <span className="text-xs text-[#94a3b8] font-medium">Quantity Range</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="font-bold text-[#111827] text-lg">{slab.price}</span>
                      <span className="text-xs text-[#94a3b8] font-medium">per {product.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-[#eff6ff] text-[#1e40af] text-sm font-medium p-3 rounded-lg border border-[#bfdbfe]">
                <strong>Note:</strong> B2B pricing applies to bulk orders. Higher quantities unlock better pricing tiers automatically.
              </div>
            </div>
          </div>

          {/* Monthly Consumption Trend */}
          <div className="bg-white rounded-xl border border-[#f3f4f6] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-6">Monthly Consumption Trend</h2>
            <div className="h-64 flex items-end gap-2 pr-4 relative pl-8">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-[#94a3b8] font-medium py-1 w-8 text-right pr-2 border-r border-[#e2e8f0]">
                <span>600</span>
                <span>450</span>
                <span>300</span>
                <span>150</span>
                <span>0</span>
              </div>
              
              {/* Bars */}
              {consumptionData.map((data, idx) => {
                const heightPercentage = (data.value / 600) * 100; // max Y axis value is 600
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-[#10b981] rounded-t-md hover:bg-[#059669] transition-colors relative"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {data.value} {product.unit}
                      </div>
                    </div>
                    <span className="text-xs text-[#64748b] font-medium border-t border-[#e2e8f0] w-full text-center pt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="flex flex-col gap-6">
          
          {/* Stock Actions */}
          <div className="bg-white rounded-xl border border-[#f3f4f6] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#111827] mb-2">Stock Actions</h2>
            {stockActions.length > 0 ? (
              stockActions.map(action => (
                <ActionButton 
                  key={action.id}
                  icon={iconMap[action.iconName] || <SettingsIcon className="w-4 h-4" />} 
                  label={action.label} 
                  bg={action.bg} 
                  text={action.text} 
                  hover={action.hover} 
                  border={action.border} 
                  onClick={() => {
                    setActiveStockAction(action.label as StockActionType);
                    setIsStockModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="text-sm text-center text-[#94a3b8] py-4">Loading actions...</div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-[#f3f4f6] shadow-sm p-6 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-[#111827]">Quick Stats</h2>
            <QuickStatRow label="Stock Status" value={product.stockStatus} valueColor="text-[#10b981]" />
            <div className="w-full h-px bg-[#f3f4f6]"></div>
            <QuickStatRow label="Product Status" value={product.productStatus} valueColor="text-[#10b981]" />
            <div className="w-full h-px bg-[#f3f4f6]"></div>
            <QuickStatRow label="Base Price" value={product.basePrice} valueColor="text-[#111827]" />
            <div className="w-full h-px bg-[#f3f4f6]"></div>
            <QuickStatRow label="Updated By" value={product.updatedBy} valueColor="text-[#111827]" />
          </div>
          
        </div>
      </div>

      {/* Stock Action Modal */}
      {product && (
        <StockActionModal 
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          actionType={activeStockAction}
          product={{
            name: product.name,
            currentStock: product.currentStock,
            unit: product.unit
          }}
          onSubmit={handleStockActionSubmit}
        />
      )}
    </div>
  );
}

// Subcomponents
function InfoField({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#6b7280] font-medium">{label}</span>
      <span className="text-sm text-[#111827] font-semibold">{value}</span>
    </div>
  );
}

function StatCard({ title, value, unit, bg, textColor, size = "small" }: { title: string, value: string | number, unit: string, bg: string, textColor: string, size?: "small" | "large" }) {
  return (
    <div className={`${bg} rounded-xl p-4 flex flex-col ${size === "large" ? "gap-2" : "gap-1"}`}>
      <span className={`${textColor} text-xs font-semibold`}>{title}</span>
      <div className="flex items-baseline gap-1">
        <span className={`${textColor} font-bold ${size === "large" ? "text-2xl" : "text-xl"}`}>{value}</span>
        {size !== "large" && <span className={`${textColor} text-xs font-semibold`}>{unit}</span>}
      </div>
      {size === "large" && <span className={`${textColor} text-xs font-semibold`}>{unit}</span>}
    </div>
  );
}

function ActionButton({ icon, label, bg, text, hover, border = "", onClick }: { icon: React.ReactNode, label: string, bg: string, text: string, hover: string, border?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm transition-colors ${bg} ${text} ${hover} ${border} justify-start shadow-sm`}>
      {icon}
      {label}
    </button>
  );
}

function QuickStatRow({ label, value, valueColor }: { label: string, value: string, valueColor: string }) {
  return (
    <div className="flex justify-between items-center text-sm font-semibold">
      <span className="text-[#6b7280]">{label}</span>
      <span className={valueColor}>{value}</span>
    </div>
  );
}

// Icons
function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function AlertCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

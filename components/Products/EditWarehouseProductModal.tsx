'use client';

import React, { useState, useEffect } from 'react';
import { warehouseProductService } from '../../services/warehouseProductService';
import toast from 'react-hot-toast';

interface EditWarehouseProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  categories?: any[];
  onSuccess: () => void;
}

export function EditWarehouseProductModal({
  isOpen,
  onClose,
  product,
  categories = [],
  onSuccess
}: EditWarehouseProductModalProps) {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    subcategory: '',
    unit: 'Units',
    basePrice: '',
    sellingPrice: '',
    currentStock: '',
    availableStock: '',
    reservedStock: '',
    stockIn: '',
    stockOut: '',
    missingStock: '',
    wastageStock: '',
    reorderLevel: '',
    location: '',
    status: 'In Stock',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'stock' | 'pricing'>('details');

  useEffect(() => {
    if (product) {
      // Helper to clean price strings e.g. "₹45.00" -> 45
      const parseNum = (val: any) => {
        if (val === undefined || val === null || val === '-') return '';
        if (typeof val === 'number') return val.toString();
        const cleaned = String(val).replace(/[^0-9.]/g, '');
        return cleaned || '';
      };

      setFormData({
        productName: product.name || product.productName || '',
        category: product.category && product.category !== '-' ? product.category : '',
        subcategory: product.subcategory && product.subcategory !== '-' ? product.subcategory : '',
        unit: product.unit || 'Units',
        basePrice: parseNum(product.rawBasePrice ?? product.basePrice),
        sellingPrice: parseNum(product.rawSellingPrice ?? product.sellingPrice),
        currentStock: String(product.rawStock ?? product.stock ?? 0),
        availableStock: String(product.available ?? product.availableStock ?? product.stock ?? 0),
        reservedStock: String(product.reserved ?? product.reservedStock ?? 0),
        stockIn: String(product.stockIn ?? 0),
        stockOut: String(product.stockOut ?? 0),
        missingStock: String(product.missing ?? product.missingStock ?? 0),
        wastageStock: String(product.wastage ?? product.wastageStock ?? 0),
        reorderLevel: String(product.reorder ?? product.reorderLevel ?? 0),
        location: product.location && product.location !== '-' ? product.location : '',
        status: product.status || (Number(product.available || product.stock) <= Number(product.reorder || 0) ? 'Low Stock' : 'In Stock'),
      });
    }
  }, [product, isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        productName: formData.productName.trim(),
        category: formData.category.trim(),
        subcategory: formData.subcategory.trim(),
        unit: formData.unit.trim(),
        location: formData.location.trim(),
        status: formData.status,
        reorderLevel: formData.reorderLevel !== '' ? Number(formData.reorderLevel) : 0,
        currentStock: formData.currentStock !== '' ? Number(formData.currentStock) : 0,
        availableStock: formData.availableStock !== '' ? Number(formData.availableStock) : 0,
        reservedStock: formData.reservedStock !== '' ? Number(formData.reservedStock) : 0,
        stockIn: formData.stockIn !== '' ? Number(formData.stockIn) : 0,
        stockOut: formData.stockOut !== '' ? Number(formData.stockOut) : 0,
        missingStock: formData.missingStock !== '' ? Number(formData.missingStock) : 0,
        wastageStock: formData.wastageStock !== '' ? Number(formData.wastageStock) : 0,
      };

      if (formData.basePrice !== '') {
        payload.basePrice = Number(formData.basePrice);
      }
      if (formData.sellingPrice !== '') {
        payload.sellingPrice = Number(formData.sellingPrice);
      }

      await warehouseProductService.update(product.id, payload);
      toast.success('Product inventory updated successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to update warehouse product:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update product details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#e5e7eb] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3f4f6] bg-[#fcfdfd]">
          <div className="flex items-center gap-3">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-11 h-11 rounded-xl object-cover border border-[#e2e8f0] shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-[#ecfdf5] text-[#07ac57] flex items-center justify-center font-bold text-lg border border-[#d1fae5]">
                📦
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111827]">Edit Product Details</h3>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569]">
                  {product.category || 'Inventory'}
                </span>
              </div>
              <p className="text-xs text-[#6b7280] truncate max-w-sm font-medium">
                {product.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#374151] p-2 rounded-lg hover:bg-[#f3f4f6] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#f3f4f6] bg-white text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#07ac57] text-[#07ac57]'
                : 'border-transparent text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            General & Location
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'border-[#07ac57] text-[#07ac57]'
                : 'border-transparent text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Pricing & Valuation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'stock'
                ? 'border-[#07ac57] text-[#07ac57]'
                : 'border-transparent text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Stock Quantities
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 flex flex-col gap-5">
            
            {/* TAB 1: General & Location */}
            {activeTab === 'details' && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-[#374151]">Product Name</label>
                    <input 
                      type="text" 
                      value={formData.productName}
                      onChange={e => handleChange('productName', e.target.value)}
                      required
                      placeholder="e.g. Organic Tomato"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#374151]">Category</label>
                    <input 
                      type="text" 
                      list="categories-list"
                      value={formData.category}
                      onChange={e => handleChange('category', e.target.value)}
                      placeholder="e.g. Vegetables"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                    />
                    <datalist id="categories-list">
                      {categories.map((c, i) => (
                        <option key={i} value={typeof c === 'string' ? c : c.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#374151]">Subcategory</label>
                    <input 
                      type="text" 
                      value={formData.subcategory}
                      onChange={e => handleChange('subcategory', e.target.value)}
                      placeholder="e.g. Daily Fresh"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#374151]">Warehouse Location / Bin</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={e => handleChange('location', e.target.value)}
                      placeholder="e.g. Rack A-02, Shelf 3"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#374151]">Inventory Status</label>
                    <select
                      value={formData.status}
                      onChange={e => handleChange('status', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all bg-white"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3 text-xs text-[#1e40af] flex items-center gap-2 mt-2">
                  <span>ℹ️</span>
                  <span>Updating the product name or category will keep the warehouse catalog in sync with global products.</span>
                </div>
              </div>
            )}

            {/* TAB 2: Pricing & Valuation */}
            {activeTab === 'pricing' && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#374151]">Base Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6b7280] font-bold">₹</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={formData.basePrice}
                        onChange={e => handleChange('basePrice', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-3.5 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all font-semibold"
                      />
                    </div>
                    <span className="text-[11px] text-[#6b7280]">Warehouse acquisition / base cost per unit</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#374151]">Selling Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6b7280] font-bold">₹</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={formData.sellingPrice}
                        onChange={e => handleChange('sellingPrice', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-3.5 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all font-semibold"
                      />
                    </div>
                    <span className="text-[11px] text-[#6b7280]">Default selling price for dispatch / customers</span>
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-[#374151]">Unit of Measure</label>
                    <input 
                      type="text" 
                      value={formData.unit}
                      onChange={e => handleChange('unit', e.target.value)}
                      placeholder="e.g. kg, pcs, crate"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                    />
                  </div>
                </div>

                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3.5 text-xs text-[#166534] flex flex-col gap-1 mt-2">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>💡</span> Pricing calculation rule
                  </div>
                  <p className="text-[#15803d]">
                    If a custom selling price is entered above, it directly overrides default margins. If left empty, selling price is calculated automatically: <em>(Base Price + Warehouse Overhead + Logistics) × Margin</em>.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Stock Quantities */}
            {activeTab === 'stock' && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#111827]">Current Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.currentStock}
                      onChange={e => handleChange('currentStock', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111827] focus:outline-none focus:border-[#07ac57] font-bold"
                    />
                    <span className="text-[10px] text-[#6b7280]">Total in warehouse</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#07ac57]">Available</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.availableStock}
                      onChange={e => handleChange('availableStock', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#07ac57] focus:outline-none focus:border-[#07ac57] font-bold"
                    />
                    <span className="text-[10px] text-[#6b7280]">Ready for orders</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#a855f7]">Reserved</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.reservedStock}
                      onChange={e => handleChange('reservedStock', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#a855f7] focus:outline-none focus:border-[#07ac57] font-bold"
                    />
                    <span className="text-[10px] text-[#6b7280]">Locked in orders</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#3b82f6]">Reorder Level</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.reorderLevel}
                      onChange={e => handleChange('reorderLevel', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#3b82f6] focus:outline-none focus:border-[#07ac57] font-bold"
                    />
                    <span className="text-[10px] text-[#6b7280]">Low stock alert</span>
                  </div>
                </div>

                <div className="border-t border-[#f3f4f6] pt-3">
                  <span className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2 block">
                    Movement & Adjustments
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#059669]">Stock In</label>
                      <input 
                        type="number" 
                        min="0"
                        value={formData.stockIn}
                        onChange={e => handleChange('stockIn', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#059669] focus:outline-none focus:border-[#07ac57] font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#ea580c]">Stock Out</label>
                      <input 
                        type="number" 
                        min="0"
                        value={formData.stockOut}
                        onChange={e => handleChange('stockOut', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#ea580c] focus:outline-none focus:border-[#07ac57] font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#d97706]">Missing</label>
                      <input 
                        type="number" 
                        min="0"
                        value={formData.missingStock}
                        onChange={e => handleChange('missingStock', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#d97706] focus:outline-none focus:border-[#07ac57] font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#dc2626]">Wastage</label>
                      <input 
                        type="number" 
                        min="0"
                        value={formData.wastageStock}
                        onChange={e => handleChange('wastageStock', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#dc2626] focus:outline-none focus:border-[#07ac57] font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f3f4f6] bg-[#f9fafb]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#4b5563] hover:bg-[#e5e7eb] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#07ac57] text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-[#059669] active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface ProductFormProps {
  initialData?: any;
  onSave: (data: any, imageFile?: File | null) => void;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    hsn: '',
    mrp: '',
    baseUnit: '',
    basePrice: '',
    status: true,
    description: '',
    organic: false,
    origin: '',
    shelfLife: '',
    storage: '',
    b2bEnabled: false
  });

  const [variations, setVariations] = useState([{ quantity: '', price: '', sellingPrice: '' }]);
  const [image, setImage] = useState<File | null>(null);
  const existingImageUrl = initialData?.imageUrl || null;

  useEffect(() => {
    if (initialData) {
      // Find the value for select by generic text matching or defaulting
      let catValue = '';
      if (initialData.category?.includes('Fruits')) catValue = 'fruits';
      else if (initialData.category?.includes('Grains')) catValue = 'grains';
      else if (initialData.category?.includes('Spices')) catValue = 'spices';
      else if (initialData.category?.includes('Pulses')) catValue = 'pulses';

      setFormData({
        title: initialData.name || '',
        category: catValue || 'fruits', // Fallback
        hsn: initialData.hsn || '',
        mrp: initialData.mrp || '', // This could be extracted from basePrice if needed
        baseUnit: 'kg', // Defaulting as mock doesn't have it
        basePrice: initialData.basePrice?.replace(/[^0-9.]/g, '') || '', // Extract number from string like '₹80/Kg'
        status: initialData.status === 'Active',
        description: initialData.description || '',
        organic: initialData.organic || false,
        origin: initialData.origin || '',
        shelfLife: initialData.shelfLife || '',
        storage: initialData.storage || '',
        b2bEnabled: initialData.b2b === 'Enabled'
      });

      if (initialData.variations && initialData.variations.length > 0) {
        setVariations(initialData.variations);
      }
    }
  }, [initialData]);

  const handleAddVarRow = () => {
    setVariations([...variations, { quantity: '', price: '', sellingPrice: '' }]);
  };

  const handleRemoveVarRow = (index: number) => {
    const newVars = variations.filter((_, i) => i !== index);
    setVariations(newVars);
  };

  const updateVarRow = (index: number, field: 'quantity' | 'price' | 'sellingPrice', value: string) => {
    const newVars = [...variations];
    newVars[index][field] = value;
    setVariations(newVars);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map form data back to table data structure
    let categoryDisplay = formData.category;
    if (formData.category === 'fruits') categoryDisplay = 'Fruits & Vegetables';
    if (formData.category === 'grains') categoryDisplay = 'Grains & Cereals';
    if (formData.category === 'spices') categoryDisplay = 'Spices & Herbs';
    if (formData.category === 'pulses') categoryDisplay = 'Pulses & Legumes';

    // Pass image file separately so the parent page can upload it to S3
    onSave({
      name: formData.title,
      category: categoryDisplay,
      hsn: formData.hsn,
      basePrice: `₹${formData.basePrice}/${formData.baseUnit==='g' ? 'g' : formData.baseUnit==='pc' ? 'pc' : formData.baseUnit==='l' ? 'L' : 'Kg'}`,
      b2b: formData.b2bEnabled ? 'Enabled' : 'Off',
      status: formData.status ? 'Active' : 'Inactive',
      variations: variations
    }, image);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      
      {/* Basic Info Section */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Input 
            label="Product Title" 
            placeholder="e.g. Fresh Turmeric Powder" 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <Select
            label="Category"
            options={[
              { label: 'Fruits & Vegetables', value: 'fruits' },
              { label: 'Grains & Cereals', value: 'grains' },
              { label: 'Spices & Herbs', value: 'spices' },
            ]}
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          />
          <Input 
            label="HSN Code" 
            placeholder="e.g. 0910" 
            required
            value={formData.hsn}
            onChange={(e) => setFormData({...formData, hsn: e.target.value})}
          />
          <Input 
            label="MRP (₹)" 
            type="number"
            placeholder="0.00" 
            required
            value={formData.mrp}
            onChange={(e) => setFormData({...formData, mrp: e.target.value})}
          />
          <Select
            label="Base Unit"
            options={[
              { label: 'Kilogram (Kg)', value: 'kg' },
              { label: 'Gram (g)', value: 'g' },
              { label: 'Litre (L)', value: 'l' },
              { label: 'Piece (pc)', value: 'pc' },
            ]}
            value={formData.baseUnit}
            onChange={(e) => setFormData({...formData, baseUnit: e.target.value})}
            required
          />
          <Input 
            label="Base Price (₹)" 
            type="number"
            placeholder="0.00" 
            required
            value={formData.basePrice}
            onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <Toggle 
              label="Product Status" 
              checked={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.checked})}
              enabledLabel="Active"
              disabledLabel="Inactive"
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-[#374151]">Description</label>
              <textarea 
                className="w-full bg-white border border-[#d1d5db] rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] transition-all min-h-[140px] resize-y"
                placeholder="Enter product description..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <div>
            <ImageUpload 
              label="Product Image" 
              onChange={setImage}
              className="h-full"
              existingImage={existingImageUrl}
            />
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Additional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center h-full pt-6">
            <Toggle 
              label="Organic Product" 
              checked={formData.organic}
              onChange={(e) => setFormData({...formData, organic: e.target.checked})}
            />
          </div>
          <Input 
            label="Country of Origin" 
            placeholder="e.g. India" 
            value={formData.origin}
            onChange={(e) => setFormData({...formData, origin: e.target.value})}
          />
          <Input 
            label="Shelf Life (Days)" 
            type="number"
            placeholder="e.g. 180" 
            value={formData.shelfLife}
            onChange={(e) => setFormData({...formData, shelfLife: e.target.value})}
          />
          <Input 
            label="Storage Condition" 
            placeholder="e.g. Cool & Dry" 
            value={formData.storage}
            onChange={(e) => setFormData({...formData, storage: e.target.value})}
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* B2C Pricing Variations */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#111827] mb-1">B2C Pricing Variations</h2>
            <p className="text-sm text-[#6b7280] mb-6">Define different pricing tiers based on quantity sold directly to consumers.</p>
            
            <div className="flex flex-col gap-3">
              {variations.map((v, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-end sm:items-start gap-4 p-4 border border-[#f3f4f6] rounded-lg bg-[#f9fafb]">
                  <div className="flex-1 w-full">
                    <Input 
                      placeholder="Qty (e.g. 500g)" 
                      value={v.quantity}
                      onChange={(e) => updateVarRow(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <Input 
                      placeholder="Price (₹)" 
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVarRow(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <Input 
                      placeholder="Selling Price (₹)" 
                      type="number"
                      value={v.sellingPrice}
                      onChange={(e) => updateVarRow(index, 'sellingPrice', e.target.value)}
                      required
                    />
                  </div>
                  {variations.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveVarRow(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded mb-[2px] mt-0.5 sm:mt-[2px] transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              className="mt-4 text-[#07ac57] hover:text-[#069a4e] hover:bg-[#e6f7ef]"
              onClick={handleAddVarRow}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              }
            >
              Add Variation
            </Button>
          </div>

          <div className="hidden md:block w-px bg-[#e5e7eb]"></div>

          {/* B2B Bluk Pricing Toggle */}
          <div className="md:w-1/3">
            <h2 className="text-lg font-bold text-[#111827] mb-1">B2B Bulk Pricing</h2>
            <p className="text-sm text-[#6b7280] mb-6">Enable special pricing for wholesale businesses.</p>
            
            <div className="p-6 border border-[#e5e7eb] rounded-xl flex flex-col gap-4 bg-[#f9fafb]">
              <Toggle 
                label="Enable B2B Pricing" 
                description="Allow business users to see bulk rates"
                checked={formData.b2bEnabled}
                onChange={(e) => setFormData({...formData, b2bEnabled: e.target.checked})}
              />
              
              {formData.b2bEnabled && (
                <div className="pt-4 border-t border-[#e5e7eb] flex flex-col gap-4 mt-2">
                   <p className="text-sm text-[#4b5563]">Detailed B2B settings will be configured in advanced panel.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 py-4 sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-[#f3f4f6] -mx-8 px-8 z-10">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Product' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}

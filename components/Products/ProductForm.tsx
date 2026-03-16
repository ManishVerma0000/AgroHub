'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { categoryService } from '@/services/categoryService';
import { subcategoryService } from '@/services/subcategoryService';

interface ProductFormProps {
  initialData?: any;
  onSave: (data: any, imageFile?: File | null) => void;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    subcategoryId: '',
    partcode: '',
    hsn: '',
    gstRate: '',
    mrp: '',
    baseUnit: '',
    basePrice: '',
    status: true,
    description: '',
    benefits: '',
    organic: 'No',
    origin: '',
    shelfLife: '',
    storage: '',
    b2bEnabled: false
  });

  const [variations, setVariations] = useState([{ quantity: '', price: '', sellingPrice: '' }]);
  const [image, setImage] = useState<File | null>(null);
  const existingImageUrl = initialData?.imageUrl || null;

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, subcatsRes] = await Promise.all([
          categoryService.getAll(),
          subcategoryService.getAll()
        ]);
        setCategories(catsRes);
        console.log(subcatsRes,'response')
        setSubcategories(subcatsRes);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.categoryId && categories.length > 0 && subcategories.length > 0) {
      const selectedCat = categories.find(c => c.id === formData.categoryId);
      if (selectedCat) {
        const filtered = subcategories.filter(sc => 
          sc.categoryId === selectedCat.id || sc.category === selectedCat.name
        );
        setFilteredSubcategories(filtered);
      } else {
        setFilteredSubcategories(subcategories);
      }
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryId, categories, subcategories]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.name || '',
        categoryId: initialData.categoryId || '',
        subcategoryId: initialData.subcategoryId || '',
        partcode: initialData.partcode || '',
        hsn: initialData.hsn || '',
        gstRate: initialData.gstRate || '',
        mrp: initialData.mrp || '', // This could be extracted from basePrice if needed
        baseUnit: initialData.baseUnit || 'kg', // Use provided or fallback
        basePrice: initialData.basePrice?.replace(/[^0-9.]/g, '') || '', // Extract number from string like '₹80/Kg'
        status: initialData.status === 'Active',
        description: initialData.description || '',
        benefits: initialData.benefits || '',
        organic: initialData.organic || 'No',
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
    
    // Pass image file separately so the parent page can upload it to S3
    onSave({
      name: formData.title,
      partcode: formData.partcode,
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      hsn: formData.hsn,
      gstRate: formData.gstRate,
      mrp: formData.mrp,
      baseUnit: formData.baseUnit,
      basePrice: `₹${formData.basePrice}/${formData.baseUnit==='g' ? 'g' : formData.baseUnit==='pc' ? 'pc' : formData.baseUnit==='l' ? 'L' : 'Kg'}`,
      description: formData.description,
      benefits: formData.benefits,
      organic: formData.organic,
      origin: formData.origin,
      shelfLife: formData.shelfLife,
      storage: formData.storage,
      b2b: formData.b2bEnabled ? 'Enabled' : 'Off',
      status: formData.status ? 'Active' : 'Inactive',
      variations: variations
    }, image);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      
      {/* Basic Info Section */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6 border-b border-[#f3f4f6] pb-4">Product Detail</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Fields) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Product Title" 
              placeholder="Enter product title" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <Input 
              label="Partcode" 
              placeholder="e.g. GR-001" 
              value={formData.partcode}
              onChange={(e) => setFormData({...formData, partcode: e.target.value})}
            />
            
            <Select
              label="Category"
              options={[
                { label: 'Select Category', value: '' },
                ...categories.map(c => ({ label: c.name, value: c.id }))
              ]}
              value={formData.categoryId}
              onChange={(e) => {
                setFormData({
                  ...formData, 
                  categoryId: e.target.value,
                  subcategoryId: '' // Reset subcategory when category changes
                });
              }}
              required
            />
            <Select
              label="Subcategory"
              options={[
                { label: 'Select Subcategory', value: '' },
                ...filteredSubcategories.map(sc => ({ label: sc.name, value: sc.id }))
              ]}
              value={formData.subcategoryId}
              onChange={(e) => setFormData({...formData, subcategoryId: e.target.value})}
              required
            />

            <Input 
              label="HSN Code" 
              placeholder="Type or Select" 
              required
              value={formData.hsn}
              onChange={(e) => setFormData({...formData, hsn: e.target.value})}
            />
            <Input 
              label="GST Rate" 
              placeholder="Auto-filled from HSN or Manual" 
              value={formData.gstRate}
              onChange={(e) => setFormData({...formData, gstRate: e.target.value})}
            />

            <Input 
              label="MRP" 
              type="number"
              placeholder="₹ 0.00" 
              required
              value={formData.mrp}
              onChange={(e) => setFormData({...formData, mrp: e.target.value})}
            />
            <Input 
              label="Base Price" 
              type="number"
              placeholder="₹ 0.00" 
              required
              value={formData.basePrice}
              onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
            />

            <Select
              label="Base Unit"
              options={[
                { label: 'Kg', value: 'kg' },
                { label: 'g', value: 'g' },
                { label: 'L', value: 'l' },
                { label: 'pc', value: 'pc' },
              ]}
              value={formData.baseUnit}
              onChange={(e) => setFormData({...formData, baseUnit: e.target.value})}
              required
            />
            <Select
              label="Status"
              options={[
                { label: 'Active', value: 'true' },
                { label: 'Inactive', value: 'false' },
              ]}
              value={formData.status ? 'true' : 'false'}
              onChange={(e) => setFormData({...formData, status: e.target.value === 'true'})}
              required
            />
          </div>

          {/* Right Column (Image) */}
          <div className="lg:col-span-1">
            <ImageUpload 
              label="Product Images" 
              onChange={setImage}
              className="h-full min-h-[250px]"
              existingImage={existingImageUrl}
            />
          </div>
        </div>
      </div>
        
      {/* Additional Details Section */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6 border-b border-[#f3f4f6] pb-4">Product Information</h2>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-[#374151]">Description</label>
            <textarea 
              className="w-full bg-white border border-[#d1d5db] rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] transition-all min-h-[100px] resize-y"
              placeholder="Product description..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-[#374151]">Benefits</label>
            <textarea 
              className="w-full bg-white border border-[#d1d5db] rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] transition-all min-h-[100px] resize-y"
              placeholder="Key benefits..."
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Organic"
              options={[
                { label: 'No', value: 'No' },
                { label: 'Yes', value: 'Yes' },
              ]}
              value={formData.organic}
              onChange={(e) => setFormData({...formData, organic: e.target.value})}
              required
            />
            <Input 
              label="Country of Origin" 
              placeholder="India" 
              value={formData.origin}
              onChange={(e) => setFormData({...formData, origin: e.target.value})}
            />
            <Input 
              label="Shelf Life" 
              placeholder="e.g. 12 months" 
              value={formData.shelfLife}
              onChange={(e) => setFormData({...formData, shelfLife: e.target.value})}
            />
            <Input 
              label="Storage Condition" 
              placeholder="e.g. Cool & dry place" 
              value={formData.storage}
              onChange={(e) => setFormData({...formData, storage: e.target.value})}
            />
          </div>
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

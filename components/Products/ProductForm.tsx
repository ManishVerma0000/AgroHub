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
    b2bEnabled: false,
    procurementUnit: '',
    conversionRate: '1',
    baseMargin: ''
  });

  const [b2bSlabs, setB2bSlabs] = useState([{ minQty: '', maxQty: '', rate: '' }]);
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
    if (formData.baseUnit && formData.procurementUnit) {
      if (formData.baseUnit === formData.procurementUnit) {
        setFormData(prev => ({ ...prev, conversionRate: '1' }));
      }
    }
  }, [formData.baseUnit, formData.procurementUnit]);

  useEffect(() => {
    if (formData.basePrice && formData.baseMargin) {
      const bPrice = parseFloat(formData.basePrice);
      const bMargin = parseFloat(formData.baseMargin);
      
      if (!isNaN(bPrice) && !isNaN(bMargin)) {
        setB2bSlabs(prev => prev.map((slab, index) => {
          const effectiveMargin = bMargin - (index * 2);
          const calculatedRate = bPrice * (1 + effectiveMargin / 100);
          return {
            ...slab,
            rate: `₹${calculatedRate.toFixed(2)}`
          };
        }));
      }
    }
  }, [formData.basePrice, formData.baseMargin, b2bSlabs.length]);

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
        b2bEnabled: initialData.b2b === 'Enabled',
        procurementUnit: initialData.procurementUnit || '',
        conversionRate: initialData.conversionRate?.toString() || '1',
        baseMargin: initialData.baseMargin || ''
      });

      if (initialData.b2bBulkSlabs && initialData.b2bBulkSlabs.length > 0) {
        setB2bSlabs(initialData.b2bBulkSlabs);
      }
    }
  }, [initialData]);


  const handleAddB2bRow = () => {
    setB2bSlabs([...b2bSlabs, { minQty: '', maxQty: '', rate: '' }]);
  };

  const handleRemoveB2bRow = (index: number) => {
    const newSlabs = b2bSlabs.filter((_, i) => i !== index);
    setB2bSlabs(newSlabs);
  };

  const updateB2bRow = (index: number, field: 'minQty' | 'maxQty' | 'rate', value: string) => {
    const newSlabs = [...b2bSlabs];
    newSlabs[index][field] = value;
    setB2bSlabs(newSlabs);
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
      basePrice: `₹${formData.basePrice}/Kg`,
      description: formData.description,
      benefits: formData.benefits,
      organic: formData.organic,
      origin: formData.origin,
      shelfLife: formData.shelfLife,
      storage: formData.storage,
      b2b: formData.b2bEnabled ? 'Enabled' : 'Off',
      status: formData.status ? 'Active' : 'Inactive',
      procurementUnit: formData.procurementUnit,
      conversionRate: parseFloat(formData.conversionRate) || 1,
      baseMargin: formData.baseMargin,
      b2bBulkSlabs: formData.b2bEnabled ? b2bSlabs : []
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
              label="Base Price (per Kg)" 
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
              label="Procurement Unit"
              options={[
                { label: 'Kg', value: 'kg' },
                { label: 'g', value: 'g' },
                { label: 'L', value: 'l' },
                { label: 'pc', value: 'pc' },
              ]}
              value={formData.procurementUnit}
              onChange={(e) => setFormData({...formData, procurementUnit: e.target.value})}
              required
            />

            <Input 
              label={`Define Conversion Unit to (${formData.baseUnit || 'Base Unit'})`}
              type="number"
              placeholder="1" 
              required
              value={formData.conversionRate}
              onChange={(e) => setFormData({...formData, conversionRate: e.target.value})}
              disabled={formData.baseUnit === formData.procurementUnit && formData.baseUnit !== ''}
            />
            <Input 
              label="Base Margin %/Unit" 
              type="number"
              placeholder="10" 
              value={formData.baseMargin}
              onChange={(e) => setFormData({...formData, baseMargin: e.target.value})}
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
        <div className="flex flex-col gap-8">
          
          {/* B2B Bluk Pricing Toggle */}
          <div className="w-full">
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
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-sm font-semibold text-[#111827]">B2B Pricing <span className="text-xs text-gray-400 font-normal">(Bulk Slabs)</span></span>
                     <Button 
                       type="button" 
                       variant="outline" 
                       className="h-8 px-3 text-sm text-[#07ac57] border-[#07ac57] hover:bg-[#e6f7ef] flex items-center gap-1"
                       onClick={handleAddB2bRow}
                     >
                       <span className="text-lg leading-none mt-[-2px]">+</span> Add Slab
                     </Button>
                   </div>
                   
                   <div className="flex flex-col gap-4">
                     {b2bSlabs.map((slab, index) => (
                       <div key={index} className="flex flex-col gap-2 p-3 bg-white border border-[#e5e7eb] rounded-lg relative shadow-sm">
                         <div className="flex items-center gap-2 w-full">
                           <div className="flex-1">
                             <Input 
                                label="Min Qty"
                                placeholder="e.g. 50kg" 
                                value={slab.minQty}
                                onChange={(e) => updateB2bRow(index, 'minQty', e.target.value)}
                                required
                             />
                           </div>
                           <div className="flex-1">
                             <Input 
                                label="Max Qty"
                                placeholder="e.g. 100kg" 
                                value={slab.maxQty}
                                onChange={(e) => updateB2bRow(index, 'maxQty', e.target.value)}
                                required
                             />
                           </div>
                         </div>
                         <div className="flex items-end gap-2 w-full mt-1">
                           <div className="flex-1">
                             <Input 
                                label={`Rate (₹) - [Margin: ${parseFloat(formData.baseMargin || '0') - (index * 2)}%]`}
                                placeholder="Auto-calculated" 
                                value={slab.rate}
                                readOnly
                                required
                             />
                           </div>
                           {b2bSlabs.length > 1 && (
                             <button 
                               type="button" 
                               onClick={() => handleRemoveB2bRow(index)}
                               className="h-[42px] px-3 mb-1 text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 flex items-center justify-center flex-shrink-0"
                             >
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                 <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                               </svg>
                             </button>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
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

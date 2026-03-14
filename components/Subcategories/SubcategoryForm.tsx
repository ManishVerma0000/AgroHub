'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import StatusToggle from '../StatusToggle/StatusToggle';

interface SubcategoryFormProps {
  initialData?: any;
  onSave: (data: any, imageFile?: File | null) => void;
  onCancel: () => void;
}

export function SubcategoryForm({ initialData, onSave, onCancel }: SubcategoryFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    status: 'Active',
  });

  const [image, setImage] = useState<File | null>(null);
  const [hsnCodes, setHsnCodes] = useState([{ code: '', gst: '', description: '' }]);
  const existingImageUrl = initialData?.imageUrl || null;

  useEffect(() => {
    if (initialData) {
      let catValue = '';
      if (initialData.category.includes('Fruits')) catValue = 'fruits';
      else if (initialData.category.includes('Grains')) catValue = 'grains';
      else if (initialData.category.includes('Spices')) catValue = 'spices';
      else if (initialData.category.includes('Pulses')) catValue = 'pulses';

      setFormData({
        category: catValue || 'fruits',
        name: initialData.name || '',
        description: initialData.description || '',
        status: initialData.status || 'Active',
      });

      if (initialData.hsnCodes && initialData.hsnCodes.length > 0) {
        setHsnCodes(initialData.hsnCodes.map((h: any) => ({
          code: h.code || '',
          gst: h.gst || '',
          description: h.description || ''
        })));
      }
    }
  }, [initialData]);

  const handleAddHsnRow = () => {
    setHsnCodes([...hsnCodes, { code: '', gst: '', description: '' }]);
  };

  const handleRemoveHsnRow = (index: number) => {
    const newCodes = hsnCodes.filter((_, i) => i !== index);
    setHsnCodes(newCodes);
  };

  const updateHsnRow = (index: number, field: 'code' | 'gst' | 'description', value: string) => {
    const newCodes = [...hsnCodes];
    newCodes[index][field] = value;
    setHsnCodes(newCodes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let categoryDisplay = formData.category;
    if (formData.category === 'fruits') categoryDisplay = 'Fruits & Vegetables';
    if (formData.category === 'grains') categoryDisplay = 'Grains & Cereals';
    if (formData.category === 'spices') categoryDisplay = 'Spices & Herbs';
    if (formData.category === 'pulses') categoryDisplay = 'Pulses & Legumes';

    onSave({
      name: formData.name,
      category: categoryDisplay,
      description: formData.description,
      status: formData.status,
      hsnCodes: hsnCodes
    }, image);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#f3f4f6] p-8 max-w-4xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={[
                { label: 'Fruits & Vegetables', value: 'fruits' },
                { label: 'Grains & Cereals', value: 'grains' },
                { label: 'Spices & Herbs', value: 'spices' },
                { label: 'Pulses & Legumes', value: 'pulses' },
              ]}
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
            <Select
              label="Parent Category"
              options={[
                { label: 'Fruits & Vegetables', value: 'fruits' },
                { label: 'Grains & Cereals', value: 'grains' },
                { label: 'Spices & Herbs', value: 'spices' },
                { label: 'Pulses & Legumes', value: 'pulses' },
              ]}
              value={formData.category} // Using same for now as per UI
              onChange={() => {}} 
              required
            />
          </div>
          <Input 
            label="Subcategory Name" 
            placeholder="e.g. Basmati Rice" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-[#374151]">Description</label>
            <textarea 
              className="w-full bg-white border border-[#d1d5db] rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] transition-all min-h-[100px] resize-y"
              placeholder="Enter subcategory description..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <ImageUpload 
            label="Image"
            onChange={setImage}
            existingImage={existingImageUrl}
            className="flex-1 min-h-[140px]"
          />
        </div>
      </div>

      <div className="mb-8 p-6 bg-[#f9fafb] rounded-xl border border-[#f3f4f6]">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-semibold text-[#111827]">HSN Codes</label>
          <Button 
            type="button" 
            variant="ghost" 
            className="text-[#07ac57] hover:text-[#069a4e] p-0 h-auto font-medium text-sm gap-1"
            onClick={handleAddHsnRow}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add HSN Code
          </Button>
        </div>
        
        <div className="flex flex-col gap-4">
          {hsnCodes.map((hsn, index) => (
            <div key={index} className="flex gap-4 items-end bg-white p-4 rounded-lg border border-[#f3f4f6] relative group">
              <div className="w-1/4">
                <Input 
                  placeholder="HSN Code" 
                  value={hsn.code}
                  onChange={(e) => updateHsnRow(index, 'code', e.target.value)}
                  required
                />
              </div>
              <div className="w-1/4">
                <Input 
                  placeholder="GST %" 
                  type="number"
                  value={hsn.gst}
                  onChange={(e) => updateHsnRow(index, 'gst', e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <Input 
                  placeholder="Description" 
                  value={hsn.description}
                  onChange={(e) => updateHsnRow(index, 'description', e.target.value)}
                />
              </div>
              {hsnCodes.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveHsnRow(index)}
                  className="p-2 text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-[#f3f4f6]">
        <StatusToggle 
          label="Status"
          initialValue={formData.status === 'Active'}
          onChange={(val) => setFormData({...formData, status: val ? 'Active' : 'Inactive'})}
        />
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel} className="px-8">
            Cancel
          </Button>
          <Button type="submit" className="px-8 bg-[#07ac57] hover:bg-[#069a4e]">
            {initialData ? 'Save Changes' : 'Save Subcategory'}
          </Button>
        </div>
      </div>
    </form>
  );
}

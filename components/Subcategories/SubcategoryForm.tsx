'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface SubcategoryFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function SubcategoryForm({ initialData, onSave, onCancel }: SubcategoryFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
  });

  const [hsnCodes, setHsnCodes] = useState([{ code: '', gst: '' }]);

  useEffect(() => {
    if (initialData) {
      // Find the value for select by generic text matching or defaulting
      let catValue = '';
      if (initialData.category.includes('Fruits')) catValue = 'fruits';
      else if (initialData.category.includes('Grains')) catValue = 'grains';
      else if (initialData.category.includes('Spices')) catValue = 'spices';
      else if (initialData.category.includes('Pulses')) catValue = 'pulses';

      setFormData({
        category: catValue || 'fruits', // Fallback
        name: initialData.name || '',
        description: initialData.description || '',
      });

      if (initialData.hsnCodes && initialData.hsnCodes.length > 0) {
        setHsnCodes(initialData.hsnCodes);
      }
    }
  }, [initialData]);

  const handleAddHsnRow = () => {
    setHsnCodes([...hsnCodes, { code: '', gst: '' }]);
  };

  const handleRemoveHsnRow = (index: number) => {
    const newCodes = hsnCodes.filter((_, i) => i !== index);
    setHsnCodes(newCodes);
  };

  const updateHsnRow = (index: number, field: 'code' | 'gst', value: string) => {
    const newCodes = [...hsnCodes];
    newCodes[index][field] = value;
    setHsnCodes(newCodes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subcategory Form Submitted:', { ...formData, hsnCodes });
    
    // Convert Select value back to display value for the table
    let categoryDisplay = formData.category;
    if (formData.category === 'fruits') categoryDisplay = 'Fruits & Vegetables';
    if (formData.category === 'grains') categoryDisplay = 'Grains & Cereals';
    if (formData.category === 'spices') categoryDisplay = 'Spices & Herbs';
    if (formData.category === 'pulses') categoryDisplay = 'Pulses & Legumes';

    onSave({
      name: formData.name,
      category: categoryDisplay,
      description: formData.description,
      hsnCodes: hsnCodes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#f3f4f6] p-8 max-w-4xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left Column: Basic Details */}
        <div className="flex flex-col gap-6">
          <Select
            label="Parent Category"
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
              className="w-full bg-white border border-[#d1d5db] rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] transition-all min-h-[120px] resize-y"
              placeholder="Enter subcategory description..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        {/* Right Column: Dynamic HSN Codes */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-[#374151] mb-4">HSN Codes & GST</label>
          <div className="flex flex-col gap-3">
            {hsnCodes.map((hsn, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-[#f3f4f6] rounded-lg bg-[#f9fafb]">
                <div className="flex-1">
                  <Input 
                    placeholder="HSN Code" 
                    value={hsn.code}
                    onChange={(e) => updateHsnRow(index, 'code', e.target.value)}
                    required
                  />
                </div>
                <div className="w-24 border-l border-[#d1d5db] pl-4">
                  <Input 
                    placeholder="GST %" 
                    type="number"
                    value={hsn.gst}
                    onChange={(e) => updateHsnRow(index, 'gst', e.target.value)}
                    required
                  />
                </div>
                {hsnCodes.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveHsnRow(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded mt-0.5 transition-colors"
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
            className="self-start mt-4 text-[#07ac57] hover:text-[#069a4e] hover:bg-[#e6f7ef]"
            onClick={handleAddHsnRow}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }
          >
            Add More
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-[#f3f4f6]">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Subcategory' : 'Save Subcategory'}
        </Button>
      </div>
    </form>
  );
}

'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface WarehouseFormProps {
  onCancel: () => void;
}

export function WarehouseForm({ onCancel }: WarehouseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    managerName: '',
    contactNumber: '',
    emailId: '',
    fullAddress: '',
    state: '',
    city: '',
    pinCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Warehouse Form Submitted:', formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      
      {/* Primary Details */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Warehouse Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Warehouse Name" 
            placeholder="e.g. Central Hub" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Manager Name" 
            placeholder="e.g. John Doe" 
            required
            value={formData.managerName}
            onChange={(e) => setFormData({...formData, managerName: e.target.value})}
          />
          <Input 
            label="Contact Number" 
            type="tel"
            placeholder="e.g. +91 9876543210" 
            required
            value={formData.contactNumber}
            onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
          />
          <Input 
            label="Email ID" 
            type="email"
            placeholder="e.g. manager@hub.com" 
            required
            value={formData.emailId}
            onChange={(e) => setFormData({...formData, emailId: e.target.value})}
          />
        </div>
      </div>

      {/* Address Details */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Address Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
          <Input 
            label="Full Address" 
            placeholder="House, Street, Area" 
            required
            value={formData.fullAddress}
            onChange={(e) => setFormData({...formData, fullAddress: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input 
            label="State" 
            placeholder="e.g. Maharashtra" 
            required
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
          />
          <Input 
            label="City" 
            placeholder="e.g. Mumbai" 
            required
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
          <Input 
            label="Pin Code" 
            placeholder="e.g. 400001" 
            required
            value={formData.pinCode}
            onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Warehouse
        </Button>
      </div>
    </form>
  );
}

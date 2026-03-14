'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';

export function SettingsForm() {
  const [formData, setFormData] = useState({
    companyName: 'AgroHub Global',
    registrationNumber: 'CIN-U12345MH2026PTC78910',
    gstin: '27AABCA1234Z1Z5',
    adminName: 'Admin User',
    adminEmail: 'admin@agrohub.com',
    adminPhone: '+91 9000000000',
    address: '123 Business Avenue, Tech Park',
    state: 'Maharashtra',
    city: 'Mumbai',
    pinCode: '400051'
  });

  const [logo, setLogo] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Settings Form Submitted:', { ...formData, logo });
    toast.success('Settings saved successfully');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-5xl">

      <div className="flex items-center justify-between pb-4 border-b border-[#f3f4f6]">
         <div>
            <h2 className="text-xl font-bold text-[#111827]">General Settings</h2>
            <p className="text-sm text-[#6b7280]">Manage your company profile and administrative details.</p>
         </div>
         <Button type="submit">
            Save Changes
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 border border-[#f3f4f6] rounded-xl p-6 bg-[#f9fafb] self-start">
            <h3 className="text-base font-semibold text-[#111827] mb-4">Company Logo</h3>
            <ImageUpload 
               onChange={setLogo}
               className="h-48"
            />
         </div>

         <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Company Info */}
            <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
               <h3 className="text-lg font-bold text-[#111827] mb-6">Company Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                  label="Company Name" 
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
               />
               <Input 
                  label="Registration Number" 
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
               />
               <Input 
                  label="GSTIN" 
                  value={formData.gstin}
                  onChange={(e) => setFormData({...formData, gstin: e.target.value})}
               />
               </div>
            </div>

            {/* Admin Info */}
            <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm">
               <h3 className="text-lg font-bold text-[#111827] mb-6">Administrator Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                  label="Full Name" 
                  required
                  value={formData.adminName}
                  onChange={(e) => setFormData({...formData, adminName: e.target.value})}
               />
               <Input 
                  label="Email Address" 
                  type="email"
                  required
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
               />
               <Input 
                  label="Phone Number" 
                  type="tel"
                  required
                  value={formData.adminPhone}
                  onChange={(e) => setFormData({...formData, adminPhone: e.target.value})}
               />
               </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl border border-[#f3f4f6] p-8 shadow-sm mb-12">
               <h3 className="text-lg font-bold text-[#111827] mb-6">Business Address</h3>
               <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
               <Input 
                  label="Full Address" 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
               />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Input 
                  label="State" 
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
               />
               <Input 
                  label="City" 
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
               />
               <Input 
                  label="Pin Code" 
                  required
                  value={formData.pinCode}
                  onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
               />
               </div>
            </div>
         </div>
      </div>
    </form>
  );
}

'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';

interface WarehouseFormProps {
  initialData?: any;
  onSave: (data: any, images?: File[], documents?: File[]) => void;
  onCancel: () => void;
}

export function WarehouseForm({ initialData, onSave, onCancel }: WarehouseFormProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);
  const [existingDocs, setExistingDocs] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    gstNo: '',
    contact: '',
    fssaiNo: '',
    email: '',
    openTime: '',
    gstOwner: '',
    closeTime: '',

    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
    latitudeLink: '',

    status: true,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        manager: initialData.manager || '',
        gstNo: initialData.gstNo || '',
        contact: initialData.contact || '',
        fssaiNo: initialData.fssaiNo || '',
        email: initialData.email || '',
        openTime: initialData.openTime || '',
        gstOwner: initialData.gstOwner || '',
        closeTime: initialData.closeTime || '',

        addressLine: initialData.location || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pinCode: initialData.pinCode || '',
        latitudeLink: initialData.latitudeLink || '',

        status: initialData.status !== 'Inactive',
      });
      setExistingImages(initialData.images || []);
      setExistingDocs(initialData.documents || []);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      manager: formData.manager,
      contact: formData.contact,
      location: formData.addressLine,
      email: formData.email,
      state: formData.state,
      city: formData.city,
      pinCode: formData.pinCode,
      gstNo: formData.gstNo,
      fssaiNo: formData.fssaiNo,
      openTime: formData.openTime,
      closeTime: formData.closeTime,
      gstOwner: formData.gstOwner,
      latitudeLink: formData.latitudeLink,
      status: formData.status ? 'Active' : 'Inactive',
      images: existingImages,
      documents: existingDocs
    }, selectedImages, selectedDocs);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* SECTION: Warehouse Details */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Warehouse Details</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Warehouse Name" 
              placeholder="e.g. Mumbai Central Warehouse" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              label="Manager Name" 
              placeholder="Full name" 
              required
              value={formData.manager}
              onChange={(e) => setFormData({...formData, manager: e.target.value})}
            />
            <Input 
              label="GST No." 
              placeholder="15-digit GST number" 
              required
              value={formData.gstNo}
              onChange={(e) => setFormData({...formData, gstNo: e.target.value})}
            />
            <Input 
              label="Phone Number" 
              type="tel"
              placeholder="+91 XXXXX XXXXX" 
              required
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
            />
            <Input 
              label="FSSAI No." 
              placeholder="14-digit FSSAI number" 
              required
              value={formData.fssaiNo}
              onChange={(e) => setFormData({...formData, fssaiNo: e.target.value})}
            />
            <Input 
              label="Email ID" 
              type="email"
              placeholder="email@example.com" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="Open Time" 
              type="time"
              placeholder="06:00" 
              value={formData.openTime}
              onChange={(e) => setFormData({...formData, openTime: e.target.value})}
            />
            <Input 
              label="GST Owner" 
              placeholder="Legal entity name" 
              value={formData.gstOwner}
              onChange={(e) => setFormData({...formData, gstOwner: e.target.value})}
            />
            <Input 
              label="Close Time" 
              type="time"
              placeholder="22:00" 
              value={formData.closeTime}
              onChange={(e) => setFormData({...formData, closeTime: e.target.value})}
            />
            <div className="hidden md:block"></div>
          </div>

          <div className="w-full lg:w-[320px]">
             <label className="block text-sm font-medium text-[#374151] mb-2">Warehouse Images <span className="text-gray-400 font-normal">(Max 10)</span></label>
             <label className="border hover:border-[#07ac57] transition-colors border-dashed border-[#d1d5db] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#f9fafb] cursor-pointer relative min-h-[250px]">
               <input 
                 type="file" 
                 accept="image/*" 
                 multiple 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 onChange={(e) => {
                   if (e.target.files) {
                     setSelectedImages(Array.from(e.target.files));
                   }
                 }}
               />
               <div className="w-12 h-12 flex items-center justify-center mb-3">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                   <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                 </svg>
               </div>
               <p className="text-sm text-[#6b7280]">Drag Images here or <br/><span className="text-[#07ac57] font-medium">Browse Images</span></p>
               {selectedImages.length > 0 && <p className="text-xs text-[#07ac57] mt-2 font-medium bg-[#07ac57]/10 px-2 py-1 rounded-full">{selectedImages.length} new images selected</p>}
               {existingImages.length > 0 && (
                 <div className="flex gap-2 mt-4 flex-wrap justify-center px-2">
                   {existingImages.map((url, i) => (
                     <div key={i} className="relative w-12 h-12 rounded overflow-hidden shadow-sm border border-gray-200">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={url} alt={`Existing img ${i+1}`} className="w-full h-full object-cover" />
                     </div>
                   ))}
                 </div>
               )}
             </label>
          </div>
        </div>
      </div>

      {/* SECTION: Warehouse Address */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Warehouse Address</h2>
        <div className="flex flex-col gap-6">
          <Input 
            label="Address Line" 
            placeholder="Street, area, building number" 
            required
            value={formData.addressLine}
            onChange={(e) => setFormData({...formData, addressLine: e.target.value})}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="City" 
              placeholder="City name" 
              required
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
            <Select 
              label="State" 
              required
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              options={[
                { label: 'Maharashtra', value: 'Maharashtra' },
                { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
                { label: 'Karnataka', value: 'Karnataka' },
                { label: 'Delhi', value: 'Delhi' },
              ]}
            />
            <Input 
              label="Pincode" 
              placeholder="6-digit pincode" 
              required
              value={formData.pinCode}
              onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
            />
          </div>
          <Input 
            label="Paste Latitude Link (Google Maps)" 
            placeholder="e.g. 19.0760° N, 72.8777° E or Google Maps URL" 
            value={formData.latitudeLink}
            onChange={(e) => setFormData({...formData, latitudeLink: e.target.value})}
          />
        </div>
      </div>

      {/* SECTION: Document Upload */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-2">
          Document Upload <span className="text-xs text-gray-400 font-normal mt-[3px]">(Max 5 · PDF, JPG, PNG)</span>
        </h2>
        <label className="border hover:border-[#07ac57] transition-colors border-dashed border-[#d1d5db] rounded-xl py-10 px-6 flex flex-col items-center justify-center text-center bg-[#f9fafb] cursor-pointer w-full relative">
           <input 
             type="file" 
             accept=".pdf,image/png,image/jpeg" 
             multiple 
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             onChange={(e) => {
               if (e.target.files) setSelectedDocs(Array.from(e.target.files));
             }}
           />
           <div className="mb-3">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
             </svg>
           </div>
           <p className="text-sm text-[#6b7280]">Drag documents here or <span className="text-[#07ac57] font-medium">Browse Files</span></p>
           <p className="text-xs text-[#9ca3af] mt-2">GST Certificate · FSSAI Certificate · Warehouse License</p>
           {selectedDocs.length > 0 && <p className="text-xs text-[#07ac57] mt-3 font-medium bg-[#07ac57]/10 px-3 py-1 rounded-full">{selectedDocs.length} new documents selected</p>}

           {existingDocs.length > 0 && (
             <div className="flex flex-col gap-2 mt-4 text-left w-full max-w-sm px-4">
               <span className="text-xs font-semibold text-gray-500 uppercase text-center mt-2">Existing Documents</span>
               {existingDocs.map((url, i) => {
                 const filename = url.split('/').pop() || `Document ${i+1}`;
                 return (
                   <a key={i} href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 truncate hover:underline bg-blue-50 py-1.5 px-3 rounded-md border border-blue-100 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                     {filename}
                   </a>
                 );
               })}
             </div>
           )}
        </label>
      </div>

      {/* SECTION: Status Toggle */}
      <div className="bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#111827]">Warehouse Status <span className="text-red-500">*</span></span>
          <span className="text-xs text-[#6b7280]">Set the warehouse as active or inactive</span>
        </div>
        <Toggle 
          checked={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.checked})}
          enabledLabel="Active"
        />
      </div>

      {/* SECTION: Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" className="text-[#07ac57] border-[#07ac57] hover:bg-[#07ac57]/5">
            Save & Add Another
          </Button>
          <Button type="submit">
            Save Warehouse
          </Button>
        </div>
      </div>
    </form>
  );
}

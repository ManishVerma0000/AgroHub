'use client';

import React, { useState } from 'react';

interface ImageUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;
  className?: string;
}

export function ImageUpload({ label, onChange, className = '' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-[#374151]">{label}</label>}
      <div className="border border-dashed border-[#d1d5db] rounded-lg p-6 bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors flex flex-col items-center justify-center relative cursor-pointer group min-h-[140px]">
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          accept="image/*"
          onChange={handleFileChange}
        />
        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Upload preview" className="max-h-32 object-contain rounded" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
              <span className="text-white text-sm font-medium">Change Image</span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-[#374151]">Click to upload or drag and drop</p>
            <p className="text-xs text-[#6b7280] mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </>
        )}
      </div>
    </div>
  );
}

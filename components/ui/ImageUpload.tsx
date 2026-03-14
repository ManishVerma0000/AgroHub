'use client';

import React, { useState } from 'react';

interface ImageUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;
  className?: string;
  existingImage?: string | null;
}

export function ImageUpload({ label, onChange, className = '', existingImage }: ImageUploadProps) {
  const [newPreview, setNewPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPreview(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  const isEditing = !!existingImage;
  const hasNewImage = !!newPreview;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-[#374151]">{label}</label>}

      {/* Side-by-side comparison when editing and a new image is selected */}
      {isEditing && hasNewImage ? (
        <div className="flex gap-3 items-start">
          {/* Current / Old Image */}
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">Current</span>
            <div className="border border-[#d1d5db] rounded-lg p-3 bg-[#f9fafb] flex items-center justify-center min-h-[120px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={existingImage} alt="Current image" className="max-h-28 object-contain rounded" />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center self-center mt-5 text-[#6b7280]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>

          {/* New Image */}
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#07ac57] uppercase tracking-wide">New (Replacing)</span>
            <div className="border-2 border-dashed border-[#07ac57]/40 rounded-lg p-3 bg-[#f0fdf4] flex items-center justify-center min-h-[120px] relative group cursor-pointer">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*"
                onChange={handleFileChange}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={newPreview} alt="New image" className="max-h-28 object-contain rounded" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Single image display: either show existing image with upload option, or plain upload */
        <div className="border border-dashed border-[#d1d5db] rounded-lg p-6 bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors flex flex-col items-center justify-center relative cursor-pointer group min-h-[140px]">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept="image/*"
            onChange={handleFileChange}
          />
          {isEditing && !hasNewImage ? (
            /* Show existing image with hover prompt to change it */
            <div className="relative w-full h-full flex items-center justify-center flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={existingImage!} alt="Current image" className="max-h-32 object-contain rounded" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                <span className="text-white text-sm font-medium">📷 Change Image</span>
              </div>
            </div>
          ) : newPreview ? (
            /* New upload (no existing), show new preview */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={newPreview} alt="Upload preview" className="max-h-32 object-contain rounded" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                <span className="text-white text-sm font-medium">Change Image</span>
              </div>
            </div>
          ) : (
            /* Default empty state */
            <>
              <div className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[#374151]">Click to upload or drag and drop</p>
              <p className="text-xs text-[#6b7280] mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

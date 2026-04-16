'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WarehouseProfile {
  id: string;
  name: string;
  manager: string;
  contact: string;
  location: string;
  email: string;
  state: string;
  city: string;
  pinCode: string;
  gstNo: string;
  fssaiNo: string;
  openTime: string;
  closeTime: string;
  gstOwner: string;
  latitudeLink: string;
  images: string[];
  documents: string[];
  status: string;
  createdDate: string;
  overheadCost: number;
  logisticCost: number;
}

export default function WarehouseProfilePage() {
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<WarehouseProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('wmsToken');
      if (!token) {
        router.push('/wms');
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/warehouse/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch warehouse profile');
        }
        const data = await response.json();
        setWarehouse(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('wmsToken');
    router.push('/wms');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#07ac57] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p className="text-[#6b7280] text-sm">{error || 'Could not load warehouse profile.'}</p>
      </div>
    );
  }

  const initials = warehouse.name?.slice(0, 2).toUpperCase() || 'WH';
  const isOpen = warehouse.status === 'Active';

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#07ac57] to-[#059c4c] rounded-2xl p-6 text-white shadow-lg shadow-[#07ac57]/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute right-16 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-8"></div>
        <div className="flex items-center gap-5 relative">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-3xl border border-white/30">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{warehouse.name}</h1>
            <p className="text-white/80 text-sm mt-0.5">{warehouse.city}, {warehouse.state} – {warehouse.pinCode}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${isOpen ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-white' : 'bg-white/40'}`}></span>
                {warehouse.status}
              </span>
              <span className="text-white/60 text-xs">{warehouse.openTime} – {warehouse.closeTime}</span>
            </div>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Contact & Management */}
        <div className="bg-white rounded-2xl border border-[#f3f4f6] shadow-sm p-6">
          <h2 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-[#07ac57]/10 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#07ac57" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            Contact & Management
          </h2>
          <div className="flex flex-col gap-4">
            <InfoRow icon="user" label="Manager" value={warehouse.manager} />
            <InfoRow icon="phone" label="Contact" value={warehouse.contact} />
            <InfoRow icon="mail" label="Email" value={warehouse.email} />
            <InfoRow icon="map-pin" label="Location" value={warehouse.location} />
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-2xl border border-[#f3f4f6] shadow-sm p-6">
          <h2 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
            Compliance & Legal
          </h2>
          <div className="flex flex-col gap-4">
            <InfoRow icon="file" label="GST No." value={warehouse.gstNo || '—'} />
            <InfoRow icon="file" label="FSSAI No." value={warehouse.fssaiNo || '—'} />
            <InfoRow icon="user" label="GST Owner" value={warehouse.gstOwner || '—'} />
            <InfoRow icon="calendar" label="Created Date" value={warehouse.createdDate} />
          </div>
        </div>

        {/* Cost & Pricing */}
        <div className="bg-white rounded-2xl border border-[#f3f4f6] shadow-sm p-6">
          <h2 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </span>
            Cost & Pricing
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 bg-[#f9fafb] rounded-xl p-4 text-center">
              <p className="text-xs text-[#6b7280] mb-1">Overhead Cost</p>
              <p className="text-2xl font-bold text-[#111827]">₹{warehouse.overheadCost?.toFixed(2)}</p>
            </div>
            <div className="flex-1 bg-[#f9fafb] rounded-xl p-4 text-center">
              <p className="text-xs text-[#6b7280] mb-1">Logistics Cost</p>
              <p className="text-2xl font-bold text-[#111827]">₹{warehouse.logisticCost?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Location & Links */}
        <div className="bg-white rounded-2xl border border-[#f3f4f6] shadow-sm p-6">
          <h2 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8z"/></svg>
            </span>
            Location
          </h2>
          <div className="flex flex-col gap-4">
            <InfoRow icon="map" label="City" value={warehouse.city} />
            <InfoRow icon="map" label="State" value={warehouse.state} />
            <InfoRow icon="map" label="PIN Code" value={warehouse.pinCode} />
            {warehouse.latitudeLink && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#6b7280] w-24 shrink-0">Map Link</span>
                <a
                  href={warehouse.latitudeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#07ac57] hover:underline font-medium truncate"
                >
                  View on Map →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents */}
      {warehouse.documents && warehouse.documents.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#f3f4f6] shadow-sm p-6">
          <h2 className="text-base font-semibold text-[#111827] mb-4">Documents</h2>
          <div className="flex flex-wrap gap-3">
            {warehouse.documents.map((doc, i) => (
              <a
                key={i}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#f9fafb] border border-[#f3f4f6] rounded-lg text-sm text-[#374151] hover:border-[#07ac57] hover:text-[#07ac57] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Document {i + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-[#9ca3af] w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-[#111827] font-medium flex-1 break-all">{value || '—'}</span>
    </div>
  );
}

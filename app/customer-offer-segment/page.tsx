"use client";

import React, { useState, useEffect, SVGProps } from "react";
import { offerService, Offer } from "../../services/offerService";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function CustomerOfferSegmentPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  
  // Image lightbox preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    offerName: "",
    offerType: "CART VALUE" as "CART VALUE" | "NEW CUSTOMER" | "WIN-BACK",
    minOrderValue: "",
    benefitType: "Flat" as "L" | "M" | "H" | "Flat",
    benefitValue: "",
    usageLimit: "1",
    usageType: "Once" as "Monthly" | "Weekly" | "Once" | "Unlimited",
    validUntil: "",
    status: true,
    imageUrl: "",
  });

  // Fetch all offers
  const fetchData = async () => {
    try {
      setLoading(true);
      const offerList = await offerService.getAll();
      setOffers(offerList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load offers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      setIsUploading(true);
      const res = await api.post("/upload/", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData(prev => ({ ...prev, imageUrl: res.data.image_url }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      offerName: "",
      offerType: "CART VALUE",
      minOrderValue: "",
      benefitType: "Flat",
      benefitValue: "",
      usageLimit: "1",
      usageType: "Once",
      validUntil: "",
      status: true,
      imageUrl: "",
    });
    setEditingOfferId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    // Format validUntil to YYYY-MM-DD
    let formattedDate = "";
    if (offer.validUntil) {
      const d = new Date(offer.validUntil);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
      }
    }

    setFormData({
      offerName: offer.offerName,
      offerType: offer.offerType,
      minOrderValue: String(offer.minOrderValue),
      benefitType: offer.benefitType,
      benefitValue: String(offer.benefitValue),
      usageLimit: String(offer.usageLimit),
      usageType: offer.usageType,
      validUntil: formattedDate,
      status: offer.status === "Active",
      imageUrl: offer.imageUrl || "",
    });
    setEditingOfferId(offer.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOfferId(null);
  };

  const handleSave = async () => {
    if (!formData.offerName || formData.minOrderValue === "" || formData.benefitValue === "" || !formData.validUntil) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      offerName: formData.offerName,
      offerType: formData.offerType,
      minOrderValue: Number(formData.minOrderValue),
      benefitType: formData.benefitType,
      benefitValue: Number(formData.benefitValue),
      usageLimit: Number(formData.usageLimit),
      usageType: formData.usageType,
      validUntil: new Date(formData.validUntil).toISOString(),
      status: (formData.status ? "Active" : "Inactive") as "Active" | "Inactive",
      imageUrl: formData.imageUrl,
    };

    try {
      if (editingOfferId) {
        await offerService.update(editingOfferId, payload);
        toast.success("Offer updated successfully");
      } else {
        await offerService.create(payload);
        toast.success("Offer created successfully");
      }
      closeModal();
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to save offer");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the offer "${name}"?`)) {
      try {
        await offerService.delete(id);
        toast.success("Offer deleted successfully");
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete offer");
      }
    }
  };

  const handleToggleStatus = async (offer: Offer) => {
    const newStatus = offer.status === "Active" ? "Inactive" : "Active";
    try {
      await offerService.update(offer.id, { status: newStatus });
      toast.success(`Offer "${offer.offerName}" is now ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Filter offers based on search and dropdown filters
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.offerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "" || offer.offerType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] p-6 text-slate-800 font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Customer Offer Segment</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage target offers, discounts, and slab rules for B2B/B2C checkouts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#07ac57] text-white rounded-xl text-sm font-semibold hover:bg-[#06994e] cursor-pointer transition-all shadow-[0_4px_14px_rgba(7,172,87,0.3)]"
          >
            <PlusIcon className="w-4 h-4" />
            Create Offer
          </button>
        </div>
      </div>

      {/* Segment Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-[#07ac57] to-[#059048] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">1. Win-Back Offers</h3>
            <p className="text-xs text-white/85 mt-1 leading-relaxed">
              Targeted to inactive customers to restore interaction. Highest priority in checkout matches.
            </p>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {offers.filter(o => o.offerType === "WIN-BACK" && o.status === "Active").length}
            </span>
            <span className="text-xs text-white/80">Active Campaigns</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">2. New Customer Offers</h3>
            <p className="text-xs text-white/85 mt-1 leading-relaxed">
              Incentivize initial purchases and maximize checkout conversions for first-time shoppers. Evaluated at Priority 2.
            </p>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {offers.filter(o => o.offerType === "NEW CUSTOMER" && o.status === "Active").length}
            </span>
            <span className="text-xs text-white/80">Active Campaigns</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">3. Cart Value Offers</h3>
            <p className="text-xs text-white/85 mt-1 leading-relaxed">
              Volume discounts triggered upon exceeding order thresholds. Evaluated as a baseline fallback.
            </p>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {offers.filter(o => o.offerType === "CART VALUE" && o.status === "Active").length}
            </span>
            <span className="text-xs text-white/80">Active Slabs</span>
          </div>
        </div>
      </div>

      {/* Offers List Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Controls */}
        <div className="p-5 border-b border-[#e2e8f0] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#f8fafc]">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search offers by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-xl text-sm outline-none bg-white focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm outline-none bg-white focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] cursor-pointer transition-all min-w-[170px]"
            >
              <option value="">All Offer Types</option>
              <option value="CART VALUE">CART VALUE</option>
              <option value="NEW CUSTOMER">NEW CUSTOMER</option>
              <option value="WIN-BACK">WIN-BACK</option>
            </select>
          </div>
          <div className="text-xs font-semibold text-[#64748b] bg-[#e2e8f0]/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
            <span>Total:</span>
            <span className="text-[#111827]">{filteredOffers.length} offers</span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-4 border-[#07ac57] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
              <TagIcon className="w-12 h-12 text-slate-300" />
              <p className="text-sm font-semibold text-slate-500">No offers found</p>
              <p className="text-xs text-slate-450">Try adjusting your filters or search term, or create a new offer.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider">Banner</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider">Offer Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider">Offer Type</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider text-right">Min Order</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider text-right">Discount</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider">Usage & Limit</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider">Valid Until</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="border-b border-[#e2e8f0] hover:bg-slate-55/40 transition-colors">
                    {/* Banner Image */}
                    <td className="py-4 px-6 align-middle">
                      {offer.imageUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(offer.imageUrl!)}
                          className="w-14 h-9 rounded-lg overflow-hidden border border-[#cbd5e1] hover:ring-2 hover:ring-[#07ac57]/50 transition-all flex items-center justify-center cursor-pointer bg-slate-50"
                        >
                          <img src={offer.imageUrl} alt={offer.offerName} className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <div className="w-14 h-9 rounded-lg bg-slate-100 border border-[#cbd5e1] flex items-center justify-center text-slate-400" title="No banner image">
                          <TagIcon className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </td>

                    {/* Offer Name */}
                    <td className="py-4 px-6 align-middle">
                      <div className="font-semibold text-slate-900 text-sm">{offer.offerName}</div>
                    </td>

                    {/* Offer Type */}
                    <td className="py-4 px-6 align-middle">
                      {offer.offerType === "WIN-BACK" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-655 border border-red-100">
                          WIN-BACK
                        </span>
                      )}
                      {offer.offerType === "NEW CUSTOMER" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-655 border border-blue-100">
                          NEW CUSTOMER
                        </span>
                      )}
                      {offer.offerType === "CART VALUE" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-655 border border-purple-100">
                          CART VALUE
                        </span>
                      )}
                    </td>

                    {/* Min Order Value */}
                    <td className="py-4 px-6 align-middle text-right font-medium text-slate-700 text-sm">
                      ${offer.minOrderValue.toLocaleString()}
                    </td>

                    {/* Discount Value */}
                    <td className="py-4 px-6 align-middle text-right font-bold text-[#07ac57] text-sm">
                      {offer.benefitType === "Flat" ? (
                        <span>${offer.benefitValue}</span>
                      ) : (
                        <span>Tier {offer.benefitType} (${offer.benefitValue})</span>
                      )}
                    </td>

                    {/* Usage & Limit */}
                    <td className="py-4 px-6 align-middle text-slate-600 text-sm">
                      <span className="font-semibold">{offer.usageLimit}x</span>
                      <span className="mx-1 text-slate-300">|</span>
                      <span>{offer.usageType}</span>
                    </td>

                    {/* Valid Until */}
                    <td className="py-4 px-6 align-middle text-slate-600 text-sm">
                      {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-6 align-middle text-center">
                      <button
                        onClick={() => handleToggleStatus(offer)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          offer.status === "Active"
                            ? "bg-[#e8f5ed] text-[#07ac57] hover:bg-[#d8f0e2]"
                            : "bg-slate-100 text-slate-550 hover:bg-slate-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${offer.status === "Active" ? "bg-[#07ac57]" : "bg-slate-400"}`} />
                        {offer.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 align-middle text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => openEditModal(offer)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Edit Offer"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id, offer.offerName)}
                          className="p-1.5 bg-red-50 text-red-650 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                          title="Delete Offer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl flex flex-col text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 flex items-center justify-between border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111827]">{editingOfferId ? "Edit Offer" : "Create Offer"}</h2>
              <button onClick={closeModal} className="text-[#94a3b8] hover:text-[#111827] cursor-pointer">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
              {/* Banner Upload */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-[#475569]">Offer Banner</label>
                <div 
                  className="relative h-28 w-full bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#f1f5f9] transition-colors overflow-hidden group"
                  onClick={() => document.getElementById("segment-banner-upload")?.click()}
                >
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/95 px-3 py-1 rounded-full text-[10px] font-bold text-[#111827] shadow">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#e2e8f0]">
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-[#07ac57] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <PlusIcon className="w-5 h-5 text-[#94a3b8]" />
                        )}
                      </div>
                      <span className="text-xs text-[#64748b] font-medium">Upload Banner</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    id="segment-banner-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Offer Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. FLAT 100 OFF"
                  value={formData.offerName}
                  onChange={(e) => setFormData({ ...formData, offerName: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Offer Type <span className="text-red-500">*</span></label>
                <select
                  value={formData.offerType}
                  onChange={(e) => setFormData({ ...formData, offerType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] bg-white rounded-lg text-sm outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] cursor-pointer transition-all"
                >
                  <option value="CART VALUE">CART VALUE</option>
                  <option value="NEW CUSTOMER">NEW CUSTOMER</option>
                  <option value="WIN-BACK">WIN-BACK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Min Order Value <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Benefit Type</label>
                  <select
                    value={formData.benefitType}
                    onChange={(e) => setFormData({ ...formData, benefitType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] bg-white rounded-lg text-sm outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] cursor-pointer transition-all"
                  >
                    <option value="Flat">Flat</option>
                    <option value="L">L (Low)</option>
                    <option value="M">M (Medium)</option>
                    <option value="H">H (High)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Discount <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.benefitValue}
                    onChange={(e) => setFormData({ ...formData, benefitValue: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Usage Type</label>
                  <select
                    value={formData.usageType}
                    onChange={(e) => setFormData({ ...formData, usageType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] bg-white rounded-lg text-sm outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] cursor-pointer transition-all"
                  >
                    <option value="Once">Once</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Usage Limit</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Valid Until <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57] transition-all"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4 mt-2">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Status</p>
                  <p className="text-[11px] text-[#64748b]">Enable or disable this offer</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-[#e2e8f0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#07ac57]"></div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-[#f1f5f9] flex items-center justify-between gap-3 bg-[#f8fafc] rounded-b-2xl">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 px-4 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-semibold hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 bg-[#07ac57] text-white rounded-xl text-sm font-semibold hover:bg-[#06994e] transition-colors shadow-sm cursor-pointer"
              >
                {editingOfferId ? "Save Changes" : "Create Offer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-3xl max-h-[85vh] bg-white p-2.5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setPreviewImage(null)} 
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10 cursor-pointer shadow-md"
              title="Close Preview"
            >
              <XIcon className="w-4 h-4" />
            </button>
            <img 
              src={previewImage} 
              alt="Offer Banner Full Preview" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl" 
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function EditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

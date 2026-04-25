"use client";

import React, { useState, useEffect, SVGProps } from "react";
import { offerService, Offer, OfferType, BenefitType, UsageType } from "../../services/offerService";
import api from "../../services/api";
import toast from "react-hot-toast";

// Format date utility
const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedType, setSelectedType] = useState("All Type");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    offerName: "",
    offerType: "CART VALUE" as OfferType,
    minOrderValue: "",
    benefitType: "Flat" as BenefitType,
    benefitValue: "",
    usageLimit: "",
    usageType: "Once" as UsageType,
    validUntil: "",
    status: true,
    imageUrl: "",
  });

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
      setFormData({ ...formData, imageUrl: res.data.image_url });
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await offerService.getAll();
      setOffers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter((offer) => {
    const matchSearch = !searchValue || offer.offerName.toLowerCase().includes(searchValue.toLowerCase());
    const matchStatus = selectedStatus === "All Status" || offer.status === selectedStatus;
    const matchType = selectedType === "All Type" || offer.offerType === selectedType;
    return matchSearch && matchStatus && matchType;
  });

  const openModal = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        offerName: offer.offerName,
        offerType: offer.offerType,
        minOrderValue: String(offer.minOrderValue),
        benefitType: offer.benefitType,
        benefitValue: String(offer.benefitValue),
        usageLimit: String(offer.usageLimit),
        usageType: offer.usageType,
        validUntil: offer.validUntil.split('T')[0],
        status: offer.status === "Active",
        imageUrl: offer.imageUrl || "",
      });
    } else {
      setEditingOffer(null);
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
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
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
      if (editingOffer) {
        await offerService.update(editingOffer.id, payload);
        toast.success("Offer updated successfully");
      } else {
        await offerService.create(payload);
        toast.success("Offer created successfully");
      }
      closeModal();
      fetchOffers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save offer");
    }
  };

  const handleDelete = (id: string) => {
    setOfferToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!offerToDelete) return;
    try {
      await offerService.delete(offerToDelete);
      toast.success("Offer deleted successfully");
      fetchOffers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete offer");
    } finally {
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[26px] font-bold text-[#111827]">Offers</h1>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00a859] text-white rounded-xl text-sm font-semibold hover:bg-[#009950] active:scale-95 transition-all shadow-[0_4px_14px_rgba(0,168,89,0.3)]"
        >
          <PlusIcon className="w-4 h-4" />
          Create Offer
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search Offer"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-transparent rounded-lg text-sm outline-none focus:border-[#e2e8f0] transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[#1e293b] text-sm font-medium outline-none cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[#1e293b] text-sm font-medium outline-none cursor-pointer"
          >
            <option value="All Type">All Type</option>
            <option value="CART VALUE">CART VALUE</option>
            <option value="NEW CUSTOMER">NEW CUSTOMER</option>
            <option value="WIN-BACK">WIN-BACK</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#94a3b8] font-bold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Offer Name</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Offer Type</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Min Order Value</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Benefit/L/M/H</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Discount</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Usage Type</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Valid Until</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Status</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[#94a3b8]">Loading...</td>
                </tr>
              ) : filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[#94a3b8]">No offers found.</td>
                </tr>
              ) : (
                filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#111827] flex items-center gap-3">
                      {offer.imageUrl && (
                        <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={offer.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {offer.offerName}
                    </td>
                    <td className="px-5 py-4 text-[#475569]">{offer.offerType}</td>
                    <td className="px-5 py-4 text-[#475569]">{offer.minOrderValue}</td>
                    <td className="px-5 py-4 text-[#475569]">{offer.benefitType}</td>
                    <td className="px-5 py-4 text-[#475569]">{offer.benefitValue}</td>
                    <td className="px-5 py-4 text-[#475569]">{offer.usageType}</td>
                    <td className="px-5 py-4 text-[#94a3b8]">{formatDate(offer.validUntil)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${offer.status === "Active" ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => openModal(offer)} className="text-[#94a3b8] hover:text-[#3b82f6] transition-colors">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(offer.id)} className="text-[#94a3b8] hover:text-[#ef4444] transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl flex flex-col">
            <div className="px-6 py-5 flex items-center justify-between border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111827]">{editingOffer ? "Edit Offer" : "Create Offer"}</h2>
              <button onClick={closeModal} className="text-[#94a3b8] hover:text-[#111827]">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
              {/* Banner Upload */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-[#475569]">Offer Banner</label>
                <div 
                  className="relative h-28 w-full bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#f1f5f9] transition-colors overflow-hidden"
                  onClick={() => document.getElementById('banner-upload')?.click()}
                >
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold text-[#111827]">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#e2e8f0]">
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-[#00a859] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <PlusIcon className="w-5 h-5 text-[#94a3b8]" />
                        )}
                      </div>
                      <span className="text-xs text-[#64748b] font-medium">Upload Banner</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    id="banner-upload" 
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
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Offer Type <span className="text-red-500">*</span></label>
                <select
                  value={formData.offerType}
                  onChange={(e) => setFormData({ ...formData, offerType: e.target.value as OfferType })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]"
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
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Benefit Type</label>
                  <select
                    value={formData.benefitType}
                    onChange={(e) => setFormData({ ...formData, benefitType: e.target.value as BenefitType })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]"
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
                    value={formData.benefitValue}
                    onChange={(e) => setFormData({ ...formData, benefitValue: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Usage Type</label>
                  <select
                    value={formData.usageType}
                    onChange={(e) => setFormData({ ...formData, usageType: e.target.value as UsageType })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]"
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
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Valid Until <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]"
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
                  <div className="w-11 h-6 bg-[#e2e8f0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a859]"></div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-[#f1f5f9] flex items-center justify-between gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 px-4 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-semibold hover:bg-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 bg-[#00a859] text-white rounded-xl text-sm font-semibold hover:bg-[#009950] transition-colors shadow-sm"
              >
                {editingOffer ? "Update Offer" : "Create Offer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <TrashIcon className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[#111827] mb-2">Delete Offer</h2>
            <p className="text-sm text-[#64748b] mb-8">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-semibold hover:bg-[#f8fafc] transition-colors"
              >
                No, Keep it
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function PlusIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function SearchIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function ChevronDownIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9"/></svg>;
}
function EditIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function TrashIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
}
function XIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

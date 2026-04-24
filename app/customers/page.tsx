"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SVGProps } from "react";
import { customerService, Customer } from "../../services/customerService";
import api from "../../services/api";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  // Step 1 – Basic Info
  shopName: string;
  ownerName: string;
  mobileNumber: string;
  city: string;
  shopType: string;
  // Step 2 – Aadhar Docs
  aadharCardFront: File | null;
  aadharCardBack: File | null;
  // Step 3 – Address
  addressLocation: string;
  nearbyLandmark: string;
  isDefaultAddress: boolean;
}

const INITIAL_FORM: FormState = {
  shopName: "",
  ownerName: "",
  mobileNumber: "",
  city: "",
  shopType: "",
  aadharCardFront: null,
  aadharCardBack: null,
  addressLocation: "",
  nearbyLandmark: "",
  isDefaultAddress: true,
};

const SHOP_TYPES = ["Restaurant", "Retailer", "Vendor", "Grocery Store", "Hotel", "Caterer"];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedType, setSelectedType] = useState("All Type");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 | 2 | 3
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Preview images
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  
  // Map resolution
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedMapData, setResolvedMapData] = useState<{lat: number, lng: number, place_name: string} | null>(null);

  useEffect(() => {
    const resolveMap = async () => {
      const val = formData.addressLocation;
      if (val && (val.includes("google.com/maps") || val.includes("maps.app.goo.gl") || val.includes("goo.gl/maps"))) {
        try {
          setIsResolving(true);
          const response = await api.get(`/utils/resolve-maps-url?url=${encodeURIComponent(val)}`);
          if (response.data && !response.data.error) {
            setResolvedMapData(response.data);
          }
        } catch (e) {
          console.error("Map resolution failed", e);
        } finally {
          setIsResolving(false);
        }
      } else {
        setResolvedMapData(null);
      }
    };
    resolveMap();
  }, [formData.addressLocation]);

  // ── Fetch customers ──────────────────────────────────────────────────────
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.customerStatus === "Active").length;
  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // ── Filter ───────────────────────────────────────────────────────────────
  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      !searchValue ||
      c.shopName.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.mobileNumber.includes(searchValue);
    const matchStatus =
      selectedStatus === "All Status" || c.customerStatus === selectedStatus;
    const matchType =
      selectedType === "All Type" || c.customerType === selectedType;
    return matchSearch && matchStatus && matchType;
  });

  // ── Form helpers ─────────────────────────────────────────────────────────
  const set = (field: keyof FormState, value: unknown) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (side: "front" | "back", file: File | null) => {
    if (!file) return;
    if (side === "front") {
      set("aadharCardFront", file);
      setFrontPreview(URL.createObjectURL(file));
    } else {
      set("aadharCardBack", file);
      setBackPreview(URL.createObjectURL(file));
    }
  };

  const resetModal = () => {
    setFormData(INITIAL_FORM);
    setStep(1);
    setSaving(false);
    setFrontPreview(null);
    setBackPreview(null);
  };

  const openModal = () => {
    resetModal();
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    resetModal();
  };

  // Step validation
  const canProceedStep1 =
    formData.shopName.trim() &&
    formData.ownerName.trim() &&
    formData.mobileNumber.trim().length >= 10;

  // ── Submit (uses mobile API – multipart/form-data) ───────────────────────
  const handleAddSubmit = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("shopName", formData.shopName);
      fd.append("ownerName", formData.ownerName);
      fd.append("mobileNumber", formData.mobileNumber);
      if (formData.city) fd.append("city", formData.city);
      if (formData.shopType) fd.append("shopType", formData.shopType);
      fd.append("status", "Active");
      if (formData.aadharCardFront)
        fd.append("aadharCardFront", formData.aadharCardFront);
      if (formData.aadharCardBack)
        fd.append("aadharCardBack", formData.aadharCardBack);
      
      // Step 3 – Address
      if (formData.addressLocation)
        fd.append("addressLocation", formData.addressLocation);
      if (formData.nearbyLandmark)
        fd.append("nearbyLandmark", formData.nearbyLandmark);
      fd.append("isDefaultAddress", formData.isDefaultAddress.toString());

      await api.post("/customers/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Customer registered successfully!");
      closeModal();
      fetchCustomers();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      toast.error(err?.response?.data?.detail || "Failed to add customer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[26px] font-bold text-[#111827]">Customers</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Manage your B2B customer accounts</p>
        </div>
        <button
          id="add-customer-btn"
          onClick={openModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00a859] text-white rounded-xl text-sm font-semibold hover:bg-[#009950] active:scale-95 transition-all shadow-[0_4px_14px_rgba(0,168,89,0.3)]"
        >
          <PlusIcon className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<UsersGroupIcon className="w-5 h-5 text-[#3b82f6]" />} label="Total Customers" value={totalCustomers.toString()} color="#3b82f6" />
        <StatCard icon={<ActivityIcon className="w-5 h-5 text-[#00a859]" />} label="Active Customers" value={activeCustomers.toString()} color="#00a859" />
        <StatCard icon={<CartIcon className="w-5 h-5 text-[#a855f7]" />} label="Total Orders" value={totalOrders.toString()} color="#a855f7" />
        <StatCard icon={<TrendingUpIcon className="w-5 h-5 text-[#3b82f6]" />} label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="#3b82f6" />
        <StatCard icon={<CartOutlinedIcon className="w-5 h-5 text-[#f97316]" />} label="Avg Order Value" value={`₹${Math.round(avgOrderValue).toLocaleString()}`} color="#f97316" />
      </div>

      {/* ── Filter Row ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by shop, owner or mobile…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-transparent rounded-lg text-sm outline-none focus:border-[#e2e8f0] transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[#1e293b] text-sm font-medium outline-none cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Regular">Regular</option>
              <option value="Active">Active</option>
              <option value="At Risk">At Risk</option>
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
              <option value="New">New</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#94a3b8] font-bold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Customer</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Contact</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Onboard</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Orders</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Revenue</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Last Order</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Type</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Status</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base text-white shrink-0"
                        style={{ background: stringToColor(customer.shopName) }}
                      >
                        {customer.shopName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827]">{customer.shopName}</p>
                        <p className="text-xs text-[#94a3b8]">{customer.ownerName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#64748b] text-sm flex items-center gap-1.5">
                      <PhoneIcon className="w-3.5 h-3.5" /> {customer.mobileNumber}
                    </p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{customer.shopType || "—"}</p>
                  </td>
                  <td className="px-5 py-4 text-[#64748b]">
                    {customer.createdDate ? new Date(customer.createdDate).toLocaleDateString("en-IN") : "N/A"}
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-[#111827]">{customer.totalOrders}</td>
                  <td className="px-5 py-4 text-center font-semibold text-[#111827]">₹{customer.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center text-[#64748b]">
                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f1f5f9] text-[#64748b] text-xs font-bold">
                      {customer.customerType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                      customer.customerStatus === "Regular" ? "bg-[#cffafe] text-[#0891b2]" :
                      customer.customerStatus === "Active" ? "bg-[#dcfce7] text-[#16a34a]" : 
                      customer.customerStatus === "At Risk" ? "bg-[#fef3c7] text-[#d97706]" : 
                      "bg-[#fee2e2] text-[#dc2626]"}`}>
                      {customer.customerStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link href={`/customers/${customer.id}`} className="inline-flex items-center justify-center text-[#94a3b8] hover:text-[#3b82f6] transition-colors" title="View">
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#94a3b8]">
                      <UsersGroupIcon className="w-10 h-10 opacity-30" />
                      <p className="font-medium">{loading ? "Loading customers…" : "No customers found."}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ADD CUSTOMER MODAL – Multi-Step (mirrors mobile registration flow)
      ═══════════════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "95vh" }}>

            {/* ── Gradient top strip ── */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00a859] via-[#34d399] to-[#00a859]" />

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-7 pt-6 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Add New Customer</h2>
                <p className="text-sm text-[#64748b] mt-0.5">B2B account registration</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] transition-all"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* ── Step Indicator ── */}
            <div className="px-7 pb-5">
              <div className="flex items-center gap-0">
                {[
                  { n: 1, label: "Basic Info" },
                  { n: 2, label: "Documents" },
                  { n: 3, label: "Address" },
                ].map(({ n, label }, idx) => (
                  <React.Fragment key={n}>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          step > n
                            ? "bg-[#00a859] text-white"
                            : step === n
                            ? "bg-[#00a859] text-white ring-4 ring-[#00a859]/20"
                            : "bg-[#f1f5f9] text-[#94a3b8]"
                        }`}
                      >
                        {step > n ? <CheckIcon className="w-4 h-4" /> : n}
                      </div>
                      <span className={`text-[10px] font-semibold ${step >= n ? "text-[#00a859]" : "text-[#94a3b8]"}`}>
                        {label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div className={`flex-1 h-0.5 mb-4 mx-1 transition-all ${step > n ? "bg-[#00a859]" : "bg-[#e2e8f0]"}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ── Form body (scrollable) ── */}
            <div className="flex-1 overflow-y-auto px-7" style={{ minHeight: 0 }}>

              {/* STEP 1 – Basic Info */}
              {step === 1 && (
                <div className="flex flex-col gap-5 pb-6">
                  <FormField label="Shop Name" required>
                    <input
                      id="shopName"
                      type="text"
                      placeholder="e.g. Standard Mart"
                      value={formData.shopName}
                      onChange={(e) => set("shopName", e.target.value)}
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Owner / Contact Person" required>
                    <input
                      id="ownerName"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.ownerName}
                      onChange={(e) => set("ownerName", e.target.value)}
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Mobile Number" required>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-sm font-semibold select-none">+91</span>
                      <input
                        id="mobileNumber"
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit number"
                        value={formData.mobileNumber}
                        onChange={(e) => set("mobileNumber", e.target.value.replace(/\D/g, ""))}
                        className="form-input pl-12"
                      />
                    </div>
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="City">
                      <input
                        id="city"
                        type="text"
                        placeholder="e.g. Gurugram"
                        value={formData.city}
                        onChange={(e) => set("city", e.target.value)}
                        className="form-input"
                      />
                    </FormField>
                    <FormField label="Business Type">
                      <select
                        id="shopType"
                        value={formData.shopType}
                        onChange={(e) => set("shopType", e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select…</option>
                        {SHOP_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </div>
              )}

              {/* STEP 2 – Aadhar Documents */}
              {step === 2 && (
                <div className="flex flex-col gap-6 pb-6">
                  <p className="text-sm text-[#64748b]">Upload Aadhar card for KYC verification. This step is optional.</p>

                  {/* Front */}
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Aadhar Front</label>
                    <input
                      ref={frontInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange("front", e.target.files?.[0] || null)}
                    />
                    {frontPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-[#e2e8f0] group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={frontPreview} alt="Aadhar front" className="w-full h-40 object-cover" />
                        <button
                          onClick={() => { setFrontPreview(null); set("aadharCardFront", null); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#dc2626] shadow hover:bg-white"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                          <p className="text-white text-xs font-semibold">Front side uploaded</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => frontInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-[#cbd5e1] rounded-2xl py-8 flex flex-col items-center gap-2 text-[#94a3b8] hover:border-[#00a859] hover:text-[#00a859] hover:bg-[#f0fdf4] transition-all group"
                      >
                        <UploadIcon className="w-8 h-8" />
                        <p className="text-sm font-semibold">Click to upload front side</p>
                        <p className="text-xs">JPG, PNG or WEBP · Max 10 MB</p>
                      </button>
                    )}
                  </div>

                  {/* Back */}
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Aadhar Back</label>
                    <input
                      ref={backInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange("back", e.target.files?.[0] || null)}
                    />
                    {backPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-[#e2e8f0]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={backPreview} alt="Aadhar back" className="w-full h-40 object-cover" />
                        <button
                          onClick={() => { setBackPreview(null); set("aadharCardBack", null); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#dc2626] shadow hover:bg-white"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                          <p className="text-white text-xs font-semibold">Back side uploaded</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => backInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-[#cbd5e1] rounded-2xl py-8 flex flex-col items-center gap-2 text-[#94a3b8] hover:border-[#00a859] hover:text-[#00a859] hover:bg-[#f0fdf4] transition-all"
                      >
                        <UploadIcon className="w-8 h-8" />
                        <p className="text-sm font-semibold">Click to upload back side</p>
                        <p className="text-xs">JPG, PNG or WEBP · Max 10 MB</p>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3 – Address */}
              {step === 3 && (
                <div className="flex flex-col gap-5 pb-6">
                  <FormField label="Address / Location">
                    <div className="relative">
                      <MapPinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                      <input
                        id="addressLocation"
                        type="text"
                        placeholder="e.g. Sector 17C, Gurugram"
                        value={formData.addressLocation}
                        onChange={(e) => set("addressLocation", e.target.value)}
                        className="form-input pl-10"
                      />
                    </div>
                    {isResolving && (
                      <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl animate-pulse">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-semibold text-blue-600">Resolving Google Maps URL…</span>
                      </div>
                    )}
                    {resolvedMapData && !isResolving && (
                      <div className="flex flex-col gap-2 mt-3 p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                          <span className="text-[11px] font-bold text-[#16a34a] uppercase tracking-wider">Located Verified</span>
                        </div>
                        <p className="text-sm font-bold text-[#15803d]">{resolvedMapData.place_name}</p>
                        <div className="flex gap-4 mt-1">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-[#16a34a]/60 uppercase">Latitude</span>
                              <span className="text-[12px] font-mono font-bold text-[#15803d]">{resolvedMapData.lat}</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-[#16a34a]/60 uppercase">Longitude</span>
                              <span className="text-[12px] font-mono font-bold text-[#15803d]">{resolvedMapData.lng}</span>
                           </div>
                        </div>
                      </div>
                    )}
                  </FormField>

                  <FormField label="Nearby Landmark">
                    <input
                      id="nearbyLandmark"
                      type="text"
                      placeholder="e.g. Opposite Metro Station"
                      value={formData.nearbyLandmark}
                      onChange={(e) => set("nearbyLandmark", e.target.value)}
                      className="form-input"
                    />
                  </FormField>

                  <div className="flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">Set as Default Address</p>
                      <p className="text-xs text-[#64748b] mt-0.5">Use this as the primary delivery address</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.isDefaultAddress}
                        onChange={() => set("isDefaultAddress", !formData.isDefaultAddress)}
                      />
                      <div className="w-11 h-6 bg-[#e2e8f0] rounded-full peer peer-checked:bg-[#00a859] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>

                  {/* Review summary */}
                  <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-2xl p-4 border border-[#bbf7d0]">
                    <p className="text-xs font-bold text-[#16a34a] uppercase tracking-wider mb-3">Registration Summary</p>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <SummaryRow label="Shop" value={formData.shopName} />
                      <SummaryRow label="Owner" value={formData.ownerName} />
                      <SummaryRow label="Mobile" value={`+91 ${formData.mobileNumber}`} />
                      <SummaryRow label="City" value={formData.city || "—"} />
                      <SummaryRow label="Type" value={formData.shopType || "—"} />
                      <SummaryRow label="Aadhar" value={formData.aadharCardFront ? "Uploaded ✓" : "Skipped"} />
                    </div>
                  </div>


                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-7 py-5 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-semibold hover:bg-[#f1f5f9] transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Back
                </button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 1 && !canProceedStep1}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#00a859] text-white rounded-xl text-sm font-semibold hover:bg-[#009950] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_14px_rgba(0,168,89,0.3)] active:scale-95"
                >
                  Continue <ArrowRightIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAddSubmit}
                  disabled={saving || !!successMsg}
                  className="flex items-center gap-2 px-7 py-2.5 bg-[#00a859] text-white rounded-xl text-sm font-semibold hover:bg-[#009950] disabled:opacity-70 transition-all shadow-[0_4px_14px_rgba(0,168,89,0.3)] active:scale-95"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering…
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" /> Register Customer
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Inline styles for form inputs ── */}
      <style jsx global>{`
        .form-input {
          width: 100%;
          background: #f8fafc;
          color: #111827;
          font-size: 0.875rem;
          padding: 0.75rem 1rem;
          border-radius: 0.875rem;
          border: 1.5px solid transparent;
          outline: none;
          transition: all 0.15s;
        }
        .form-input:focus {
          background: white;
          border-color: #00a859;
          box-shadow: 0 0 0 3px rgba(0, 168, 89, 0.12);
        }
        .form-input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">{icon}<p className="text-sm font-semibold text-[#64748b]">{label}</p></div>
      <h2 className="text-2xl font-bold" style={{ color }}>{value}</h2>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#111827] mb-1.5">
        {label}{required && <span className="text-[#f97316] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold text-[#16a34a]/70 tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-[#15803d] truncate">{value}</p>
    </div>
  );
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function stringToColor(str: string): string {
  const colors = ["#3b82f6", "#8b5cf6", "#f97316", "#ec4899", "#14b8a6", "#f59e0b", "#6366f1"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function PlusIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function SearchIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function ChevronDownIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9"/></svg>;
}
function PhoneIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function EyeIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function UsersGroupIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function ActivityIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function CartIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
}
function TrendingUpIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
function CartOutlinedIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
}
function ArrowLeftIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
function ArrowRightIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}
function UploadIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}
function XIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function CheckIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
}
function CheckCircleIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function MapPinIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}

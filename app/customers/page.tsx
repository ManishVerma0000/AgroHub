"use client";

import React, { useState, useEffect } from "react";
import { SVGProps } from "react";
import { customerService, Customer } from "../../services/customerService";

export default function CustomersPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedType, setSelectedType] = useState("All Type");

  // State for data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Customer Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    mobileNumber: "",
    city: "",
    shopType: "",
    aadharCardFront: null as File | null,
    aadharCardBack: null as File | null,
    
    // Address fields
    addressLocation: "",
    nearbyLandmark: "",
    isDefaultAddress: true
  });
  const [saving, setSaving] = useState(false);

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = async () => {
    if (!formData.shopName || !formData.mobileNumber) return alert("Shop Name and Mobile are required");
    
    try {
      setSaving(true);
      await customerService.create({
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        shopType: formData.shopType,
        addressLocation: formData.addressLocation,
        nearbyLandmark: formData.nearbyLandmark,
        isDefaultAddress: formData.isDefaultAddress
      });
      setIsAddModalOpen(false);
      setFormData({
        shopName: "", ownerName: "", mobileNumber: "", city: "", shopType: "",
        aadharCardFront: null, aadharCardBack: null, addressLocation: "", nearbyLandmark: "", isDefaultAddress: true
      });
      fetchCustomers(); // Refresh list
    } catch (e) {
      console.error(e);
      alert("Failed to add customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <h1 className="text-[26px] font-bold text-[#111827]">Customers</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00a859] text-white rounded-lg text-sm font-semibold hover:bg-[#00964f] transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Customers */}
        <div className="bg-white border text-left border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <UsersGroupIcon className="w-5 h-5 text-[#3b82f6]" />
            <p className="text-sm font-semibold text-[#64748b]">Total Customers</p>
          </div>
          <h2 className="text-2xl font-bold text-[#111827]">1</h2>
        </div>

        {/* Active Customers */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ActivityIcon className="w-5 h-5 text-[#00a859]" />
            <p className="text-sm font-semibold text-[#64748b]">Active Customers</p>
          </div>
          <h2 className="text-2xl font-bold text-[#00a859]">1</h2>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CartIcon className="w-5 h-5 text-[#a855f7]" />
            <p className="text-sm font-semibold text-[#64748b]">Total Orders</p>
          </div>
          <h2 className="text-2xl font-bold text-[#111827]">2</h2>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className="w-5 h-5 text-[#3b82f6]" />
            <p className="text-sm font-semibold text-[#64748b]">Total Revenue</p>
          </div>
          <h2 className="text-2xl font-bold text-[#111827]">₹542</h2>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CartOutlinedIcon className="w-5 h-5 text-[#f97316]" />
            <p className="text-sm font-semibold text-[#64748b]">Avg Order Value</p>
          </div>
          <h2 className="text-2xl font-bold text-[#111827]">₹271</h2>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input 
            type="text" 
            placeholder="Search Rule" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-transparent rounded-lg text-sm outline-none focus:border-[#e2e8f0] transition-colors"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select 
              value={selectedStatus} 
              onChange={e => setSelectedStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[#1e293b] text-sm font-medium outline-none cursor-pointer w-[140px]"
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
              onChange={e => setSelectedType(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[#1e293b] text-sm font-medium outline-none cursor-pointer w-[140px]"
            >
              <option value="All Type">All Type</option>
              <option value="New">New</option>
              <option value="Regular">Regular</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-[#94a3b8] font-bold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Customer</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Contact</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Onboard</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Total Order</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Total Spent</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Last Order</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Type</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Status</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-bold text-lg shrink-0">
                        {customer.shopName?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#111827] text-sm">{customer.shopName}</span>
                        <span className="text-[#94a3b8] text-xs">{customer.ownerName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-[#64748b] text-xs flex items-center gap-1.5 font-medium"><PhoneIcon className="w-3 h-3"/> {customer.mobileNumber}</span>
                      <span className="text-[#94a3b8] text-[11px] mt-0.5">{customer.shopType || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#64748b] font-medium">
                    {customer.createdDate ? new Date(customer.createdDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-[#111827]">{customer.totalOrders}</td>
                  <td className="px-5 py-4 text-center font-bold text-[#111827]">₹{customer.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-4 text-[#64748b] font-medium text-center">
                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f1f5f9] text-[#64748b] text-xs font-bold w-fit mx-auto">
                      {customer.customerType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold w-fit mx-auto ${customer.customerStatus === 'Active' ? 'bg-[#dcfce7] text-[#16a34a]' : customer.customerStatus === 'At Risk' ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
                      {customer.customerStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center">
                       <button className="text-[#111827] hover:text-[#3b82f6] transition-colors" title="View Details">
                         <EyeIcon className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                   <td colSpan={9} className="px-5 py-8 text-center text-[#94a3b8]">
                      {loading ? 'Loading customers...' : 'No customers found.'}
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Desktop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center overflow-y-auto p-4 sm:p-6">
          <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-2xl relative flex flex-col pt-2 overflow-hidden my-auto max-h-[95vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-[#f1f5f9]">
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">Add Customer</h2>
                <p className="text-[#64748b] text-sm mt-1">Register a new B2B account</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#111827] transition-all"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="p-8 flex-1 overflow-y-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Left Column: Customer Details */}
                <div className="flex flex-col gap-5 border-r border-transparent md:border-[#f1f5f9] pr-0 md:pr-4">
                  <h3 className="font-bold text-[#111827] text-base border-b pb-2 mb-2">Customer Profile</h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#111827] mb-1.5">Shop Name<span className="text-[#f97316]">*</span></label>
                    <input 
                      type="text" placeholder="e.g. Standard Cart"
                      value={formData.shopName}
                      onChange={e => handleInputChange('shopName', e.target.value)}
                      className="w-full bg-[#f8fafc] text-[#111827] text-sm px-4 py-3 xl:py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-[#00a859] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111827] mb-1.5">Owner Name<span className="text-[#f97316]">*</span></label>
                    <input 
                      type="text" placeholder="e.g. John Doe"
                      value={formData.ownerName}
                      onChange={e => handleInputChange('ownerName', e.target.value)}
                      className="w-full bg-[#f8fafc] text-[#111827] text-sm px-4 py-3 xl:py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-[#00a859] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111827] mb-1.5">Mobile Number<span className="text-[#f97316]">*</span></label>
                    <input 
                      type="text" placeholder="10-digit number"
                      value={formData.mobileNumber}
                      onChange={e => handleInputChange('mobileNumber', e.target.value)}
                      className="w-full bg-[#f8fafc] text-[#111827] text-sm px-4 py-3 xl:py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-[#00a859] outline-none transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-[#111827] mb-1.5">City</label>
                        <input 
                          type="text" placeholder="e.g. Gurugram"
                          value={formData.city}
                          onChange={e => handleInputChange('city', e.target.value)}
                          className="w-full bg-[#f8fafc] text-[#111827] text-sm px-4 py-3 xl:py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-[#00a859] outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-[#111827] mb-1.5">Type</label>
                        <select
                           value={formData.shopType}
                           onChange={e => handleInputChange('shopType', e.target.value)}
                           className="w-full bg-[#f8fafc] text-[#111827] text-sm px-4 py-3 xl:py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-[#00a859] outline-none cursor-pointer"
                        >
                           <option value="">Select type...</option>
                           <option value="Restaurant">Restaurant</option>
                           <option value="Retailer">Retailer</option>
                           <option value="Vendor">Vendor</option>
                           <option value="Grocery Store">Grocery Store</option>
                        </select>
                     </div>
                  </div>
                </div>

                {/* Right Column: Address Details */}
                <div className="flex flex-col gap-5 pl-0 md:pl-4 mt-6 md:mt-0">
                  <h3 className="font-bold text-[#111827] text-base border-b pb-2 mb-2">Delivery Address</h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#111827] mb-1.5">Map Location</label>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                      <input 
                        type="text" 
                        placeholder="Search area (e.g. Sec 17C Gurugram)"
                        value={formData.addressLocation}
                        onChange={(e) => handleInputChange('addressLocation', e.target.value)}
                        className="w-full bg-[#f8fafc] text-[#111827] text-sm pl-9 pr-4 py-3 xl:py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-[#00a859] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#111827] mb-1.5">Nearby Landmark</label>
                    <input 
                      type="text" placeholder="e.g. Opposite Metro Station"
                      value={formData.nearbyLandmark}
                      onChange={e => handleInputChange('nearbyLandmark', e.target.value)}
                      className="w-full bg-[#f8fafc] text-[#111827] text-sm px-4 py-3 xl:py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-[#00a859] outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-2 bg-[#f8fafc] p-4 rounded-xl border border-[#f1f5f9]">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#111827]">Set as Default</p>
                      <p className="text-xs text-[#64748b] mt-0.5">Use this as primary address</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.isDefaultAddress} onChange={() => handleInputChange('isDefaultAddress', !formData.isDefaultAddress)} />
                      <div className="w-11 h-6 bg-[#e2e8f0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a859]"></div>
                    </label>
                  </div>
                  
                  {/* Documents Zone (Desktop View) */}
                  <div className="mt-auto">
                    <label className="block text-sm font-bold text-[#111827] mb-2">Verification Docs</label>
                    <div className="flex gap-3">
                      <button className="flex-1 flex flex-col items-center justify-center gap-1.5 border border-dashed border-[#cbd5e1] py-4 rounded-xl text-xs font-semibold text-[#64748b] hover:bg-[#f8fafc] hover:border-[#00a859] transition-colors group">
                        <UploadIcon className="w-5 h-5 text-[#94a3b8] group-hover:text-[#00a859]" />
                        Front Image
                      </button>
                      <button className="flex-1 flex flex-col items-center justify-center gap-1.5 border border-dashed border-[#cbd5e1] py-4 rounded-xl text-xs font-semibold text-[#64748b] hover:bg-[#f8fafc] hover:border-[#00a859] transition-colors group">
                        <UploadIcon className="w-5 h-5 text-[#94a3b8] group-hover:text-[#00a859]" />
                        Back Image
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="px-8 py-5 bg-[#f8fafc] border-t border-[#f1f5f9] flex justify-end gap-3 mt-auto rounded-b-2xl">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-bold hover:bg-[#f1f5f9] transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSubmit}
                disabled={saving}
                className="px-8 py-2.5 bg-[#00a859] text-white rounded-xl text-sm font-bold hover:bg-[#00964f] transition-colors shadow-[0_4px_14px_rgba(0,168,89,0.3)] disabled:opacity-70 flex items-center gap-2"
              >
                {saving ? (
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                   <PlusIcon className="w-4 h-4" />
                )}
                {saving ? 'Creating...' : 'Create Customer'}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}

// Icons
function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function UsersGroupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function ActivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}

function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

function TrendingUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}

function CartOutlinedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}

function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  );
}

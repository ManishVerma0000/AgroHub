"use client";

import React, { useState, useEffect } from "react";
import { SVGProps } from "react";
import { useRouter } from "next/navigation";
import { supplierService, Supplier } from "../../../../services/supplierService";

export default function SuppliersPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showAddModal, setShowAddModal] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    location: "",
    gstNumber: "",
    address: "",
    status: "Active"
  });

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async () => {
    try {
      await supplierService.createSupplier(formData);
      setShowAddModal(false);
      setFormData({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        location: "",
        gstNumber: "",
        address: "",
        status: "Active"
      });
      fetchSuppliers(); // Refresh list
    } catch (error) {
      console.error("Failed to add supplier", error);
      alert("Failed to add supplier. Please check the inputs.");
    }
  };

  const avatarColors = [
    "from-[#0d9488] to-[#0284c7]",
    "from-[#10b981] to-[#0284c7]",
    "from-[#f59e0b] to-[#ea580c]",
    "from-[#8b5cf6] to-[#ec4899]",
    "from-[#ec4899] to-[#f43f5e]"
  ];

  const filteredSuppliers = suppliers.filter(s => {
    if (selectedStatus !== "All Status" && s.status !== selectedStatus) return false;
    const loc = s.location?.split(',')[0]?.trim() || "";
    if (selectedLocation !== "All Locations" && loc !== selectedLocation) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-bold text-[#1e293b]">Suppliers</h1>
          <div className="flex items-center gap-1 text-[#64748b]">
            <span className="text-xl">{filteredSuppliers.length}</span>
            <ChevronDownIcon className="w-5 h-5 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors shadow-sm">
            Bulk Action
            <ChevronDownIcon className="w-4 h-4 text-[#64748b]" />
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#15803d] text-white rounded-lg text-sm font-semibold hover:bg-[#166534] transition-colors shadow-[0_4px_12px_-2px_rgba(21,128,61,0.2)]"
          >
            <PlusIcon className="w-4 h-4" />
            New
          </button>
          
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#64748b] mr-1">Filter by:</span>
        
        <div className="relative">
          <select 
            value={selectedStatus} 
            onChange={e => setSelectedStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[#1e293b] text-sm font-medium transition-colors outline-none cursor-pointer shadow-sm w-[130px]"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            value={selectedLocation} 
            onChange={e => setSelectedLocation(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[#1e293b] text-sm font-medium transition-colors outline-none cursor-pointer shadow-sm w-[150px]"
          >
            <option value="All Locations">All Locations</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-[#64748b] font-semibold border-b border-[#e2e8f0]">
              <tr>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Supplier Name</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Contact<br/>Person</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Phone<br/>Number</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">GST Number</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider">Location</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Products</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">PO<br/>Count</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Total PO<br/>Amount</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Pending<br/>Amount</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Paid<br/>Amount</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Status</th>
                <th className="px-5 py-4 uppercase text-[11px] tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="px-5 py-8 text-center text-[#64748b]">
                    Loading...
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-5 py-8 text-center text-[#64748b]">
                    No suppliers found.
                  </td>
                </tr>
              ) : filteredSuppliers.map((supplier, index) => (
                <tr key={supplier.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 bg-gradient-to-br ${avatarColors[index % avatarColors.length]}`}>
                        {supplier.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0f172a] text-[15px]">{supplier.name}</span>
                        <span className="text-[#94a3b8] text-xs font-semibold">SUP-{supplier.id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[#475569]">
                      <span className="font-medium">{supplier.contactPerson.split(' ')[0]}</span>
                      <span>{supplier.contactPerson.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[#475569]">
                      <span>{supplier.phone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#475569] font-medium">{supplier.gstNumber || '-'}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[#475569]">
                      <span>{supplier.location.split(',')[0]?.trim() || supplier.location}{supplier.location.includes(',') ? ',' : ''}</span>
                      <span>{supplier.location.split(',')[1]?.trim() || ''}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-[#e0e7ff] text-[#4f46e5] font-bold text-xs">
                      {supplier.products}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-[#f3e8ff] text-[#9333ea] font-bold text-xs">
                      {supplier.poCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-[#1e293b]">
                    ₹{supplier.totalAmount}
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-[#ea580c]">
                    ₹{supplier.pendingAmount}
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-[#16a34a]">
                    ₹{supplier.paidAmount}
                  </td>
                  <td className="px-5 py-4 text-center">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dcfce7] text-[#16a34a] text-xs font-bold border border-[#bbf7d0]">
                       <CheckCircleIcon className="w-3.5 h-3.5" />
                       {supplier.status}
                     </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                       <button 
                         onClick={() => router.push(`/wms/procurement/suppliers/${supplier.id}`)}
                         className="text-[#3b82f6] hover:text-[#2563eb] transition-colors" 
                         title="View Details"
                       >
                         <EyeIcon className="w-4 h-4" />
                       </button>
                       <button className="text-[#16a34a] hover:text-[#15803d] transition-colors" title="Edit Supplier">
                         <EditPencilIcon className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Supplier Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#e2e8f0]">
              <h2 className="text-[20px] font-semibold text-[#0f172a]">Add New Supplier</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#64748b] hover:text-[#0f172a] transition-colors p-1"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">Supplier Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#15803d]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">Contact Person <span className="text-red-500">*</span></label>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#15803d]" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm text-[#64748b] outline-none focus:border-[#15803d]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#15803d]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">Location <span className="text-red-500">*</span></label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="City A" className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm text-[#64748b] outline-none focus:border-[#15803d]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">GST Number</label>
                  <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="123456789012" className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm text-[#64748b] outline-none focus:border-[#15803d]" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">Address <span className="text-red-500">*</span></label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address, City, State, Pincode"
                  rows={3}
                  className="w-full px-4 py-3 border border-[#cbd5e1] rounded-lg text-sm text-[#64748b] outline-none focus:border-[#15803d] resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">Status</label>
                <div className="relative w-1/2">
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full appearance-none px-4 py-2 border border-[#cbd5e1] bg-white rounded-lg text-[#1e293b] text-sm outline-none focus:border-[#15803d] cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-[#1e293b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 border border-[#cbd5e1] text-[#0f172a] font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSupplier}
                className="px-6 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white font-semibold rounded-lg transition-colors"
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// SVG Icons
function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function MoreVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="12" cy="5" r="1"/>
      <circle cx="12" cy="19" r="1"/>
    </svg>
  );
}

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
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

function EditPencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

"use client";

import React, { SVGProps } from "react";
import Link from "next/link";

const mockUsers = [
  { 
    id: "USR-001", 
    initials: "JD", 
    name: "John Doe", 
    role: "Warehouse Manager",
    roleBg: "bg-[#f3e8ff]",
    roleColor: "text-[#9333ea]",
    phone: "+91 98765 43210", 
    email: "john.doe@example.com", 
    lastLogin: "15 Mar 2024", 
    status: "Active", 
    avatarBg: "bg-[#0ea5e9]" 
  },
  { 
    id: "USR-002", 
    initials: "JS", 
    name: "Jane Smith", 
    role: "Inventory Staff",
    roleBg: "bg-[#eff6ff]",
    roleColor: "text-[#2563eb]",
    phone: "+91 98234 56789", 
    email: "jane.smith@example.com", 
    lastLogin: "14 Mar 2024", 
    status: "Active", 
    avatarBg: "bg-[#10b981]" 
  },
  { 
    id: "USR-003", 
    initials: "MJ", 
    name: "Mike Johnson", 
    role: "Packing Staff",
    roleBg: "bg-[#f0fdf4]",
    roleColor: "text-[#16a34a]",
    phone: "+91 98765 43210", 
    email: "mike.johnson@example.com", 
    lastLogin: "13 Mar 2024", 
    status: "Active", 
    avatarBg: "bg-[#0ea5e9]" 
  },
  { 
    id: "USR-004", 
    initials: "SL", 
    name: "Sarah Lee", 
    role: "Dispatch Staff",
    roleBg: "bg-[#fff7ed]",
    roleColor: "text-[#ea580c]",
    phone: "+91 98234 56789", 
    email: "sarah.lee@example.com", 
    lastLogin: "12 Mar 2024", 
    status: "Active", 
    avatarBg: "bg-[#0ea5e9]" 
  }
];

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-bold text-[#0f172a]">Warehouse Users</h1>
          <span className="text-[20px] font-medium text-[#94a3b8]">4</span>
          <ChevronDownIcon className="w-5 h-5 text-[#64748b] mt-1" />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            Bulk Action
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-sm font-bold rounded-lg hover:bg-[#15803d] transition-colors shadow-sm">
            <PlusIcon className="w-4 h-4" />
            New
          </button>
          <button className="flex items-center justify-center p-2.5 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-4 mb-2">
         <div className="flex items-center gap-2">
           <span className="text-[#64748b] text-[14px]">Filter by:</span>
           <button className="flex items-center gap-8 px-3 py-2 border border-[#e2e8f0] bg-white text-[#0f172a] text-[14px] font-medium rounded-lg shadow-sm hover:bg-[#f8fafc] transition-colors">
              All Roles
              <ChevronDownIcon className="w-4 h-4 text-[#64748b]" />
           </button>
         </div>
         <button className="flex items-center gap-8 px-3 py-2 border border-[#e2e8f0] bg-white text-[#0f172a] text-[14px] font-medium rounded-lg shadow-sm hover:bg-[#f8fafc] transition-colors">
            All Status
            <ChevronDownIcon className="w-4 h-4 text-[#64748b]" />
         </button>
      </div>

      {/* Dynamic Users 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user) => (
          <div key={user.id} className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col pt-6 pb-5 px-6">
            
            {/* Top Identity Block */}
            <div className="flex justify-between items-start mb-5">
               <div className="flex items-center gap-4">
                  <div className={`w-[52px] h-[52px] rounded-full ${user.avatarBg} text-white flex items-center justify-center font-bold text-[19px] shadow-sm shrink-0`}>
                     {user.initials}
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[#0f172a] font-bold text-[16px] leading-tight">{user.name}</span>
                     <span className="text-[#64748b] text-[13px] mt-0.5">{user.id}</span>
                  </div>
               </div>
               <span className="inline-flex items-center px-3 py-1 bg-[#dcfce3] text-[#16a34a] text-[12px] font-bold rounded-full mt-1 shrink-0">
                  {user.status}
               </span>
            </div>

            {/* Role Badge */}
            <div className="mb-5">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${user.roleBg} ${user.roleColor} text-[13px] font-bold tracking-tight w-max`}>
                 <ShieldIcon className="w-4 h-4" />
                 {user.role}
               </span>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-3 mb-6 flex-1">
               <div className="flex items-center gap-2.5 text-[#475569] text-[13.5px]">
                  <PhoneIcon className="w-4 h-4 shrink-0 text-[#94a3b8]" />
                  <span>{user.phone}</span>
               </div>
               <div className="flex items-center gap-2.5 text-[#475569] text-[13.5px]">
                  <MailIcon className="w-4 h-4 shrink-0 text-[#94a3b8]" />
                  <span>{user.email}</span>
               </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#e2e8f0] mb-4"></div>

            {/* Footer / Actions */}
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2 text-[#64748b] text-[13px]">
                  <ClockIcon className="w-4 h-4 shrink-0" />
                  <span>Last login: {user.lastLogin}</span>
               </div>
               <div className="flex gap-3 mt-1">
                  <button className="flex-1 py-2.5 border border-[#e2e8f0] text-[#0f172a] rounded-lg font-bold text-sm hover:bg-[#f8fafc] transition-colors shadow-sm flex items-center justify-center">
                     View
                  </button>
                  <button className="flex-1 py-2.5 bg-[#16a34a] text-white rounded-lg font-bold text-sm hover:bg-[#15803d] transition-colors shadow-sm flex items-center justify-center">
                     Edit
                  </button>
               </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

// Inline SVGs
function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
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

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
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

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

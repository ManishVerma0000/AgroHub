'use client';

import { SVGProps } from "react";
import { useRouter } from "next/navigation";

export default function WMSTopbar() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between py-4 px-8 bg-white border-b border-[#f3f4f6]">
      <div className="flex items-center bg-[#f9fafb] border border-[#f3f4f6] rounded-lg py-2 px-4 w-[320px]">
        <SearchIcon className="w-[18px] h-[18px] text-[#94a3b8] mr-2" />
        <input type="text" placeholder="Search Store..." className="border-none bg-transparent outline-none text-sm w-full text-[#111827] placeholder:text-[#94a3b8]" />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-1.5 bg-[#07ac57] text-white border-none py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-opacity hover:opacity-90">
          <PlusIcon className="w-4 h-4" />
          Quick Add
        </button>
        
        <div className="relative cursor-pointer text-[#6b7280] flex items-center">
          <BellIcon className="w-5 h-5" />
          <span className="absolute -top-0.5 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
        
        <button
          onClick={() => router.push('/wms/profile')}
          title="Warehouse Profile"
          className="w-9 h-9 bg-[#07ac57] text-white rounded-full flex items-center justify-center font-semibold text-base cursor-pointer hover:bg-[#069a4e] transition-colors"
        >
          <span>W</span>
        </button>
      </div>
    </header>
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

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

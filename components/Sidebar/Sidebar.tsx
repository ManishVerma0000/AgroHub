"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SVGProps, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: DashboardIcon },
    { label: "Customers", href: "/customers", icon: ProfileIcon },
    { label: "Category Management", href: "/categories", icon: TagIcon },
    { label: "Subcategory Management", href: "/subcategories", icon: TagIcon },
    { label: "Product Management", href: "/products", icon: BoxIcon },
    { label: "Warehouse Management", href: "/warehouse", icon: WarehouseIcon },
  ];

  const rulesPricingItems = [
    { label: "Delivery Charges", href: "/delivery-charges", icon: TruckIcon },
    { label: "Offers", href: "/offers", icon: DollarIcon },
  ];

  return (
    <aside
      className={`bg-white border-r border-[#f3f4f6] flex flex-col h-full shrink-0 transition-[width] duration-300 ease-in-out ${isExpanded ? "w-[300px]" : "w-[78px]"
        }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onFocus={() => setIsExpanded(true)}
      onBlur={(event) => {
        const nextFocus = event.relatedTarget as Node | null;
        if (!nextFocus || !event.currentTarget.contains(nextFocus)) {
          setIsExpanded(false);
        }
      }}
    >
      <div
        className={`px-5 py-6 flex items-center gap-3 relative transition-all duration-300 ${isExpanded ? "" : "justify-center"
          }`}
      >
        <div className="absolute top-1/2 -right-[14px] z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#f3f4f6] bg-white text-[#cbd5e1]">
          <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`} />
        </div>
        <div className="w-10 h-10 bg-[#07ac57] text-white rounded-lg flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
          <LeafIcon />
        </div>
        <div
          className={`flex min-w-0 flex-col overflow-hidden transition-all duration-200 ${isExpanded ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
            }`}
        >
          <h1 className="text-base font-bold text-[#111827] m-0 leading-tight">AgroAdmin</h1>
          <p className="text-xs text-[#07ac57] font-medium m-0 whitespace-nowrap">B2B & B2C Panel</p>
        </div>
      </div>

      <div className="py-2 flex-1 overflow-y-auto">
        <p
          className={`text-[11px] font-semibold text-[#94a3b8] tracking-widest px-6 mb-2 overflow-hidden transition-all duration-200 ${isExpanded ? "h-4 opacity-100" : "h-0 opacity-0"
            }`}
        >
          NAVIGATION
        </p>
        <nav className="flex flex-col gap-1 mb-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                title={!isExpanded ? item.label : undefined}
                className={`flex items-center gap-3 py-2.5 mx-2 rounded-lg text-sm transition-all relative ${isExpanded ? "px-6" : "justify-center px-0"
                  } ${isActive
                    ? 'bg-[#f2fcf6] text-[#07ac57] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#07ac57] before:rounded-full [&>svg]:text-[#07ac57]'
                    : 'text-[#6b7280] font-medium hover:bg-[#f9fafb] hover:text-[#111827] [&>svg]:text-[#94a3b8]'
                  }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${isExpanded ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <p
          className={`text-[11px] font-semibold text-[#94a3b8] tracking-widest px-6 mb-2 overflow-hidden transition-all duration-200 ${isExpanded ? "h-4 opacity-100" : "h-0 opacity-0"
            }`}
        >
          RULES & PRICING
        </p>
        <nav className="flex flex-col gap-1">
          {rulesPricingItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                title={!isExpanded ? item.label : undefined}
                className={`flex items-center gap-3 py-2.5 mx-2 rounded-lg text-sm transition-all relative ${isExpanded ? "px-6" : "justify-center px-0"
                  } ${isActive
                    ? 'bg-[#f2fcf6] text-[#07ac57] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#07ac57] before:rounded-full [&>svg]:text-[#07ac57]'
                    : 'text-[#6b7280] font-medium hover:bg-[#f9fafb] hover:text-[#111827] [&>svg]:text-[#94a3b8]'
                  }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${isExpanded ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="py-4 px-4 border-t border-[#f3f4f6]">
        <div
          title={!isExpanded ? "Admin Profile" : undefined}
          className={`flex items-center gap-3 py-2.5 rounded-lg text-sm text-[#111827] font-medium transition-all ${isExpanded ? "px-3" : "justify-center px-0"
            }`}
        >
          <ProfileIcon className="w-6 h-6 text-[#94a3b8] shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${isExpanded ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
              }`}
          >
            Admin Profile
          </span>
        </div>
      </div>
    </aside>
  );
}

function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 22C2 22 4 4 15 2C15 2 22 4 22 15C22 26 2 22 2 22Z" />
      <path d="M2 22L12 12" />
    </svg>
  );
}

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="curren  tColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function WarehouseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ProfileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function DollarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

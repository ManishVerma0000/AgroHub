"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SVGProps, useState } from "react";

export default function WMSSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('wmsToken');
    router.push('/wms');
  };

  const navGroups = [
    {
      label: "HOME",
      items: [
        { label: "Dashboard", href: "/wms/dashboard", icon: DashboardIcon },
      ]
    },
    {
      label: "INVENTORY",
      items: [
        { label: "Product Inventory", href: "/wms/inventory/products", icon: BoxIcon },
        { label: "Movement History", href: "/wms/inventory/movements", icon: HistoryIcon },
      ]
    },
    {
      label: "PROCUREMENT",
      items: [
        { label: "Purchase Planning", href: "/wms/procurement/planning", icon: ClipboardListIcon },
        { label: "Suppliers", href: "/wms/procurement/suppliers", icon: UsersIcon },
        { label: "Purchase Orders", href: "/wms/procurement/orders", icon: FileTextIcon },
        { label: "PO Receiving", href: "/wms/procurement/receiving", icon: TruckIcon },
      ]
    },
    {
      label: "ORDERS",
      items: [
        { label: "All Orders", href: "/wms/orders/all", icon: PackageIcon },
        { label: "Picking", href: "/wms/orders/picking", icon: HandIcon },
        { label: "Packing", href: "/wms/orders/packing", icon: BoxIcon },
        { label: "Dispatch", href: "/wms/orders/dispatch", icon: FastForwardIcon },
        { label: "Customers", href: "/wms/customers", icon: UserCogIcon },
        { label: "Users", href: "/wms/users", icon: UsersIcon },
        { label: "Reports", href: "/wms/reports", icon: BarChartIcon },
      ]
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-[#f3f4f6] flex flex-col h-full shrink-0 transition-[width] duration-300 ease-in-out ${
        isExpanded ? "w-[300px]" : "w-[78px]"
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
        className={`px-5 py-6 flex items-center gap-3 relative transition-all duration-300 ${
          isExpanded ? "" : "justify-center"
        }`}
      >
        <div className="absolute top-1/2 -right-[14px] z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#f3f4f6] bg-white text-[#cbd5e1]">
          <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`} />
        </div>
        <div className="w-10 h-10 bg-[#07ac57] text-white rounded-lg flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
          <WarehouseIcon />
        </div>
        <div
          className={`flex min-w-0 flex-col overflow-hidden transition-all duration-200 ${
            isExpanded ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          <h1 className="text-base font-bold text-[#111827] m-0 leading-tight">WMS Panel</h1>
          <p className="text-xs text-[#07ac57] font-medium m-0 whitespace-nowrap">AgroAdmin Warehouse</p>
        </div>
      </div>
      
      <div className="py-2 flex-1 overflow-y-auto">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            <p
              className={`text-[11px] font-semibold text-[#94a3b8] tracking-widest px-6 mb-2 overflow-hidden transition-all duration-200 ${
                isExpanded ? "h-4 opacity-100" : "h-0 opacity-0"
              }`}
            >
              {group.label}
            </p>
            <nav className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    href={item.href} 
                    key={item.href}
                    title={!isExpanded ? item.label : undefined}
                    className={`flex items-center gap-3 py-2.5 mx-2 rounded-lg text-sm transition-all relative ${
                      isExpanded ? "px-6" : "justify-center px-0"
                    } ${
                      isActive 
                      ? 'bg-[#f2fcf6] text-[#07ac57] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#07ac57] before:rounded-full [&>svg]:text-[#07ac57]' 
                      : 'text-[#6b7280] font-medium hover:bg-[#f9fafb] hover:text-[#111827] [&>svg]:text-[#94a3b8]'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                        isExpanded ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="py-4 px-4 border-t border-[#f3f4f6] flex flex-col gap-1">
        <Link
          href="/wms/profile"
          title={!isExpanded ? "Warehouse Profile" : undefined}
          className={`flex items-center gap-3 py-2.5 rounded-lg text-sm transition-all ${
            isExpanded ? "px-3" : "justify-center px-0"
          } ${
            pathname === '/wms/profile'
              ? 'bg-[#f2fcf6] text-[#07ac57] font-semibold'
              : 'text-[#6b7280] font-medium hover:bg-[#f9fafb] hover:text-[#111827]'
          }`}
        >
          <ProfileIcon className="w-5 h-5 shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
              isExpanded ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Warehouse Profile
          </span>
        </Link>
        <button
          onClick={handleLogout}
          title={!isExpanded ? "Logout" : undefined}
          className={`flex items-center gap-3 py-2.5 rounded-lg text-sm text-red-500 font-medium hover:bg-red-50 transition-all w-full text-left ${
            isExpanded ? "px-3" : "justify-center px-0"
          }`}
        >
          <LogoutIcon className="w-5 h-5 shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
              isExpanded ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

// Icons
function WarehouseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21V9l9-6 9 6v12"/>
      <path d="M9 21v-6h6v6"/>
    </svg>
  );
}

function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1"/>
      <rect x="14" y="3" width="7" height="5" rx="1"/>
      <rect x="14" y="12" width="7" height="9" rx="1"/>
      <rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>
  );
}

function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
}

function HistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function ClipboardListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <line x1="9" y1="14" x2="15" y2="14"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
    </svg>
  );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function FileTextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16h16V8l-6-6z"/>
      <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
    </svg>
  );
}

function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

function PackageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function HandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 11V6a2 2 0 0 0-4 0v5"/>
      <path d="M14 10V4a2 2 0 0 0-4 0v6"/>
      <path d="M10 10.5V3a2 2 0 0 0-4 0v11l-3-3a2.5 2.5 0 0 0-3.5 3.5l6.5 6.5C8 23 10 24 13 24h5a6 6 0 0 0 6-6V13a2 2 0 0 0-4 0"/>
    </svg>
  );
}

function FastForwardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 19 22 12 13 5 13 19"/>
      <polygon points="2 19 11 12 2 5 2 19"/>
    </svg>
  );
}

function ProfileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function UserCogIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <circle cx="19" cy="11" r="3"/>
      <path d="M19 6.5v2M19 13.5v2M22.5 11h-2M15.5 11h-2"/>
    </svg>
  );
}

function BarChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}

function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

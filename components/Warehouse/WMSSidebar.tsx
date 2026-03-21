"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SVGProps } from "react";

export default function WMSSidebar() {
  const pathname = usePathname();

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
      ]
    }
  ];

  return (
    <aside className="w-[300px] bg-white border-r border-[#f3f4f6] flex flex-col h-full shrink-0">
      <div className="px-5 py-6 flex items-center gap-3 relative after:absolute after:top-1/2 after:-right-[14px] after:-translate-y-1/2 after:w-7 after:h-7 after:bg-white after:border after:border-[#f3f4f6] after:rounded-full after:z-10 after:flex after:justify-center after:items-center after:bg-no-repeat after:bg-center after:cursor-pointer after:bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23cbd5e1\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'15 18 9 12 15 6\'%3E%3C/polyline%3E%3C/svg%3E')]">
        <div className="w-10 h-10 bg-[#07ac57] text-white rounded-lg flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
          <WarehouseIcon />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-[#111827] m-0 leading-tight">WMS Panel</h1>
          <p className="text-xs text-[#07ac57] font-medium m-0">AgroAdmin Warehouse</p>
        </div>
      </div>
      
      <div className="py-2 flex-1 overflow-y-auto">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            <p className="text-[11px] font-semibold text-[#94a3b8] tracking-widest px-6 mb-2">
              {group.label}
            </p>
            <nav className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    href={item.href} 
                    key={item.href}
                    className={`flex items-center gap-3 py-2.5 px-6 mx-2 rounded-lg text-sm transition-all relative ${
                      isActive 
                      ? 'bg-[#f2fcf6] text-[#07ac57] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#07ac57] before:rounded-full [&>svg]:text-[#07ac57]' 
                      : 'text-[#6b7280] font-medium hover:bg-[#f9fafb] hover:text-[#111827] [&>svg]:text-[#94a3b8]'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="py-5 px-6 border-t border-[#f3f4f6]">
        <div className="flex items-center gap-3 text-[#111827] text-sm font-medium">
          <ProfileIcon className="w-6 h-6 text-[#94a3b8]" />
          <span>Warehouse Profile</span>
        </div>
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

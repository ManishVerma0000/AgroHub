'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import WMSSidebar from './Warehouse/WMSSidebar';
import WMSTopbar from './Warehouse/WMSTopbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that should NOT have the sidebar and topbar (e.g., login, auth)
  const isAuthRoute = pathname === '/login' || pathname?.startsWith('/auth');
  const isWMSRoute = pathname?.startsWith('/wms');

  if (isAuthRoute) {
    return (
      <main className="min-h-screen w-full bg-[#f9fafb] flex items-center justify-center">
        {children}
      </main>
    );
  }

  if (isWMSRoute) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        <WMSSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <WMSTopbar />
          <main style={{ flex: 1, overflowY: 'auto', padding: '32px', backgroundColor: '#f9fafb' }}>
            <Toaster position="top-right" />
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', backgroundColor: '#f9fafb' }}>
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
    </div>
  );
}

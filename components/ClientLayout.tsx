'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import WMSSidebar from './Warehouse/WMSSidebar';
import WMSTopbar from './Warehouse/WMSTopbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Routes that should NOT have the sidebar and topbar (e.g., login, auth)
  const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/wms';
  const isWMSRoute = pathname?.startsWith('/wms') && pathname !== '/wms';

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      if (!isAuthRoute) {
        if (isWMSRoute) {
          const wmsToken = localStorage.getItem('wmsToken');
          if (!wmsToken) {
            router.push('/wms');
            return;
          }
        } else {
          // Admin routes
          const adminToken = localStorage.getItem('adminToken');
          if (!adminToken) {
            router.push('/');
            return;
          }
        }
      }
      // Finished checking, safe to render
      setIsCheckingAuth(false);
    }
  }, [pathname, isAuthRoute, isWMSRoute, router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#f9fafb] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#07ac57] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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

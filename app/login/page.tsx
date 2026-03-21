'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginRole, setLoginRole] = useState<'Admin' | 'Warehouse'>('Admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Login attempt:', { email, password, rememberMe, role: loginRole });
    
    // Simulate API call and redirect
    setTimeout(() => {
      setIsLoading(false);
      if (loginRole === 'Warehouse') {
        router.push('/wms/dashboard');
      } else {
        router.push('/');
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-[#f3f4f6]">
      {/* Header & Branding */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#07ac57] rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-[#07ac57]/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Welcome to AgroAdmin</h1>
        <p className="text-sm text-[#6b7280] mt-1 text-center">Log in to manage your B2B & B2C operations.</p>
      </div>

      {/* Login Form */}
      <div className="flex bg-[#f3f4f6] p-1 rounded-lg mb-6 shadow-inner">
        <button
          type="button"
          onClick={() => setLoginRole('Admin')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${loginRole === 'Admin' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6b7280] hover:text-[#111827]'}`}
        >
          Admin Portal
        </button>
        <button
          type="button"
          onClick={() => setLoginRole('Warehouse')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${loginRole === 'Warehouse' ? 'bg-[#07ac57] text-white shadow-sm' : 'text-[#6b7280] hover:text-[#111827]'}`}
        >
          Warehouse WMS
        </button>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="admin@agrohub.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          }
        />
        
        <div className="flex flex-col gap-1">
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
          />
          <div className="flex justify-end mt-1">
            <a href="#" className="text-sm text-[#07ac57] hover:text-[#069a4e] font-medium transition-colors">
              Forgot Password?
            </a>
          </div>
        </div>

        <div className="pt-2">
          <Toggle 
            label="Remember me for 30 days" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full flex justify-center text-center py-3 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : "Sign In"}
          </Button>
        </div>
      </form>

      {/* Footer / Contact */}
      <div className="mt-8 pt-6 border-t border-[#f3f4f6] text-center">
        <p className="text-sm text-[#6b7280]">
          Having trouble logging in? <a href="#" className="text-[#07ac57] hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}

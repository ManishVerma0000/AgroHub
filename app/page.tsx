'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login({ username, password });
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        toast.success(data.message || 'Logged in successfully');
        router.push('/dashboard');
      } else {
        toast.error('Login failed');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-[#f3f4f6]">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#07ac57] rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-[#07ac57]/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Welcome to AgroAdmin</h1>
        <p className="text-sm text-[#6b7280] mt-1 text-center">Log in to manage your B2B & B2C operations.</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <Input 
          label="Username" 
          type="text" 
          placeholder="admin_user" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <div className="flex flex-col gap-1">
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { wmsAuthService } from '@/services/wmsAuthService';

export default function WMSLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await wmsAuthService.sendOtp({ email });
      toast.success(data.message || 'OTP Sent Successfully (Static 1234)');
      setStep(2);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail?.message || error?.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await wmsAuthService.verifyOtp({ email, otp: parseInt(otp) });
      if (data.userdetails?.token) {
        localStorage.setItem('wmsToken', data.userdetails.token);
        toast.success(data.message || 'Logged in successfully');
        router.push('/wms/dashboard');
      } else {
        toast.error('Login failed! Invalid OTP.');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Login failed! Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-[#f3f4f6]">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#07ac57] rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-[#07ac57]/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Warehouse System</h1>
        <p className="text-sm text-[#6b7280] mt-1 text-center">Login with Email & OTP.</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="worker@warehouse.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full flex justify-center text-center py-3 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
          <div className="p-3 bg-[#07ac57]/10 text-[#069a4e] text-sm rounded-lg mb-2">
            OTP sent to <strong>{email}</strong>
          </div>
          <Input 
            label="Enter OTP" 
            type="text" 
            placeholder="1234" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
          />
          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full flex justify-center text-center py-3 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP & Login"}
            </Button>
          </div>
          <button 
            type="button"
            className="text-sm text-center text-[#6b7280] hover:text-[#07ac57] mt-2 transition-colors"
            onClick={() => setStep(1)}
          >
            Change Email
          </button>
        </form>
      )}
    </div>
  );
}

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'blue';
  children: React.ReactNode;
}

export function Badge({ variant = 'neutral', children, className = '', ...props }: BadgeProps) {
  const variants = {
    success: 'bg-[#dcfce7] text-[#166534]', // Green
    warning: 'bg-[#fef08a] text-[#854d0e]', // Yellow
    error: 'bg-[#fee2e2] text-[#991b1b]',   // Red
    neutral: 'bg-[#f3f4f6] text-[#4b5563]', // Gray
    blue: 'bg-[#e0e7ff] text-[#3730a3]',    // Indigo/Blue
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', icon, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#07ac57] text-white hover:bg-[#069a4e]',
      outline: 'bg-white text-[#374151] border border-[#d1d5db] hover:bg-[#f9fafb]',
      ghost: 'bg-transparent text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]',
      danger: 'bg-red-600 text-white hover:bg-red-700'
    };
    
    const sizes = {
      sm: 'py-1.5 px-3 text-xs',
      md: 'py-2 px-4 text-sm',
      lg: 'py-2.5 px-5 text-base'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {icon && <span className="mr-2 flex items-center">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

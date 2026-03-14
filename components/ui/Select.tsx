import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, icon, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[#374151]">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-[#9ca3af] pointer-events-none">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={`w-full bg-white border ${error ? 'border-red-500' : 'border-[#d1d5db]'} rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] transition-all appearance-none disabled:bg-[#f9fafb] disabled:text-[#9ca3af] disabled:cursor-not-allowed ${icon ? 'pl-9' : ''} pr-10 ${className}`}
            {...props}
          >
            {/* Placeholder option if no value is selected */}
            {!props.value && <option value="" disabled className="text-[#9ca3af]">Select an option</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 text-[#9ca3af] pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

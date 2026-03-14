import React from 'react';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  enabledLabel?: string;
  disabledLabel?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className = '', label, description, enabledLabel, disabledLabel, checked, onChange, ...props }, ref) => {
    return (
      <label className={`flex items-center justify-between cursor-pointer ${className}`}>
        {(label || description) && (
          <div className="flex flex-col mr-4">
            {label && <span className="text-sm font-medium text-[#111827]">{label}</span>}
            {description && <span className="text-xs text-[#6b7280] mt-0.5">{description}</span>}
          </div>
        )}
        <div className="flex items-center gap-2">
          {disabledLabel && !checked && <span className="text-sm text-[#6b7280]">{disabledLabel}</span>}
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              ref={ref}
              checked={checked}
              onChange={onChange}
              {...props} 
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[#07ac57]' : 'bg-[#e5e7eb]'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
          </div>
          {enabledLabel && checked && <span className="text-sm text-[#07ac57] font-medium">{enabledLabel}</span>}
        </div>
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

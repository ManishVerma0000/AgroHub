import React from 'react';

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 pb-2 border-b border-transparent">
      <div className="flex flex-col gap-1">
        {breadcrumbs && (
          <div className="flex items-center text-xs text-[#6b7280] mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className={idx === breadcrumbs.length - 1 ? 'text-[#111827] font-medium' : ''}>
                  {crumb.label}
                </span>
                {idx < breadcrumbs.length - 1 && (
                  <span className="mx-2">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#111827]">{title}</h1>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9ca3af] mt-1 cursor-pointer hover:text-[#4b5563]">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { SVGProps } from "react";

export default function WMSDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">WMS Dashboard</h1>
        <p className="text-sm text-[#6b7280] mt-1">Overview of your warehouse operations and inventory status.</p>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard title="Orders Received" value="45" icon={PackageIcon} color="blue" />
        <SummaryCard title="Orders Pending" value="23" icon={ClockIcon} color="orange" />
        <SummaryCard title="Ready for Dispatch" value="18" icon={TruckIcon} color="green" />
        <SummaryCard title="Inventory Value" value="₹2.4M" icon={BanknoteIcon} color="purple" />
      </div>

      {/* Inventory Alerts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#111827]">Daily Orders Trend</h2>
          </div>
          <div className="h-[250px] flex items-end gap-2 pb-6 border-b border-[#f3f4f6]">
            {/* Mock Chart Bars */}
            {[40, 60, 45, 80, 50, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                <div 
                  className="w-full bg-[#e2f5ec] group-hover:bg-[#07ac57] rounded-t-md transition-colors"
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-xs text-[#94a3b8]">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#111827]">Inventory Alerts</h2>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#fff7ed] text-[#ea580c]">
            <div className="flex items-center gap-3">
              <AlertTriangleIcon className="w-5 h-5" />
              <div className="font-semibold text-sm">Low Stock</div>
            </div>
            <div className="font-bold text-lg">8</div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#fef2f2] text-[#dc2626]">
            <div className="flex items-center gap-3">
              <AlertCircleIcon className="w-5 h-5" />
              <div className="font-semibold text-sm">Out of Stock</div>
            </div>
            <div className="font-bold text-lg">3</div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f3f4f6] text-[#6b7280]">
            <div className="flex items-center gap-3">
              <TrashIcon className="w-5 h-5" />
              <div className="font-semibold text-sm">Wastage (Today)</div>
            </div>
            <div className="font-bold text-lg">2kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white border border-[#f3f4f6] rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-[#6b7280]">{title}</p>
        <p className="text-2xl font-bold text-[#111827] mt-1">{value}</p>
      </div>
    </div>
  );
}

// Icons
function PackageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

function BanknoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );
}

function AlertTriangleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function AlertCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}

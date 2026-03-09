import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  subtextType?: "positive" | "negative" | "neutral";
  icon: ReactNode;
  theme: "blue" | "purple" | "green" | "orange";
}

export default function StatCard({ title, value, subtext, subtextType = "positive", icon, theme }: StatCardProps) {
  const themeStyles = {
    blue: "bg-[#f0f7ff] text-[#3b82f6]",
    purple: "bg-[#fdf5ff] text-[#a855f7]",
    green: "bg-[#07ac57] text-white",
    orange: "bg-[#f97316] text-white",
  };

  // Note: the icon backgrounds in Figma:
  // blue -> blue bg, white icon
  // purple -> purple bg, white icon
  // green -> green bg, white icon
  // orange -> orange bg, white icon
  const iconBgStyles = {
    blue: "bg-[#3b82f6]",
    purple: "bg-[#a855f7]",
    green: "bg-[#07ac57]",
    orange: "bg-[#f97316]",
  };

  const subtextStyles = {
    positive: "text-[#07ac57]",
    negative: "text-red-500",
    neutral: "text-[#6b7280]",
  };

  return (
    <div className="bg-white border border-[#f3f4f6] rounded-xl p-5 md:px-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow flex-1">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white ${iconBgStyles[theme]}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-[13px] text-[#6b7280] font-medium m-0 mb-0.5">{title}</h3>
        <p className="text-2xl font-bold text-[#111827] m-0 mb-1 leading-tight">{value}</p>
        <p className={`text-xs m-0 font-medium ${subtextStyles[subtextType]}`}>
          {subtext}
        </p>
      </div>
    </div>
  );
}

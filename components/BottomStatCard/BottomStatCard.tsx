import { ReactNode } from "react";

interface BottomStatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  theme: "blue" | "green" | "purple";
}

export default function BottomStatCard({ title, value, icon, theme }: BottomStatCardProps) {
  const iconColors = {
    blue: "text-[#3b82f6]",
    green: "text-[#07ac57]",
    purple: "text-[#a855f7]",
  };

  return (
    <div className="bg-white border border-[#f3f4f6] rounded-xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow flex-1">
      <div className={`w-6 h-6 mb-4 flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6 ${iconColors[theme]}`}>
        {icon}
      </div>
      <p className="text-[13px] text-[#6b7280] font-semibold m-0 mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-[#111827] m-0">{value}</h3>
    </div>
  );
}

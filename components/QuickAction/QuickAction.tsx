import { ReactNode } from "react";
import Link from "next/link";

interface QuickActionProps {
  label: string;
  icon: ReactNode;
  theme: "blue" | "purple" | "green" | "orange";
  href: string;
}

export default function QuickAction({ label, icon, theme, href }: QuickActionProps) {
  const themeStyles = {
    blue: "bg-[#f0f7ff] text-[#3b82f6]",
    purple: "bg-[#fdf5ff] text-[#a855f7]",
    green: "bg-[#f2fcf6] text-[#07ac57]",
    orange: "bg-[#fff7ed] text-[#f97316]",
  };

  return (
    <Link href={href}>
      <button
        className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium cursor-pointer border border-transparent transition-all flex-1 min-w-[140px] hover:opacity-90 [&>svg]:w-[18px] [&>svg]:h-[18px] ${themeStyles[theme]}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    </Link>
  );
}
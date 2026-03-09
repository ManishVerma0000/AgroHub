// Removed CSS module
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  dotColor: "green" | "blue" | "orange" | "purple";
}

export default function ActivityItem({ title, description, time, dotColor }: ActivityItemProps) {
  const dotColors = {
    green: "bg-[#07ac57]",
    blue: "bg-[#3b82f6]",
    orange: "bg-[#f97316]",
    purple: "bg-[#a855f7]",
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#f3f4f6] last:border-b-0">
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[dotColor]}`}></div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold text-[#111827] m-0">{title}</h4>
          <span className="text-xs text-[#94a3b8]">{time}</span>
        </div>
        <p className="text-[13px] text-[#6b7280] m-0">{description}</p>
      </div>
    </div>
  );
}

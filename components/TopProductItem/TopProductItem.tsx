// Removed CSS module
interface TopProductItemProps {
  name: string;
  details: string;
  status: "Active" | "Inactive";
}

export default function TopProductItem({ name, details, status }: TopProductItemProps) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-[#f3f4f6] last:border-b-0">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-[#111827] m-0">{name}</h4>
        <p className="text-[13px] text-[#94a3b8] m-0">{details}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status === 'Active' 
          ? 'bg-[#f2fcf6] text-[#07ac57]' 
          : 'bg-[#f1f5f9] text-[#64748b]'
      }`}>
        {status}
      </div>
    </div>
  );
}

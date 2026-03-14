import { useState } from "react";

type Status = "active" | "inactive";

interface StatusToggleProps {
  label?: string;
  defaultStatus?: Status;
  onChange?: (value: Status) => void;
}

export default function StatusToggle({
  label = "Status",
  defaultStatus = "active",
  onChange,
}: StatusToggleProps) {
  const [status, setStatus] = useState<Status>(defaultStatus);

  const toggle = () => {
    const newStatus: Status = status === "active" ? "inactive" : "active";
    setStatus(newStatus);
    onChange?.(newStatus);
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl">
      
      {/* Left Text */}
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500 capitalize">{status}</p>
      </div>

      {/* Toggle Switch */}
      <button
        type="button"
        onClick={toggle}
        className={`relative w-12 h-6 flex items-center rounded-full transition-colors ${
          status === "active" ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
            status === "active" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
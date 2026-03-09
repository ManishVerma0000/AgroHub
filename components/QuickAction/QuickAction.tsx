import styles from "./QuickAction.module.css";
import { ReactNode } from "react";

interface QuickActionProps {
  label: string;
  icon: ReactNode;
  theme: "blue" | "purple" | "green" | "orange";
}

export default function QuickAction({ label, icon, theme }: QuickActionProps) {
  return (
    <button className={`${styles.action} ${styles[theme]}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

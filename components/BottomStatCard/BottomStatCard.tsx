import styles from "./BottomStatCard.module.css";
import { ReactNode } from "react";

interface BottomStatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  theme: "blue" | "green" | "purple";
}

export default function BottomStatCard({ title, value, icon, theme }: BottomStatCardProps) {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconContainer} ${styles[theme]}`}>
        {icon}
      </div>
      <p className={styles.title}>{title}</p>
      <h3 className={styles.value}>{value}</h3>
    </div>
  );
}

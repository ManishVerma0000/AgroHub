import styles from "./StatCard.module.css";
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
  return (
    <div className={styles.card}>
      <div className={`${styles.iconContainer} ${styles[theme]}`}>
        {icon}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
        <p className={`${styles.subtext} ${styles[subtextType]}`}>
          {subtext}
        </p>
      </div>
    </div>
  );
}

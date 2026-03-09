import styles from "./ActivityItem.module.css";

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  dotColor: "green" | "blue" | "orange" | "purple";
}

export default function ActivityItem({ title, description, time, dotColor }: ActivityItemProps) {
  return (
    <div className={styles.item}>
      <div className={`${styles.dot} ${styles[dotColor]}`}></div>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h4 className={styles.title}>{title}</h4>
          <span className={styles.time}>{time}</span>
        </div>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

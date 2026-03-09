import styles from "./TopProductItem.module.css";

interface TopProductItemProps {
  name: string;
  details: string;
  status: "Active" | "Inactive";
}

export default function TopProductItem({ name, details, status }: TopProductItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.content}>
        <h4 className={styles.name}>{name}</h4>
        <p className={styles.details}>{details}</p>
      </div>
      <div className={`${styles.statusPill} ${status === 'Active' ? styles.active : styles.inactive}`}>
        {status}
      </div>
    </div>
  );
}

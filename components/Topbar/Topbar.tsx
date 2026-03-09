import styles from "./Topbar.module.css";
import { SVGProps } from "react";

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.searchContainer}>
        <SearchIcon className={styles.searchIcon} />
        <input type="text" placeholder="Search..." className={styles.searchInput} />
      </div>
      
      <div className={styles.actions}>
        <button className={styles.quickAdd}>
          <PlusIcon className={styles.plusIcon} />
          Quick Add
        </button>
        
        <div className={styles.notification}>
          <BellIcon className={styles.bellIcon} />
          <span className={styles.badge}></span>
        </div>
        
        <div className={styles.avatar}>
          <span className={styles.avatarText}>A</span>
        </div>
      </div>
    </header>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

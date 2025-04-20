import Link from "next/link";
import styles from "./home.module.scss";

export default function Home() {
  return (
    <main className="main">
      <div className={styles.container}>
        <h1 className={styles.title}>Postal Service App</h1>
        
        <div className={styles.grid}>
          <Link href="/packages" className={styles.card}>
            <h2>Package Management</h2>
            <p>Track, create, and manage packages in the system</p>
          </Link>
          
          <Link href="/users" className={styles.card}>
            <h2>User Management</h2>
            <p>Manage users and delivery personnel</p>
          </Link>
          
          <Link href="/tracking" className={styles.card}>
            <h2>Tracking Portal</h2>
            <p>Track packages with tracking numbers</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

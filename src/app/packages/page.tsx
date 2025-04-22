"use client";

import { trpc } from "../utils/trpc";
import Link from "next/link";
import styles from "./packages.module.scss";

export default function PackagesPage() {
  const packagesQuery = trpc.package.getAll.useQuery();

  return (
    <main className="main">
      <div className={styles.container}>
        <div>
          <Link href="/" className={styles.backLink}>
            Back to Home
          </Link>
        </div>
        
        <h1 className={styles.title}>Package Management</h1>
        
        <div className={styles.actions}>
          <button className={styles.createButton}>
            Create New Package
          </button>
        </div>

        {packagesQuery.isLoading && (
          <div className={styles.loadingMessage}>Loading packages...</div>
        )}

        {packagesQuery.isError && (
          <div className={styles.errorMessage}>
            Error: {packagesQuery.error.message}
          </div>
        )}

        {packagesQuery.isSuccess && packagesQuery.data ? (
          <div className={styles.packageList}>
            {packagesQuery.data.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tracking Number</th>
                    <th>Status</th>
                    <th>Weight</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packagesQuery.data.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>{pkg.trackingNumber}</td>
                      <td>{pkg.status}</td>
                      <td>{pkg.weight} kg</td>
                      <td>{new Date(pkg.createdAt).toLocaleString()}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button className={styles.actionButton}>View</button>
                          <button className={styles.actionButton}>Edit</button>
                          <button className={styles.deleteButton}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noPackages}>
                No packages found. Create your first package.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
} 
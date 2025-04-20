"use client";

import { useState } from "react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import styles from "./tracking.module.scss";

interface TrackingEvent {
  id: string;
  status: string;
  location?: string | null;
  description?: string | null;
  timestamp: Date;
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const packageQuery = trpc.package.getByTrackingNumber.useQuery(
    { trackingNumber },
    { enabled: isSearching && trackingNumber.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber) {
      setIsSearching(true);
    }
  };

  return (
    <main className="main">
      <div className={styles.container}>
        <div>
          <Link href="/" className={styles.backLink}>
            Back to Home
          </Link>
        </div>
        
        <h1 className={styles.title}>Track Your Package</h1>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className={styles.searchInput}
              required
            />
            <button
              type="submit"
              className={styles.searchButton}
            >
              Track Package
            </button>
          </div>
        </form>

        {packageQuery.isLoading && (
          <div className={styles.loadingMessage}>Loading tracking information...</div>
        )}

        {packageQuery.isError && (
          <div className={styles.errorMessage}>
            Error: {packageQuery.error.message}
          </div>
        )}

        {packageQuery.isSuccess && packageQuery.data ? (
          <div className={styles.resultCard}>
            <h2 className={styles.packageTitle}>
              Package #{packageQuery.data.trackingNumber}
            </h2>
            
            <div className={styles.detailsGrid}>
              <div>
                <h3 className={styles.sectionTitle}>Package Details</h3>
                <p>Status: <span className={styles.statusHighlight}>{packageQuery.data.status}</span></p>
                <p>Weight: {packageQuery.data.weight} kg</p>
                {packageQuery.data.description && (
                  <p>Description: {packageQuery.data.description}</p>
                )}
              </div>
              
              <div>
                <h3 className={styles.sectionTitle}>Delivery Information</h3>
                <p>From: {[
                  packageQuery.data.fromAddress.street,
                  packageQuery.data.fromAddress.city,
                  packageQuery.data.fromAddress.state,
                  packageQuery.data.fromAddress.postalCode,
                  packageQuery.data.fromAddress.country,
                ].join(", ")}</p>
                <p>To: {[
                  packageQuery.data.toAddress.street,
                  packageQuery.data.toAddress.city,
                  packageQuery.data.toAddress.state,
                  packageQuery.data.toAddress.postalCode,
                  packageQuery.data.toAddress.country,
                ].join(", ")}</p>
              </div>
            </div>
            
            <div>
              <h3 className={styles.sectionTitle}>Tracking History</h3>
              {packageQuery.data.events.length > 0 ? (
                <ul className={styles.trackingList}>
                  {packageQuery.data.events.map((event: TrackingEvent) => (
                    <li key={event.id} className={styles.trackingItem}>
                      <div className={styles.eventHeader}>
                        <span className={styles.eventStatus}>{event.status}</span>
                        <span className={styles.eventTime}>
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {event.location && <p>Location: {event.location}</p>}
                      {event.description && <p>{event.description}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tracking events found.</p>
              )}
            </div>
          </div>
        ) : isSearching && !packageQuery.isLoading ? (
          <div className={styles.noResults}>
            No package found with tracking number: {trackingNumber}
          </div>
        ) : null}
      </div>
    </main>
  );
} 
"use client";

import { useState } from "react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import styles from "./users.module.scss";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | Date;
}

export default function UsersPage() {
  const usersQuery = trpc.user.getAll.useQuery();

  return (
    <main className="main">
      <div className={styles.container}>
        <div>
          <Link href="/" className={styles.backLink}>
            Back to Home
          </Link>
        </div>
        
        <h1 className={styles.title}>User Management</h1>
        
        <div className={styles.actions}>
          <button className={styles.createButton}>
            Create New User
          </button>
        </div>

        {usersQuery.isLoading && (
          <div className={styles.loadingMessage}>Loading users...</div>
        )}

        {usersQuery.isError && (
          <div className={styles.errorMessage}>
            Error: {usersQuery.error.message}
          </div>
        )}

        {usersQuery.isSuccess && usersQuery.data ? (
          <div className={styles.userList}>
            {usersQuery.data.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersQuery.data.map((user: User) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
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
              <div className={styles.noUsers}>
                No users found. Create your first user.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
} 
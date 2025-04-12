'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  useEffect(() => {
    // Add title and meta description for SEO
    document.title = 'Page Not Found | Kirill Markin';
  }, []);

  return (
    <div className={styles.errorPageContainer}>
      <h1 className={styles.errorTitle}>404</h1>
      <h2 className={styles.errorSubtitle}>
        Page Not Foun<span className={styles.glitchLetter}>d</span>
      </h2>
      <p className={styles.errorMessage}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className={styles.errorBackButton}>
        BACK TO HOME
      </Link>
    </div>
  );
} 
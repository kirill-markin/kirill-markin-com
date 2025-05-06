'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './not-found.module.css';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getTranslation } from '@/lib/localization';

// Note: In the App Router, we can't dynamically set metadata from client components.
// The static metadata defined in layout.js or page.js will be used for SEO purposes.
// This component focuses on the user experience aspect based on detected language.

export default function NotFound() {
  const pathname = usePathname();
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    // Extract language from the URL path
    const pathParts = pathname.split('/').filter(Boolean);

    // If the first part of the path is a supported language, use it
    if (pathParts.length > 0 && SUPPORTED_LANGUAGES.includes(pathParts[0])) {
      setLanguage(pathParts[0]);
    } else {
      setLanguage(DEFAULT_LANGUAGE);
    }
  }, [pathname]);

  // Get translations for the 404 page
  const translations = getTranslation('notFound', language);

  // Create the correct home link based on the language
  const homeLink = language === DEFAULT_LANGUAGE ? '/' : `/${language}/`;

  return (
    <div className={styles.errorPageContainer}>
      <h1 className={styles.errorTitle}>404</h1>
      <h2 className={styles.errorSubtitle}>
        {translations.title.split('').map((letter, index) =>
          index === translations.title.length - 1 ? (
            <span key={index} className={styles.glitchLetter}>{letter}</span>
          ) : (
            letter
          )
        )}
      </h2>
      <p className={styles.errorMessage}>
        {translations.message}
      </p>
      <Link href={homeLink} className={styles.errorBackButton}>
        {translations.backToHome}
      </Link>
    </div>
  );
} 
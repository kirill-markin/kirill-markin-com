'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import styles from './Header.module.css';
import {
  DEFAULT_LANGUAGE,
  getPathSegmentByLanguage,
  getTranslation
} from '@/lib/localization';

interface HeaderProps {
  language?: string;
}

const Header: React.FC<HeaderProps> = ({ language = DEFAULT_LANGUAGE }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Get translations for navigation items
  const navigationTranslations = getTranslation('navigation', language);

  // Get localized path segments
  const servicesPath = language === DEFAULT_LANGUAGE
    ? '/services/'
    : `/${language}/${getPathSegmentByLanguage('services', language)}/`;

  const articlesPath = language === DEFAULT_LANGUAGE
    ? '/articles/'
    : `/${language}/${getPathSegmentByLanguage('articles', language)}/`;

  const fractionalAICTOPath = '/services/fractional-ai-cto-kirill-markin/';

  // Get localized home path
  const homePath = language === DEFAULT_LANGUAGE ? '/' : `/${language}/`;

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerDesktopContainer}>
        <div className={styles.headerContentWrapper}>
          <div className={styles.leftColumn}>
            {pathname !== homePath && (
              <Link href={homePath} className={`${styles.headerDesktopButton} ${styles.headerLogo}`}>
                KIRILL MARKIN
              </Link>
            )}
          </div>
          <nav className={styles.rightColumn} aria-label="Main navigation">
            <Link className={styles.headerDesktopButton} href={servicesPath}>
              {navigationTranslations.services}
            </Link>
            <Link
              className={styles.headerDesktopButton}
              href={articlesPath}
            >
              {navigationTranslations.articles}
            </Link>
            <Link
              className={`${styles.headerDesktopButton} ${styles.headerBookAMeeting}`}
              href={fractionalAICTOPath}
            >
              {navigationTranslations.fractionalAICTO}
            </Link>
          </nav>
        </div>
      </div>

      <div className={styles.headerMobile}>
        <div className={styles.headerMobileContainer}>
          <div className={styles.headerMobileButtonContainer}>
            <button
              className={`${styles.headerMobileButton} ${mobileMenuOpen ? styles.open : styles.closed}`}
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <div className={styles.headerMobileButtonClosed}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 12H4M18 17H4M20 7H4" stroke="#232323" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className={styles.headerMobileButtonOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6L18 18" stroke="#232323" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 6L6 18" stroke="#232323" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          </div>
          <div className={styles.mobileRightButtonsContainer}>
            <div className={styles.mobileButton}>
              <Link
                href={articlesPath}
                onClick={closeMobileMenu}
                className={styles.headerMobileBlogButton}
              >
                {navigationTranslations.articles}
              </Link>
            </div>
            <div className={styles.mobileButton}>
              <Link
                href={fractionalAICTOPath}
                className={styles.headerMobileBookAMeetingButton}
              >
                {navigationTranslations.fractionalAICTO}
              </Link>
            </div>
          </div>
        </div>

        <nav className={`${styles.headerMobileMenuOpen} ${mobileMenuOpen ? '' : styles.hidden}`} aria-label="Mobile navigation">
          <div className={styles.headerMobileMenuSection}>
            <Link href={homePath} onClick={closeMobileMenu}>KIRILL MARKIN</Link>
          </div>
          <div className={styles.headerMobileMenuSection}>
            <Link href={servicesPath} onClick={closeMobileMenu}>{navigationTranslations.services}</Link>
          </div>
          <div className={styles.headerMobileMenuSection}>
            <Link
              href={articlesPath}
              onClick={closeMobileMenu}
            >
              {navigationTranslations.articles}
            </Link>
          </div>
          <div className={styles.headerMobileMenuSection}>
            <Link
              className={styles.headerMobileBookAMeeting}
              href={fractionalAICTOPath}
              onClick={closeMobileMenu}
            >
              {navigationTranslations.fractionalAICTO}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4.22559 20L20 4M20 4V17M20 4H7" stroke="#353C2A" strokeWidth="2" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
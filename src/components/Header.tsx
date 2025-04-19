'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerDesktopContainer}>
        <div className={styles.leftColumn}>
          {pathname !== '/' && (
            <Link href="/" className={`${styles.headerDesktopButton} ${styles.headerLogo}`}>
              KIRILL MARKIN
            </Link>
          )}
        </div>
        <nav className={styles.rightColumn} aria-label="Main navigation">
          <Link className={styles.headerDesktopButton} href="/services/">
            SERVICES
          </Link>
          <Link
            className={styles.headerDesktopButton}
            href="/articles/"
          >
            ARTICLES
          </Link>
          <Link
            className={`${styles.headerDesktopButton} ${styles.headerBookAMeeting}`}
            href="/meet/short/"
            rel="noopener noreferrer"
          >
            TALK TO KIRILL
          </Link>
        </nav>
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
                href="/articles/"
                onClick={closeMobileMenu}
                className={styles.headerMobileBlogButton}
              >
                ARTICLES
              </Link>
            </div>
            <div className={styles.mobileButton}>
              <Link
                href="/meet/short/"
                rel="noopener noreferrer"
                className={styles.headerMobileBookAMeetingButton}
              >
                TALK TO KIRILL
              </Link>
            </div>
          </div>
        </div>

        <nav className={`${styles.headerMobileMenuOpen} ${mobileMenuOpen ? '' : styles.hidden}`} aria-label="Mobile navigation">
          <div className={styles.headerMobileMenuSection}>
            <Link href="/" onClick={closeMobileMenu}>KIRILL MARKIN</Link>
          </div>
          <div className={styles.headerMobileMenuSection}>
            <Link href="/services/" onClick={closeMobileMenu}>SERVICES</Link>
          </div>
          <div className={styles.headerMobileMenuSection}>
            <Link
              href="/articles/"
              onClick={closeMobileMenu}
            >
              ARTICLES
            </Link>
          </div>
          <div className={styles.headerMobileMenuSection}>
            <Link
              className={styles.headerMobileBookAMeeting}
              href="/meet/short/"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
            >
              TALK TO KIRILL
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
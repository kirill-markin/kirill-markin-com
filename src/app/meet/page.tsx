import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meeting Booking Options with Kirill Markin',
  description: 'Select your preferred meeting option with Kirill Markin. Choose meeting timing and duration.',
  openGraph: {
    title: 'Meeting Booking Options with Kirill Markin',
    description: 'Select your preferred meeting option with Kirill Markin. Choose meeting timing and duration.',
    url: 'https://kirill-markin.com/meet/',
    images: [
      {
        url: '/images/meeting-booking.webp',
        width: 1200,
        height: 630,
        alt: 'Schedule a meeting with Kirill Markin',
      }
    ],
  },
  twitter: {
    title: 'Meeting Booking Options with Kirill Markin',
    description: 'Select your preferred meeting option with Kirill Markin. Choose meeting timing and duration.',
    images: ['/images/meeting-booking.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/meet/',
  },
};

export default function MeetPage() {
  return (
    <section className={styles.bookingOptionsContainer}>
      <h1>BOOKING OPTIONS</h1>
      <p>Please select your preferred meeting type:</p>
      
      <nav className={styles.bookingMethods} aria-label="Meeting booking options">
        <Link href="/meet/short/" className={styles.bookingMethod}>
          <div className={styles.bookingMethodLogo}>
            <Image 
              src="/icons/booking/calendar-icon.svg" 
              alt="Short Meeting" 
              className={styles.bookingLogo}
              width={40}
              height={40}
            />
          </div>
          <div className={styles.bookingMethodDetails}>
            <h2>15-Minute Welcome Meeting</h2>
            <p>Free introduction call to discuss your needs and how we can work together</p>
          </div>
        </Link>
        
        <Link href="/meet/all/" className={styles.bookingMethod}>
          <div className={styles.bookingMethodLogo}>
            <Image 
              src="/icons/booking/calendar-full-icon.svg" 
              alt="All durations" 
              className={styles.bookingLogo}
              width={40}
              height={40}
            />
          </div>
          <div className={styles.bookingMethodDetails}>
            <h2>All durations</h2>
            <p>Choose from all available consultation options and time slots</p>
          </div>
        </Link>
      </nav>
    </section>
  );
} 
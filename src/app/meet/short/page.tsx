import Link from 'next/link';
import styles from '../page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '15-Minute Welcome Meeting | Kirill Markin',
  description: 'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.',
};

export default function ShortMeetingPage() {
  return (
    <div className={styles.bookingOptionsContainer}>
      <h1>15-MINUTE WELCOME MEETING</h1>
      <p>This is a placeholder for the 15-minute meeting scheduling interface.</p>
      <p>In a real implementation, this would integrate with a scheduling service like Calendly or similar.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <Link href="/meet" style={{ 
          color: 'var(--dark-gray)', 
          textDecoration: 'underline',
          fontWeight: 'bold' 
        }}>
          ← Back to booking options
        </Link>
      </div>
    </div>
  );
} 
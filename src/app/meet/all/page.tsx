import Link from 'next/link';
import styles from '../page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Meeting Options | Kirill Markin',
  description: 'Choose from all available consultation options and time slots for meetings with Kirill Markin.',
};

export default function AllMeetingsPage() {
  return (
    <div className={styles.bookingOptionsContainer}>
      <h1>ALL MEETING OPTIONS</h1>
      <p>This is a placeholder for the comprehensive meeting scheduling interface.</p>
      <p>In a real implementation, this would integrate with a scheduling service like Calendly or similar, offering various meeting durations.</p>
      
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
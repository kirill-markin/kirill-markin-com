'use client';

import Link from 'next/link';
import styles from '../page.module.css';

export default function ShortMeetingClient() {
  return (
    <div className={styles.bookingOptionsContainer}>
      <div className={styles.backLinkContainer}>
        <Link href="/meet" className={styles.backLink}>
          ← Back to booking options
        </Link>
      </div>
      
      <h1>15-MINUTE WELCOME MEETING</h1>
      
      <div className={styles.meetContainer}>
        {/* Google Calendar Appointment Scheduling */}
        <iframe 
          src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3pfMQ0yUmE2aKR4rzkH2yqLoo0J4axSI2DBLAfZE3Ypp92t1bzdNpNf4dYe2jlBcqJt1J78H70?gv=true" 
          style={{ 
            border: '1px solid var(--dark-gray)', 
            backgroundColor: 'white' 
          }} 
          width="100%" 
          height="900" 
          frameBorder="0"
        />
      </div>
    </div>
  );
} 
'use client';

import Link from 'next/link';
import styles from '../page.module.css';

export default function AllMeetingsClient() {
  return (
    <div className={styles.bookingOptionsContainer}>
      <div className={styles.backLinkContainer}>
        <Link href="/meet" className={styles.backLink}>
          ← Back to booking options
        </Link>
      </div>
      
      <h1>ALL MEETING OPTIONS</h1>
      
      <div className={styles.meetContainer}>
        {/* Google Calendar Appointment Scheduling */}
        <iframe 
          src="https://calendar.google.com/calendar/appointments/AcZssZ2TdBp4R_bZv3Iva79rDa8mgAqV8n_usbMetXM=?gv=true" 
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
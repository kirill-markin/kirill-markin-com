'use client';

import { useState } from 'react';
import styles from '../page.module.css';

export default function AllMeetingsClient() {
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  return (
    <div className={styles.bookingOptionsContainer}>
      <h1>ALL MEETING OPTIONS</h1>
      
      <div className={styles.meetContainer}>
        {isCalendarLoading && (
          <div className={styles.calendarLoading}>
            <p>Calendar loading...</p>
          </div>
        )}
        {/* Google Calendar Appointment Scheduling */}
        <iframe 
          src="https://calendar.google.com/calendar/appointments/AcZssZ2TdBp4R_bZv3Iva79rDa8mgAqV8n_usbMetXM=?gv=true" 
          style={{ 
            border: '1px solid var(--dark-gray)', 
            backgroundColor: 'white',
            opacity: isCalendarLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }} 
          width="100%" 
          height="1200" 
          frameBorder="0"
          onLoad={() => setIsCalendarLoading(false)}
        />
      </div>
    </div>
  );
} 
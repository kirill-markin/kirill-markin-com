'use client';

import { useState } from 'react';
import styles from '@/app/meet/page.module.css';
import { DEFAULT_LANGUAGE, getTranslation } from '@/lib/localization';

interface AllMeetingsPageProps {
    language?: string;
}

export default function AllMeetingsPage({ language = DEFAULT_LANGUAGE }: AllMeetingsPageProps) {
    const [isCalendarLoading, setIsCalendarLoading] = useState(true);

    // Get translated texts
    const translations = getTranslation('meet', language);

    return (
        <div className={styles.bookingOptionsContainer}>
            <h1>{translations.allPageTitle}</h1>

            <div className={styles.meetContainer}>
                {isCalendarLoading && (
                    <div className={styles.calendarLoading}>
                        <p>{translations.calendarLoading}</p>
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
'use client';

import { useState } from 'react';
import styles from '@/app/meet/page.module.css';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, getSubPathSegmentByLanguage, getTranslation } from '@/lib/localization';
import Footer from '@/components/Footer';

interface ShortMeetingPageProps {
    language?: string;
}

export default function ShortMeetingPage({ language = DEFAULT_LANGUAGE }: ShortMeetingPageProps) {
    const [isCalendarLoading, setIsCalendarLoading] = useState(true);

    // Get translated texts
    const translations = getTranslation('meet', language);

    // Form current path for footer
    const currentPath = language === DEFAULT_LANGUAGE
        ? '/meet/short/'
        : `/${language}/${getPathSegmentByLanguage('meet', language)}/${getSubPathSegmentByLanguage('meet', 'short', language)}/`;

    return (
        <>
            <div className={styles.bookingOptionsContainer}>
                <h1>{translations.shortPageTitle}</h1>

                <div className={styles.meetContainer}>
                    {isCalendarLoading && (
                        <div className={styles.calendarLoading}>
                            <p>{translations.calendarLoading}</p>
                        </div>
                    )}
                    {/* Google Calendar Appointment Scheduling */}
                    <iframe
                        src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3pfMQ0yUmE2aKR4rzkH2yqLoo0J4axSI2DBLAfZE3Ypp92t1bzdNpNf4dYe2jlBcqJt1J78H70?gv=true"
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
            <Footer language={language} currentPath={currentPath} />
        </>
    );
} 
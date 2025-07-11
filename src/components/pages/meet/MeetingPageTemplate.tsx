'use client';

import { useState } from 'react';
import styles from '@/app/(default)/meet/page.module.css';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, getSubPathSegmentByLanguage, getTranslation } from '@/lib/localization';
import Footer from '@/components/Footer';

// Strict meeting type definition
export type MeetingType = 'short' | 'medium' | 'long' | 'all';

// Calendar URL mapping for each meeting type
const CALENDAR_URLS: Record<MeetingType, string> = {
    short: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3pfMQ0yUmE2aKR4rzkH2yqLoo0J4axSI2DBLAfZE3Ypp92t1bzdNpNf4dYe2jlBcqJt1J78H70?gv=true',
    medium: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2st7UtcSSfxqi0zATAVf_Nk3369CLxyIl7q2kcuB_-oVzc2ommI9Ya7QwAdathRhxR6LO3l3N5?gv=true',
    long: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1ozYumxC9Lnrp44LZo8TI5Pw-LhUbXf0dIOITMlZ6PyfwHd3HL1A7Hg1dyD4HGtfcrqiMd8SpD?gv=true',
    all: 'https://calendar.google.com/calendar/appointments/AcZssZ2TdBp4R_bZv3Iva79rDa8mgAqV8n_usbMetXM=?gv=true'
};

interface MeetingPageTemplateProps {
    language?: string;
    meetingType: MeetingType;
}

export default function MeetingPageTemplate({
    language = DEFAULT_LANGUAGE,
    meetingType
}: MeetingPageTemplateProps) {
    const [isCalendarLoading, setIsCalendarLoading] = useState(true);

    // Get translated texts
    const translations = getTranslation('meet', language);

    // Get the appropriate title based on meeting type
    const getPageTitle = (): string => {
        switch (meetingType) {
            case 'short':
                return translations.shortPageTitle;
            case 'medium':
                return translations.mediumPageTitle;
            case 'long':
                return translations.longPageTitle;
            case 'all':
                return translations.allPageTitle;
        }
    };

    // Form current path for footer
    const getCurrentPath = (): string => {
        if (language === DEFAULT_LANGUAGE) {
            return `/meet/${meetingType}/`;
        } else {
            const meetSegment = getPathSegmentByLanguage('meet', language);
            const typeSegment = getSubPathSegmentByLanguage('meet', meetingType, language);
            return `/${language}/${meetSegment}/${typeSegment}/`;
        }
    };

    // Get calendar URL for the meeting type
    const calendarUrl = CALENDAR_URLS[meetingType];

    return (
        <>
            <div className={styles.bookingOptionsContainer}>
                <h1>{getPageTitle()}</h1>

                <div className={styles.meetContainer}>
                    {isCalendarLoading && (
                        <div className={styles.calendarLoading}>
                            <p>{translations.calendarLoading}</p>
                        </div>
                    )}
                    {/* Google Calendar Appointment Scheduling */}
                    <iframe
                        src={calendarUrl}
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
            <Footer language={language} currentPath={getCurrentPath()} />
        </>
    );
} 
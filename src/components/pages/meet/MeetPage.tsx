import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/meet/page.module.css';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, getSubPathSegmentByLanguage, getTranslation } from '@/lib/localization';

interface MeetPageProps {
    language?: string;
}

export default function MeetPage({ language = DEFAULT_LANGUAGE }: MeetPageProps) {
    // Get translated texts
    const translations = getTranslation('meet', language);

    // Get localized paths for the sub-segments
    const shortPath = language === DEFAULT_LANGUAGE
        ? '/meet/short/'
        : `/${language}/${getPathSegmentByLanguage('meet', language)}/${getSubPathSegmentByLanguage('meet', 'short', language)}/`;

    const allPath = language === DEFAULT_LANGUAGE
        ? '/meet/all/'
        : `/${language}/${getPathSegmentByLanguage('meet', language)}/${getSubPathSegmentByLanguage('meet', 'all', language)}/`;

    return (
        <section className={styles.bookingOptionsContainer}>
            <h1>{translations.title}</h1>
            <p>{translations.description}</p>

            <nav className={styles.bookingMethods} aria-label="Meeting booking options">
                <Link href={shortPath} className={styles.bookingMethod}>
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
                        <h2>{translations.shortMeeting.title}</h2>
                        <p>{translations.shortMeeting.description}</p>
                    </div>
                </Link>

                <Link href={allPath} className={styles.bookingMethod}>
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
                        <h2>{translations.allMeetings.title}</h2>
                        <p>{translations.allMeetings.description}</p>
                    </div>
                </Link>
            </nav>
        </section>
    );
} 
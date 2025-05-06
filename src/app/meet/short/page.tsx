import { Metadata } from 'next';
import { ShortMeetingPage } from '@/components/pages/meet';
import { DEFAULT_LANGUAGE } from '@/lib/localization';

export const metadata: Metadata = {
    title: '15-Minute Welcome Meeting | Kirill Markin',
    description: 'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.',
    openGraph: {
        title: '15-Minute Welcome Meeting | Kirill Markin',
        description: 'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.',
        url: 'https://kirill-markin.com/meet/short/',
        images: [
            {
                url: '/images/meeting-booking.webp',
                width: 1200,
                height: 630,
                alt: '15-minute welcome meeting with Kirill Markin',
            }
        ],
        type: 'website',
        siteName: 'Kirill Markin',
        locale: 'en_US',
    },
    twitter: {
        title: '15-Minute Welcome Meeting | Kirill Markin',
        description: 'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.',
        images: ['/images/meeting-booking.webp'],
    },
    alternates: {
        canonical: 'https://kirill-markin.com/meet/short/',
    },
};

interface PageProps {
    params: Promise<{ lang?: string }>;
}

export default async function Page({ params }: PageProps) {
    // Get language from params, default to English if not provided
    const { lang = DEFAULT_LANGUAGE } = await params || {};

    return <ShortMeetingPage language={lang} />;
} 
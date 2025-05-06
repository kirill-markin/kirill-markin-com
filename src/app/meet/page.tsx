import { MeetPage } from '@/components/pages/meet';
import type { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';

export const metadata: Metadata = {
  title: 'Meeting Booking Options with Kirill Markin',
  description: 'Select your preferred meeting option with Kirill Markin. Choose meeting timing and duration.',
  openGraph: {
    title: 'Meeting Booking Options with Kirill Markin',
    description: 'Select your preferred meeting option with Kirill Markin. Choose meeting timing and duration.',
    url: 'https://kirill-markin.com/meet/',
    images: [
      {
        url: '/images/meeting-booking.webp',
        width: 1200,
        height: 630,
        alt: 'Schedule a meeting with Kirill Markin',
      }
    ],
    type: 'website',
    siteName: 'Kirill Markin',
    locale: 'en_US',
  },
  twitter: {
    title: 'Meeting Booking Options with Kirill Markin',
    description: 'Select your preferred meeting option with Kirill Markin. Choose meeting timing and duration.',
    images: ['/images/meeting-booking.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/meet/',
  },
};

interface PageProps {
  params: Promise<{ lang?: string }>;
}

export default async function Page({ params }: PageProps) {
  // Get language from params, default to English if not provided
  const { lang = DEFAULT_LANGUAGE } = await params || {};

  return <MeetPage language={lang} />;
} 
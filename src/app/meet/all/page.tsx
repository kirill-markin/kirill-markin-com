import { Metadata } from 'next';
import { AllMeetingsPage } from '@/components/pages/meet';
import { DEFAULT_LANGUAGE } from '@/lib/localization';

export const metadata: Metadata = {
  title: 'All Meeting Options | Kirill Markin',
  description: 'Schedule a consultation with Kirill Markin. Choose from all available meeting options and time slots.',
  openGraph: {
    title: 'All Meeting Options | Kirill Markin',
    description: 'Schedule a consultation with Kirill Markin. Choose from all available meeting options and time slots.',
    url: 'https://kirill-markin.com/meet/all/',
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
    title: 'All Meeting Options | Kirill Markin',
    description: 'Schedule a consultation with Kirill Markin. Choose from all available meeting options and time slots.',
    images: ['/images/meeting-booking.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/meet/all/',
  },
};

interface PageProps {
  params: Promise<{ lang?: string }>;
}

export default async function Page({ params }: PageProps) {
  // Get language from params, default to English if not provided
  const { lang = DEFAULT_LANGUAGE } = await params || {};

  return <AllMeetingsPage language={lang} />;
} 
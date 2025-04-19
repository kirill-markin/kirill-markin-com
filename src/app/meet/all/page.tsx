import { Metadata } from 'next';
import AllMeetingsClient from './all-client';

export const metadata: Metadata = {
  title: 'All Meeting Options | Kirill Markin',
  description: 'Choose from all available consultation options and time slots for meetings with Kirill Markin.',
  openGraph: {
    title: 'All Meeting Options | Kirill Markin',
    description: 'Choose from all available consultation options and time slots for meetings with Kirill Markin.',
    url: 'https://kirill-markin.com/meet/all/',
    images: [
      {
        url: '/images/meeting-all-options.webp',
        width: 1200,
        height: 630,
        alt: 'All meeting options with Kirill Markin',
      }
    ],
    type: 'website',
    siteName: 'Kirill Markin',
    locale: 'en_US',
  },
  twitter: {
    title: 'All Meeting Options | Kirill Markin',
    description: 'Choose from all available consultation options and time slots for meetings with Kirill Markin.',
    images: ['/images/meeting-all-options.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/meet/all/',
  },
};

export default function AllMeetingsPage() {
  return <AllMeetingsClient />;
} 
import { Metadata } from 'next';
import ShortMeetingClient from './short-client';

export const metadata: Metadata = {
  title: '15-Minute Welcome Meeting | Kirill Markin',
  description: 'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.',
  openGraph: {
    title: '15-Minute Welcome Meeting | Kirill Markin',
    description: 'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.',
    url: 'https://kirill-markin.com/meet/short/',
    type: 'website',
    siteName: 'Kirill Markin',
    locale: 'en_US',
  },
  twitter: {
    title: '15-Minute Welcome Meeting | Kirill Markin',
    description: 'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.',
  },
  alternates: {
    canonical: 'https://kirill-markin.com/meet/short/',
  },
};

export default function ShortMeetingPage() {
  return <ShortMeetingClient />;
} 
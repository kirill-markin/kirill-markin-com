import { Metadata } from 'next';
import ShortMeetingClient from './short-client';

export const metadata: Metadata = {
  title: '15-Minute Welcome Meeting | Kirill Markin',
  description: 'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.',
};

export default function ShortMeetingPage() {
  return <ShortMeetingClient />;
} 
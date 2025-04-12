import { Metadata } from 'next';
import AllMeetingsClient from './all-client';

export const metadata: Metadata = {
  title: 'All Meeting Options | Kirill Markin',
  description: 'Choose from all available consultation options and time slots for meetings with Kirill Markin.',
};

export default function AllMeetingsPage() {
  return <AllMeetingsClient />;
} 
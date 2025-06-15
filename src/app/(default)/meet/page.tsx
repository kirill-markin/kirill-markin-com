import { MeetPage } from '@/components/pages/meet';
import type { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generateMeetPageMetadata } from '@/lib/metadata';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  return generateMeetPageMetadata({
    language: DEFAULT_LANGUAGE,
    type: 'index'
  });
}

export default function Page() {
  return <MeetPage language={DEFAULT_LANGUAGE} />;
} 
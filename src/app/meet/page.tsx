import { MeetPage } from '@/components/pages/meet';
import type { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generateMeetPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeetPageMetadata({
    language: DEFAULT_LANGUAGE,
    type: 'index'
  });
}

interface PageProps {
  params: Promise<{ lang?: string }>;
}

export default async function Page({ params }: PageProps) {
  // Get language from params, default to English if not provided
  const { lang = DEFAULT_LANGUAGE } = await params || {};

  return <MeetPage language={lang} />;
} 
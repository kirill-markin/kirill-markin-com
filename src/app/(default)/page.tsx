import type { Metadata } from 'next';
import HomePageContent from '@/components/pages/HomePageContent';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generateHomePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateHomePageMetadata(DEFAULT_LANGUAGE);

export default function Home() {
  return <HomePageContent language={DEFAULT_LANGUAGE} />;
}

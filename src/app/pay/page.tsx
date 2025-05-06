import { PayPage } from '@/components/pages/pay';
import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generatePayPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return generatePayPageMetadata({
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

  return <PayPage language={lang} />;
} 
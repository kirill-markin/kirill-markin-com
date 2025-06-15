import { PayPage } from '@/components/pages/pay';
import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generatePayPageMetadata } from '@/lib/metadata';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  return generatePayPageMetadata({
    language: DEFAULT_LANGUAGE,
    type: 'index'
  });
}

export default function Page() {
  return <PayPage language={DEFAULT_LANGUAGE} />;
} 
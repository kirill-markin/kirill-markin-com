import SubscribePageContent from '@/components/pages/SubscribePageContent';
import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generateSubscribePageMetadata } from '@/lib/metadata';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
    return generateSubscribePageMetadata();
}

export default function Page() {
    return <SubscribePageContent language={DEFAULT_LANGUAGE} />;
} 
import { Metadata } from 'next';
import { ShortMeetingPage } from '@/components/pages/meet';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generateMeetPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
    return generateMeetPageMetadata({
        language: DEFAULT_LANGUAGE,
        type: 'short'
    });
}

interface PageProps {
    params: Promise<{ lang?: string }>;
}

export default async function Page({ params }: PageProps) {
    // Get language from params, default to English if not provided
    const { lang = DEFAULT_LANGUAGE } = (await params) || {};

    return <ShortMeetingPage language={lang} />;
} 
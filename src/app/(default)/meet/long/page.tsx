import { Metadata } from 'next';
import { MeetingPageTemplate } from '@/components/pages/meet';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generateMeetPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
    return generateMeetPageMetadata({
        language: DEFAULT_LANGUAGE,
        type: 'long'
    });
}

interface PageProps {
    params: Promise<{ lang?: string }>;
}

export default async function Page({ params }: PageProps) {
    // Get language from params, default to English if not provided
    const { lang = DEFAULT_LANGUAGE } = (await params) || {};

    return <MeetingPageTemplate language={lang} meetingType="long" />;
} 
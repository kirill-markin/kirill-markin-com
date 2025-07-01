import { Metadata } from 'next';
import { DEFAULT_LANGUAGE, isValidLanguage } from '@/lib/localization';
import { redirect, notFound } from 'next/navigation';
import HomePageContent from '@/components/pages/HomePageContent';
import { generateHomePageMetadata } from '@/lib/metadata';

interface HomePageProps {
    params: Promise<{
        lang: string;
    }>;
}

// Generate static params for all supported languages
export async function generateStaticParams() {
    return [{ lang: 'es' }, { lang: 'zh' }, { lang: 'ar' }, { lang: 'hi' }];
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
    const { lang } = await params;

    // Check if language is valid
    if (!isValidLanguage(lang) || lang === DEFAULT_LANGUAGE) {
        return {};
    }

    return generateHomePageMetadata(lang);
}

export default async function LocalizedHomePage({ params }: HomePageProps) {
    const { lang } = await params;

    // Check if language is valid
    if (!isValidLanguage(lang)) {
        notFound();
        return null;
    }

    // For English, redirect to main site
    if (lang === DEFAULT_LANGUAGE) {
        redirect('/');
    }

    // For other languages, use the common component
    return <HomePageContent language={lang} />;
} 
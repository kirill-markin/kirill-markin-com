import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, isValidLanguage } from '@/lib/localization';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kirill Markin',
    description: 'Personal website of Kirill Markin'
};

// Generate static params for all supported languages
export async function generateStaticParams() {
    return SUPPORTED_LANGUAGES
        .filter(lang => lang !== DEFAULT_LANGUAGE)
        .map(lang => ({ lang }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    // Validate language or redirect to default
    if (!isValidLanguage(lang)) {
        redirect('/');
    }

    return (
        <>
            <Header language={lang} />
            <main>{children}</main>
        </>
    );
} 
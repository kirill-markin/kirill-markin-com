import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, isValidLanguage } from '@/lib/localization';
import { notFound } from 'next/navigation';
import { Source_Serif_4 } from "next/font/google";
import JsonLdSchema from '@/components/JsonLdSchema';
import type { Metadata } from 'next';
import "../../globals.css";
import { commonViewport, commonIcons, commonManifestConfig, commonMetadataBase } from "@/lib/layout-config";
import HeadLinks from "@/components/layout/HeadLinks";
import AnalyticsScripts, { AnalyticsInit } from "@/components/layout/AnalyticsScripts";
import LayoutBody from "@/components/layout/LayoutBody";

const sourceSerifPro = Source_Serif_4({
    subsets: ['latin'],
    weight: ['400', '600'],
    display: 'swap',
    variable: '--font-source-serif-pro',
});

export const viewport = commonViewport;

export const metadata: Metadata = {
    title: 'Kirill Markin',
    description: 'Personal website of Kirill Markin',
    metadataBase: commonMetadataBase,
    icons: commonIcons,
    ...commonManifestConfig,
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

    // Validate language or show 404
    if (!isValidLanguage(lang)) {
        notFound();
        return null; // This line won't execute but helps TypeScript understand the flow
    }

    // Check if we're in production environment
    const isProd = process.env.VERCEL_ENV === 'production';

    return (
        <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className={sourceSerifPro.variable}>
            <head>
                <HeadLinks />
                <JsonLdSchema language={lang} />
                <AnalyticsInit isProd={isProd} />
                <AnalyticsScripts isProd={isProd} />
            </head>
            <LayoutBody language={lang} isProd={isProd}>
                {children}
            </LayoutBody>
        </html>
    );
} 
import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "../globals.css";
import JsonLdSchema from "@/components/JsonLdSchema";
import { DEFAULT_LANGUAGE } from "@/lib/localization";
import { commonViewport, commonIcons, commonManifestConfig, commonMetadataBase } from "@/lib/layout-config";
import HeadLinks from "@/components/layout/HeadLinks";
import GoogleTagManager from "@/components/layout/GoogleTagManager";
import LayoutBody from "@/components/layout/LayoutBody";

const sourceSerifPro = Source_Serif_4({
    subsets: ['latin'],
    weight: ['400', '600'],
    display: 'swap',
    variable: '--font-source-serif-pro',
});

export const viewport = commonViewport;

export const metadata: Metadata = {
    title: "Kirill Markin - Consultant and Software Architect",
    description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
    metadataBase: commonMetadataBase,
    icons: commonIcons,
    ...commonManifestConfig,
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://kirill-markin.com/',
        siteName: 'Kirill Markin',
        title: 'Kirill Markin - Consultant and Software Architect',
        description: 'Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more',
        images: [
            {
                url: '/avatars/Kirill-Markin.webp',
                width: 300,
                height: 300,
                alt: 'Kirill Markin',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kirill Markin - Consultant and Software Architect',
        description: 'Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more',
        images: ['/avatars/Kirill-Markin.webp'],
        creator: '@kirill_markin_',
        site: '@kirill_markin_',
    },
    alternates: {
        canonical: 'https://kirill-markin.com/',
    },
};

export default function DefaultLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Check if we're in production environment
    const isProd = process.env.VERCEL_ENV === 'production';

    // For default layout, use English
    const lang = DEFAULT_LANGUAGE;

    return (
        <html lang={lang} className={sourceSerifPro.variable}>
            <head>
                <HeadLinks />
                <JsonLdSchema language={lang} />
                <GoogleTagManager isProd={isProd} />
            </head>
            <LayoutBody language={lang} isProd={isProd}>
                {children}
            </LayoutBody>
        </html>
    );
} 
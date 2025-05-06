import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import JsonLdSchema from "@/components/JsonLdSchema";
import Script from "next/script";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlitchFilters from "@/components/GlitchFilters";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DEFAULT_LANGUAGE } from "@/lib/localization";
import { headers } from 'next/headers';
import LanguageAttributeUpdater from "@/components/LanguageAttributeUpdater";

export const viewport: Viewport = {
  themeColor: '#800080',
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Kirill Markin - Consultant and Software Architect",
  description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
  metadataBase: new URL('https://kirill-markin.com/'),
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Kirill Markin',
    statusBarStyle: 'black-translucent',
  },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if we're in production environment
  const isProd = process.env.VERCEL_ENV === 'production';

  // Get language from headers
  const headersList = await headers();
  const langWithRegion = headersList.has('x-language') ? headersList.get('x-language') as string : DEFAULT_LANGUAGE;

  // Extract just the language part (first two letters) without the region
  const lang = langWithRegion.split('-')[0];

  return (
    <html lang={lang}>
      <head>
        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicons/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" sizes="180x180" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#800080" />
        <meta name="msapplication-TileColor" content="#800080" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <JsonLdSchema />
        {/* Google Tag Manager - only loaded in production */}
        {isProd && (
          <Script id="google-tag-manager" strategy="lazyOnload">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NJZKH2L');
            `}
          </Script>
        )}
      </head>
      <body>
        {/* Компонент для обновления атрибута lang при изменении пути */}
        <LanguageAttributeUpdater />

        {/* Google Tag Manager (noscript) - only loaded in production */}
        {isProd && (
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NJZKH2L"
              height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}>
            </iframe>
          </noscript>
        )}
        <Header />
        <Breadcrumbs />
        <main>{children}</main>
        <GlitchFilters />
        <Analytics debug={process.env.NODE_ENV !== 'production'} />
        <SpeedInsights debug={process.env.NODE_ENV !== 'production'} />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLdSchema from "@/components/JsonLdSchema";

export const viewport: Viewport = {
  themeColor: '#800080',
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicons/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" sizes="180x180" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#800080" />
        <meta name="msapplication-TileColor" content="#800080" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <JsonLdSchema />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

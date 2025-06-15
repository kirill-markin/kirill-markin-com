import type { Viewport } from 'next';

export const commonViewport: Viewport = {
    themeColor: '#800080',
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 5.0,
    userScalable: true,
};

export const commonIcons = {
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
};

export const commonManifestConfig = {
    manifest: '/site.webmanifest',
    appleWebApp: {
        title: 'Kirill Markin',
        statusBarStyle: 'black-translucent' as const,
    },
};

export const commonMetadataBase = new URL('https://kirill-markin.com/'); 
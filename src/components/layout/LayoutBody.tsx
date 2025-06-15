import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import GlitchFilters from '@/components/GlitchFilters';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManagerNoScript } from './GoogleTagManager';
import { SUPPORTED_LANGUAGES } from '@/lib/localization';

type Language = typeof SUPPORTED_LANGUAGES[number];

interface LayoutBodyProps {
    children: React.ReactNode;
    language: Language;
    isProd: boolean;
}

export default function LayoutBody({ children, language, isProd }: LayoutBodyProps) {
    return (
        <body>
            <GoogleTagManagerNoScript isProd={isProd} />
            <Header language={language} />
            <Breadcrumbs />
            <main>{children}</main>
            <GlitchFilters />
            <Analytics debug={process.env.NODE_ENV !== 'production'} />
            <SpeedInsights debug={process.env.NODE_ENV !== 'production'} />
        </body>
    );
} 
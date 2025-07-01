import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import GlitchFilters from '@/components/GlitchFilters';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManagerNoScript } from './GoogleTagManager';
import { SUPPORTED_LANGUAGES } from '@/lib/localization';
import EmailPopup from '@/components/EmailPopup';
import { isLemlistConfigured, getLemlistConfigStatus } from '@/lib/popupConstants';

type Language = typeof SUPPORTED_LANGUAGES[number];

interface LayoutBodyProps {
    children: React.ReactNode;
    language: Language;
    isProd: boolean;
}

export default function LayoutBody({ children, language, isProd }: LayoutBodyProps) {
    // Check if email popup should be enabled
    const showEmailPopup = isLemlistConfigured();

    // Log configuration status only when disabled and in development
    if (!showEmailPopup && process.env.NODE_ENV === 'development') {
        const configStatus = getLemlistConfigStatus();
        console.warn('📧 Email popup disabled - Missing Lemlist configuration:', {
            hasApiKey: configStatus.hasApiKey,
            hasCompanyId: configStatus.hasCompanyId,
            note: 'Set LEMLIST_API_KEY and LEMLIST_SUBSCRIPTION_COMPANY_ID environment variables to enable'
        });
    }

    return (
        <body>
            <GoogleTagManagerNoScript isProd={isProd} />
            <Header language={language} />
            <Breadcrumbs />
            <main>{children}</main>
            <GlitchFilters />
            {isProd && <SpeedInsights />}
            {showEmailPopup && <EmailPopup language={language} />}
        </body>
    );
} 
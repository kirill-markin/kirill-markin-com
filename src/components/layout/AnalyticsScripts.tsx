import Script from 'next/script';
import { ANALYTICS_CONFIG, getAnalyticsInitScript } from '@/lib/analytics';

interface AnalyticsScriptsProps {
    isProd: boolean;
}

/**
 * Analytics initialization script for <head>
 * Initializes queues before external scripts load
 * Uses inline script tag (not Next.js Script) to ensure it runs immediately
 */
export function AnalyticsInit({ isProd }: AnalyticsScriptsProps) {
    if (!isProd) return null;

    // Use regular script tag for immediate execution (before any async scripts)
    return (
        <script
            id="analytics-init"
            dangerouslySetInnerHTML={{ __html: getAnalyticsInitScript() }}
        />
    );
}

/**
 * Analytics scripts that load asynchronously
 * Uses lazyOnload strategy to not block page rendering
 */
export default function AnalyticsScripts({ isProd }: AnalyticsScriptsProps) {
    if (!isProd) return null;

    const { GA4_MEASUREMENT_ID, CLARITY_PROJECT_ID, AHREFS_DATA_KEY } = ANALYTICS_CONFIG;

    return (
        <>
            {/* Google Analytics 4 */}
            <Script
                id="ga4-script"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
                strategy="lazyOnload"
            />
            <Script
                id="ga4-config"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.gtag && window.gtag('config', '${GA4_MEASUREMENT_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />

            {/* Microsoft Clarity */}
            <Script
                id="clarity-script"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
                    `,
                }}
            />

            {/* Ahrefs Analytics */}
            {AHREFS_DATA_KEY && (
                <Script
                    id="ahrefs-script"
                    src="https://analytics.ahrefs.com/analytics.js"
                    data-key={AHREFS_DATA_KEY}
                    strategy="lazyOnload"
                />
            )}

        </>
    );
}

/**
 * NoScript fallback for analytics
 * Currently empty since GA4 and Clarity don't have noscript equivalents
 * GTM's noscript iframe was mainly for GTM's own tracking
 */
export function AnalyticsNoScript({ isProd }: AnalyticsScriptsProps) {
    if (!isProd) return null;

    // GA4 and Clarity don't require noscript fallbacks
    // The GTM noscript iframe was for GTM container loading, not analytics
    return null;
}

import Script from 'next/script';

interface GoogleTagManagerProps {
    isProd: boolean;
}

export default function GoogleTagManager({ isProd }: GoogleTagManagerProps) {
    if (!isProd) return null;

    return (
        <>
            {/* Google Tag Manager Script */}
            <Script id="google-tag-manager" strategy="lazyOnload">
                {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-NJZKH2L');
                `}
            </Script>
        </>
    );
}

export function GoogleTagManagerNoScript({ isProd }: GoogleTagManagerProps) {
    if (!isProd) return null;

    return (
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NJZKH2L"
                height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}>
            </iframe>
        </noscript>
    );
} 
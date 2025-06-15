'use client';

import { useEffect, useRef } from 'react';
import styles from '@/app/(default)/pay/page.module.css';
import Script from 'next/script';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, getSubPathSegmentByLanguage, getTranslation } from '@/lib/localization';
import Footer from '@/components/Footer';

interface StripePaymentPageProps {
    language?: string;
}

export default function StripePaymentPage({ language = DEFAULT_LANGUAGE }: StripePaymentPageProps) {
    // Get translated texts
    const translations = getTranslation('pay', language);
    const stripeContainerRef = useRef<HTMLDivElement>(null);

    // Form current path for footer
    const currentPath = language === DEFAULT_LANGUAGE
        ? '/pay/stripe/'
        : `/${language}/${getPathSegmentByLanguage('pay', language)}/${getSubPathSegmentByLanguage('pay', 'stripe', language)}/`;

    useEffect(() => {
        if (stripeContainerRef.current) {
            // Create custom Stripe pricing table element
            const stripePricingTable = document.createElement('stripe-pricing-table');
            stripePricingTable.setAttribute('pricing-table-id', 'prctbl_1Pb2neE3K3xV54NrGWDLabtL');
            stripePricingTable.setAttribute('publishable-key', 'pk_live_51KrGW6E3K3xV54NrjakiNdX4kKJ5YJiG1YaRjzafUba44oeVTvOZNQQTC25riOXZjUtKERJKXbbRxQCwKfh9J0x200wTzm77Ps');
            stripePricingTable.className = styles.stripePricingTable;

            // Clear and append
            stripeContainerRef.current.innerHTML = '';
            stripeContainerRef.current.appendChild(stripePricingTable);
        }
    }, []);

    return (
        <>
            <div className={styles.paymentOptionsContainer}>
                <h1>{translations.stripePageTitle}</h1>

                <div className={styles.stripeContainer} ref={stripeContainerRef}>
                    {/* Stripe pricing table will be rendered here */}
                    <div className={styles.stripeLoading}>
                        <p>{translations.formLoading}</p>
                    </div>
                </div>

                <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="afterInteractive" />
            </div>
            <Footer language={language} currentPath={currentPath} />
        </>
    );
} 
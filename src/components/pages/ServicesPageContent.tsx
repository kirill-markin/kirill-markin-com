'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { getPathSegmentByLanguage, getSubPathSegmentByLanguage } from '@/lib/localization';
import ServicesFractionalCTOSection from '@/components/Services/ServicesFractionalCTOSection';
import ServicesOtherSection from '@/components/Services/ServicesOtherSection';
import { ServiceOtherData, ServiceFractionalCTOData } from '@/types/services';
import Footer from '@/components/Footer';
import styles from '@/app/(default)/services/page.module.css';

interface ServicesPageContentProps {
    language: string;
    services: ServiceOtherData[]; // Services Other passed from server as props
    fractionalCTOData: ServiceFractionalCTOData; // Fractional CTO data passed from server as props
}

export default function ServicesPageContent({ language, services, fractionalCTOData }: ServicesPageContentProps) {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || 'all';

    // Function to resolve localized category name to internal category ID
    const resolveInternalCategory = (): string => {
        // If no category or explicit 'all' category, return 'all'
        if (!currentCategory || currentCategory === 'all' ||
            currentCategory === getSubPathSegmentByLanguage('services', 'all', language)) {
            return 'all';
        }

        // Check against known categories
        const knownCategories = ['people', 'business', 'journalists'];

        // First check if it's already a known internal category (for English)
        if (language === 'en' && knownCategories.includes(currentCategory)) {
            return currentCategory;
        }

        // Otherwise, check if it's a valid localized category for the CURRENT language only
        for (const internalCategory of knownCategories) {
            const localizedCategoryName = getSubPathSegmentByLanguage('services', internalCategory, language);
            if (currentCategory === localizedCategoryName) {
                return internalCategory;
            }
        }

        // If invalid category, default to 'all' for client-side (no 404)
        return 'all';
    };

    const internalCategory = resolveInternalCategory();

    // Get the localized category name for URL
    const getLocalizedCategoryParam = (): string => {
        if (internalCategory === 'all') {
            return getSubPathSegmentByLanguage('services', 'all', language);
        }
        return getSubPathSegmentByLanguage('services', internalCategory, language);
    };

    // Form path for footer
    const servicesBasePath = language === 'en'
        ? '/services'
        : `/${language}/${getPathSegmentByLanguage('services', language)}`;

    // Form full path including category parameter if specified
    const fullPath = internalCategory === 'all'
        ? servicesBasePath
        : `${servicesBasePath}/?category=${getLocalizedCategoryParam()}`;

    return (
        <>
            <div className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.fullWidthColumn}>
                        <ServicesFractionalCTOSection data={fractionalCTOData} />
                        <ServicesOtherSection
                            services={services}
                            currentCategory={internalCategory}
                            language={language}
                        />
                    </div>
                </div>
            </div>
            <Footer language={language} currentPath={fullPath} />
        </>
    );
} 
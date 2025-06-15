import React from 'react';
import { getPathSegmentByLanguage, getSubPathSegmentByLanguage } from '@/lib/localization';
import ServerServices from '@/components/ServerServices';
import { servicesData } from '@/data/services';
import Footer from '@/components/Footer';
import styles from '@/app/(default)/services/page.module.css';
import { notFound } from 'next/navigation';

interface ServicesPageContentProps {
    language: string;
    category?: string;
}

export default function ServicesPageContent({ language, category }: ServicesPageContentProps) {
    // Map the localized category parameter to internal category ID if needed
    const resolveInternalCategory = (): string | null => {
        // If no category or explicit 'all' category, return 'all'
        if (!category || category === 'all' ||
            category === getSubPathSegmentByLanguage('services', 'all', language)) {
            return 'all';
        }

        // Check against known categories
        const knownCategories = ['people', 'business', 'journalists'];

        // First check if it's already a known internal category (for English)
        if (language === 'en' && knownCategories.includes(category)) {
            return category;
        }

        // Otherwise, check if it's a valid localized category for the CURRENT language only
        for (const internalCategory of knownCategories) {
            const localizedCategoryName = getSubPathSegmentByLanguage('services', internalCategory, language);
            if (category === localizedCategoryName) {
                return internalCategory;
            }
        }

        // If we get here, the category is either:
        // 1. Not a valid category at all
        // 2. A valid category but from the wrong language
        // Either way, we should return null to trigger a 404
        return null;
    };

    // Define current category (internal ID)
    const currentCategory = resolveInternalCategory();

    // If resolveInternalCategory returns null, it means the category is invalid
    // for the current language, so we should return a 404
    if (currentCategory === null) {
        notFound();
    }

    // Get the localized category name for URL
    const getLocalizedCategoryParam = (): string => {
        if (currentCategory === 'all') {
            return getSubPathSegmentByLanguage('services', 'all', language);
        }
        return getSubPathSegmentByLanguage('services', currentCategory, language);
    };

    // Form path for footer
    const servicesBasePath = language === 'en'
        ? '/services'
        : `/${language}/${getPathSegmentByLanguage('services', language)}`;

    // Form full path including category parameter if specified
    const fullPath = currentCategory === 'all'
        ? servicesBasePath
        : `${servicesBasePath}/?category=${getLocalizedCategoryParam()}`;

    return (
        <>
            <div className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.fullWidthColumn}>
                        <ServerServices
                            services={servicesData}
                            currentCategory={currentCategory}
                            language={language}
                        />
                    </div>
                </div>
            </div>
            <Footer language={language} currentPath={fullPath} />
        </>
    );
} 
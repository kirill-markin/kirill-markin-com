import React from 'react';
import { getPathSegmentByLanguage, getSubPathSegmentByLanguage } from '@/lib/localization';
import ServerServices from '@/components/ServerServices';
import { servicesData } from '@/data/services';
import Footer from '@/components/Footer';
import styles from '@/app/services/page.module.css';

interface ServicesPageContentProps {
    language: string;
    category?: string;
}

export default function ServicesPageContent({ language, category }: ServicesPageContentProps) {
    // Map the localized category parameter to internal category ID if needed
    const resolveInternalCategory = (): string => {
        if (!category || category === 'all' ||
            category === getSubPathSegmentByLanguage('services', 'all', language)) {
            return 'all';
        }

        // Check against known categories
        const knownCategories = ['people', 'business', 'journalists'];

        // First check if it's already a known internal category
        if (knownCategories.includes(category)) {
            return category;
        }

        // Otherwise, find the internal category ID that matches this localized category name
        for (const internalCategory of knownCategories) {
            const localizedCategoryName = getSubPathSegmentByLanguage('services', internalCategory, language);
            if (category === localizedCategoryName) {
                return internalCategory;
            }
        }

        // If not found, default to 'all'
        return 'all';
    };

    // Define current category (internal ID)
    const currentCategory = resolveInternalCategory();

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
import React from 'react';
import { getPathSegmentByLanguage } from '@/lib/localization';
import ServerServices from '@/components/ServerServices';
import { servicesData } from '@/data/services';
import Footer from '@/components/Footer';
import styles from '@/app/services/page.module.css';

interface ServicesPageContentProps {
    language: string;
    category?: string;
}

export default function ServicesPageContent({ language, category }: ServicesPageContentProps) {
    // Define current category
    const currentCategory = category || 'all';

    // Form path for footer
    const servicesBasePath = language === 'en'
        ? '/services'
        : `/${language}/${getPathSegmentByLanguage('services', language)}`;

    // Form full path including category parameter if specified
    const fullPath = currentCategory === 'all'
        ? servicesBasePath
        : `${servicesBasePath}/?category=${currentCategory}`;

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
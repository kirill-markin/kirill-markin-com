'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ServiceData } from '@/types/services';
import { getTranslation, getPathSegmentByLanguage, getSubPathSegmentByLanguage } from '@/lib/localization';
import styles from '../Services/Services.module.css';

interface ServicesGridProps {
    services: ServiceData[]; // ALL services (not filtered)
    currentCategory: string;
    language: string;
}

// Client component for ServiceCard
function ServiceCard({ service, language }: { service: ServiceData; language: string }) {
    const getFirstParagraph = (description: string): string => {
        return description.split('\n\n')[0];
    };

    // Get translations for service categories
    const t = getTranslation('services', language);

    // Get localized category name
    const getLocalizedCategoryName = (categoryId: string): string => {
        return (t.serviceCategories?.[categoryId as keyof typeof t.serviceCategories]) ||
            categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    };

    // Get formatted category for display
    const formattedCategory = getLocalizedCategoryName(service.categoryId);

    const isExternalLink = service.buttonUrl.startsWith('http://') || service.buttonUrl.startsWith('https://');

    return (
        <article className={styles.serviceCard} data-category={service.categoryId}>
            <Link href={service.buttonUrl}
                className={styles.serviceCardLink}
                target={isExternalLink ? '_blank' : undefined}>
                <div className={styles.serviceCardCategory}>
                    <span className={styles.currentCategory}>{formattedCategory}</span>
                </div>
                <div className={styles.serviceCardImage}>
                    {service.logoUrl ? (
                        <Image
                            src={service.logoUrl}
                            alt={service.name}
                            className={styles.serviceImage}
                            width={600}
                            height={338}
                            sizes="(max-width: 640px) 300px, (max-width: 1024px) 450px, 600px"
                            quality={75}
                            priority
                        />
                    ) : (
                        <Image
                            src="/services/default.png"
                            alt={service.name}
                            className={styles.serviceImage}
                            width={600}
                            height={338}
                            sizes="(max-width: 640px) 300px, (max-width: 1024px) 450px, 600px"
                            quality={75}
                            priority
                        />
                    )}
                </div>
                <div className={styles.serviceCardContent}>
                    <h3>{service.name}</h3>
                    <div className={styles.serviceDescription}>
                        <div className={styles.serviceShortDescription}>
                            <p>{getFirstParagraph(service.description)}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}

// Main client component for services grid with filtering
export default function ServicesGrid({ services, currentCategory, language }: ServicesGridProps) {
    // Get translations
    const t = getTranslation('services', language);

    // Extract unique categories from ALL services (not filtered)
    const categories = Array.from(
        new Set(services.map(service => service.categoryId))
    ).filter(category => category !== 'all');

    // Filter services based on current category (client-side filtering)
    const filteredServices = currentCategory === 'all'
        ? services
        : services.filter(service => service.categoryId === currentCategory);

    // SEO-friendly category title
    const getCategoryTitle = () => {
        if (currentCategory === 'all') {
            return t.serviceCategories?.all || 'All Services';
        }

        const formattedCategory = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        const categoryLabel = t.serviceCategories?.[currentCategory as keyof typeof t.serviceCategories] || formattedCategory;
        return categoryLabel;
    };

    // Helper to get the localized category URL
    const getCategoryUrl = (category: string) => {
        const servicesSegment = getPathSegmentByLanguage('services', language);
        const localizedCategory = getSubPathSegmentByLanguage('services', category, language);

        // Form the base services path based on language
        const basePath = language === 'en'
            ? '/services'
            : `/${language}/${servicesSegment}`;

        // For "all" category, just return the base path
        if (category === 'all') {
            return basePath;
        }

        // Otherwise add the category parameter with localized value
        return `${basePath}/?category=${localizedCategory}`;
    };

    // Helper to get translated category name
    const getCategoryName = (category: string) => {
        if (category === 'all') {
            return t.serviceCategories?.all || 'All Services';
        }
        return (t.serviceCategories?.[category as keyof typeof t.serviceCategories]) ||
            category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <section className={styles.services}>
            <div className={styles.servicesHeader}>
                <div className={styles.servicesHeaderTitle}>
                    <h1 className={styles.servicesTitle}>
                        {getCategoryTitle()}
                    </h1>
                    <div className={styles.categoryDescription}>
                        <p>{t.description}</p>
                    </div>
                </div>
            </div>

            <nav className={styles.servicesMenu} aria-label="Service categories">
                <span>{t.categoriesLabel || 'Categories'}</span>
                <div className={styles.servicesMenuCategories}>
                    <Link
                        href={getCategoryUrl('all')}
                        className={`${styles.servicesMenuCategory} ${currentCategory === 'all' ? styles.active : ''}`}
                        scroll={false}
                    >
                        {getCategoryName('all')}
                    </Link>

                    {categories.map(category => (
                        <Link
                            key={category}
                            href={getCategoryUrl(category)}
                            className={`${styles.servicesMenuCategory} ${currentCategory === category ? styles.active : ''}`}
                            scroll={false}
                        >
                            {getCategoryName(category)}
                        </Link>
                    ))}
                </div>
            </nav>

            <ul className={styles.servicesList}>
                {filteredServices.map(service => (
                    <li key={service.serviceId}>
                        <ServiceCard service={service} language={language} />
                    </li>
                ))}
            </ul>
        </section>
    );
} 
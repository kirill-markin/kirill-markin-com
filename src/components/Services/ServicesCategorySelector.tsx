'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getTranslation, getPathSegmentByLanguage, getSubPathSegmentByLanguage } from '@/lib/localization';
import styles from './ServicesCategorySelector.module.css';

interface ServicesCategorySelectorProps {
    language: string;
}

export default function ServicesCategorySelector({ language }: ServicesCategorySelectorProps) {
    const t = getTranslation('services', language);

    // Helper to get the localized category URL
    const getCategoryUrl = (category: string) => {
        const servicesSegment = getPathSegmentByLanguage('services', language);
        const localizedCategory = getSubPathSegmentByLanguage('services', category, language);

        // Form the base services path based on language
        const basePath = language === 'en'
            ? '/services/'
            : `/${language}/${servicesSegment}/`;

        // For "all" category, use the base path with category parameter
        if (category === 'all') {
            return `${basePath}?category=${localizedCategory}`;
        }

        // Otherwise add the category parameter with localized value
        return `${basePath}?category=${localizedCategory}`;
    };

    // Helper to get translated category name
    const getCategoryName = (category: string) => {
        if (category === 'all') {
            return t.serviceCategories?.all || 'All Services';
        }
        return (t.serviceCategories?.[category as keyof typeof t.serviceCategories]) ||
            category.charAt(0).toUpperCase() + category.slice(1);
    };

    const categories = [
        { id: 'all', iconPath: '/icons/services/squares-2x2.svg' },
        { id: 'people', iconPath: '/icons/services/user.svg' },
        { id: 'business', iconPath: '/icons/services/building-office.svg' },
        { id: 'journalists', iconPath: '/icons/services/newspaper.svg' }
    ];

    return (
        <section className={styles.categorySelector}>
            <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>
                    How Can I Help<span className={styles.glitchLetter}>?</span>
                </h2>
                <p className={styles.categoryDescription}>
                    Please select what interests you - I'll be happy to help!
                </p>
            </div>

            <div className={styles.categoryButtons}>
                {categories.map(category => (
                    <Link
                        key={category.id}
                        href={getCategoryUrl(category.id)}
                        className={styles.categoryButton}
                        scroll={false}
                    >
                        <div className={styles.categoryIcon}>
                            <Image
                                src={category.iconPath}
                                alt={getCategoryName(category.id)}
                                width={48}
                                height={48}
                                className={styles.categoryIconSvg}
                            />
                        </div>
                        <div className={styles.categoryName}>
                            {getCategoryName(category.id)}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
} 
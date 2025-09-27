'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AuthorBlock.module.css';
import { personalInfo } from '../../data/personalInfo';
import { DEFAULT_LANGUAGE, getTranslation } from '@/lib/localization';

interface AuthorBlockProps {
    language?: string;
}

const AuthorBlock: React.FC<AuthorBlockProps> = ({
    language = DEFAULT_LANGUAGE
}) => {
    // Get translations
    const personalInfoTranslations = getTranslation('personalInfo', language);
    const commonTranslations = getTranslation('common', language);

    // Create the correct home link based on the language
    const homeLink = language === DEFAULT_LANGUAGE ? '/' : `/${language}/`;

    return (
        <Link href={homeLink} className={styles.authorBlock}>
            <div className={styles.authorContent}>
                <h3 className={styles.authorHeading}>{commonTranslations.aboutAuthor}</h3>
                <div className={styles.imageContainer}>
                    <Image
                        src={personalInfo.image}
                        alt={personalInfo.name}
                        width={120}
                        height={120}
                        className={styles.authorImage}
                        sizes="(max-width: 1200px) 50px, 120px"
                    />
                </div>
                <div className={styles.authorInfo}>
                    <p className={styles.authorName}>{personalInfo.name}</p>
                    <p className={styles.authorTitle}>{personalInfoTranslations.jobTitle}</p>
                    <p className={styles.authorSecondaryTitle}>{personalInfoTranslations.secondaryTitle}</p>
                    <p className={styles.authorTertiaryTitle}>{personalInfoTranslations.tertiaryTitle}</p>
                </div>
            </div>
            <div className={styles.achievementSticker}>
                <div className={styles.value}>7,000+</div>
                <div className={styles.label}>subscribers</div>
            </div>
        </Link>
    );
};

export default AuthorBlock; 
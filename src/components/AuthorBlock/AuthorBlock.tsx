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
    // Get personal info translations
    const personalInfoTranslations = getTranslation('personalInfo', language);

    return (
        <Link href="/" className={styles.authorBlock}>
            <div className={styles.authorContent}>
                <h3 className={styles.authorHeading}>About Author</h3>
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
        </Link>
    );
};

export default AuthorBlock; 
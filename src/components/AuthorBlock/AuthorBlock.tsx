'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AuthorBlock.module.css';
import { personalInfo } from '../../data/personalInfo';

const AuthorBlock: React.FC = () => {
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
                    <p className={styles.authorTitle}>{personalInfo.jobTitle}</p>
                    <p className={styles.authorSecondaryTitle}>{personalInfo.secondaryTitle}</p>
                    <p className={styles.authorTertiaryTitle}>{personalInfo.tertiaryTitle}</p>
                </div>
            </div>
        </Link>
    );
};

export default AuthorBlock; 
import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { mediaMentions } from '../data/mediaMentions';
import PersonalInfo from '../components/PersonalInfo';
import type { Metadata } from 'next';

// Update placeholder image constant
const PLACEHOLDER_IMAGE = '/articles/articles-screen-saver-1.png';

export const metadata: Metadata = {
  title: "Kirill Markin - Consultant and Software Architect",
  description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
  openGraph: {
    title: "Kirill Markin - Consultant and Software Architect",
    description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
    url: 'https://kirill-markin.com/',
    images: [
      {
        url: '/avatars/Kirill-Markin.webp',
        width: 300,
        height: 300,
        alt: 'Kirill Markin',
      }
    ],
  },
  twitter: {
    title: "Kirill Markin - Consultant and Software Architect",
    description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
    images: ['/avatars/Kirill-Markin.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/',
  },
};

export default function Home() {
  return (
    <div className={styles.mainPageContent}>
      <div className={styles.leftColumn}>
        <PersonalInfo />
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.articles}>
          <h2 className={styles.articlesHeading}>
            Article<span className={styles.glitchLetter}>s</span> and mention<span className={styles.glitchLetter}>s</span>
          </h2>

          <div className={styles.mediaMentions}>
            {mediaMentions.map((mention, index) => {
              const isLarge = index === 0 || index === 5;
              const isVideo = mention.isVideo || mention.type.toLowerCase() === 'video';
              const displayTitle = mention.language === 'en' ? mention.title : (mention.alternativeTitle || mention.title);
              
              return (
                <a 
                  key={index}
                  href={mention.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.mediaMention} ${isLarge ? styles.wide : ''} ${isVideo ? styles.video : ''} ${isLarge ? styles.wideWithThumbnail : ''}`}
                >
                  <div className={styles.language}>
                    <div className={styles.text}>[{mention.language}]</div>
                  </div>
                  
                  {mention.type && (
                    <div className={styles.type}>
                      <div className={styles.text}>[{mention.type}]</div>
                    </div>
                  )}
                  
                  <div className={styles.thumbnailContainer}>
                    <Image 
                      className={styles.thumbnail} 
                      src={mention.thumbnailUrl || PLACEHOLDER_IMAGE} 
                      alt={displayTitle} 
                      width={640} 
                      height={360} 
                      priority={index < 4}
                    />
                  </div>
                  
                  <div className={styles.content}>
                    <div className={styles.title}>{displayTitle}</div>
                    {mention.description && isLarge && (
                      <div className={styles.description}>{mention.description}</div>
                    )}
                    
                    {mention.websiteLogoUrl && (
                      <div className={styles.footer}>
                        <div className={styles.divider} />
                        <div className={styles.logoContainer}>
                          <Image 
                            className={styles.logo} 
                            src={mention.websiteLogoUrl || PLACEHOLDER_IMAGE} 
                            alt="Website Logo" 
                            width={100} 
                            height={25} 
                          />
                          {mention.achievementValue && (
                            <div className={styles.achievement}>
                              <div className={styles.value}>{mention.achievementValue}</div>
                              {mention.achievementLabel && (
                                <div className={styles.label}>{mention.achievementLabel}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

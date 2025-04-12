import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { personalInfo } from '../data/personalInfo';
import { socialLinks } from '../data/socialLinks';
import { mediaMentions } from '../data/mediaMentions';

export default function Home() {
  return (
    <div className={styles.mainPageContent}>
      <div className={styles.leftColumn}>
        <div className={styles.personalInfo}>
          <h1 className={styles.personalName} data-text={personalInfo.name}>
            {personalInfo.name}
          </h1>
        </div>
        <div className={styles.personalContacts}>
          <div className={styles.avatarAndTitles}>
            <div className={styles.profileImageContainer}>
              <Image 
                src={personalInfo.image} 
                alt={`Picture of ${personalInfo.name}`} 
                className={styles.profileImage} 
                width={300} 
                height={300} 
                priority
              />
            </div>
            <div className={styles.personalTitles}>
              <p className={styles.mainTitle}>{personalInfo.jobTitle}</p>
              <p className={styles.secondaryTitle}>{personalInfo.secondaryTitle}</p>
              <p className={styles.tertiaryTitle}>{personalInfo.tertiaryTitle}</p>
            </div>
          </div>
          <div className={styles.contactBubbles}>
            {socialLinks
              .filter(link => link.avatarContact)
              .map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.contactBubble}
                >
                  {link.socialLogoUrlDefault && (
                    <span className={styles.contactLogo}>
                      <Image 
                        src={link.socialLogoUrlDefault} 
                        alt={`${link.name} logo`} 
                        className={styles.socialLogo}
                        width={24}
                        height={24}
                      />
                    </span>
                  )}
                  <span className={styles.contactUsername}>{link.username}</span>
                </a>
              ))
            }
          </div>
        </div>
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
                  className={`${styles.mediaMention} ${isLarge ? styles.wide : ''} ${isVideo ? styles.video : ''}`}
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
                      src={mention.thumbnailUrl} 
                      alt={displayTitle} 
                      width={640} 
                      height={360} 
                    />
                  </div>
                  
                  <div className={styles.content}>
                    <div className={styles.title}>{displayTitle}</div>
                    {mention.description && isLarge && (
                      <div className={styles.description}>{mention.description}</div>
                    )}
                    
                    {mention.websiteLogoUrl && (
                      <div className={styles.footer}>
                        <hr className={styles.divider} />
                        <div className={styles.logoContainer}>
                          <Image 
                            className={styles.logo} 
                            src={mention.websiteLogoUrl} 
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

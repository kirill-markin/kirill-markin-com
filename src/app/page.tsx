import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';

// This would normally be fetched from the CMS or API
const personalInfo = {
  name: 'Kirill Markin',
  job_title: 'Consultant at OZMA.IO',
  secondary_title: 'Senior Software Architect',
  tertiary_title: 'Tech Consultant',
  image: '/images/Kirill-Markin.webp'
};

// Mock social links data
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/username', avatar_contact: true, social_logo_url_default: '/images/github.svg', username: '@username' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/username', avatar_contact: true, social_logo_url_default: '/images/linkedin.svg', username: 'Kirill Markin' },
  { name: 'Twitter', url: 'https://twitter.com/username', avatar_contact: true, social_logo_url_default: '/images/twitter.svg', username: '@username' },
  // Add more social links as needed
];

// Mock media mentions data
const mediaMentions = [
  {
    title: 'How to Build Scalable Applications with Next.js',
    url: 'https://example.com/article1',
    language: 'en',
    thumbnail_url: '/images/articles_thumbnails/article1.png',
    description: 'Kirill shares insights on building scalable web applications with Next.js and React.',
    website_logo_url: '/images/website_logos/medium.svg',
    type: 'article'
  },
  {
    title: 'Software Architecture Best Practices',
    url: 'https://example.com/article2',
    language: 'en',
    thumbnail_url: '/images/articles_thumbnails/article2.png',
    website_logo_url: '/images/website_logos/dev-to.svg',
    type: 'tutorial'
  },
  // Add more media mentions as needed
];

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
              <p className={styles.mainTitle}>{personalInfo.job_title}</p>
              <p className={styles.secondaryTitle}>{personalInfo.secondary_title}</p>
              <p className={styles.tertiaryTitle}>{personalInfo.tertiary_title}</p>
            </div>
          </div>
          <div className={styles.contactBubbles}>
            {socialLinks
              .filter(link => link.avatar_contact)
              .map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.contactBubble}
                >
                  {link.social_logo_url_default && (
                    <span className={styles.contactLogo}>
                      <Image 
                        src={link.social_logo_url_default} 
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
              const isVideo = mention.type === 'video';
              
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
                      src={mention.thumbnail_url} 
                      alt={mention.title} 
                      width={640} 
                      height={360} 
                    />
                  </div>
                  
                  <div className={styles.content}>
                    <div className={styles.title}>{mention.title}</div>
                    {mention.description && isLarge && (
                      <div className={styles.description}>{mention.description}</div>
                    )}
                    
                    {mention.website_logo_url && (
                      <div className={styles.footer}>
                        <hr className={styles.divider} />
                        <div className={styles.logoContainer}>
                          <Image 
                            className={styles.logo} 
                            src={mention.website_logo_url} 
                            alt="Website Logo" 
                            width={100} 
                            height={25} 
                          />
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

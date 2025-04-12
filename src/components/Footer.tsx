import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { personalInfo } from '../data/personalInfo';
import { socialLinks } from '../data/socialLinks';

const Footer: React.FC = () => {
  const renderJobTitle = (title: string): { __html: string } => {
    return {
      __html: title.replace('ozma.io', `<span class="${styles.ozmaAsTitleFooter}">ozma.io</span>`)
    };
  };

  return (
    <div className={styles.footer}>
      <div className={styles.footerColumnContainer}>
        <div className={`${styles.rightColumn} ${styles.singleColumn}`}>
          <div className={styles.footerTopSection}>
            <h2 className={`${styles.footerOrgName} ${styles.leftAligned}`}>{personalInfo.name}</h2>
            <hr className={styles.footerWhiteLine} />
          </div>
          
          <div className={styles.footerMainContent}>
            <div className={styles.footerRolesSection}>
              <div className={styles.footerPersonalTitles}>
                <p 
                  className={styles.mainTitleFooter}
                  dangerouslySetInnerHTML={renderJobTitle(personalInfo.jobTitle)}
                />
                <p className={styles.secondaryTitleFooter}>{personalInfo.secondaryTitle}</p>
                <p className={styles.tertiaryTitleFooter}>{personalInfo.tertiaryTitle}</p>
              </div>
              
              <div className={styles.footerCta}>
                <div className={styles.questionButton}>
                  <Link href="/meet/short" className={styles.footerButton} rel="noopener noreferrer">
                    Talk to Kirill
                  </Link>
                </div>
              </div>
            </div>
            
            <div className={styles.footerLinksWrapper}>
              <div className={styles.footerOrgInfo}>
                <div className={styles.footerOrgContactInfo}>
                  <h3>Contact</h3>
                  <a href={`mailto:${personalInfo.email}`} className={styles.footerEmail}>
                    <Image src="/images/email.svg" alt="Email icon" className={styles.footerIcon} width={16} height={16} />
                    {personalInfo.email}
                  </a>
                  <a href={`tel:${personalInfo.phone}`} className={styles.footerPhone}>
                    <Image src="/images/phone.svg" alt="Phone icon" className={styles.footerIcon} width={16} height={16} />
                    {personalInfo.phone}
                  </a>
                </div>
                
                <div className={styles.footerOrgMoreInfo}>
                  <h3>Social</h3>
                  {socialLinks
                    .filter(link => ['GitHub', 'LinkedIn', 'Twitter', 'Facebook', 'Instagram'].includes(link.name))
                    .map((link, index) => (
                      <a 
                        key={index}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.footerLink}
                      >
                        {link.name}
                      </a>
                    ))
                  }
                </div>

                <div className={styles.footerOrgMedia}>
                  <h3>Media</h3>
                  {socialLinks
                    .filter(link => ['Blog', 'Medium', 'YouTube', 'Reddit', 'Product Hunt', 'IndieHackers'].includes(link.name))
                    .map((link, index) => (
                      <a 
                        key={index}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.footerLink}
                      >
                        {link.name}
                      </a>
                    ))
                  }
                </div>

                <div className={styles.footerOrgOther}>
                  <h3>Other</h3>
                  {socialLinks
                    .filter(link => ['Telegram', 'WhatsApp', 'GitLab', 'Bluesky', 'Email'].includes(link.name))
                    .map((link, index) => (
                      <a 
                        key={index}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.footerLink}
                      >
                        {link.name}
                      </a>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.socialMediaLine}>
        <div className={styles.socialLinks}>
          {socialLinks
            .filter(link => link.footerBottomGreenLine)
            .map((link, index) => (
              <a 
                key={index}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
              >
                <Image 
                  src={link.socialLogoUrlDefault || '/images/social_logos/default.png'} 
                  alt={link.name} 
                  className={styles.iconDefault}
                  width={24}
                  height={24}
                />
                {link.socialLogoUrlHover && (
                  <Image 
                    src={link.socialLogoUrlHover} 
                    alt={link.name} 
                    className={styles.iconHover}
                    width={24}
                    height={24}
                  />
                )}
              </a>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Footer; 
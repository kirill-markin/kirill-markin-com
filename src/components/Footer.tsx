import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { personalInfo } from '../data/personalInfo';
import { socialLinks } from '../data/socialLinks';
import LanguageSwitcher from './LanguageSwitcher';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, getSubPathSegmentByLanguage } from '@/lib/localization';
import { Translation } from '@/types/article';

interface FooterProps {
  language?: string;
  currentPath: string;
  translations?: Translation[];
}

const Footer: React.FC<FooterProps> = ({
  language = DEFAULT_LANGUAGE,
  currentPath,
  translations
}) => {
  const renderJobTitle = (title: string): { __html: string } => {
    return {
      __html: title
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
                  <Link
                    href={language === DEFAULT_LANGUAGE
                      ? "/meet/short/"
                      : `/${language}/${getPathSegmentByLanguage('meet', language)}/${getSubPathSegmentByLanguage('meet', 'short', language)}/`}
                    className={styles.footerButton}
                    rel="noopener noreferrer"
                  >
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
                    <Image src="/icons/email.svg" alt="Email icon" className={styles.footerIcon} width={16} height={16} />
                    {personalInfo.email}
                  </a>
                  <a href={`tel:${personalInfo.phone}`} className={styles.footerPhone}>
                    <Image src="/icons/phone.svg" alt="Phone icon" className={styles.footerIcon} width={16} height={16} />
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
            .filter(link => (link.footerBottomGreenLine || link.name === "WhatsApp" || link.name === "Telegram" || link.name === "Instagram" || link.name === "Email" || link.name === "Medium" || link.name === "Twitter" || link.name === "Reddit" || link.name === "Bluesky") && link.socialLogoUrlDefault)
            .map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Image
                  src={link.socialLogoUrlDefault || '/social/default.png'}
                  alt={link.name}
                  className={styles.iconDefault}
                  width={36}
                  height={36}
                />
                {link.socialLogoUrlHover && (
                  <Image
                    src={link.socialLogoUrlHover}
                    alt={link.name}
                    className={styles.iconHover}
                    width={36}
                    height={36}
                  />
                )}
              </a>
            ))
          }
        </div>
      </div>

      {/* Language switcher at the bottom of the footer */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Kirill Markin
        </div>
        <LanguageSwitcher
          currentLanguage={language}
          currentPath={currentPath}
          translations={translations}
          className={styles.footerLanguageSwitcher}
        />
      </div>
    </div>
  );
};

export default Footer; 
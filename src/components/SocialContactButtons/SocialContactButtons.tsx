import React from 'react';
import Image from 'next/image';
import { socialLinks } from '../../data/socialLinks';
import styles from './SocialContactButtons.module.css';

interface SocialContactButtonsProps {
  variant?: 'horizontal' | 'vertical';
  showLabels?: boolean;
}

export const SocialContactButtons: React.FC<SocialContactButtonsProps> = ({
  variant = 'horizontal',
  showLabels = true
}) => {
  // Filter social links that should be shown as contact buttons
  const contactLinks = socialLinks.filter(link =>
    link.avatarContact &&
    link.socialLogoUrlDefault &&
    typeof link.socialLogoUrlDefault === 'string'
  );

  return (
    <div className={`${styles.socialContactButtons} ${styles[variant]}`}>
      {contactLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialButton}
          aria-label={link.name}
        >
          <div className={styles.iconWrapper}>
            <Image
              src={link.socialLogoUrlDefault as string}
              alt={`${link.name} logo`}
              className={styles.icon}
              width={24}
              height={24}
            />
          </div>

          {showLabels && (
            <span className={styles.label}>{link.username}</span>
          )}

          {/* Add LinkedIn followers badge */}
          {link.name === 'LinkedIn' && (
            <div className={styles.achievement}>
              <div className={styles.value}>6,000+</div>
              <div className={styles.label}>followers</div>
            </div>
          )}

          {/* Add CV experience badge */}
          {link.name === 'CV' && (
            <div className={styles.achievement}>
              <div className={styles.value}>12+</div>
              <div className={styles.label}>years</div>
            </div>
          )}

          {/* Add YouTube subscribers badge */}
          {link.name === 'YouTube' && (
            <div className={styles.achievement}>
              <div className={styles.value}>170+</div>
              <div className={styles.label}>subscribers</div>
            </div>
          )}

          {/* Add GitHub repositories badge */}
          {link.name === 'GitHub' && (
            <div className={styles.achievement}>
              <div className={styles.value}>35+</div>
              <div className={styles.label}>repos</div>
            </div>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialContactButtons; 
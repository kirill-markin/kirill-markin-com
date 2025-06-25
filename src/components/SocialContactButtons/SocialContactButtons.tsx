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
          style={link.hidden ? { display: 'none' } : undefined}
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

          {/* Add achievement badge if present */}
          {link.achievement && (
            <div className={styles.achievement}>
              <div className={styles.value}>{link.achievement.value}</div>
              <div className={styles.label}>{link.achievement.label}</div>
            </div>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialContactButtons; 
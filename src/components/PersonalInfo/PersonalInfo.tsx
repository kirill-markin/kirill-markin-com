"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './PersonalInfo.module.css';
import { personalInfo } from '../../data/personalInfo';
import { additionalFacts, fillAdditionalFactTemplate } from '../../data/additionalFacts';
import SocialContactButtons from '../SocialContactButtons';
import { DEFAULT_LANGUAGE, getTranslation } from '@/lib/localization';

interface PersonalInfoProps {
  showContactButtons?: boolean;
  language?: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  showContactButtons = true,
  language = DEFAULT_LANGUAGE
}) => {
  // Get personal info translations
  const personalInfoTranslations = getTranslation('personalInfo', language);

  // State to track which image to show (false = angel, true = devil)
  const [showDevil, setShowDevil] = useState(false);
  // Track hover state
  const [isHovering, setIsHovering] = useState(false);
  // Track if this is first hover
  const isFirstHover = useRef(true);

  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovering(true);

    if (isFirstHover.current) {
      // First hover always shows angel
      setShowDevil(false);
      isFirstHover.current = false;
    } else {
      // Subsequent hovers alternate between angel and devil
      setShowDevil(prev => !prev);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={styles.personalInfoContainer}>
      <div className={styles.personalInfo}>
        <h2 className={styles.personalName} data-text={personalInfo.name}>
          {personalInfo.name}
        </h2>
        <div className={styles.nameUnderline}></div>
      </div>
      <div className={styles.personalContacts}>
        <div className={styles.avatarAndTitles}>
          <div
            className={styles.profileImageContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={personalInfo.image}
              alt={`Picture of ${personalInfo.name}`}
              className={`${styles.profileImage} ${styles.mainImage}`}
              width={300}
              height={300}
              sizes="(max-width: 768px) 150px, 300px"
              quality={75}
              priority
            />
            <Image
              src="/avatars/kirill-angel.webp"
              alt="Angel effect"
              className={`${styles.profileImage} ${styles.angelImage} ${isHovering && !showDevil ? styles.activeEffect : ''}`}
              width={300}
              height={300}
              sizes="(max-width: 768px) 150px, 300px"
              quality={75}
            />
            <Image
              src="/avatars/kirill-devil.webp"
              alt="Devil effect"
              className={`${styles.profileImage} ${styles.devilImage} ${isHovering && showDevil ? styles.activeEffect : ''}`}
              width={300}
              height={300}
              sizes="(max-width: 768px) 150px, 300px"
              quality={75}
            />
          </div>
          <div className={styles.personalTitles}>
            <p className={styles.mainTitle}>
              {personalInfoTranslations.jobTitle}, {personalInfoTranslations.secondaryTitle}
            </p>
          </div>
        </div>

        {showContactButtons && (
          <div className={styles.contactButtonsContainer}>
            <SocialContactButtons variant="horizontal" showLabels={true} />
          </div>
        )}

        <section className={styles.additionalFacts}>
          <h3 className={styles.additionalFactsTitle}>
            {personalInfoTranslations.additionalFactsTitle}
          </h3>
          <ul className={styles.additionalFactsList}>
            {additionalFacts.map((fact) => (
              <li key={fact.links.map(link => link.name).join('|')} className={styles.additionalFact}>
                {fillAdditionalFactTemplate(
                  personalInfoTranslations.additionalFactTemplates[fact.kind],
                  fact.links.map(link => link.url ? (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener"
                      className={styles.additionalFactLink}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <span key={link.name}>{link.name}</span>
                  )),
                  personalInfoTranslations.additionalFactsConjunction
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PersonalInfo; 

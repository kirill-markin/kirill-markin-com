"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './PersonalInfo.module.css';
import { personalInfo } from '../../data/personalInfo';
import SocialContactButtons from '../SocialContactButtons';

interface PersonalInfoProps {
  showContactButtons?: boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  showContactButtons = true
}) => {
  // State to track the toggle between angel and devil images
  const [toggleState, setToggleState] = useState(false);
  
  const handleToggle = () => {
    setToggleState(prev => !prev);
  };

  return (
    <div className={styles.personalInfoContainer}>
      <div className={styles.personalInfo}>
        <h1 className={styles.personalName} data-text={personalInfo.name}>
          {personalInfo.name}
        </h1>
        <div className={styles.nameUnderline}></div>
      </div>
      <div className={styles.personalContacts}>
        <div className={styles.avatarAndTitles}>
          <div className={styles.profileImageContainer}>
            <div className={styles.toggleTrigger} onClick={handleToggle}></div>
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
              className={`${styles.profileImage} ${styles.angelImage} ${!toggleState ? styles.activeEffect : ''}`}
              width={300}
              height={300}
              sizes="(max-width: 768px) 150px, 300px"
              quality={75}
            />
            <Image
              src="/avatars/kirill-devil.webp"
              alt="Devil effect"
              className={`${styles.profileImage} ${styles.devilImage} ${toggleState ? styles.activeEffect : ''}`}
              width={300}
              height={300}
              sizes="(max-width: 768px) 150px, 300px"
              quality={75}
            />
          </div>
          <div className={styles.personalTitles}>
            <p className={styles.mainTitle}>{personalInfo.jobTitle}</p>
            <p className={styles.secondaryTitle}>{personalInfo.secondaryTitle}</p>
            <p className={styles.tertiaryTitle}>{personalInfo.tertiaryTitle}</p>
          </div>
        </div>

        {showContactButtons && (
          <div className={styles.contactButtonsContainer}>
            <SocialContactButtons variant="horizontal" showLabels={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo; 
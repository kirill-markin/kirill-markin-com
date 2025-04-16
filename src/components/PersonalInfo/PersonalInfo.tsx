import React from 'react';
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
            <Image
              src={personalInfo.image}
              alt={`Picture of ${personalInfo.name}`}
              className={styles.profileImage}
              width={300}
              height={300}
              sizes="(max-width: 768px) 150px, 300px"
              quality={75}
              priority
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
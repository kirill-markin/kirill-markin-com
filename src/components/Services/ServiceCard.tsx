'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ServiceData } from '@/types/services';
import styles from './Services.module.css';

interface ServiceCardProps {
  service: ServiceData;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getFirstParagraph = (description: string): string => {
    return description.split('\n\n')[0];
  };

  const formattedCategory = service.categoryId.replace('for_', '').charAt(0).toUpperCase() + service.categoryId.replace('for_', '').slice(1);
  
  const isExternalLink = service.buttonUrl.startsWith('http://') || service.buttonUrl.startsWith('https://');
  
  return (
    <Link href={service.buttonUrl} 
          className={styles.serviceCard} 
          data-category={service.categoryId}
          target={isExternalLink ? '_blank' : undefined}>
      <div className={styles.serviceCardCategory}>
        <span className={styles.currentCategory}>{formattedCategory}</span>
      </div>
      <div className={styles.serviceCardImage}>
        {service.logoUrl ? (
          <Image 
            src={service.logoUrl} 
            alt={service.name} 
            className={styles.serviceImage}
            width={600}
            height={338}
            priority
          />
        ) : (
          <Image 
            src="/services/default.png" 
            alt={service.name} 
            className={styles.serviceImage}
            width={600}
            height={338}
            priority
          />
        )}
      </div>
      <div className={styles.serviceCardContent}>
        <h3>{service.name}</h3>
        <div className={styles.serviceDescription}>
          <div className={styles.serviceShortDescription}>
            <p>{getFirstParagraph(service.description)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard; 
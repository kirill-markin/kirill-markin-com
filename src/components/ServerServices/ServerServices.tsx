import Image from 'next/image';
import Link from 'next/link';
import { ServiceData } from '@/types/services';
import styles from '../Services/Services.module.css';

interface ServerServicesProps {
  services: ServiceData[];
  currentCategory: string;
}

// Server component for ServiceCard
function ServerServiceCard({ service }: { service: ServiceData }) {
  const getFirstParagraph = (description: string): string => {
    return description.split('\n\n')[0];
  };

  const formattedCategory = service.categoryId.charAt(0).toUpperCase() + service.categoryId.slice(1);
  
  const isExternalLink = service.buttonUrl.startsWith('http://') || service.buttonUrl.startsWith('https://');
  
  return (
    <article className={styles.serviceCard} data-category={service.categoryId}>
      <Link href={service.buttonUrl} 
            className={styles.serviceCardLink}
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
    </article>
  );
}

// Main server component
export default function ServerServices({ services, currentCategory }: ServerServicesProps) {
  // Extract unique categories from services
  const categories = Array.from(
    new Set(services.map(service => service.categoryId))
  ).filter(category => category !== 'all');
  
  // Filter services based on current category
  const filteredServices = currentCategory === 'all' 
    ? services 
    : services.filter(service => service.categoryId === currentCategory);
  
  return (
    <section className={styles.services}>
      <div className={styles.servicesHeader}>
        <div className={styles.servicesHeaderTitle}>
          <h1 className={styles.servicesTitle}>
            Service<span className={styles.glitchLetter}>s</span>
          </h1>
        </div>
        <Link href="/" className={styles.servicesBackButton}>
          <Image src="/icons/arrow.svg" alt="Arrow icon" className={styles.arrowIcon} width={14} height={14} />
          <span>Back to main</span>
        </Link>
      </div>
      
      <nav className={styles.servicesMenu} aria-label="Service categories">
        <span>Categories</span>
        <div className={styles.servicesMenuCategories}>
          <Link 
            href="/services"
            className={`${styles.servicesMenuCategory} ${currentCategory === 'all' ? styles.active : ''}`}
          >
            All
          </Link>
          
          {categories.map(category => (
            <Link 
              key={category}
              href={`/services?category=${category}`}
              className={`${styles.servicesMenuCategory} ${currentCategory === category ? styles.active : ''}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </div>
      </nav>
      
      <ul className={styles.servicesList}>
        {filteredServices.map(service => (
          <li key={service.serviceId}>
            <ServerServiceCard service={service} />
          </li>
        ))}
      </ul>
    </section>
  );
} 
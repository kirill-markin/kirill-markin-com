'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ServiceData } from '@/types/services';
import ServiceCard from './ServiceCard';
import styles from './Services.module.css';

interface ServicesProps {
  services: ServiceData[];
}

const Services: React.FC<ServicesProps> = ({ services }) => {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Extract unique categories from services
  const categories = Array.from(
    new Set(services.map(service => service.categoryId))
  ).filter(category => category !== 'for_all');
  
  // Filter services based on active category
  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.categoryId === activeCategory);
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  // Check URL parameters on component mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);
  
  return (
    <section className={styles.services}>
      <div className={styles.servicesHeader}>
        <div className={styles.servicesHeaderTitle}>
          <h1 className={styles.servicesTitle}>
            Service<span className={styles.glitchLetter}>s</span>
          </h1>
        </div>
      </div>
      
      <nav className={styles.servicesMenu} aria-label="Service categories">
        <span>Categories</span>
        <div className={styles.servicesMenuCategories}>
          <button 
            className={`${styles.servicesMenuCategory} ${activeCategory === 'all' ? styles.active : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          
          {categories.map(category => (
            <button 
              key={category}
              className={`${styles.servicesMenuCategory} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.replace('for_', '').charAt(0).toUpperCase() + category.replace('for_', '').slice(1)}
            </button>
          ))}
        </div>
      </nav>
      
      <ul className={styles.servicesList}>
        {filteredServices.map(service => (
          <li key={service.serviceId}>
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Services; 
'use client';

import { ServiceOtherData } from '@/types/services';
import ServicesOtherGrid from './ServicesOtherGrid';
import styles from './ServicesOtherSection.module.css';

interface ServicesOtherSectionProps {
    services: ServiceOtherData[];
    currentCategory: string;
    language: string;
}

const ServicesOtherSection: React.FC<ServicesOtherSectionProps> = ({
    services,
    currentCategory,
    language
}) => {
    return (
        <section className={styles.servicesOtherSection}>
            <ServicesOtherGrid
                services={services}
                currentCategory={currentCategory}
                language={language}
            />
        </section>
    );
};

export default ServicesOtherSection; 
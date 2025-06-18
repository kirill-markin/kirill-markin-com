'use client';

import { ServiceFractionalCTOData } from '@/types/services';
import FractionalCTOPricingPlans from './FractionalCTOPricingPlans';
import styles from './ServicesFractionalCTOSection.module.css';

interface ServicesFractionalCTOSectionProps {
    data: ServiceFractionalCTOData;
}

const ServicesFractionalCTOSection: React.FC<ServicesFractionalCTOSectionProps> = ({ data }) => {
    return (
        <section className={styles.fractionalCTOSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    Fractional CT<span className={styles.glitchLetter}>O</span>
                </h2>
                <div className={styles.sectionDescription}>
                    <p>{data.description}</p>
                </div>
            </div>

            <FractionalCTOPricingPlans
                plans={data.plans}
                subtitle={data.subtitle}
            />
        </section>
    );
};

export default ServicesFractionalCTOSection; 
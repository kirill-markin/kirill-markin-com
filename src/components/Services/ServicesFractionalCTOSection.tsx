'use client';

import { ServiceFractionalCTOData } from '@/types/services';
import FractionalCTOPricingPlans, { FractionalCTOHeader } from './FractionalCTOPricingPlans';
import styles from './ServicesFractionalCTOSection.module.css';

interface ServicesFractionalCTOSectionProps {
    data: ServiceFractionalCTOData;
    isStandalonePage?: boolean;
}

const ServicesFractionalCTOSection: React.FC<ServicesFractionalCTOSectionProps> = ({ data, isStandalonePage = false }) => {
    const headingLevel = isStandalonePage ? 'h1' : 'h2';

    return (
        <section className={styles.fractionalCTOSection}>
            <FractionalCTOHeader
                data={data}
                isStandalonePage={isStandalonePage}
                headingLevel={headingLevel}
            />
            <FractionalCTOPricingPlans plans={data.plans} />
        </section>
    );
};

export default ServicesFractionalCTOSection; 
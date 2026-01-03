'use client';

import { ServiceFractionalCTOData } from '@/types/services';
import FractionalCTOPricingPlans, { FractionalCTOHeader } from './FractionalCTOPricingPlans';
import styles from './ServicesFractionalCTOSection.module.css';

interface ServicesFractionalCTOSectionProps {
    data: ServiceFractionalCTOData;
    isStandalonePage?: boolean;
    ariaLabel?: string;
}

const ServicesFractionalCTOSection: React.FC<ServicesFractionalCTOSectionProps> = ({ data, isStandalonePage = false, ariaLabel }) => {
    const headingLevel = isStandalonePage ? 'h1' : 'h2';

    return (
        <section className={styles.fractionalCTOSection} aria-label={ariaLabel}>
            <FractionalCTOHeader
                data={data}
                isStandalonePage={isStandalonePage}
                headingLevel={headingLevel}
            />
            <FractionalCTOPricingPlans plans={data.plans} serviceType={data.serviceType} />
        </section>
    );
};

export default ServicesFractionalCTOSection; 
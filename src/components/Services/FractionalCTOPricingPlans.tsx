'use client';

import Link from 'next/link';
import { ServiceFractionalCTOData, ServiceType } from '@/types/services';
import PricingCard from './PricingCard';
import styles from './FractionalCTOPricingPlans.module.css';

interface FractionalCTOPricingPlansProps {
    plans: ServiceFractionalCTOData['plans'];
    serviceType: ServiceType;
}

const FractionalCTOPricingPlans: React.FC<FractionalCTOPricingPlansProps> = ({ plans, serviceType }) => {
    return (
        <div className={styles.pricingPlans}>
            {plans.map((plan) => (
                <PricingCard key={plan.planId} plan={plan} serviceType={serviceType} />
            ))}
        </div>
    );
};

// Отдельный компонент для заголовка с ссылкой
interface FractionalCTOHeaderProps {
    data: ServiceFractionalCTOData;
    isStandalonePage?: boolean;
    headingLevel?: 'h1' | 'h2';
}

export const FractionalCTOHeader: React.FC<FractionalCTOHeaderProps> = ({
    data,
    isStandalonePage = false,
    headingLevel = 'h2'
}) => {
    const TitleTag = headingLevel;

    return (
        <div className={styles.sectionHeader}>
            {isStandalonePage ? (
                <TitleTag className={styles.sectionTitle}>
                    {data.title}
                </TitleTag>
            ) : (
                <TitleTag className={styles.sectionTitle}>
                    <Link href="/services/fractional-ai-cto-kirill-markin/" className={styles.titleLink}>
                        {data.title}
                    </Link>
                </TitleTag>
            )}
            <div className={styles.sectionDescription}>
                <p>{data.description}</p>
            </div>
        </div>
    );
};

export default FractionalCTOPricingPlans; 
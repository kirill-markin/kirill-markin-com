'use client';

import { ServiceFractionalCTOPlan } from '@/types/services';
import PricingCard from './PricingCard';
import styles from './FractionalCTOPricingPlans.module.css';

interface FractionalCTOPricingPlansProps {
    plans: ServiceFractionalCTOPlan[];
    subtitle?: string;
}

const FractionalCTOPricingPlans: React.FC<FractionalCTOPricingPlansProps> = ({
    plans,
    subtitle
}) => {
    return (
        <div className={styles.pricingPlansContainer}>
            {subtitle && (
                <div className={styles.subtitle}>
                    <p>{subtitle}</p>
                </div>
            )}

            <div className={styles.pricingGrid}>
                {plans.map(plan => (
                    <PricingCard key={plan.planId} plan={plan} />
                ))}
            </div>
        </div>
    );
};

export default FractionalCTOPricingPlans; 
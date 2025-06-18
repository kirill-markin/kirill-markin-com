'use client';

import { ServiceFractionalCTOPlan } from '@/types/services';
import styles from './PricingCard.module.css';

interface PricingCardProps {
    plan: ServiceFractionalCTOPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
    return (
        <div className={`${styles.pricingCard} ${plan.highlighted ? styles.highlighted : ''}`}>
            {plan.highlighted && (
                <div className={styles.highlightedBadge}>
                    Recommended
                </div>
            )}

            <div className={styles.pricingHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.priceContainer}>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.hours}>{plan.hours}</span>
                </div>
            </div>

            <div className={styles.featuresContainer}>
                <ul className={styles.featuresList}>
                    {plan.features.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                            <span className={styles.checkmark}>✓</span>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.cardAction}>
                <a
                    href={plan.buttonUrl}
                    className={`${styles.actionButton} ${plan.highlighted ? styles.highlightedButton : ''}`}
                >
                    {plan.buttonText}
                </a>
            </div>
        </div>
    );
};

export default PricingCard; 
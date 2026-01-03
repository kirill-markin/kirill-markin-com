'use client';

import { ServiceFractionalCTOPlan, ServiceType } from '@/types/services';
import { trackEvent } from '@/lib/analytics';
import styles from './PricingCard.module.css';

interface PricingCardProps {
    plan: ServiceFractionalCTOPlan;
    serviceType: ServiceType;
}

const CheckIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="16"
        height="16"
        className={styles.checkIcon}
    >
        <path
            d="m56,18.24l-30,30L8,30.24l4.24-4.24,13.76,13.76,25.76-25.76,4.24,4.24Z"
            fill="currentColor"
        />
    </svg>
);

const PricingCard: React.FC<PricingCardProps> = ({ plan, serviceType }) => {
    return (
        <div className={`${styles.pricingCard} ${plan.highlighted ? styles.highlighted : ''} ${plan.soldOut ? styles.soldOut : ''}`}>
            {plan.highlighted && (
                <div className={styles.highlightedBadge}>
                    Recommended
                </div>
            )}

            {plan.soldOut && (
                <div className={styles.soldOutBanner}>
                    <div className={styles.soldOutMainText}>{plan.soldOutMainText}</div>
                    <div className={styles.soldOutAdditionalText}>{plan.soldOutAdditionalText}</div>
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
                            <CheckIcon />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.cardAction}>
                <a
                    href={plan.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionButton} ${plan.highlighted ? styles.highlightedButton : ''}`}
                    onClick={() => {
                        trackEvent('service_click', {
                            service_type: serviceType,
                            plan_id: plan.planId,
                            target: 'cta_button'
                        });
                    }}
                >
                    {plan.buttonText}
                </a>
            </div>
        </div>
    );
};

export default PricingCard; 
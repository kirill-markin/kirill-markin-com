'use client';

import Image from 'next/image';
import { ServiceFractionalCTOPlan } from '@/types/services';
import styles from './PricingCard.module.css';

interface PricingCardProps {
    plan: ServiceFractionalCTOPlan;
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
                            <CheckIcon />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.cardAction}>
                {plan.socialButtons ? (
                    <div className={styles.socialButtons}>
                        {plan.socialButtons.map((socialButton, index) => (
                            <a
                                key={index}
                                href={socialButton.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialButton}
                                aria-label={socialButton.name}
                            >
                                <div className={styles.iconWrapper}>
                                    <Image
                                        src={socialButton.icon}
                                        alt={`${socialButton.name} logo`}
                                        className={styles.icon}
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <span className={styles.label}>{socialButton.username}</span>
                            </a>
                        ))}
                    </div>
                ) : (
                    <a
                        href={plan.buttonUrl}
                        className={`${styles.actionButton} ${plan.highlighted ? styles.highlightedButton : ''}`}
                    >
                        {plan.buttonText}
                    </a>
                )}
            </div>
        </div>
    );
};

export default PricingCard; 
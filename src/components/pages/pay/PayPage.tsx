import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/pay/page.module.css';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, getSubPathSegmentByLanguage, getTranslation } from '@/lib/localization';

interface PayPageProps {
    language?: string;
}

export default function PayPage({ language = DEFAULT_LANGUAGE }: PayPageProps) {
    // Get translated texts
    const translations = getTranslation('pay', language);

    // Get localized path for the stripe sub-segment
    const stripePath = language === DEFAULT_LANGUAGE
        ? '/pay/stripe/'
        : `/${language}/${getPathSegmentByLanguage('pay', language)}/${getSubPathSegmentByLanguage('pay', 'stripe', language)}/`;

    return (
        <section className={styles.paymentOptionsContainer}>
            <h1>{translations.title}</h1>
            <p>{translations.description}</p>

            <div className={styles.paymentMethods}>
                <Link href={stripePath} className={styles.paymentMethod}>
                    <div className={styles.paymentMethodLogo}>
                        <Image
                            src="/icons/payment/stripe-logo.svg"
                            alt="Stripe Payment"
                            className={styles.stripeLogo}
                            width={60}
                            height={40}
                        />
                    </div>
                    <div className={styles.paymentMethodDetails}>
                        <h2>{translations.stripe.title}</h2>
                        <p>{translations.stripe.description}</p>
                    </div>
                </Link>
            </div>
        </section>
    );
} 
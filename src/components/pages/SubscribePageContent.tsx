'use client';

import { useState, useEffect } from 'react';
import styles from './SubscribePageContent.module.css';
import { DEFAULT_LANGUAGE, getTranslation } from '@/lib/localization';
import { trackEvent } from '@/lib/analytics';
import Footer from '@/components/Footer';
import { EMAIL_REGEX, EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH } from '@/lib/popupConstants';

interface SubscribePageContentProps {
    language?: string;
}

export default function SubscribePageContent({ language = DEFAULT_LANGUAGE }: SubscribePageContentProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Get translated texts
    const translations = getTranslation('subscribe', language);

    // Track page view for subscription form
    useEffect(() => {
        trackEvent('email_subscribe_page_shown');
    }, []);

    const validateEmail = (email: string): boolean => {
        const trimmedEmail = email.trim();
        return (
            trimmedEmail.length >= EMAIL_MIN_LENGTH &&
            trimmedEmail.length <= EMAIL_MAX_LENGTH &&
            EMAIL_REGEX.test(trimmedEmail)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage({
                type: 'error',
                text: translations.form.validationError
            });
            trackEvent('email_validation_failed');
            return;
        }

        if (!validateEmail(email)) {
            setMessage({
                type: 'error',
                text: translations.form.validationError
            });
            trackEvent('email_validation_failed');
            return;
        }

        trackEvent('email_validation_passed');

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: translations.form.successMessage
                });
                setEmail('');
                trackEvent('email_subscription_success');
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setMessage({
                type: 'error',
                text: translations.form.errorMessage
            });
            trackEvent('email_subscription_failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.fullWidthColumn}>
                        <div className={styles.subscribeContainer}>
                            <div className={styles.subscribeContent}>
                                <h1 className={styles.title}>{translations.title}</h1>
                                <p className={styles.description}>{translations.description}</p>

                                <div className={styles.benefitsSection}>
                                    <h2 className={styles.benefitsTitle}>{translations.benefits.title}</h2>
                                    <ul className={styles.benefitsList}>
                                        {translations.benefits.items.map((benefit, index) => (
                                            <li key={index} className={styles.benefitItem}>
                                                <span className={styles.benefitIcon}>✓</span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <form onSubmit={handleSubmit} className={styles.subscribeForm}>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={translations.form.emailPlaceholder}
                                            className={styles.emailInput}
                                            disabled={isLoading}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className={styles.subscribeButton}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? translations.form.loadingText : translations.form.subscribeButton}
                                        </button>
                                    </div>

                                    {message && (
                                        <div className={`${styles.message} ${styles[message.type]}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <p className={styles.privacyNote}>
                                        {translations.form.privacyNote}
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer language={language} currentPath="/subscribe/" />
        </>
    );
} 
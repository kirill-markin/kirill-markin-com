'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTranslation, SUPPORTED_LANGUAGES } from '@/lib/localization';
import { trackGtmEvent } from '@/lib/gtm';
import { useExitIntent } from '@/lib/useExitIntent';
import {
    POPUP_DELAY,
    POPUP_COOKIE_NAME,
    POPUP_SUBSCRIBED_COOKIE_NAME,
    POPUP_SESSION_KEY,
    POPUP_COOLDOWN_DAYS,
    POPUP_SUBSCRIBED_DAYS,
    EMAIL_MIN_LENGTH,
    EMAIL_MAX_LENGTH,
    EMAIL_REGEX,
} from '@/lib/popupConstants';
import styles from './EmailPopup.module.css';

type Language = typeof SUPPORTED_LANGUAGES[number];

interface EmailPopupProps {
    language: Language;
}

export default function EmailPopup({ language }: EmailPopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);
    const timerTriggeredRef = useRef(false);

    const translations = getTranslation('emailPopup', language);

    // Use exit intent hook
    const exitIntentState = useExitIntent({
        onExitIntent: () => {
            if (!timerTriggeredRef.current) {
                showPopup();
            }
        }
    });

    // Cookie utilities
    const setCookie = useCallback((name: string, value: string, days: number) => {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }, []);

    const getCookie = useCallback((name: string): string | null => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }, []);

    // Check if popup should be shown
    const shouldShowPopup = useCallback((): boolean => {
        // Check if user already subscribed (highest priority - never show again)
        if (getCookie(POPUP_SUBSCRIBED_COOKIE_NAME)) {
            return false;
        }

        // Check if already shown in this session
        if (sessionStorage.getItem(POPUP_SESSION_KEY)) {
            return false;
        }

        // Check if dismissed recently (cookie)
        if (getCookie(POPUP_COOKIE_NAME)) {
            return false;
        }

        return true;
    }, [getCookie]);

    // Email validation
    const validateEmail = useCallback((emailValue: string): boolean => {
        const trimmedEmail = emailValue.trim();
        return (
            trimmedEmail.length >= EMAIL_MIN_LENGTH &&
            trimmedEmail.length <= EMAIL_MAX_LENGTH &&
            EMAIL_REGEX.test(trimmedEmail)
        );
    }, []);

    // Show popup logic
    const showPopup = useCallback(() => {
        if (!shouldShowPopup() || isVisible) return;

        setIsVisible(true);
        sessionStorage.setItem(POPUP_SESSION_KEY, 'true');
        trackGtmEvent({ event: 'email_popup_shown' });
    }, [isVisible, shouldShowPopup]);

    // Hide popup logic
    const hidePopup = useCallback(() => {
        setIsVisible(false);
        setCookie(POPUP_COOKIE_NAME, 'true', POPUP_COOLDOWN_DAYS);
        trackGtmEvent({ event: 'email_popup_dismissed' });
    }, [setCookie]);

    // Mark user as subscribed (never show popup again)
    const markAsSubscribed = useCallback(() => {
        setCookie(POPUP_SUBSCRIBED_COOKIE_NAME, 'true', POPUP_SUBSCRIBED_DAYS);
        trackGtmEvent({ event: 'email_subscription_success' });
    }, [setCookie]);

    // Timer trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!exitIntentState.hasTriggered && !timerTriggeredRef.current) {
                timerTriggeredRef.current = true;
                trackGtmEvent({
                    event: 'email_popup_timer_trigger'
                });
                showPopup();
            }
        }, POPUP_DELAY);

        return () => clearTimeout(timer);
    }, [showPopup, exitIntentState.hasTriggered]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        // Reset previous errors
        setShowValidationError(false);
        setShowError(false);

        // Validate email
        if (!validateEmail(trimmedEmail)) {
            setShowValidationError(true);
            trackGtmEvent({ event: 'email_validation_failed' });
            return;
        }

        trackGtmEvent({ event: 'email_validation_passed' });

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: trimmedEmail }),
            });

            if (response.ok) {
                setShowSuccess(true);
                setEmail('');
                markAsSubscribed();

                // Hide popup after success
                setTimeout(() => {
                    setIsVisible(false);
                }, 2000);
            } else {
                setShowError(true);
                trackGtmEvent({ event: 'email_subscription_failed' });
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setShowError(true);
            trackGtmEvent({ event: 'email_subscription_failed' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle email input change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        // Clear validation error when user starts typing
        if (showValidationError) {
            setShowValidationError(false);
        }
    };

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible) {
                hidePopup();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, hidePopup]);

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button
                    className={styles.closeButton}
                    onClick={hidePopup}
                    aria-label="Close popup"
                >
                    ×
                </button>

                <div className={styles.content}>
                    <h2 className={styles.title}>{translations.title}</h2>
                    <p className={styles.description}>{translations.description}</p>

                    {showSuccess ? (
                        <div className={styles.successMessage}>
                            {translations.successMessage}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="your@email.com"
                                className={`${styles.emailInput} ${showValidationError ? styles.errorInput : ''}`}
                                disabled={isSubmitting}
                                required
                            />

                            {showValidationError && (
                                <div className={styles.validationError}>
                                    {translations.validationError}
                                </div>
                            )}

                            <p className={styles.subText}>{translations.subText}</p>

                            {showError && (
                                <div className={styles.errorMessage}>
                                    {translations.errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={styles.ctaButton}
                            >
                                {isSubmitting ? '...' : translations.ctaButton}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
} 
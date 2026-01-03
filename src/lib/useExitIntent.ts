import { useEffect, useRef, useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';
import { EXIT_INTENT_THRESHOLD, SCROLL_UP_THRESHOLD, SCROLL_DEBOUNCE_MS } from '@/lib/popupConstants';

export type ExitIntentTrigger = 'mouse' | 'scroll';

export interface ExitIntentOptions {
    onExitIntent: (trigger: ExitIntentTrigger) => void;
    enableMouseDetection?: boolean;
    enableScrollDetection?: boolean;
    minTimeOnPage?: number; // milliseconds
    mouseThreshold?: number; // pixels from top
    scrollThreshold?: number; // pixels scrolled up
    scrollDebounce?: number; // milliseconds
}

export interface ExitIntentState {
    mouseTriggered: boolean;
    scrollTriggered: boolean;
    hasTriggered: boolean;
}

export function useExitIntent(options: ExitIntentOptions): ExitIntentState {
    const {
        onExitIntent,
        enableMouseDetection = true,
        enableScrollDetection = true,
        minTimeOnPage = 1000,
        mouseThreshold = EXIT_INTENT_THRESHOLD,
        scrollThreshold = SCROLL_UP_THRESHOLD,
        scrollDebounce = SCROLL_DEBOUNCE_MS,
    } = options;

    // Refs for tracking state
    const startTimeRef = useRef<number>(Date.now());
    const mouseTriggeredRef = useRef(false);
    const scrollTriggeredRef = useRef(false);
    const lastScrollPositionRef = useRef<number>(0);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle exit intent trigger
    const triggerExitIntent = useCallback((trigger: ExitIntentTrigger) => {
        // Track general exit intent event
        trackEvent('exit_intent', {
            trigger_type: trigger
        });

        // Call the provided callback
        onExitIntent(trigger);
    }, [onExitIntent]);

    // Mouse-based exit intent detection
    useEffect(() => {
        if (!enableMouseDetection) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (
                e.clientY <= mouseThreshold &&
                !mouseTriggeredRef.current &&
                !scrollTriggeredRef.current &&
                Date.now() - startTimeRef.current >= minTimeOnPage
            ) {
                mouseTriggeredRef.current = true;
                triggerExitIntent('mouse');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [enableMouseDetection, mouseThreshold, minTimeOnPage, triggerExitIntent]);

    // Scroll-based exit intent detection
    useEffect(() => {
        if (!enableScrollDetection) return;

        // Initialize scroll position
        lastScrollPositionRef.current = window.scrollY;

        const handleScroll = () => {
            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Debounce scroll handling
            scrollTimeoutRef.current = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const scrollDifference = lastScrollPositionRef.current - currentScrollY;

                // Check if scrolling up significantly
                if (
                    scrollDifference >= scrollThreshold &&
                    !mouseTriggeredRef.current &&
                    !scrollTriggeredRef.current &&
                    Date.now() - startTimeRef.current >= minTimeOnPage
                ) {
                    scrollTriggeredRef.current = true;
                    triggerExitIntent('scroll');
                }

                // Update last scroll position
                lastScrollPositionRef.current = currentScrollY;
            }, scrollDebounce);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [enableScrollDetection, scrollThreshold, scrollDebounce, minTimeOnPage, triggerExitIntent]);

    // Return current state
    return {
        mouseTriggered: mouseTriggeredRef.current,
        scrollTriggered: scrollTriggeredRef.current,
        hasTriggered: mouseTriggeredRef.current || scrollTriggeredRef.current,
    };
} 
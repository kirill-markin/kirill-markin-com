'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode, MouseEvent } from 'react';

interface SecretModeContextType {
    isSecretModeUnlocked: boolean;
    isHydrated: boolean;
    handleHeaderClick: (event: MouseEvent<HTMLElement>) => void;
}

const SecretModeContext = createContext<SecretModeContextType | undefined>(undefined);

const REQUIRED_CLICKS = 3;
const CLICK_TIMEOUT_MS = 2000; // Reset counter if no click within 2 seconds
const SESSION_STORAGE_KEY = 'secretModeUnlocked';

interface SecretModeProviderProps {
    children: ReactNode;
}

export function SecretModeProvider({ children }: SecretModeProviderProps) {
    // Initialize with false to avoid hydration mismatch (SSR vs client)
    const [isSecretModeUnlocked, setIsSecretModeUnlocked] = useState<boolean>(false);
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    const clickCountRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Restore from sessionStorage on mount (client-side only)
    useEffect(() => {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored === 'true') {
            setIsSecretModeUnlocked(true);
        }
        setIsHydrated(true);
    }, []);

    // Persist to sessionStorage when unlocked
    useEffect(() => {
        if (isSecretModeUnlocked) {
            sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        }
    }, [isSecretModeUnlocked]);

    const handleHeaderClick = useCallback((event: MouseEvent<HTMLElement>) => {
        // If already unlocked, do nothing
        if (isSecretModeUnlocked) {
            return;
        }

        // Check if click originated from an interactive element (link, button)
        const target = event.target as HTMLElement;
        if (target.closest('a, button, [role="button"]')) {
            return;
        }

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Increment click counter
        clickCountRef.current += 1;

        // Check if we reached required clicks
        if (clickCountRef.current >= REQUIRED_CLICKS) {
            setIsSecretModeUnlocked(true);
            clickCountRef.current = 0;
        } else {
            // Set timeout to reset counter
            timeoutRef.current = setTimeout(() => {
                clickCountRef.current = 0;
            }, CLICK_TIMEOUT_MS);
        }
    }, [isSecretModeUnlocked]);

    // Cleanup timeout on unmount or when secret mode is unlocked
    useEffect(() => {
        // Clear timeout when secret mode is unlocked
        if (isSecretModeUnlocked && timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // Cleanup on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isSecretModeUnlocked]);

    return (
        <SecretModeContext.Provider value={{ isSecretModeUnlocked, isHydrated, handleHeaderClick }}>
            {children}
        </SecretModeContext.Provider>
    );
}

export function useSecretMode(): SecretModeContextType {
    const context = useContext(SecretModeContext);
    if (context === undefined) {
        throw new Error('useSecretMode must be used within a SecretModeProvider');
    }
    return context;
}

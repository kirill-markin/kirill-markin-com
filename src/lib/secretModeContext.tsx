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

    // Persist to sessionStorage; wait for restoration so the initial false state cannot erase a stored 'true'
    useEffect(() => {
        if (!isHydrated) {
            return;
        }
        if (isSecretModeUnlocked) {
            sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        } else {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
    }, [isSecretModeUnlocked, isHydrated]);

    const handleHeaderClick = useCallback((event: MouseEvent<HTMLElement>) => {
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

        // Toggle secret mode once the required clicks are reached
        if (clickCountRef.current >= REQUIRED_CLICKS) {
            setIsSecretModeUnlocked((previous) => !previous);
            clickCountRef.current = 0;
            timeoutRef.current = null;
        } else {
            // Set timeout to reset counter
            timeoutRef.current = setTimeout(() => {
                clickCountRef.current = 0;
            }, CLICK_TIMEOUT_MS);
        }
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);

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

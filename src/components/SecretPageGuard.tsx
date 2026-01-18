'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSecretMode } from '@/lib/secretModeContext';

interface SecretPageGuardProps {
    children: React.ReactNode;
    redirectTo: string;
}

export default function SecretPageGuard({ children, redirectTo }: SecretPageGuardProps) {
    const { isSecretModeUnlocked, isHydrated } = useSecretMode();
    const router = useRouter();

    useEffect(() => {
        // Only redirect after hydration is complete to avoid race condition
        // with sessionStorage restoration
        if (isHydrated && !isSecretModeUnlocked) {
            router.replace(redirectTo);
        }
    }, [isSecretModeUnlocked, isHydrated, redirectTo, router]);

    // Wait for hydration before deciding what to render
    if (!isHydrated) {
        return null;
    }

    // After hydration, don't render if not unlocked (redirect is in progress)
    if (!isSecretModeUnlocked) {
        return null;
    }

    return <>{children}</>;
}

'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/localization';

export default function LanguageAttributeUpdater() {
    const pathname = usePathname();

    useEffect(() => {
        // Extract language code from URL
        const pathParts = pathname.split('/').filter(Boolean);
        let lang = DEFAULT_LANGUAGE;

        // If the first part of the path is a supported language, use it
        if (pathParts.length > 0 && SUPPORTED_LANGUAGES.includes(pathParts[0])) {
            lang = pathParts[0];
        }

        // Take only the main language code (first 2 letters) without region
        const mainLang = lang.split('-')[0];

        // Update the lang attribute on the HTML element
        document.documentElement.lang = mainLang;

        // Set the dir attribute based on the language
        // For Arabic language use RTL (right to left)
        if (mainLang === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    }, [pathname]);

    // This component doesn't render any visible UI
    return null;
} 
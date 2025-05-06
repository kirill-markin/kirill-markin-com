'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/localization';

export default function LanguageAttributeUpdater() {
    const pathname = usePathname();

    useEffect(() => {
        // Извлекаем языковой код из URL
        const pathParts = pathname.split('/').filter(Boolean);
        let lang = DEFAULT_LANGUAGE;

        // Если первая часть пути - это поддерживаемый язык, используем его
        if (pathParts.length > 0 && SUPPORTED_LANGUAGES.includes(pathParts[0])) {
            lang = pathParts[0];
        }

        // Берем только основной языковой код (первые 2 буквы) без региона
        const mainLang = lang.split('-')[0];

        // Обновляем атрибут lang на HTML элементе
        document.documentElement.lang = mainLang;
    }, [pathname]);

    // Этот компонент не рендерит видимый UI
    return null;
} 
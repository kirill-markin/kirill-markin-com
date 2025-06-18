import Link from 'next/link';
import {
    SUPPORTED_LANGUAGES,
    LANGUAGE_NAMES,
    getUrlForLanguage
} from '@/lib/localization';
import { Translation } from '@/types/article';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
    currentLanguage: string;
    currentPath: string;
    translations?: Translation[];
    availableLanguages?: string[];
    className?: string;
}

export default function LanguageSwitcher({
    currentLanguage,
    currentPath,
    translations,
    availableLanguages,
    className,
}: LanguageSwitcherProps) {
    // Use availableLanguages if provided, otherwise use all SUPPORTED_LANGUAGES
    const languagesToShow = availableLanguages || SUPPORTED_LANGUAGES;

    return (
        <div className={`${styles.languageSwitcher} ${className || ''}`}>
            {languagesToShow.map(lang => {
                if (lang === currentLanguage) {
                    return (
                        <span key={lang} className={styles.currentLanguage}>
                            {LANGUAGE_NAMES[lang] || lang}
                        </span>
                    );
                }

                const url = getUrlForLanguage(lang, currentLanguage, currentPath, translations);

                if (url === null) {
                    return null;
                }

                return (
                    <Link
                        key={lang}
                        href={url}
                        className={styles.languageLink}
                    >
                        {LANGUAGE_NAMES[lang] || lang}
                    </Link>
                );
            })}
        </div>
    );
} 
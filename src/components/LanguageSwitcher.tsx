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
    className?: string;
}

export default function LanguageSwitcher({
    currentLanguage,
    currentPath,
    translations,
    className,
}: LanguageSwitcherProps) {
    return (
        <div className={`${styles.languageSwitcher} ${className || ''}`}>
            {SUPPORTED_LANGUAGES.map(lang => {
                if (lang === currentLanguage) {
                    return (
                        <span key={lang} className={styles.currentLanguage}>
                            {LANGUAGE_NAMES[lang] || lang}
                        </span>
                    );
                }

                const url = getUrlForLanguage(lang, currentLanguage, currentPath, translations);

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
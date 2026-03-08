import Image from 'next/image';
import Link from 'next/link';
import styles from './ArticlePreviewCard.module.css';

type ArticlePreviewCardTitleTag = 'h2' | 'h3';

interface ArticlePreviewCardProps {
    href: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    languageLabel: string;
    typeLabel?: string;
    date?: string;
    dateLocale: string;
    achievementValue?: string;
    achievementLabel?: string;
    isWide: boolean;
    priority: boolean;
    titleTag: ArticlePreviewCardTitleTag;
}

const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

function formatArticleDate(date: string, dateLocale: string): string {
    return new Date(date).toLocaleDateString(
        dateLocale === 'en' ? 'en-US' : dateLocale,
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
    );
}

export default function ArticlePreviewCard({
    href,
    title,
    description,
    thumbnailUrl,
    languageLabel,
    typeLabel,
    date,
    dateLocale,
    achievementValue,
    achievementLabel,
    isWide,
    priority,
    titleTag,
}: ArticlePreviewCardProps) {
    const TitleTag = titleTag;

    return (
        <article className={`${styles.card} ${isWide ? styles.cardWide : ''}`}>
            <Link href={href} className={styles.cardLink}>
                <div className={styles.languageBadge}>
                    <span className={styles.badgeText}>[{languageLabel}]</span>
                </div>

                {typeLabel ? (
                    <div className={styles.typeBadge}>
                        <span className={styles.badgeText}>[{typeLabel}]</span>
                    </div>
                ) : null}

                <div className={styles.thumbnailContainer}>
                    <Image
                        className={styles.thumbnail}
                        src={thumbnailUrl || PLACEHOLDER_IMAGE}
                        alt={title}
                        width={640}
                        height={360}
                        sizes="(max-width: 640px) 320px, (max-width: 1200px) 640px, 640px"
                        quality={75}
                        priority={priority}
                    />
                </div>

                <div className={styles.content}>
                    <div className={styles.contentBody}>
                        <TitleTag className={styles.title}>{title}</TitleTag>

                        {description ? (
                            <p className={styles.description}>{description}</p>
                        ) : null}
                    </div>

                    {date || (achievementValue && achievementLabel) ? (
                        <div className={styles.footer}>
                            <div className={styles.date}>
                                {date ? (
                                    <time dateTime={date}>
                                        {formatArticleDate(date, dateLocale)}
                                    </time>
                                ) : null}
                            </div>

                            {achievementValue && achievementLabel ? (
                                <div className={styles.achievement}>
                                    <div className={styles.achievementValue}>{achievementValue}</div>
                                    <div className={styles.achievementLabel}>{achievementLabel}</div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </Link>
        </article>
    );
}

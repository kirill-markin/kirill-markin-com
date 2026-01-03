'use client';

import Image from 'next/image';
import { MediaMention } from '@/data/mediaMentions';
import { trackEvent } from '@/lib/analytics';
import styles from '@/app/page.module.css';

const PLACEHOLDER_IMAGE = '/articles/preview-main.webp';

interface MediaMentionCardProps {
  mention: MediaMention;
  isLarge: boolean;
  displayTitle: string;
  index: number;
}

export default function MediaMentionCard({
  mention,
  isLarge,
  displayTitle,
  index
}: MediaMentionCardProps) {
  const isVideo = mention.isVideo || mention.type.toLowerCase() === 'video';

  const handleClick = () => {
    trackEvent('media_mention_click', {
      publisher: mention.publisher || 'unknown',
      mention_type: mention.type,
      mention_title: displayTitle,
    });
  };

  return (
    <article
      className={`${styles.mediaMention} ${isLarge ? styles.wide : ''} ${isVideo ? styles.video : ''} ${isLarge ? styles.wideWithThumbnail : ''}`}
    >
      <a
        href={mention.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.mentionLink}
        onClick={handleClick}
      >
        <div className={styles.language}>
          <div className={styles.text}>[{mention.language}]</div>
        </div>

        {mention.type && (
          <div className={styles.type}>
            <div className={styles.text}>[{mention.type}]</div>
          </div>
        )}

        <div className={styles.thumbnailContainer}>
          <Image
            className={styles.thumbnail}
            src={mention.thumbnailUrl || PLACEHOLDER_IMAGE}
            alt={displayTitle}
            width={640}
            height={360}
            sizes="(max-width: 640px) 320px, (max-width: 1200px) 640px, 640px"
            quality={75}
            priority={index < 4}
          />
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{displayTitle}</h3>
          {mention.description && isLarge && (
            <div className={styles.description}>{mention.description}</div>
          )}

          {mention.websiteLogoUrl && (
            <div className={styles.footer}>
              <div className={styles.divider} />
              <div className={styles.logoContainer}>
                <Image
                  className={styles.logo}
                  src={mention.websiteLogoUrl || PLACEHOLDER_IMAGE}
                  alt="Website Logo"
                  width={100}
                  height={25}
                />
                {mention.achievementValue && (
                  <div className={styles.achievement}>
                    <div className={styles.value}>{mention.achievementValue}</div>
                    {mention.achievementLabel && (
                      <div className={styles.label}>{mention.achievementLabel}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </a>
    </article>
  );
}

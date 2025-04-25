'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './SocialShare.module.css';

interface SocialShareProps {
  url?: string;
  title?: string;
  variant?: 'fixed' | 'inline';
  className?: string;
}

// Define the platforms to share to
const platforms = [
  {
    name: 'X',
    icon: '/social/svg/twitter.svg',
    shareUrl: (url: string, title: string) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  },
  {
    name: 'LinkedIn',
    icon: '/social/svg/linkedin.svg',
    shareUrl: (url: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  },
  {
    name: 'Reddit',
    icon: '/social/svg/reddit.svg',
    shareUrl: (url: string, title: string) => 
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  },
  {
    name: 'Facebook',
    icon: '/social/svg/facebook.svg',
    shareUrl: (url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    name: 'WhatsApp',
    icon: '/social/svg/whatsapp.svg',
    shareUrl: (url: string, title: string) => 
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
  },
  {
    name: 'Telegram',
    icon: '/social/svg/telegram.svg',
    shareUrl: (url: string, title: string) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  }
];

export default function SocialShare({ 
  url, 
  title = '', 
  variant = 'fixed',
  className = ''
}: SocialShareProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(url || '');
  const [pageTitle, setPageTitle] = useState<string>(title || '');
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  // Get the current URL and title if not provided
  useEffect(() => {
    if (!url) {
      setCurrentUrl(window.location.href);
    }
    
    if (!title && document.title) {
      setPageTitle(document.title);
    }
  }, [url, title]);
  
  const containerClass = variant === 'fixed' 
    ? `${styles.socialShare} ${styles.fixed} ${className}`
    : `${styles.socialShare} ${className}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  if (!currentUrl) {
    return null;
  }

  return (
    <div className={containerClass}>
      <div className={styles.shareButtons}>
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.shareUrl(currentUrl, pageTitle)}
            className={`${styles.shareButton} ${hoveredPlatform === platform.name ? styles.hovered : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${platform.name}`}
            aria-label={`Share on ${platform.name}`}
            onMouseEnter={() => setHoveredPlatform(platform.name)}
            onMouseLeave={() => setHoveredPlatform(null)}
          >
            <div className={styles.iconContainer}>
              <Image
                src={platform.icon}
                alt={platform.name}
                width={36}
                height={36}
                className={styles.icon}
              />
            </div>
          </a>
        ))}
        <button
          className={`${styles.shareButton} ${hoveredPlatform === 'Copy' ? styles.hovered : ''}`}
          onClick={copyToClipboard}
          title="Copy link"
          aria-label="Copy link to clipboard"
          onMouseEnter={() => setHoveredPlatform('Copy')}
          onMouseLeave={() => setHoveredPlatform(null)}
        >
          <div className={styles.iconContainer}>
            <Image
              src="/social/svg/link.svg"
              alt="Copy link"
              width={36}
              height={36}
              className={styles.icon}
            />
            {copySuccess && <span className={styles.copyTooltip}>Copied!</span>}
          </div>
        </button>
      </div>
    </div>
  );
} 
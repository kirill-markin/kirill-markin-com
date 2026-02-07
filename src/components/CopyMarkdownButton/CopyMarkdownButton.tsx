'use client';

import { useState } from 'react';
import styles from './CopyMarkdownButton.module.css';

interface CopyMarkdownButtonProps {
  content: string;
}

export default function CopyMarkdownButton({ content }: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={styles.copyButton}
      onClick={handleCopy}
      title="Copy as Markdown"
      aria-label="Copy article as Markdown"
    >
      <svg
        className={styles.icon}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
      </svg>
      {copied && <span className={styles.tooltip}>Copied!</span>}
    </button>
  );
}

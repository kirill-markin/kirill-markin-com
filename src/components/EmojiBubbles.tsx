"use client";

import { useState } from 'react';
import styles from './EmojiBubbles.module.css';
import { trackEvent } from '@/lib/analytics';

export default function EmojiBubbles() {
  const [activeEmoji, setActiveEmoji] = useState<'none' | 'angel' | 'devil'>('none');

  const handleAngelClick = () => {
    const newState = activeEmoji === 'angel' ? 'none' : 'angel';
    setActiveEmoji(newState);

    if (newState === 'angel') {
      trackEvent('emoji_click_angel');
    }
  };

  const handleDevilClick = () => {
    const newState = activeEmoji === 'devil' ? 'none' : 'devil';
    setActiveEmoji(newState);

    if (newState === 'devil') {
      trackEvent('emoji_click_devil');
    }
  };

  const handleOverlayClick = () => {
    setActiveEmoji('none');
  };

  return (
    <div className={styles.emojiBubbles}>
      {/* Angel Emoji (Right Corner) */}
      <div
        className={`${styles.emojiContainer} ${styles.angel}`}
        onClick={handleAngelClick}
      >
        <div className={`${styles.messageBubble} ${activeEmoji === 'angel' ? styles.active : ''}`}>
          You're doing great! Take a moment to appreciate how far you've come. 😇
        </div>
        <span role="img" aria-label="Angel emoji">😇</span>
      </div>

      {/* Devil Emoji (Left Corner) */}
      <div
        className={`${styles.emojiContainer} ${styles.devil}`}
        onClick={handleDevilClick}
      >
        <div className={`${styles.messageBubble} ${activeEmoji === 'devil' ? styles.active : ''}`}>
          Hey! Stop doomscrolling and get back to work! 😈
        </div>
        <span role="img" aria-label="Devil emoji">😈</span>
      </div>

      {/* Overlay for catching clicks outside emojis */}
      {activeEmoji !== 'none' && (
        <div
          className={styles.emojiOverlay}
          onClick={handleOverlayClick}
        />
      )}
    </div>
  );
} 
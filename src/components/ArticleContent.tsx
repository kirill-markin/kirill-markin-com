'use client';

import { useEffect, useRef } from 'react';
import styles from './ArticleContent.module.css';

interface ArticleContentProps {
  htmlContent: string;
  className?: string;
}

export default function ArticleContent({ htmlContent, className }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all pre>code elements in the container
    const codeBlocks = contentRef.current.querySelectorAll('pre > code');

    // Add copy button to each code block
    codeBlocks.forEach((codeBlock) => {
      const preElement = codeBlock.parentElement;
      if (!preElement) return;

      // Set position relative on the pre element if not already set
      if (getComputedStyle(preElement).position === 'static') {
        preElement.style.position = 'relative';
      }

      // Create a button element
      const button = document.createElement('button');
      button.className = styles.copyButton;
      button.setAttribute('aria-label', 'Copy code to clipboard');

      // Create copy icon
      const copyIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      copyIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      copyIcon.setAttribute('width', '16');
      copyIcon.setAttribute('height', '16');
      copyIcon.setAttribute('viewBox', '0 0 24 24');
      copyIcon.setAttribute('fill', 'none');
      copyIcon.setAttribute('stroke', 'currentColor');
      copyIcon.setAttribute('stroke-width', '2');
      copyIcon.setAttribute('stroke-linecap', 'round');
      copyIcon.setAttribute('stroke-linejoin', 'round');

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '9');
      rect.setAttribute('y', '9');
      rect.setAttribute('width', '13');
      rect.setAttribute('height', '13');
      rect.setAttribute('rx', '2');
      rect.setAttribute('ry', '2');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');

      copyIcon.appendChild(rect);
      copyIcon.appendChild(path);
      button.appendChild(copyIcon);

      // Add click handler
      const codeText = codeBlock.textContent || '';
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeText);

          // Show success state
          button.innerHTML = '';
          const checkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          checkIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          checkIcon.setAttribute('width', '16');
          checkIcon.setAttribute('height', '16');
          checkIcon.setAttribute('viewBox', '0 0 24 24');
          checkIcon.setAttribute('fill', 'none');
          checkIcon.setAttribute('stroke', 'currentColor');
          checkIcon.setAttribute('stroke-width', '2');
          checkIcon.setAttribute('stroke-linecap', 'round');
          checkIcon.setAttribute('stroke-linejoin', 'round');

          const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
          polyline.setAttribute('points', '20 6 9 17 4 12');
          checkIcon.appendChild(polyline);
          button.appendChild(checkIcon);

          // Reset after 2 seconds
          setTimeout(() => {
            button.innerHTML = '';
            button.appendChild(copyIcon);
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
        }
      });

      // Add button to pre element
      preElement.appendChild(button);
    });
  }, [htmlContent]);

  return (
    <div
      ref={contentRef}
      className={`article-content ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
} 
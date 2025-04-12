'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Component to manage scroll position when changing categories
 * This preserves scroll position when switching between categories
 */
export default function CategoryScrollManager() {
  const searchParams = useSearchParams();
  const scrollPositionRef = useRef<number>(0);
  const categoryRef = useRef<string | null>(null);
  const isNavigatingRef = useRef<boolean>(false);
  
  // Store current category for comparison
  const currentCategory = searchParams.get('category') || 'all';
  
  // Store scroll position when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (!isNavigatingRef.current) {
        scrollPositionRef.current = window.scrollY;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // When URL changes (category change), maintain scroll position
  useEffect(() => {
    // Only handle this for category changes, not initial load
    if (categoryRef.current !== null && categoryRef.current !== currentCategory) {
      isNavigatingRef.current = true;
      
      // Apply stored scroll position with a small delay to ensure the DOM has updated
      setTimeout(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'instant' // Use 'instant' to avoid any animation
        });
        
        // Reset navigation flag after a brief period to allow for scrolling again
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 100);
      }, 0);
    }
    
    // Update the category reference
    categoryRef.current = currentCategory;
  }, [currentCategory]);
  
  // This component doesn't render anything
  return null;
} 
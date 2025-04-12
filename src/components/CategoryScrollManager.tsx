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
  const navigationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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
      // Clear any existing timers to prevent race conditions
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }
      
      isNavigatingRef.current = true;
      
      // Store current scroll position one more time to make sure we have the most recent position
      if (!isNavigatingRef.current) {
        scrollPositionRef.current = window.scrollY;
      }
      
      // Apply stored scroll position with a delay to ensure the DOM has updated
      navigationTimerRef.current = setTimeout(() => {
        // Restore scroll position
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'instant'
        });
        
        // Try again with a slightly longer delay for reliability
        setTimeout(() => {
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: 'instant'
          });
          
          // Reset navigation flag and clear reference
          navigationTimerRef.current = setTimeout(() => {
            isNavigatingRef.current = false;
            navigationTimerRef.current = null;
          }, 200);
        }, 50);
      }, 20);
    }
    
    // Update the category reference
    categoryRef.current = currentCategory;
    
    // Cleanup timeout when the component unmounts or when the effect reruns
    return () => {
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }
    };
  }, [currentCategory]);
  
  // This component doesn't render anything
  return null;
} 
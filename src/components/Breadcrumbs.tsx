'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';
import { SUPPORTED_LANGUAGES } from '@/lib/localization';

type BreadcrumbItem = {
  path: string;
  label: string;
};

const formatLabel = (segment: string): string => {
  // Replace hyphens with spaces and capitalize words
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ path: '/', label: 'Home' }];

  // Check if the first segment is a language code
  const hasLanguagePrefix = pathSegments.length > 0 && SUPPORTED_LANGUAGES.includes(pathSegments[0]);
  const language = hasLanguagePrefix ? pathSegments[0] : 'en';

  // If there's a language prefix, adjust the segments we process
  const segmentsToProcess = hasLanguagePrefix ? pathSegments.slice(1) : pathSegments;

  let currentPath = hasLanguagePrefix ? `/${language}` : '';
  segmentsToProcess.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Format the label based on the segment
    let label = formatLabel(segment);

    // Special case handling for specific paths
    if (segment === 'meet' || segment === 'reunirse' || segment === 'huijian' || segment === 'liqaa' || segment === 'milna') {
      // Check if next segment is 'short' or its localized version
      const nextSegment = segmentsToProcess[index + 1];
      const isShortMeeting = nextSegment === 'short' ||
        nextSegment === 'corto' ||
        nextSegment === 'duanzan' ||
        nextSegment === 'qasir' ||
        nextSegment === 'sankshipt';

      if (isShortMeeting) {
        label = 'Talk to Kirill';
      }
    }

    breadcrumbs.push({
      path: currentPath,
      label
    });
  });

  return breadcrumbs;
};

const Breadcrumbs = () => {
  const pathname = usePathname();

  // Don't show breadcrumbs on the home page or language home pages (e.g., /es/)
  if (pathname === '/' || /^\/[a-z]{2}\/?$/.test(pathname)) {
    return null;
  }

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <nav className={styles.breadcrumbsContainer} aria-label="Breadcrumbs">
      <ol className={styles.breadcrumbsList}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className={styles.breadcrumbItem}>
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link href={breadcrumb.path} className={styles.breadcrumbLink}>
                  {breadcrumb.label}
                </Link>
                <span className={styles.separator}>/</span>
              </>
            ) : (
              <span className={styles.currentPage}>{breadcrumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';
import { SUPPORTED_LANGUAGES, getTranslation } from '@/lib/localization';

type BreadcrumbItem = {
  path: string;
  label: string;
  id: string;
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
  const breadcrumbs: BreadcrumbItem[] = [];

  // Check if the first segment is a language code
  const hasLanguagePrefix = pathSegments.length > 0 && SUPPORTED_LANGUAGES.includes(pathSegments[0]);
  const language = hasLanguagePrefix ? pathSegments[0] : 'en';

  // Add Home link with proper language handling
  // For non-English languages, use "English" as the label for the root path
  // to clearly indicate that clicking will change the language to English
  const homeLabel = hasLanguagePrefix ? 'English' : getTranslation('navigation', language).home;
  breadcrumbs.push({ path: '/', label: homeLabel, id: 'home' });

  // Add language as a breadcrumb
  if (hasLanguagePrefix) {
    const languageLabel = getTranslation('navigation', language).language;
    breadcrumbs.push({
      path: `/${language}`,
      label: languageLabel,
      id: `language-${language}`
    });
  }

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
        // Use the localized version of "Talk to Kirill"
        label = getTranslation('navigation', language).talkToKirill;
      }
    }

    breadcrumbs.push({
      path: currentPath,
      label,
      id: `segment-${index}-${segment}`
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

  // Generate JSON-LD schema for breadcrumbs
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': breadcrumb.label,
      'item': `https://kirill-markin.com${breadcrumb.path}${breadcrumb.path.endsWith('/') ? '' : '/'}`
    }))
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* HTML with microdata */}
      <nav className={styles.breadcrumbsContainer} aria-label="Breadcrumbs">
        <div className={styles.breadcrumbsContentWrapper}>
          <ol className={styles.breadcrumbsList} itemScope itemType="https://schema.org/BreadcrumbList">
            {breadcrumbs.map((breadcrumb, index) => (
              <li
                key={breadcrumb.id}
                className={styles.breadcrumbItem}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <Link
                      href={breadcrumb.path}
                      className={styles.breadcrumbLink}
                      itemProp="item"
                    >
                      <span itemProp="name">{breadcrumb.label}</span>
                    </Link>
                    <meta itemProp="position" content={`${index + 1}`} />
                    <span className={styles.separator}>/</span>
                  </>
                ) : (
                  <>
                    <span className={styles.currentPage} itemProp="name">{breadcrumb.label}</span>
                    <meta itemProp="position" content={`${index + 1}`} />
                    <link itemProp="item" href={`${breadcrumb.path}${breadcrumb.path.endsWith('/') ? '' : '/'}`} />
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumbs; 
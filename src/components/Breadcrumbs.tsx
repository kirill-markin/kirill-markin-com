'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';

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

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format the label based on the segment
    let label = formatLabel(segment);
    
    // Special case handling for specific paths
    if (segment === 'meet' && pathSegments[index + 1] === 'short') {
      label = 'Talk to Kirill';
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
  
  // Don't show breadcrumbs on the home page
  if (pathname === '/') {
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
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * Metadata for search page - set to noindex to prevent search engines from indexing
 */
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

/**
 * Search page component that redirects to home page
 * This is created to handle any indexed search pages and redirect them appropriately
 */
export default function SearchPage() {
    // Redirect to home page
    redirect('/');
} 
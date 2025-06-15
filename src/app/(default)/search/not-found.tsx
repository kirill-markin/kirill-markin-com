import { redirect } from 'next/navigation';

/**
 * Redirect search page requests to the home page
 * This handles the case of the incorrectly indexed search?q= URL pattern
 */
export default function SearchNotFound() {
    // Redirect any search requests to the home page
    redirect('/');
} 
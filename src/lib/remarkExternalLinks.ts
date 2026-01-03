import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { SITE_DOMAIN } from '@/data/contacts';

// Whitelist of domains that we don't need to add rel="nofollow" to
const DOMAIN_WHITELIST = [
    SITE_DOMAIN,
];

// Whitelist of specific URLs that we don't need to add rel="nofollow" to
const URL_WHITELIST = [
    'https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL'
];

interface LinkNode extends Node {
    url?: string;
    children?: Node[];
    data?: {
        hProperties?: {
            target?: string;
            rel?: string;
        }
    };
}

function isExternalUrl(url: string): boolean {
    // Check if URL is absolute (begins with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // Check if the URL is not pointing to the current domain
        return !url.includes(SITE_DOMAIN);
    }

    // Check if URL is a mailto or tel link
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
        return true;
    }

    // All other URLs (relative paths) are considered internal
    return false;
}

function getDomainFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
}

function isWhitelistedDomain(url: string): boolean {
    // First check if the exact URL is in the URL whitelist
    if (URL_WHITELIST.includes(url)) {
        return true;
    }

    // Then check if the domain is in the domain whitelist
    const domain = getDomainFromUrl(url);
    if (!domain) return false;

    return DOMAIN_WHITELIST.some(whitelistDomain =>
        domain === whitelistDomain || domain.endsWith(`.${whitelistDomain}`)
    );
}

export function remarkExternalLinks() {
    return (tree: Node) => {
        visit(tree, 'link', (node: LinkNode) => {
            const url = node.url;

            if (!url) return;

            if (isExternalUrl(url)) {
                // Convert markdown link node to an HTML link node with attributes
                const data = node.data || (node.data = {});
                const hProps = data.hProperties || (data.hProperties = {});

                // Add target="_blank" for all external links
                hProps.target = '_blank';

                // Add security attributes
                const rel = ['noopener', 'noreferrer'];

                // Add nofollow for non-whitelisted domains
                if (!isWhitelistedDomain(url)) {
                    rel.push('nofollow');
                }

                hProps.rel = rel.join(' ');
            }

            // Internal links are left unchanged
        });
    };
} 
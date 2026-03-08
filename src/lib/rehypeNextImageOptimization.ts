import { visit } from 'unist-util-visit';
import path from 'path';
import { promisify } from 'util';
import sizeOf from 'image-size';
import fs from 'fs';
import { Node } from 'unist';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

const readFile = promisify(fs.readFile);

interface ImageDimensions {
    width: number;
    height: number;
}

interface ImageNode extends Node {
    tagName: string;
    properties: {
        src?: string;
        alt?: string;
        width?: number;
        height?: number;
        sizes?: string;
        loading?: string;
        decoding?: string;
        srcSet?: string;
    };
}

const ARTICLE_IMAGE_WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048] as const;
const ARTICLE_IMAGE_DISPLAY_WIDTH = 800;

function getArticleImageFallbackWidth(): number {
    const fallbackWidth = ARTICLE_IMAGE_WIDTHS.find((width) => width >= ARTICLE_IMAGE_DISPLAY_WIDTH);

    if (typeof fallbackWidth !== 'number') {
        throw new Error('No valid fallback width configured for article images');
    }

    return fallbackWidth;
}

// Cache for image dimensions
const imageDimensionsCache = new Map<string, ImageDimensions>();

export function rehypeNextImageOptimization(options = { publicDir: './public' }) {
    return async (tree: Node) => {
        const promises: Promise<void>[] = [];

        visit(tree, { tagName: 'img' }, (node: ImageNode) => {
            const src = node.properties.src;

            // Skip external images
            if (typeof src !== 'string' || src.startsWith('http')) {
                // For external images, only add loading="lazy"
                node.properties.loading = 'lazy';
                return;
            }

            // Path to the image in the file system
            const imagePath = path.join(options.publicDir, src);

            // Calculate image dimensions (or get from cache)
            const dimensionsPromise = (async () => {
                if (imageDimensionsCache.has(imagePath)) {
                    return imageDimensionsCache.get(imagePath)!;
                }

                try {
                    // Read the file as a buffer first
                    const buffer = await readFile(imagePath);

                    // Use the buffer with image-size
                    const dimensions = sizeOf(buffer) as ISizeCalculationResult;

                    // Create a properly typed result
                    const result: ImageDimensions = {
                        width: typeof dimensions.width === 'number' ? dimensions.width : 800,
                        height: typeof dimensions.height === 'number' ? dimensions.height : 450
                    };

                    imageDimensionsCache.set(imagePath, result);
                    return result;
                } catch (err) {
                    console.warn(`Could not determine dimensions for image: ${src}, error: ${err}`);
                    // Return default values on error
                    const defaultDimensions: ImageDimensions = { width: 800, height: 450 };
                    return defaultDimensions;
                }
            })();

            promises.push(
                dimensionsPromise.then((dimensions) => {
                    // Update node properties for Server-Side optimization
                    node.properties.width = dimensions.width;
                    node.properties.height = dimensions.height;
                    node.properties.sizes = '(max-width: 768px) 100vw, 800px';
                    node.properties.loading = 'lazy';
                    node.properties.decoding = 'async';

                    // Transform src to URL for Next.js Image Optimization API
                    if (process.env.NODE_ENV === 'production') {
                        try {
                            const fallbackWidth = getArticleImageFallbackWidth();

                            // In production use Next.js Image Optimization
                            node.properties.srcSet = ARTICLE_IMAGE_WIDTHS.map(
                                (width) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75 ${width}w`
                            ).join(', ');

                            // Base src for browsers that don't support srcSet
                            node.properties.src = `/_next/image?url=${encodeURIComponent(src)}&w=${fallbackWidth}&q=75`;
                        } catch (err) {
                            console.error(`Error setting srcSet for image: ${src}, error: ${err}`);
                            // Keep original src on error
                            node.properties.src = src;
                        }
                    }
                })
            );
        });

        // Wait for all async operations to complete
        await Promise.all(promises);
    };
} 

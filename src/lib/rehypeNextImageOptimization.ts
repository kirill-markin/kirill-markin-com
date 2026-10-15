import { visit } from 'unist-util-visit';
import path from 'path';
import { readFile } from 'fs/promises';
import sizeOf from 'image-size';
import type { Node } from 'unist';
import { getMarketingMedia, resolveMediaUrl } from './mediaUrls';

interface ImageDimensions {
    width: number;
    height: number;
}

interface ImageNode extends Node {
    tagName: string;
    properties: {
        src?: string;
        alt?: string;
        href?: string;
        width?: number;
        height?: number;
        sizes?: string;
        loading?: string;
        decoding?: string;
        srcSet?: string;
    };
}

const ARTICLE_IMAGE_WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048] as const;
const ARTICLE_IMAGE_FALLBACK_WIDTH = 828;
const imageDimensionsCache = new Map<string, ImageDimensions>();

async function getImageDimensions(source: string, publicDir: string): Promise<ImageDimensions> {
    const media = getMarketingMedia(source);
    if (media) {
        if (media.width === undefined || media.height === undefined) {
            throw new Error(`Media used as an image has no dimensions: ${source}`);
        }
        return { width: media.width, height: media.height };
    }

    const imagePath = path.join(publicDir, source);
    const cached = imageDimensionsCache.get(imagePath);
    if (cached) return cached;

    const dimensions = sizeOf(await readFile(imagePath));
    if (typeof dimensions.width !== 'number' || typeof dimensions.height !== 'number') {
        throw new Error(`Could not determine image dimensions: ${imagePath}`);
    }
    const result = { width: dimensions.width, height: dimensions.height };
    imageDimensionsCache.set(imagePath, result);
    return result;
}

export function rehypeNextImageOptimization(options: { publicDir: string }) {
    return async (tree: Node) => {
        const promises: Promise<void>[] = [];

        visit(tree, { tagName: 'a' }, (node: ImageNode) => {
            if (typeof node.properties.href === 'string') {
                node.properties.href = resolveMediaUrl(node.properties.href);
            }
        });

        visit(tree, { tagName: 'img' }, (node: ImageNode) => {
            const source = node.properties.src;
            node.properties.loading = 'lazy';
            if (typeof source !== 'string') return;
            const media = getMarketingMedia(source);
            if (!media && /^(?:https?:)?\/\//.test(source)) return;

            promises.push(getImageDimensions(source, options.publicDir).then((dimensions) => {
                const url = resolveMediaUrl(source);
                node.properties.width = dimensions.width;
                node.properties.height = dimensions.height;
                node.properties.sizes = '(max-width: 768px) 100vw, 800px';
                node.properties.decoding = 'async';
                node.properties.src = url;

                if (process.env.NODE_ENV === 'production') {
                    node.properties.srcSet = ARTICLE_IMAGE_WIDTHS.map(
                        (width) => `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=75 ${width}w`
                    ).join(', ');
                    node.properties.src = `/_next/image?url=${encodeURIComponent(url)}&w=${ARTICLE_IMAGE_FALLBACK_WIDTH}&q=75`;
                }
            }));
        });

        await Promise.all(promises);
    };
}

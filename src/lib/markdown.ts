import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import type { Root } from 'mdast';
import { remarkExternalLinks } from './remarkExternalLinks';
import { rehypeNextImageOptimization } from './rehypeNextImageOptimization';
import { getFirstHeading, getFirstHeadingText, remarkStripFirstHeading } from './remarkStripFirstHeading';

export type MarkdownToHtmlOptions = {
  stripFirstHeading: boolean;
};

export type FirstMarkdownHeading = {
  depth: number;
  text: string;
};

export function getFirstMarkdownHeading(markdown: string): FirstMarkdownHeading | null {
  const tree = remark().parse(markdown) as Root;
  const firstHeading = getFirstHeading(tree);
  const firstHeadingText = getFirstHeadingText(tree);

  if (!firstHeading || !firstHeadingText) {
    return null;
  }

  return {
    depth: firstHeading.depth,
    text: firstHeadingText,
  };
}

export async function markdownToHtml(markdown: string, options: MarkdownToHtmlOptions): Promise<string> {
  let processor = remark()
    .use(remarkGfm)
    .use(remarkExternalLinks);

  if (options.stripFirstHeading) {
    processor = processor.use(remarkStripFirstHeading);
  }

  const result = await processor
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeNextImageOptimization, { publicDir: './public' })
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
} 

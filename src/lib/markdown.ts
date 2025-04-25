import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { remarkExternalLinks } from './remarkExternalLinks';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkExternalLinks)
    .use(html, { sanitize: false })
    .process(markdown);

  return result.toString();
} 
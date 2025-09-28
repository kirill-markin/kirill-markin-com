import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { remarkExternalLinks } from './remarkExternalLinks';
import { rehypeNextImageOptimization } from './rehypeNextImageOptimization';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkExternalLinks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeNextImageOptimization, { publicDir: './public' })
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
} 
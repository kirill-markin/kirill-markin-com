import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { resolveMediaUrl } from './mediaUrls';

export function remarkMediaLinks() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type === 'link' || node.type === 'image' || node.type === 'definition') {
        node.url = resolveMediaUrl(node.url);
      }
      if (node.type === 'html') {
        node.value = node.value.replace(/(\b(?:src|href)\s*=\s*)(["'])(.*?)\2/g,
          (_match, attribute: string, quote: string, source: string) => `${attribute}${quote}${resolveMediaUrl(source)}${quote}`);
      }
    });
  };
}

export async function resolveMarkdownMedia(markdown: string): Promise<string> {
  return String(await remark().use(remarkGfm).use(remarkMediaLinks).process(markdown));
}

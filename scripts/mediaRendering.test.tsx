import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { getImgProps } from 'next/dist/shared/lib/get-img-props';
import { imageConfigDefault, prepareImageConfig } from 'next/dist/shared/lib/image-config';
import defaultLoader from 'next/dist/shared/lib/image-loader';
import { hasRemoteMatch } from 'next/dist/shared/lib/match-remote-pattern';
import MediaImage from '../src/components/MediaImage';
import ArticleJsonLd from '../src/components/ArticleJsonLd';
import { getArticleBySlug } from '../src/lib/articles';
import { marketingMediaManifest } from '../src/lib/marketingMedia';
import { markdownToHtml } from '../src/lib/markdown';
import { resolveMarkdownMedia } from '../src/lib/markdownMedia';
import { generateHomePageMetadata } from '../src/lib/metadata';
import { absoluteMediaUrl, mediaImageMetadata, resolveMediaUrl } from '../src/lib/mediaUrls';
import { mediaHeaders, mediaRedirects, mediaRemotePatterns } from '../src/lib/mediaRouting';

function optimizedSource(value: string): string | null {
  return new URL(value, 'https://kirill-markin.com').searchParams.get('url');
}

test('all migrated images render optimized immutable URLs and manifest dimensions without local files', async () => {
  assert.ok(marketingMediaManifest.length > 0);
  const images = marketingMediaManifest.filter((media) => media.width !== undefined);
  const markdown = images.map((media) => `![Image](${media.publicPath})`).join('\n\n');
  const html = await markdownToHtml(markdown, { stripFirstHeading: false });
  const nodes = [...new JSDOM(html).window.document.querySelectorAll('img')];
  assert.equal(nodes.length, images.length);
  for (const [index, media] of images.entries()) {
    await assert.rejects(access(`public${media.publicPath}`), { code: 'ENOENT' });
    const node = nodes[index];
    assert.equal(node.getAttribute('width'), String(media.width));
    assert.equal(node.getAttribute('height'), String(media.height));
    assert.equal(optimizedSource(node.getAttribute('src')!), media.url);
    const sources = node.getAttribute('srcset')!.split(', ');
    assert.ok(sources.length > 1);
    for (const source of sources) assert.equal(optimizedSource(source.split(' ')[0]), media.url);
    assert.equal(node.getAttribute('loading'), 'lazy');
  }
});

test('Next Image thumbnails, services and avatars use immutable sources in src and srcset', () => {
  for (const publicPath of ['/articles/preview-main.webp', '/services/default.png', '/avatars/Kirill-Markin.webp']) {
    const media = marketingMediaManifest.find((asset) => asset.publicPath === publicPath)!;
    const element = MediaImage({ src: publicPath, width: 640, height: 360, alt: 'Media' });
    const { props } = getImgProps(element.props, {
      defaultLoader,
      imgConf: prepareImageConfig({ ...imageConfigDefault, remotePatterns: mediaRemotePatterns }),
    });
    assert.equal(optimizedSource(props.src), media.url);
    assert.ok(props.srcSet);
    for (const source of props.srcSet.split(', ')) assert.equal(optimizedSource(source.split(' ')[0]), media.url);
    assert.ok(hasRemoteMatch([], mediaRemotePatterns, new URL(media.url)));
  }
  assert.equal(hasRemoteMatch([], mediaRemotePatterns,
    new URL('https://unrelated.public.blob.vercel-storage.com/marketing/image.webp')), false);
  assert.equal(hasRemoteMatch([], mediaRemotePatterns,
    new URL(`https://${mediaRemotePatterns[0].hostname}/unmanaged/image.webp`)), false);
  assert.equal(resolveMediaUrl('/icons/email.svg'), '/icons/email.svg');
  assert.equal(resolveMediaUrl('https://example.com/photo.jpg'), 'https://example.com/photo.jpg');
});

test('old URLs redirect temporarily with browser revalidation and original bytes when present', () => {
  assert.equal(mediaRedirects.length, marketingMediaManifest.length);
  for (const [index, media] of marketingMediaManifest.entries()) {
    assert.deepEqual(mediaRedirects[index], {
      source: media.publicPath, destination: (media.original ?? media).url, permanent: false,
    });
    assert.deepEqual(mediaHeaders[index], {
      source: media.publicPath, headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
    });
  }
});

test('rendered Markdown and HTML resolve managed images and PDF links while leaving code examples intact', async () => {
  const image = marketingMediaManifest.find((media) => media.width !== undefined)!;
  const pdf = marketingMediaManifest.find((media) => media.publicPath.endsWith('.pdf'))!;
  const markdown = `![Photo](${image.publicPath})\n\n[PDF](${pdf.publicPath})\n\n<img src="${image.publicPath}" alt="Photo">\n\n\`${image.publicPath}\``;
  const resolved = await resolveMarkdownMedia(markdown);
  assert.ok(resolved.includes(`(${image.url})`));
  assert.ok(resolved.includes(`(${pdf.url})`));
  assert.ok(resolved.includes(`src="${image.url}"`));
  assert.ok(resolved.includes(`\`${image.publicPath}\``));
  const html = await markdownToHtml(markdown, { stripFirstHeading: false });
  const document = new JSDOM(html).window.document;
  assert.equal(document.querySelector('a')?.getAttribute('href'), pdf.url);
  assert.equal(document.querySelectorAll('img').length, 2);
  assert.equal(absoluteMediaUrl(`https://kirill-markin.com${image.publicPath}`), image.url);
});

test('article metadata and JSON-LD retain immutable thumbnail URLs across languages', async () => {
  const homeImage = marketingMediaManifest.find((media) => media.publicPath === '/articles/preview-main.webp')!;
  const home = generateHomePageMetadata('en');
  assert.ok(JSON.stringify(home.openGraph?.images).includes(homeImage.url));
  assert.deepEqual(mediaImageMetadata(homeImage.publicPath, { width: 1200, height: 630 }), {
    url: homeImage.url, width: homeImage.width, height: homeImage.height,
  });
  const articles = [
    ['en', 'cursor-ide-rules-for-ai'],
    ['es', 'reglas-cursor-ide-para-ia'],
    ['zh', 'cursor-ide-ai-bianma-guize-youhua'],
    ['ar', 'qawaid-cursor-ide-lilthakaa-alistinaei-tahseen-barmaja'],
    ['hi', 'cursor-ide-niyam-kritrim-buddhimatta-coding-ke-liye'],
  ] as const;
  for (const [language, slug] of articles) {
    const article = await getArticleBySlug(slug, language);
    assert.ok(article);
    const thumbnail = article.metadata.thumbnailUrl!;
    assert.ok(thumbnail.startsWith(`https://${mediaRemotePatterns[0].hostname}/marketing/`));
    const script = ArticleJsonLd({ article, url: `https://kirill-markin.com/${language}/article/` });
    const schema = JSON.parse(script.props.dangerouslySetInnerHTML.__html) as { image: string };
    assert.equal(schema.image, thumbnail);
    assert.ok(!schema.image.includes('kirill-markin.com/https://'));
  }
});

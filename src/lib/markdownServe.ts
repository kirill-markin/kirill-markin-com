import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { getTranslation, getPathSegmentByLanguage } from '@/lib/localization';
import { servicesOtherData } from '@/data/servicesOther';
import { SITE_URL } from '@/data/contacts';

type MarkdownResult = {
  markdown: string;
  status: 200 | 404;
};

export async function renderHomeMarkdown(language: string): Promise<MarkdownResult> {
  const home = getTranslation('home', language);
  const personalInfo = getTranslation('personalInfo', language);
  const articles = await getAllArticles(language);
  const recentArticles = articles.slice(0, 5);
  const articlesSegment = getPathSegmentByLanguage('articles', language);
  const servicesSegment = getPathSegmentByLanguage('services', language);
  const meetSegment = getPathSegmentByLanguage('meet', language);
  const langPrefix = language === 'en' ? '' : `/${language}`;

  const lines: string[] = [
    `# Kirill Markin`,
    ``,
    `${personalInfo.jobTitle} | ${personalInfo.secondaryTitle} | ${personalInfo.tertiaryTitle}`,
    ``,
    home.description,
    ``,
    `## Recent Articles`,
    ``,
    ...recentArticles.map(a =>
      `- [${a.metadata.title}](${SITE_URL}${langPrefix}/${articlesSegment}/${a.slug}/) — ${a.metadata.date ? new Date(a.metadata.date).toISOString().slice(0, 10) : ''}`
    ),
    ``,
    `[All articles](${SITE_URL}${langPrefix}/${articlesSegment}/)`,
    ``,
    `## Services`,
    ``,
    ...servicesOtherData.map(s =>
      `- [${s.name}](${SITE_URL}${s.buttonUrl}): ${s.description}`
    ),
    ``,
    `[All services](${SITE_URL}${langPrefix}/${servicesSegment}/)`,
    ``,
    `## Contact`,
    ``,
    `- [Schedule a meeting](${SITE_URL}${langPrefix}/${meetSegment}/)`,
    `- [Website](${SITE_URL}${langPrefix}/)`,
  ];

  return { markdown: lines.join('\n'), status: 200 };
}

export async function renderArticlesListingMarkdown(language: string): Promise<MarkdownResult> {
  const articlesTranslation = getTranslation('articles', language);
  const articles = await getAllArticles(language);
  const articlesSegment = getPathSegmentByLanguage('articles', language);
  const langPrefix = language === 'en' ? '' : `/${language}`;

  const lines: string[] = [
    `# ${articlesTranslation.title}`,
    ``,
    articlesTranslation.description,
    ``,
  ];

  for (const a of articles) {
    const date = a.metadata.date ? new Date(a.metadata.date).toISOString().slice(0, 10) : '';
    const tags = a.metadata.tags.length > 0 ? ` [${a.metadata.tags.join(', ')}]` : '';
    lines.push(`## [${a.metadata.title}](${SITE_URL}${langPrefix}/${articlesSegment}/${a.slug}/)`);
    lines.push(``);
    lines.push(`${date}${tags}`);
    if (a.metadata.description) {
      lines.push(``);
      lines.push(a.metadata.description);
    }
    lines.push(``);
  }

  return { markdown: lines.join('\n'), status: 200 };
}

export async function renderArticleMarkdown(slug: string, language: string): Promise<MarkdownResult> {
  const article = await getArticleBySlug(slug, language);
  if (!article) {
    return { markdown: `# 404\n\nArticle not found: ${slug}`, status: 404 };
  }

  return { markdown: article.content, status: 200 };
}

export async function renderServicesListingMarkdown(language: string): Promise<MarkdownResult> {
  const servicesTranslation = getTranslation('services', language);
  const langPrefix = language === 'en' ? '' : `/${language}`;
  const servicesSegment = getPathSegmentByLanguage('services', language);

  const categories = ['people', 'business', 'journalists', 'police'] as const;

  const lines: string[] = [
    `# ${servicesTranslation.title}`,
    ``,
    servicesTranslation.description,
    ``,
  ];

  for (const categoryId of categories) {
    const categoryName = servicesTranslation.serviceCategories[categoryId];
    const categoryServices = servicesOtherData.filter(s => s.categoryId === categoryId);

    if (categoryServices.length > 0) {
      lines.push(`## ${categoryName}`);
      lines.push(``);
      for (const s of categoryServices) {
        lines.push(`### ${s.name}`);
        lines.push(``);
        lines.push(s.description);
        if (s.buttonUrl) {
          lines.push(``);
          lines.push(`[${s.buttonText}](${SITE_URL}${s.buttonUrl})`);
        }
        lines.push(``);
      }
    }
  }

  lines.push(`[All services](${SITE_URL}${langPrefix}/${servicesSegment}/)`);

  return { markdown: lines.join('\n'), status: 200 };
}

export async function renderMeetMarkdown(language: string): Promise<MarkdownResult> {
  const meetTranslation = getTranslation('meet', language);
  const langPrefix = language === 'en' ? '' : `/${language}`;
  const meetSegment = getPathSegmentByLanguage('meet', language);

  const lines: string[] = [
    `# ${meetTranslation.title}`,
    ``,
    meetTranslation.description,
    ``,
    `## ${meetTranslation.shortMeeting.title}`,
    ``,
    meetTranslation.shortMeeting.description,
    ``,
    `[Book](${SITE_URL}${langPrefix}/${meetSegment}/short/)`,
    ``,
    `## ${meetTranslation.mediumMeeting.title}`,
    ``,
    meetTranslation.mediumMeeting.description,
    ``,
    `[Book](${SITE_URL}${langPrefix}/${meetSegment}/medium/)`,
    ``,
    `## ${meetTranslation.longMeeting.title}`,
    ``,
    meetTranslation.longMeeting.description,
    ``,
    `[Book](${SITE_URL}${langPrefix}/${meetSegment}/long/)`,
  ];

  return { markdown: lines.join('\n'), status: 200 };
}

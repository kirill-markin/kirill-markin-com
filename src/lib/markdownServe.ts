import { getPublishedMarkdownArticles, getPublishedMarkdownArticleBySlug } from '@/lib/articleIndex';
import { getTranslation, getPathSegmentByLanguage } from '@/lib/localization';
import { servicesOtherData } from '@/data/servicesOther';
import { SITE_URL, VCARD_DATA, HEIGHT_CM } from '@/data/contacts';
import { socialLinks } from '@/data/socialLinks';
import { bigMediaMentions, smallMediaMentions, type MediaMention } from '@/data/mediaMentions';
import { getWeightSeries } from '@/lib/weight';
import type { WeightPoint } from '@/types/weight';

type MarkdownResult = {
  markdown: string;
  status: 200 | 404;
};

function formatMediaMention(m: MediaMention): string {
  const title = m.alternativeTitle || m.title;
  const parts: string[] = [];
  if (m.publisher) parts.push(m.publisher);
  if (m.date) parts.push(m.date);
  if (m.type) parts.push(m.type);
  if (m.achievementValue) {
    parts.push(`${m.achievementValue}${m.achievementLabel ? ' ' + m.achievementLabel : ''}`);
  }
  const suffix = parts.length > 0 ? ` — ${parts.join(', ')}` : '';
  return `- [${title}](${m.url})${suffix}`;
}

export async function renderHomeMarkdown(language: string): Promise<MarkdownResult> {
  const home = getTranslation('home', language);
  const personalInfo = getTranslation('personalInfo', language);
  const articles = await getPublishedMarkdownArticles(language);
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
      `- [${a.title}](${SITE_URL}${langPrefix}/${articlesSegment}/${a.slug}/) — ${a.date ? new Date(a.date).toISOString().slice(0, 10) : ''}`
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
    `## Professional Profiles`,
    ``,
    ...socialLinks
      .filter(s => !s.hidden && s.avatarContact)
      .map(s => {
        const achievement = s.achievement ? ` (${s.achievement.value} ${s.achievement.label})` : '';
        return `- [${s.name}](${s.url}) — ${s.username}${achievement}`;
      }),
    ``,
    `## Media & Publications`,
    ``,
    ...[...bigMediaMentions, ...smallMediaMentions].map(formatMediaMention),
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
  const articles = await getPublishedMarkdownArticles(language);
  const articlesSegment = getPathSegmentByLanguage('articles', language);
  const langPrefix = language === 'en' ? '' : `/${language}`;

  const lines: string[] = [
    `# ${articlesTranslation.title}`,
    ``,
    articlesTranslation.description,
    ``,
  ];

  for (const a of articles) {
    const date = a.date ? new Date(a.date).toISOString().slice(0, 10) : '';
    const tags = a.tags.length > 0 ? ` [${a.tags.join(', ')}]` : '';
    lines.push(`## [${a.title}](${SITE_URL}${langPrefix}/${articlesSegment}/${a.slug}/)`);
    lines.push(``);
    lines.push(`${date}${tags}`);
    if (a.description) {
      lines.push(``);
      lines.push(a.description);
    }
    lines.push(``);
  }

  return { markdown: lines.join('\n'), status: 200 };
}

export async function renderArticleMarkdown(slug: string, language: string): Promise<MarkdownResult> {
  const article = await getPublishedMarkdownArticleBySlug(slug, language);
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
    ``,
    `## ${meetTranslation.allMeetings.title}`,
    ``,
    meetTranslation.allMeetings.description,
    ``,
    `[View all](${SITE_URL}${langPrefix}/${meetSegment}/all/)`,
  ];

  return { markdown: lines.join('\n'), status: 200 };
}

const DEFAULT_RANGE_DAYS = 365;
const GENOME_URL = 'https://storage.googleapis.com/personal-public-data-km/raw/genome_snps-kirill_markin-atlas_ru-2022_02_22.txt';

const computeAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const computeWeightStats = (
  series: ReadonlyArray<WeightPoint>,
  rangeDays: number,
): { filtered: ReadonlyArray<WeightPoint>; min: WeightPoint; max: WeightPoint; latest: WeightPoint; oldest: WeightPoint } => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - rangeDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const filtered = series.filter((p) => p.date >= cutoffStr);
  const data = filtered.length >= 2 ? filtered : series;

  let min = data[0];
  let max = data[0];
  for (const p of data) {
    if (p.weightKg < min.weightKg) min = p;
    if (p.weightKg > max.weightKg) max = p;
  }

  return {
    filtered: data,
    min,
    max,
    latest: data[data.length - 1],
    oldest: data[0],
  };
};

export async function renderDashboardsBodyMarkdown(): Promise<MarkdownResult> {
  const series = await getWeightSeries();
  const canonicalUrl = `${SITE_URL}/dashboards/body/`;

  if (series.length === 0) {
    const lines: string[] = [
      `# Body Dashboard`,
      ``,
      `Body metrics dashboard by ${VCARD_DATA.fullName}.`,
      ``,
      `## Facts`,
      ``,
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Height | ${HEIGHT_CM} cm |`,
      `| Date of birth | ${VCARD_DATA.birthday} |`,
      `| Age | ${computeAge(VCARD_DATA.birthday)} |`,
      ``,
      `## Weight`,
      ``,
      `Weight data is unavailable in this local build because BigQuery credentials are not configured.`,
      ``,
      `## Raw Data`,
      ``,
      `- [Full Genome — SNP Genotyping Data (TSV, ~16 MB)](${GENOME_URL}) — Atlas Biomed, February 2022`,
      ``,
      `## Links`,
      ``,
      `- [Interactive dashboard](${canonicalUrl})`,
    ];

    return { markdown: lines.join('\n'), status: 200 };
  }

  const stats = computeWeightStats(series, DEFAULT_RANGE_DAYS);
  const csvSizeKb = Math.round((series.length * 16) / 1024);

  const weightChange = stats.latest.weightKg - stats.oldest.weightKg;
  const changeSign = weightChange >= 0 ? '+' : '';
  const recentPoints = stats.filtered.slice(-10);

  const lines: string[] = [
    `# Body Dashboard`,
    ``,
    `Body metrics dashboard by ${VCARD_DATA.fullName}.`,
    ``,
    `## Facts`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Height | ${HEIGHT_CM} cm |`,
    `| Date of birth | ${VCARD_DATA.birthday} |`,
    `| Age | ${computeAge(VCARD_DATA.birthday)} |`,
    ``,
    `## Weight (last ${DEFAULT_RANGE_DAYS} days)`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Latest | ${stats.latest.weightKg} kg (${stats.latest.date}) |`,
    `| Min | ${stats.min.weightKg} kg (${stats.min.date}) |`,
    `| Max | ${stats.max.weightKg} kg (${stats.max.date}) |`,
    `| Change | ${changeSign}${weightChange.toFixed(1)} kg over period |`,
    `| Data points | ${stats.filtered.length} entries |`,
    ``,
    `### Recent Measurements`,
    ``,
    `| Date | Weight (kg) |`,
    `|------|-------------|`,
    ...recentPoints.map((p) => `| ${p.date} | ${p.weightKg} |`),
    ``,
    `## Raw Data`,
    ``,
    `- [Body Metrics — Weight Series (CSV, ~${csvSizeKb} KB)](${SITE_URL}/data/body-metrics-weight-series.csv) — ${series.length} data points, updated daily`,
    `- [Full Genome — SNP Genotyping Data (TSV, ~16 MB)](${GENOME_URL}) — Atlas Biomed, February 2022`,
    ``,
    `## Links`,
    ``,
    `- [Interactive dashboard](${canonicalUrl})`,
  ];

  return { markdown: lines.join('\n'), status: 200 };
}

export async function renderDashboardsListingMarkdown(): Promise<MarkdownResult> {
  const lines: string[] = [
    `# Dashboards`,
    ``,
    `Public dashboards by ${VCARD_DATA.fullName} with personal metrics, health data, and product activity data.`,
    ``,
    `- [Body Dashboard](${SITE_URL}/dashboards/body/) — weight tracking, body facts, raw data downloads`,
    `- [Flashcards Open Source App: Public Activity](https://flashcards-open-source-app.com/dashboards/) — daily unique reviewers and review events by platform from the public API`,
  ];

  return { markdown: lines.join('\n'), status: 200 };
}

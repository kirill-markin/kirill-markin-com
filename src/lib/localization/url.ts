import { Translation } from '@/types/article';

import { DEFAULT_LANGUAGE, isValidLanguage } from './languages';
import { getSubPathSegmentByLanguage, PATH_SEGMENTS, SUB_PATH_SEGMENTS } from './routes';
import { translations as translationSections } from './translations';

type QueryParams = Record<string, string>;

const KNOWN_SERVICE_CATEGORIES = ['all', 'people', 'business', 'journalists', 'police'] as const;

function parseQueryParams(queryString: string | undefined): QueryParams {
    if (!queryString) {
        return {};
    }

    return queryString.split('&').reduce<QueryParams>((params, param) => {
        const [key, value] = param.split('=');

        if (key && value) {
            return {
                ...params,
                [key]: decodeURIComponent(value),
            };
        }

        return params;
    }, {});
}

function buildQueryString(queryParams: QueryParams): string {
    if (Object.keys(queryParams).length === 0) {
        return '';
    }

    const query = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    return `?${query}`;
}

function translateCategoryQuery(
    queryParams: QueryParams,
    currentLanguage: string,
    targetLanguage: string
): QueryParams {
    if (!queryParams.category) {
        return queryParams;
    }

    let categoryInternalName: string | undefined;

    for (const categoryKey of KNOWN_SERVICE_CATEGORIES) {
        const localizedCategory = getSubPathSegmentByLanguage('services', categoryKey, currentLanguage);

        if (localizedCategory === queryParams.category) {
            categoryInternalName = categoryKey;
            break;
        }
    }

    if (!categoryInternalName) {
        return queryParams;
    }

    return {
        ...queryParams,
        category: getSubPathSegmentByLanguage('services', categoryInternalName, targetLanguage),
    };
}

function translateTagQuery(
    queryParams: QueryParams,
    currentLanguage: string,
    targetLanguage: string
): QueryParams {
    if (!queryParams.tag) {
        return queryParams;
    }

    const knownTags = Object.keys(SUB_PATH_SEGMENTS.articles || {});
    let tagInternalName: string | undefined;

    for (const tagKey of knownTags) {
        const localizedTag = getSubPathSegmentByLanguage('articles', tagKey, currentLanguage);

        if (localizedTag === queryParams.tag) {
            tagInternalName = tagKey;
            break;
        }
    }

    if (!tagInternalName) {
        return queryParams;
    }

    return {
        ...queryParams,
        tag: getSubPathSegmentByLanguage('articles', tagInternalName, targetLanguage),
    };
}

function isArticlePagePath(currentPath: string): boolean {
    return Object.values(PATH_SEGMENTS.articles).some((segment) => (
        currentPath.includes(`/${segment}/`) && !currentPath.endsWith(`/${segment}/`)
    ));
}

function buildArticleUrl(targetLanguage: string, articleTranslations: Translation[]): string | null {
    const targetTranslation = articleTranslations.find((translation) => translation.language === targetLanguage);

    if (!targetTranslation) {
        return null;
    }

    const articlesSegment = targetLanguage === DEFAULT_LANGUAGE
        ? PATH_SEGMENTS.articles[DEFAULT_LANGUAGE]
        : isValidLanguage(targetLanguage)
            ? PATH_SEGMENTS.articles[targetLanguage]
            : PATH_SEGMENTS.articles[DEFAULT_LANGUAGE];

    if (targetLanguage === DEFAULT_LANGUAGE) {
        return `/${articlesSegment}/${targetTranslation.slug}/`;
    }

    return `/${targetLanguage}/${articlesSegment}/${targetTranslation.slug}/`;
}

function getBasePath(pathWithoutQuery: string): string[] {
    const pathSegments = pathWithoutQuery.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    const hasLanguagePrefix = isValidLanguage(firstSegment);

    return hasLanguagePrefix ? pathSegments.slice(1) : pathSegments;
}

function resolveSegment(basePath: string[]): { segmentType: string; segmentIndex: number } | null {
    for (let index = 0; index < basePath.length; index += 1) {
        const segment = basePath[index];
        const foundSegmentType = Object.keys(PATH_SEGMENTS).find((key) => (
            Object.values(PATH_SEGMENTS[key]).some((value) => value === segment)
        ));

        if (foundSegmentType) {
            return {
                segmentType: foundSegmentType,
                segmentIndex: index,
            };
        }
    }

    return null;
}

function resolveSubsegmentKey(segmentType: string, currentSubsegment: string): string | null {
    const subPathSegments = SUB_PATH_SEGMENTS[segmentType];

    if (!subPathSegments) {
        return null;
    }

    for (const [subsegmentKey, subsegmentValues] of Object.entries(subPathSegments)) {
        if (Object.values(subsegmentValues).some((value) => value === currentSubsegment)) {
            return subsegmentKey;
        }
    }

    return null;
}

function buildLocalizedPath(
    targetLanguage: string,
    basePath: string[],
    segmentType: string,
    segmentIndex: number,
    queryString: string
): string {
    const resolvedTargetLanguage = isValidLanguage(targetLanguage) ? targetLanguage : DEFAULT_LANGUAGE;
    const newSegment = PATH_SEGMENTS[segmentType][resolvedTargetLanguage] || PATH_SEGMENTS[segmentType][DEFAULT_LANGUAGE];
    const currentSubsegment = basePath[segmentIndex + 1];

    if (currentSubsegment && SUB_PATH_SEGMENTS[segmentType]) {
        const subsegmentKey = resolveSubsegmentKey(segmentType, currentSubsegment);

        if (subsegmentKey) {
            const newSubsegment = getSubPathSegmentByLanguage(segmentType, subsegmentKey, resolvedTargetLanguage);
            const remainingPath = basePath.slice(segmentIndex + 2).join('/');
            const remainingWithSlash = remainingPath ? `/${remainingPath}` : '';
            const localizedPath = resolvedTargetLanguage === DEFAULT_LANGUAGE
                ? `/${newSegment}/${newSubsegment}${remainingWithSlash}/`
                : `/${resolvedTargetLanguage}/${newSegment}/${newSubsegment}${remainingWithSlash}/`;

            return `${localizedPath}${queryString}`;
        }
    }

    const restOfPath = basePath.slice(segmentIndex + 1).join('/');
    const restWithSlash = restOfPath ? `/${restOfPath}` : '';
    const localizedPath = resolvedTargetLanguage === DEFAULT_LANGUAGE
        ? `/${newSegment}${restWithSlash}/`
        : `/${resolvedTargetLanguage}/${newSegment}${restWithSlash}/`;

    return `${localizedPath}${queryString}`;
}

/**
 * Check if translation exists for a specific section
 * @param section Section name (e.g. 'articles', 'services')
 * @param language Target language
 * @returns True if translation exists
 */
export function hasTranslation(section: string, language: string): boolean {
    if (Object.keys(PATH_SEGMENTS).includes(section)) {
        return true;
    }

    if (translationSections[section as keyof typeof translationSections]) {
        const sectionTranslations = translationSections[section as keyof typeof translationSections];
        return language in sectionTranslations;
    }

    return false;
}

/**
 * Get URL for the current page in a different language
 * @param targetLanguage Language to translate URL to
 * @param currentLanguage Current language
 * @param currentPath Current path
 * @param translations Available translations (for articles)
 * @returns URL for the current page in the target language or null if translation not available
 */
export function getUrlForLanguage(
    targetLanguage: string,
    currentLanguage: string,
    currentPath: string,
    translations?: Translation[]
): string | null {
    const [pathWithoutQuery, queryString] = currentPath.split('?');
    const parsedQueryParams = parseQueryParams(queryString);
    const translatedCategoryQuery = translateCategoryQuery(parsedQueryParams, currentLanguage, targetLanguage);
    const translatedQueryParams = translateTagQuery(translatedCategoryQuery, currentLanguage, targetLanguage);
    const localizedQueryString = buildQueryString(translatedQueryParams);

    if (isArticlePagePath(currentPath) && translations) {
        return buildArticleUrl(targetLanguage, translations);
    }

    const basePath = getBasePath(pathWithoutQuery);

    if (basePath.length === 0) {
        return targetLanguage === DEFAULT_LANGUAGE ? '/' : `/${targetLanguage}/`;
    }

    const resolvedSegment = resolveSegment(basePath);

    if (!resolvedSegment) {
        return null;
    }

    return buildLocalizedPath(
        targetLanguage,
        basePath,
        resolvedSegment.segmentType,
        resolvedSegment.segmentIndex,
        localizedQueryString
    );
}

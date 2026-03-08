import {
    DEFAULT_LANGUAGE,
    PATH_SEGMENTS,
    SUB_PATH_SEGMENTS,
    SUPPORTED_LANGUAGES,
    getPathSegmentByLanguage,
    getSubPathSegmentByLanguage,
    getTranslation,
    getUrlForLanguage,
} from '@/lib/localization';

describe('localization', () => {
    describe('getPathSegmentByLanguage', () => {
        it('returns localized top-level path segments across all supported languages', () => {
            for (const [segmentKey, localizedSegments] of Object.entries(PATH_SEGMENTS)) {
                for (const language of SUPPORTED_LANGUAGES) {
                    expect(getPathSegmentByLanguage(segmentKey, language)).toBe(localizedSegments[language]);
                }
            }
        });
    });

    describe('getSubPathSegmentByLanguage', () => {
        it('returns localized sub-path segments across all supported languages', () => {
            for (const [segmentKey, subSegments] of Object.entries(SUB_PATH_SEGMENTS)) {
                for (const [subSegmentKey, localizedSubSegments] of Object.entries(subSegments)) {
                    for (const language of SUPPORTED_LANGUAGES) {
                        expect(getSubPathSegmentByLanguage(segmentKey, subSegmentKey, language)).toBe(localizedSubSegments[language]);
                    }
                }
            }
        });
    });

    describe('getUrlForLanguage', () => {
        it('switches the home page to a localized root', () => {
            expect(getUrlForLanguage('es', DEFAULT_LANGUAGE, '/')).toBe('/es/');
        });

        it('switches base section pages', () => {
            expect(getUrlForLanguage('es', DEFAULT_LANGUAGE, '/services/')).toBe('/es/servicios/');
        });

        it('switches sub-route pages', () => {
            expect(getUrlForLanguage('zh', DEFAULT_LANGUAGE, '/meet/short/')).toBe('/zh/yuyue/mianfei/');
        });

        it('switches translated article pages when a target translation exists', () => {
            expect(getUrlForLanguage('es', DEFAULT_LANGUAGE, '/articles/original-slug/', [
                {
                    language: 'es',
                    slug: 'articulo-traducido',
                },
            ])).toBe('/es/articulos/articulo-traducido/');
        });

        it('returns null for article pages when a target translation is missing', () => {
            expect(getUrlForLanguage('es', DEFAULT_LANGUAGE, '/articles/original-slug/', [
                {
                    language: 'zh',
                    slug: 'translated-article',
                },
            ])).toBeNull();
        });

        it('translates service category query parameters', () => {
            expect(getUrlForLanguage('zh', 'es', '/es/servicios/?category=empresas')).toBe('/zh/zixun/?category=qiye');
        });

        it('translates article tag query parameters', () => {
            const expectedTag = encodeURIComponent('एआई');

            expect(getUrlForLanguage('hi', 'ar', '/ar/maqalat/?tag=الذكاء-الاصطناعي')).toBe(`/hi/gyan/?tag=${expectedTag}`);
        });

        it('returns null for unknown paths', () => {
            expect(getUrlForLanguage('es', DEFAULT_LANGUAGE, '/unknown/')).toBeNull();
        });
    });

    describe('getTranslation', () => {
        it('returns section translations for a supported language', () => {
            expect(getTranslation('common', 'es').siteName).toBe('Kirill Markin | Asesor de Estrategia de IA');
        });

        it('falls back to English when a section translation is missing', () => {
            expect(getTranslation('subscribe', 'es').title).toBe(getTranslation('subscribe', DEFAULT_LANGUAGE).title);
        });

        it('falls back to English when the language is unsupported', () => {
            expect(getTranslation('emailPopup', 'fr').title).toBe(getTranslation('emailPopup', DEFAULT_LANGUAGE).title);
        });
    });
});

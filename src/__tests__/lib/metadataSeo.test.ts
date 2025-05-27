import {
    generateHomePageMetadata,
    generateArticlesPageMetadata,
    generateServicesPageMetadata,
    generateMeetPageMetadata,
    generatePayPageMetadata
} from '@/lib/metadata';
import { validateMetadata } from '@/lib/seoValidation';

// Mock the translations to avoid dependencies
jest.mock('@/lib/localization', () => ({
    getTranslation: jest.fn((section, language) => {
        const mockTranslations: Record<string, Record<string, Record<string, string | Record<string, string>>>> = {
            home: {
                en: {
                    title: 'A'.repeat(65),
                    description: 'A'.repeat(155),
                    metaTitle: 'A'.repeat(65),
                    metaDescription: 'A'.repeat(155),
                },
                es: {
                    title: 'A'.repeat(65),
                    description: 'A'.repeat(155),
                    metaTitle: 'A'.repeat(65),
                    metaDescription: 'A'.repeat(155),
                }
            },
            articles: {
                en: {
                    title: 'A'.repeat(65),
                    description: 'A'.repeat(155),
                    metaTitle: 'A'.repeat(65),
                    metaDescription: 'A'.repeat(155),
                }
            },
            services: {
                en: {
                    title: 'A'.repeat(34),
                    description: 'A'.repeat(155),
                    metaTitle: 'A'.repeat(65),
                    metaDescription: 'A'.repeat(155),
                    serviceCategories: {
                        all: 'A'.repeat(30),
                        people: 'A'.repeat(30),
                        business: 'A'.repeat(30),
                        journalists: 'A'.repeat(30)
                    }
                }
            },
            meet: {
                en: {
                    title: 'A'.repeat(65),
                    description: 'A'.repeat(155),
                    metaTitle: 'A'.repeat(65),
                    metaDescription: 'A'.repeat(155),
                    shortMeeting: {
                        title: 'A'.repeat(65),
                        description: 'A'.repeat(155),
                        metaTitle: 'A'.repeat(65),
                        metaDescription: 'A'.repeat(155)
                    },
                    allMeetings: {
                        title: 'A'.repeat(65),
                        description: 'A'.repeat(155),
                        metaTitle: 'A'.repeat(65),
                        metaDescription: 'A'.repeat(155)
                    }
                }
            },
            pay: {
                en: {
                    title: 'A'.repeat(65),
                    description: 'A'.repeat(155),
                    metaTitle: 'A'.repeat(65),
                    metaDescription: 'A'.repeat(155),
                    stripe: {
                        title: 'A'.repeat(65),
                        description: 'A'.repeat(155),
                        metaTitle: 'A'.repeat(65),
                        metaDescription: 'A'.repeat(155)
                    }
                }
            }
        };

        return mockTranslations[section]?.[language] || mockTranslations[section]?.['en'] || {};
    }),
    getLocaleForLanguage: jest.fn(() => 'en_US'),
    getPathSegmentByLanguage: jest.fn((segment) => segment),
    getSubPathSegmentByLanguage: jest.fn((_, subSegment) => subSegment),
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'es'],
    getLanguageAlternates: jest.fn(() => ({})),
}));

describe('SEO Metadata Tests', () => {
    describe('Home Page Metadata', () => {
        it('should generate valid SEO metadata for the home page in English', () => {
            const metadata = generateHomePageMetadata('en');
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should generate valid SEO metadata for the home page in Spanish', () => {
            const metadata = generateHomePageMetadata('es');
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should include OpenGraph metadata with valid title and description', () => {
            const metadata = generateHomePageMetadata('en');
            const ogTitle = metadata.openGraph?.title as string;
            const ogDescription = metadata.openGraph?.description as string;

            const ogValidation = validateMetadata(ogTitle, ogDescription);
            expect(ogValidation.valid).toBe(true);
        });
    });

    describe('Articles Page Metadata', () => {
        it('should generate valid SEO metadata for the articles page', () => {
            const metadata = generateArticlesPageMetadata({ language: 'en' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should generate valid SEO metadata for tag-filtered articles page', () => {
            const metadata = generateArticlesPageMetadata({ language: 'en', tag: 'ai' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            console.log('Title:', metadata.title);
            console.log('Title length:', (metadata.title as string).length);
            console.log('Title validation:', validation.title);

            console.log('Description:', metadata.description);
            console.log('Description length:', (metadata.description as string).length);
            console.log('Description validation:', validation.description);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });
    });

    describe('Services Page Metadata', () => {
        it('should generate valid SEO metadata for the services page', () => {
            const metadata = generateServicesPageMetadata({ language: 'en' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should generate valid SEO metadata for category-filtered services page', () => {
            const metadata = generateServicesPageMetadata({ language: 'en', category: 'business' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            console.log('Title:', metadata.title);
            console.log('Title length:', (metadata.title as string).length);
            console.log('Title validation:', validation.title);

            console.log('Description:', metadata.description);
            console.log('Description length:', (metadata.description as string).length);
            console.log('Description validation:', validation.description);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });
    });

    describe('Meet Page Metadata', () => {
        it('should generate valid SEO metadata for the meeting index page', () => {
            const metadata = generateMeetPageMetadata({ language: 'en', type: 'index' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should generate valid SEO metadata for the short meeting page', () => {
            const metadata = generateMeetPageMetadata({ language: 'en', type: 'short' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should generate valid SEO metadata for the all meetings page', () => {
            const metadata = generateMeetPageMetadata({ language: 'en', type: 'all' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });
    });

    describe('Pay Page Metadata', () => {
        it('should generate valid SEO metadata for the payment options page', () => {
            const metadata = generatePayPageMetadata({ language: 'en', type: 'index' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should generate valid SEO metadata for the Stripe payment page', () => {
            const metadata = generatePayPageMetadata({ language: 'en', type: 'stripe' });
            const validation = validateMetadata(metadata.title as string, metadata.description as string);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });
    });
}); 
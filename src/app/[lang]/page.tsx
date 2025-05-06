import { Metadata } from 'next';
import { getLocaleForLanguage, DEFAULT_LANGUAGE } from '@/lib/localization';
import { redirect } from 'next/navigation';

interface HomePageProps {
    params: Promise<{
        lang: string;
    }>;
}

// Translations for static text
const translations = {
    title: {
        'en': 'Kirill Markin - Personal Website',
        'es': 'Kirill Markin - Sitio Web Personal',
        'zh': 'Kirill Markin - 个人网站',
        'ar': 'كيريل ماركين - موقع شخصي',
        'hi': 'किरिल मार्किन - व्यक्तिगत वेबसाइट',
    },
    description: {
        'en': 'Personal website of Kirill Markin - strategy & technology consultant, product and growth lead, AI & data specialist.',
        'es': 'Sitio web personal de Kirill Markin - consultor de estrategia y tecnología, líder de producto y crecimiento, especialista en IA y datos.',
        'zh': 'Kirill Markin的个人网站 - 战略与技术顾问，产品和增长负责人，AI和数据专家。',
        'ar': 'الموقع الشخصي لكيريل ماركين - مستشار استراتيجية وتكنولوجيا، قائد المنتج والنمو، متخصص في الذكاء الاصطناعي والبيانات.',
        'hi': 'किरिल मार्किन की व्यक्तिगत वेबसाइट - रणनीति और प्रौद्योगिकी सलाहकार, उत्पाद और विकास प्रमुख, AI और डेटा विशेषज्ञ।',
    },
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
    const { lang } = await params;

    // For now, redirect the default language to the main site
    if (lang === DEFAULT_LANGUAGE) {
        return {
            title: translations.title.en,
            description: translations.description.en,
        };
    }

    // Get language-specific title and description
    const title = translations.title[lang as keyof typeof translations.title] || translations.title.en;
    const description = translations.description[lang as keyof typeof translations.description] || translations.description.en;

    return {
        title,
        description,
        alternates: {
            canonical: `https://kirill-markin.com/${lang}/`,
            languages: {
                'en': 'https://kirill-markin.com/',
                'es': 'https://kirill-markin.com/es/',
                'zh': 'https://kirill-markin.com/zh/',
                'ar': 'https://kirill-markin.com/ar/',
                'hi': 'https://kirill-markin.com/hi/',
            },
        },
        openGraph: {
            locale: getLocaleForLanguage(lang),
        },
    };
}

// For now, redirect from /[lang] to the main site for English or
// to the language page when it's fully translated
export default async function LocalizedHomePage({ params }: HomePageProps) {
    const { lang } = await params;

    // For English, redirect to the main site
    if (lang === DEFAULT_LANGUAGE) {
        redirect('/');
    }

    // For other languages, reuse the main page content
    // In the future, this will be replaced with localized content
    redirect('/');
} 
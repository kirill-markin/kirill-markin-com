/**
 * Localization utilities for multilingual support
 */

import { Translation } from '@/types/article';

/**
 * List of all supported languages
 */
export const SUPPORTED_LANGUAGES = ['en', 'es', 'zh', 'ar', 'hi'];

/**
 * Default language (used for fallbacks)
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Human-readable language names for UI
 */
export const LANGUAGE_NAMES: Record<string, string> = {
    'en': 'English',
    'es': 'Español',
    'zh': '中文',
    'ar': 'العربية',
    'hi': 'हिन्दी',
};

/**
 * Path segment mapping for URLs in different languages
 */
export const PATH_SEGMENTS: Record<string, Record<string, string>> = {
    'articles': {
        'en': 'articles',
        'es': 'articulos',
        'zh': 'wenzhang',
        'ar': 'maqalat',
        'hi': 'lekh',
    },
    'services': {
        'en': 'services',
        'es': 'servicios',
        'zh': 'fuwu',
        'ar': 'khadamat',
        'hi': 'sevaen',
    },
    'meet': {
        'en': 'meet',
        'es': 'reunirse',
        'zh': 'huijian',
        'ar': 'liqaa',
        'hi': 'milna',
    },
    'pay': {
        'en': 'pay',
        'es': 'pagar',
        'zh': 'zhifu',
        'ar': 'dafa',
        'hi': 'bhugtan',
    },
};

/**
 * Sub-path segment mapping for URLs in different languages
 */
export const SUB_PATH_SEGMENTS: Record<string, Record<string, Record<string, string>>> = {
    'meet': {
        'short': {
            'en': 'short',
            'es': 'corto',
            'zh': 'duanzan',
            'ar': 'qasir',
            'hi': 'sankshipt'
        },
        'all': {
            'en': 'all',
            'es': 'todo',
            'zh': 'quanbu',
            'ar': 'kul',
            'hi': 'sabhi'
        }
    },
    'pay': {
        'stripe': {
            'en': 'stripe',
            'es': 'stripe',
            'zh': 'stripe',
            'ar': 'stripe',
            'hi': 'stripe'
        }
    },
    'services': {
        'all': {
            'en': 'all',
            'es': 'todos',
            'zh': 'quanbu',
            'ar': 'jamia',
            'hi': 'sabhi'
        },
        'people': {
            'en': 'people',
            'es': 'personas',
            'zh': 'renyuan',
            'ar': 'ashkhas',
            'hi': 'log'
        },
        'business': {
            'en': 'business',
            'es': 'negocios',
            'zh': 'shangye',
            'ar': 'aamal',
            'hi': 'vyapaar'
        },
        'journalists': {
            'en': 'journalists',
            'es': 'periodistas',
            'zh': 'jizhe',
            'ar': 'sahafieen',
            'hi': 'patrakar'
        }
    }
};

/**
 * Get the localized path segment for a specific language
 * @param segment Original segment in English
 * @param language Target language code
 * @returns Localized path segment
 */
export function getPathSegmentByLanguage(
    segment: string,
    language: string
): string {
    // Return original segment for English or if mapping doesn't exist
    if (language === DEFAULT_LANGUAGE || !PATH_SEGMENTS[segment]) {
        return segment;
    }

    return PATH_SEGMENTS[segment]?.[language] || segment;
}

/**
 * Get the localized sub-path segment for a specific language
 * @param mainSegment Original main segment in English (e.g. 'meet')
 * @param subSegment Original sub-segment in English (e.g. 'short')
 * @param language Target language code
 * @returns Localized sub-path segment
 */
export function getSubPathSegmentByLanguage(
    mainSegment: string,
    subSegment: string,
    language: string
): string {
    // Return original sub-segment for English or if mapping doesn't exist
    if (language === DEFAULT_LANGUAGE ||
        !SUB_PATH_SEGMENTS[mainSegment] ||
        !SUB_PATH_SEGMENTS[mainSegment][subSegment]) {
        return subSegment;
    }

    return SUB_PATH_SEGMENTS[mainSegment][subSegment][language] || subSegment;
}

/**
 * Check if translation exists for a specific section
 * @param section Section name (e.g. 'articles', 'services')
 * @param language Target language
 * @returns True if translation exists
 */
export function hasTranslation(
    section: string,
    language: string
): boolean {
    // Base sections are always translated
    if (Object.keys(PATH_SEGMENTS).includes(section)) {
        return true;
    }

    // For other sections, check in translations object
    if (translations[section as keyof typeof translations]) {
        const sectionTranslations = translations[section as keyof typeof translations];
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
    // Extract query parameters
    const [pathWithoutQuery, queryString] = currentPath.split('?');
    const query = queryString ? `?${queryString}` : '';

    // For specific article pages with translations
    const isArticlePage = Object.values(PATH_SEGMENTS['articles']).some(segment =>
        currentPath.includes(`/${segment}/`) && !currentPath.endsWith(`/${segment}/`));

    if (isArticlePage && translations) {
        // Find the translation for the target language
        const targetTranslation = translations.find(t => t.language === targetLanguage);

        if (targetTranslation) {
            // Article has translation for target language
            const articlesSegment = targetLanguage === DEFAULT_LANGUAGE
                ? 'articles'
                : PATH_SEGMENTS['articles'][targetLanguage];

            return targetLanguage === DEFAULT_LANGUAGE
                ? `/articles/${targetTranslation.slug}/`
                : `/${targetLanguage}/${articlesSegment}/${targetTranslation.slug}/`;
        } else {
            // Article doesn't have translation for target language
            return null; // Return null to hide this language option
        }
    }

    // For index pages and other sections
    const pathSegments = pathWithoutQuery.split('/').filter(Boolean);

    // Check if the first segment is a language prefix
    const firstSegment = pathSegments[0];
    const hasLanguagePrefix = SUPPORTED_LANGUAGES.includes(firstSegment);

    // Determine base path without language prefix
    const basePath = hasLanguagePrefix ? pathSegments.slice(1) : pathSegments;

    if (basePath.length === 0) {
        // This is the home page
        return targetLanguage === DEFAULT_LANGUAGE ? '/' : `/${targetLanguage}/`;
    }

    // Find the segment type by checking all possible localized segments
    let segmentType: string | undefined;
    let segmentIndex = -1;

    for (let i = 0; i < basePath.length; i++) {
        const segment = basePath[i];
        const foundSegmentType = Object.keys(PATH_SEGMENTS).find(key => {
            return Object.values(PATH_SEGMENTS[key]).some(val => val === segment);
        });

        if (foundSegmentType) {
            segmentType = foundSegmentType;
            segmentIndex = i;
            break;
        }
    }

    if (segmentType) {
        // Create the new path with the translated segment
        const newSegment = PATH_SEGMENTS[segmentType][targetLanguage];

        // Handle subsegments if they exist
        if (basePath.length > segmentIndex + 1 && SUB_PATH_SEGMENTS[segmentType]) {
            const currentSubsegment = basePath[segmentIndex + 1];

            // Find which subsegment this matches
            let subsegmentKey: string | undefined;

            for (const subKey of Object.keys(SUB_PATH_SEGMENTS[segmentType])) {
                const subValues = SUB_PATH_SEGMENTS[segmentType][subKey];
                if (Object.values(subValues).some(val => val === currentSubsegment)) {
                    subsegmentKey = subKey;
                    break;
                }
            }

            if (subsegmentKey) {
                // We found a matching subsegment, translate it
                const newSubsegment = getSubPathSegmentByLanguage(segmentType, subsegmentKey, targetLanguage);

                // Get remaining path segments (for future nested paths)
                const remainingPath = basePath.slice(segmentIndex + 2).join('/');
                const remainingWithSlash = remainingPath ? `/${remainingPath}` : '';

                // Form the new path with both translated segment and subsegment
                const newPath = targetLanguage === DEFAULT_LANGUAGE
                    ? `/${newSegment}/${newSubsegment}${remainingWithSlash}/`
                    : `/${targetLanguage}/${newSegment}/${newSubsegment}${remainingWithSlash}/`;

                return newPath + query;
            }
        }

        // No subsegment found or no match, just use the remaining path as is
        const restOfPath = basePath.slice(segmentIndex + 1).join('/');
        const restWithSlash = restOfPath ? `/${restOfPath}` : '';

        // Form the new path
        const newPath = targetLanguage === DEFAULT_LANGUAGE
            ? `/${newSegment}${restWithSlash}/`
            : `/${targetLanguage}/${newSegment}${restWithSlash}/`;

        return newPath + query;
    }

    // If we can't determine the path structure, return null to show 404 rather than redirecting
    return null;
}

/**
 * Check if a language is valid and supported
 * @param language Language code to check
 * @returns Whether the language is supported
 */
export function isValidLanguage(language: string): boolean {
    return SUPPORTED_LANGUAGES.includes(language);
}

/**
 * Get locale string for a language (for HTML lang attribute and OpenGraph)
 * @param language Language code
 * @returns Locale string (e.g. 'en_US', 'es_ES')
 */
export function getLocaleForLanguage(language: string): string {
    const localeMap: Record<string, string> = {
        'en': 'en_US',
        'es': 'es_ES',
        'zh': 'zh_CN',
        'ar': 'ar_SA',
        'hi': 'hi_IN',
    };

    return localeMap[language] || 'en_US';
}

/**
 * All translations for the website
 */
export const translations = {
    common: {
        'en': {
            siteName: 'Kirill Markin',
            language: 'English',
            viewAllLink: 'View All',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        },
        'es': {
            siteName: 'Kirill Markin',
            language: 'Español',
            viewAllLink: 'Ver Todo',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        },
        'zh': {
            siteName: 'Kirill Markin',
            language: '中文',
            viewAllLink: '查看全部',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        },
        'ar': {
            siteName: 'Kirill Markin',
            language: 'العربية',
            viewAllLink: 'عرض الكل',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        },
        'hi': {
            siteName: 'Kirill Markin',
            language: 'हिन्दी',
            viewAllLink: 'सभी देखें',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        },
    },
    navigation: {
        'en': {
            home: 'Home',
            services: 'SERVICES',
            articles: 'ARTICLES',
            talkToKirill: 'TALK TO KIRILL',
            language: 'English'
        },
        'es': {
            home: 'Inicio',
            services: 'SERVICIOS',
            articles: 'ARTÍCULOS',
            talkToKirill: 'HABLAR CON KIRILL',
            language: 'Español'
        },
        'zh': {
            home: '首页',
            services: '服务',
            articles: '文章',
            talkToKirill: '与KIRILL交流',
            language: '中文'
        },
        'ar': {
            home: 'الرئيسية',
            services: 'الخدمات',
            articles: 'المقالات',
            talkToKirill: 'تحدث مع كيريل',
            language: 'العربية'
        },
        'hi': {
            home: 'होम',
            services: 'सेवाएं',
            articles: 'लेख',
            talkToKirill: 'किरिल से बात करें',
            language: 'हिन्दी'
        },
    },
    personalInfo: {
        'en': {
            jobTitle: 'Founder of ozma.io',
            secondaryTitle: 'Director of R&D',
            tertiaryTitle: 'AI & Data Engineer'
        },
        'es': {
            jobTitle: 'Fundador de ozma.io',
            secondaryTitle: 'Director de I+D',
            tertiaryTitle: 'Ingeniero de IA y Datos'
        },
        'zh': {
            jobTitle: 'ozma.io 创始人',
            secondaryTitle: '研发总监',
            tertiaryTitle: '人工智能与数据工程师'
        },
        'ar': {
            jobTitle: 'مؤسس ozma.io',
            secondaryTitle: 'مدير البحث والتطوير',
            tertiaryTitle: 'مهندس الذكاء الاصطناعي والبيانات'
        },
        'hi': {
            jobTitle: 'ozma.io के संस्थापक',
            secondaryTitle: 'अनुसंधान एवं विकास निदेशक',
            tertiaryTitle: 'एआई और डेटा इंजीनियर'
        }
    },
    footer: {
        'en': {
            contact: 'Contact',
            social: 'Social',
            media: 'Media',
            other: 'Other',
            talkToKirill: 'Talk to Kirill',
            copyright: '© {year} Kirill Markin',
            socialNetworks: {
                LinkedIn: 'LinkedIn',
                GitHub: 'GitHub',
                Twitter: 'Twitter',
                Facebook: 'Facebook',
                Instagram: 'Instagram',
                Medium: 'Medium',
                YouTube: 'YouTube',
                Reddit: 'Reddit',
                ProductHunt: 'Product Hunt',
                IndieHackers: 'IndieHackers',
                Blog: 'Blog',
                Telegram: 'Telegram',
                WhatsApp: 'WhatsApp',
                GitLab: 'GitLab',
                Bluesky: 'Bluesky',
                Email: 'Email'
            }
        },
        'es': {
            contact: 'Contacto',
            social: 'Social',
            media: 'Medios',
            other: 'Otros',
            talkToKirill: 'Hablar con Kirill',
            copyright: '© {year} Kirill Markin',
            socialNetworks: {
                LinkedIn: 'LinkedIn',
                GitHub: 'GitHub',
                Twitter: 'Twitter',
                Facebook: 'Facebook',
                Instagram: 'Instagram',
                Medium: 'Medium',
                YouTube: 'YouTube',
                Reddit: 'Reddit',
                ProductHunt: 'Product Hunt',
                IndieHackers: 'IndieHackers',
                Blog: 'Blog',
                Telegram: 'Telegram',
                WhatsApp: 'WhatsApp',
                GitLab: 'GitLab',
                Bluesky: 'Bluesky',
                Email: 'Correo'
            }
        },
        'zh': {
            contact: '联系方式',
            social: '社交媒体',
            media: '媒体',
            other: '其他',
            talkToKirill: '与Kirill交流',
            copyright: '© {year} Kirill Markin',
            socialNetworks: {
                LinkedIn: '领英',
                GitHub: 'GitHub',
                Twitter: '推特',
                Facebook: '脸书',
                Instagram: 'Instagram',
                Medium: 'Medium',
                YouTube: '油管',
                Reddit: 'Reddit',
                ProductHunt: 'Product Hunt',
                IndieHackers: 'IndieHackers',
                Blog: '博客',
                Telegram: 'Telegram',
                WhatsApp: 'WhatsApp',
                GitLab: 'GitLab',
                Bluesky: 'Bluesky',
                Email: '邮箱'
            }
        },
        'ar': {
            contact: 'جهات الاتصال',
            social: 'وسائل التواصل',
            media: 'الإعلام',
            other: 'أخرى',
            talkToKirill: 'تحدث مع كيريل',
            copyright: '© {year} كيريل ماركين',
            socialNetworks: {
                LinkedIn: 'لينكد إن',
                GitHub: 'جيثب',
                Twitter: 'تويتر',
                Facebook: 'فيسبوك',
                Instagram: 'انستغرام',
                Medium: 'ميديوم',
                YouTube: 'يوتيوب',
                Reddit: 'ريديت',
                ProductHunt: 'برودكت هانت',
                IndieHackers: 'إندي هاكرز',
                Blog: 'مدونة',
                Telegram: 'تيليجرام',
                WhatsApp: 'واتساب',
                GitLab: 'جيتلاب',
                Bluesky: 'بلوسكاي',
                Email: 'البريد الإلكتروني'
            }
        },
        'hi': {
            contact: 'संपर्क',
            social: 'सामाजिक',
            media: 'मीडिया',
            other: 'अन्य',
            talkToKirill: 'किरिल से बात करें',
            copyright: '© {year} किरिल मार्किन',
            socialNetworks: {
                LinkedIn: 'लिंक्डइन',
                GitHub: 'गिटहब',
                Twitter: 'ट्विटर',
                Facebook: 'फेसबुक',
                Instagram: 'इंस्टाग्राम',
                Medium: 'मीडियम',
                YouTube: 'यूट्यूब',
                Reddit: 'रेडिट',
                ProductHunt: 'प्रोडक्ट हंट',
                IndieHackers: 'इंडी हैकर्स',
                Blog: 'ब्लॉग',
                Telegram: 'टेलीग्राम',
                WhatsApp: 'व्हाट्सएप',
                GitLab: 'गिटलैब',
                Bluesky: 'ब्लूस्काई',
                Email: 'ईमेल'
            }
        }
    },
    home: {
        'en': {
            title: 'Kirill Markin - AI Strategy Advisor',
            description: 'I help businesses with AI implementation strategy. Learn about my services, read my articles on AI and tech.',
        },
        'es': {
            title: 'Kirill Markin - Asesor de Estrategia de IA',
            description: 'Ayudo a las empresas con la estrategia de implementación de IA. Conozca mis servicios, lea mis artículos sobre IA y tecnología.',
        },
        'zh': {
            title: 'Kirill Markin - 人工智能战略顾问',
            description: '我帮助企业实施人工智能战略。了解我的服务，阅读我关于人工智能和技术的文章。',
        },
        'ar': {
            title: 'كيريل ماركين - مستشار استراتيجية الذكاء الاصطناعي',
            description: 'أساعد الشركات في استراتيجية تنفيذ الذكاء الاصطناعي. تعرف على خدماتي، اقرأ مقالاتي عن الذكاء الاصطناعي والتكنولوجيا.',
        },
        'hi': {
            title: 'किरिल मार्किन - एआई रणनीति सलाहकार',
            description: 'मैं व्यवसायों को एआई कार्यान्वयन रणनीति के साथ मदद करता हूं। मेरी सेवाओं के बारे में जानें, एआई और तकनीक पर मेरे लेख पढ़ें।',
        },
    },
    articles: {
        'en': {
            title: 'Articles',
            description: 'Articles on AI, technology, and business strategy',
            metaTitle: 'Articles on AI and Tech | Kirill Markin',
            metaDescription: 'Read my articles on artificial intelligence, technology trends, and business strategy. Insights on AI implementation and digital transformation.',
            readTimeText: 'min read',
        },
        'es': {
            title: 'Artículos',
            description: 'Artículos sobre IA, tecnología y estrategia empresarial',
            metaTitle: 'Artículos sobre IA y Tecnología | Kirill Markin',
            metaDescription: 'Lea mis artículos sobre inteligencia artificial, tendencias tecnológicas y estrategia empresarial. Información sobre implementación de IA y transformación digital.',
            readTimeText: 'min de lectura',
        },
        'zh': {
            title: '文章',
            description: '关于人工智能、技术和商业策略的文章',
            metaTitle: '人工智能和技术文章 | Kirill Markin',
            metaDescription: '阅读我关于人工智能、技术趋势和商业策略的文章。关于人工智能实施和数字化转型的见解。',
            readTimeText: '分钟阅读',
        },
        'ar': {
            title: 'المقالات',
            description: 'مقالات عن الذكاء الاصطناعي والتكنولوجيا واستراتيجية الأعمال',
            metaTitle: 'مقالات عن الذكاء الاصطناعي والتكنولوجيا | كيريل ماركين',
            metaDescription: 'اقرأ مقالاتي عن الذكاء الاصطناعي واتجاهات التكنولوجيا واستراتيجية الأعمال. رؤى حول تنفيذ الذكاء الاصطناعي والتحول الرقمي.',
            readTimeText: 'دقيقة قراءة',
        },
        'hi': {
            title: 'लेख',
            description: 'एआई, प्रौद्योगिकी, और व्यापार रणनीति पर लेख',
            metaTitle: 'एआई और टेक पर लेख | किरिल मार्किन',
            metaDescription: 'कृत्रिम बुद्धिमत्ता, प्रौद्योगिकी रुझान, और व्यापार रणनीति पर मेरे लेख पढ़ें। एआई कार्यान्वयन और डिजिटल परिवर्तन पर अंतर्दृष्टि।',
            readTimeText: 'मिनट पढ़ें',
        },
    },
    services: {
        'en': {
            title: 'Services',
            description: 'Explore the complete range of services for individuals, businesses, and media professionals. Whether you need career guidance, analytics support, or expert commentary, I am ready to help.',
            metaTitle: 'AI Strategy & Implementation Services | Kirill Markin',
            metaDescription: 'Expert AI strategy consulting and implementation services. I help businesses integrate artificial intelligence to drive growth and efficiency.',
            serviceCategories: {
                all: 'All Services',
                people: 'People',
                business: 'Business',
                journalists: 'Journalists'
            },
            categoriesLabel: 'Categories',
        },
        'es': {
            title: 'Servicios',
            description: 'Explore la gama completa de servicios para individuos, empresas y profesionales de los medios. Ya sea que necesite orientación profesional, soporte analítico o comentarios de expertos, estoy listo para ayudar.',
            metaTitle: 'Servicios de Estrategia e Implementación de IA | Kirill Markin',
            metaDescription: 'Servicios expertos de consultoría e implementación de estrategia de IA. Ayudo a las empresas a integrar la inteligencia artificial para impulsar el crecimiento y la eficiencia.',
            serviceCategories: {
                all: 'Todos los Servicios',
                people: 'Personas',
                business: 'Negocios',
                journalists: 'Periodistas'
            },
            categoriesLabel: 'Categorías',
        },
        'zh': {
            title: '服务',
            description: '探索适用于个人、企业和媒体专业人士的完整服务范围。无论您需要职业指导、分析支持还是专家评论，我都随时准备提供帮助。',
            metaTitle: '人工智能战略与实施服务 | Kirill Markin',
            metaDescription: '专业人工智能战略咨询和实施服务。我帮助企业集成人工智能以推动增长和效率。',
            serviceCategories: {
                all: '所有服务',
                people: '个人服务',
                business: '企业服务',
                journalists: '媒体服务'
            },
            categoriesLabel: '类别',
        },
        'ar': {
            title: 'الخدمات',
            description: 'استكشف المجموعة الكاملة من الخدمات للأفراد والشركات ومحترفي الإعلام. سواء كنت بحاجة إلى إرشادات مهنية أو دعم تحليلي أو تعليقات خبيرة، فأنا مستعد للمساعدة.',
            metaTitle: 'خدمات استراتيجية وتنفيذ الذكاء الاصطناعي | كيريل ماركين',
            metaDescription: 'خدمات استشارية وتنفيذية متخصصة في استراتيجية الذكاء الاصطناعي. أساعد الشركات على دمج الذكاء الاصطناعي لدفع النمو والكفاءة.',
            serviceCategories: {
                all: 'جميع الخدمات',
                people: 'خدمات الأفراد',
                business: 'خدمات الأعمال',
                journalists: 'خدمات الإعلام'
            },
            categoriesLabel: 'الفئات',
        },
        'hi': {
            title: 'सेवाएं',
            description: 'व्यक्तियों, व्यवसायों और मीडिया पेशेवरों के लिए सेवाओं की पूरी श्रृंखला का अन्वेषण करें। चाहे आपको करियर मार्गदर्शन, विश्लेषण समर्थन, या विशेषज्ञ टिप्पणी की आवश्यकता हो, मैं मदद के लिए तैयार हूं।',
            metaTitle: 'एआई रणनीति और कार्यान्वयन सेवाएं | किरिल मार्किन',
            metaDescription: 'विशेषज्ञ एआई रणनीति परामर्श और कार्यान्वयन सेवाएं। मैं व्यवसायों को विकास और दक्षता बढ़ाने के लिए कृत्रिम बुद्धिमत्ता एकीकृत करने में मदद करता हूं।',
            serviceCategories: {
                all: 'सभी सेवाएं',
                people: 'व्यक्तिगत सेवाएं',
                business: 'व्यापारिक सेवाएं',
                journalists: 'मीडिया सेवाएं'
            },
            categoriesLabel: 'श्रेणियां',
        },
    },
    meet: {
        'en': {
            title: 'Meeting Booking Options',
            description: 'Please select your preferred meeting type:',
            metaTitle: 'Book a Meeting with Kirill Markin | AI Strategy Consultation',
            metaDescription: 'Schedule a meeting with Kirill Markin to discuss AI strategy, implementation, and digital transformation for your business. Choose from various consultation options.',
            shortMeeting: {
                title: '15-Minute Welcome Meeting',
                description: 'Free introduction call to discuss your needs and how we can work together',
                metaTitle: '15-Minute Free Consultation | Kirill Markin',
                metaDescription: 'Book a free 15-minute introduction call with Kirill Markin to discuss your AI strategy needs and explore potential collaboration opportunities.'
            },
            allMeetings: {
                title: 'All durations',
                description: 'Choose from all available consultation options and time slots',
                metaTitle: 'All Consultation Options | Kirill Markin',
                metaDescription: 'View all available meeting durations and time slots for consultations with Kirill Markin on AI strategy and implementation.'
            },
            shortPageTitle: '15-MINUTE WELCOME MEETING',
            allPageTitle: 'ALL MEETING OPTIONS',
            calendarLoading: 'Calendar loading...'
        },
        'es': {
            title: 'Opciones de Reserva de Reuniones',
            description: 'Por favor, seleccione su tipo de reunión preferido:',
            metaTitle: 'Reserve una Reunión con Kirill Markin | Consultoría de Estrategia de IA',
            metaDescription: 'Programe una reunión con Kirill Markin para discutir estrategia de IA, implementación y transformación digital para su empresa. Elija entre varias opciones de consulta.',
            shortMeeting: {
                title: 'Reunión de Bienvenida de 15 Minutos',
                description: 'Llamada de introducción gratuita para discutir sus necesidades y cómo podemos trabajar juntos',
                metaTitle: 'Consulta Gratuita de 15 Minutos | Kirill Markin',
                metaDescription: 'Reserve una llamada de introducción gratuita de 15 minutos con Kirill Markin para discutir sus necesidades de estrategia de IA y explorar oportunidades de colaboración potencial.'
            },
            allMeetings: {
                title: 'Todas las duraciones',
                description: 'Elija entre todas las opciones de consulta disponibles y franjas horarias',
                metaTitle: 'Todas las Opciones de Consulta | Kirill Markin',
                metaDescription: 'Vea todas las duraciones de reuniones disponibles y franjas horarias para consultas con Kirill Markin sobre estrategia e implementación de IA.'
            },
            shortPageTitle: 'REUNIÓN DE BIENVENIDA DE 15 MINUTOS',
            allPageTitle: 'TODAS LAS OPCIONES DE REUNIÓN',
            calendarLoading: 'Cargando calendario...'
        },
        'zh': {
            title: '会议预约选项',
            description: '请选择您喜欢的会议类型：',
            metaTitle: '与Kirill Markin预约会议 | 人工智能战略咨询',
            metaDescription: '与Kirill Markin预约会议，讨论人工智能战略、实施和企业数字化转型。从各种咨询选项中选择。',
            shortMeeting: {
                title: '15分钟欢迎会议',
                description: '免费介绍电话，讨论您的需求以及我们如何合作',
                metaTitle: '15分钟免费咨询 | Kirill Markin',
                metaDescription: '预约与Kirill Markin的15分钟免费介绍电话，讨论您的人工智能战略需求并探索潜在的合作机会。'
            },
            allMeetings: {
                title: '所有时长',
                description: '从所有可用的咨询选项和时间段中进行选择',
                metaTitle: '所有咨询选项 | Kirill Markin',
                metaDescription: '查看与Kirill Markin关于人工智能战略和实施咨询的所有可用会议时长和时间段。'
            },
            shortPageTitle: '15分钟欢迎会议',
            allPageTitle: '所有会议选项',
            calendarLoading: '日历加载中...'
        },
        'ar': {
            title: 'خيارات حجز الاجتماعات',
            description: 'يرجى اختيار نوع الاجتماع المفضل لديك:',
            metaTitle: 'حجز اجتماع مع كيريل ماركين | استشارات استراتيجية الذكاء الاصطناعي',
            metaDescription: 'قم بجدولة اجتماع مع كيريل ماركين لمناقشة استراتيجية الذكاء الاصطناعي والتنفيذ والتحول الرقمي لعملك. اختر من بين خيارات الاستشارة المختلفة.',
            shortMeeting: {
                title: 'اجتماع ترحيبي لمدة 15 دقيقة',
                description: 'مكالمة تعريفية مجانية لمناقشة احتياجاتك وكيف يمكننا العمل معًا',
                metaTitle: 'استشارة مجانية لمدة 15 دقيقة | كيريل ماركين',
                metaDescription: 'احجز مكالمة تعريفية مجانية لمدة 15 دقيقة مع كيريل ماركين لمناقشة احتياجات استراتيجية الذكاء الاصطناعي واستكشاف فرص التعاون المحتملة.'
            },
            allMeetings: {
                title: 'جميع المدد',
                description: 'اختر من بين جميع خيارات الاستشارة المتاحة والمواعيد',
                metaTitle: 'جميع خيارات الاستشارة | كيريل ماركين',
                metaDescription: 'اطلع على جميع مدد الاجتماعات المتاحة والمواعيد للاستشارات مع كيريل ماركين حول استراتيجية وتنفيذ الذكاء الاصطناعي.'
            },
            shortPageTitle: 'اجتماع ترحيبي لمدة 15 دقيقة',
            allPageTitle: 'جميع خيارات الاجتماع',
            calendarLoading: 'جاري تحميل التقويم...'
        },
        'hi': {
            title: 'मीटिंग बुकिंग विकल्प',
            description: 'कृपया अपनी पसंदीदा मीटिंग प्रकार चुनें:',
            metaTitle: 'किरिल मार्किन के साथ मीटिंग बुक करें | एआई रणनीति परामर्श',
            metaDescription: 'अपने व्यवसाय के लिए एआई रणनीति, कार्यान्वयन और डिजिटल परिवर्तन पर चर्चा करने के लिए किरिल मार्किन के साथ बैठक शेड्यूल करें। विभिन्न परामर्श विकल्पों से चुनें।',
            shortMeeting: {
                title: '15-मिनट का स्वागत मीटिंग',
                description: 'आपकी जरूरतों और हम कैसे एक साथ काम कर सकते हैं इस पर चर्चा करने के लिए मुफ्त परिचय कॉल',
                metaTitle: '15-मिनट का निःशुल्क परामर्श | किरिल मार्किन',
                metaDescription: 'अपनी एआई रणनीति की आवश्यकताओं पर चर्चा करने और संभावित सहयोग के अवसरों का पता लगाने के लिए किरिल मार्किन के साथ 15-मिनट का मुफ्त परिचय कॉल बुक करें।'
            },
            allMeetings: {
                title: 'सभी अवधियां',
                description: 'सभी उपलब्ध परामर्श विकल्पों और समय स्लॉट से चुनें',
                metaTitle: 'सभी परामर्श विकल्प | किरिल मार्किन',
                metaDescription: 'एआई रणनीति और कार्यान्वयन पर किरिल मार्किन के साथ परामर्श के लिए सभी उपलब्ध मीटिंग अवधियों और समय स्लॉट देखें।'
            },
            shortPageTitle: '15-मिनट का स्वागत मीटिंग',
            allPageTitle: 'सभी मीटिंग विकल्प',
            calendarLoading: 'कैलेंडर लोड हो रहा है...'
        }
    },
    pay: {
        'en': {
            title: 'PAYMENT OPTIONS',
            description: 'Please select your preferred payment method:',
            metaTitle: 'Secure Payment Options | Kirill Markin Services',
            metaDescription: 'Complete your payment for Kirill Markin\'s AI strategy and consulting services. Choose from multiple secure payment methods.',
            stripe: {
                title: 'Pay with Stripe',
                description: 'Secure payment with credit or debit card',
                metaTitle: 'Secure Stripe Payment | Kirill Markin',
                metaDescription: 'Make a secure payment for Kirill Markin\'s services using Stripe\'s protected payment processing with credit or debit card.'
            },
            stripePageTitle: 'PAY WITH STRIPE',
            formLoading: 'Loading payment form...'
        },
        'es': {
            title: 'OPCIONES DE PAGO',
            description: 'Por favor, seleccione su método de pago preferido:',
            metaTitle: 'Opciones de Pago Seguro | Servicios de Kirill Markin',
            metaDescription: 'Complete su pago por los servicios de estrategia de IA y consultoría de Kirill Markin. Elija entre múltiples métodos de pago seguros.',
            stripe: {
                title: 'Pagar con Stripe',
                description: 'Pago seguro con tarjeta de crédito o débito',
                metaTitle: 'Pago Seguro con Stripe | Kirill Markin',
                metaDescription: 'Realice un pago seguro por los servicios de Kirill Markin utilizando el procesamiento de pagos protegido de Stripe con tarjeta de crédito o débito.'
            },
            stripePageTitle: 'PAGAR CON STRIPE',
            formLoading: 'Cargando formulario de pago...'
        },
        'zh': {
            title: '支付选项',
            description: '请选择您喜欢的支付方式：',
            metaTitle: '安全支付选项 | Kirill Markin服务',
            metaDescription: '完成Kirill Markin人工智能战略和咨询服务的付款。从多种安全支付方式中选择。',
            stripe: {
                title: '使用Stripe支付',
                description: '使用信用卡或借记卡安全支付',
                metaTitle: 'Stripe安全支付 | Kirill Markin',
                metaDescription: '使用Stripe的受保护支付处理系统，通过信用卡或借记卡为Kirill Markin的服务进行安全支付。'
            },
            stripePageTitle: '使用STRIPE支付',
            formLoading: '加载支付表单...'
        },
        'ar': {
            title: 'خيارات الدفع',
            description: 'يرجى اختيار طريقة الدفع المفضلة لديك:',
            metaTitle: 'خيارات الدفع الآمن | خدمات كيريل ماركين',
            metaDescription: 'أكمل دفعتك لخدمات استراتيجية الذكاء الاصطناعي والاستشارات من كيريل ماركين. اختر من بين طرق دفع آمنة متعددة.',
            stripe: {
                title: 'الدفع باستخدام Stripe',
                description: 'دفع آمن ببطاقة الائتمان أو الخصم',
                metaTitle: 'دفع آمن عبر Stripe | كيريل ماركين',
                metaDescription: 'قم بإجراء دفع آمن لخدمات كيريل ماركين باستخدام معالجة الدفع المحمية من Stripe ببطاقة الائتمان أو الخصم.'
            },
            stripePageTitle: 'الدفع باستخدام STRIPE',
            formLoading: 'جاري تحميل نموذج الدفع...'
        },
        'hi': {
            title: 'भुगतान विकल्प',
            description: 'कृपया अपना पसंदीदा भुगतान विधि चुनें:',
            metaTitle: 'सुरक्षित भुगतान विकल्प | किरिल मार्किन सेवाएं',
            metaDescription: 'किरिल मार्किन की एआई रणनीति और परामर्श सेवाओं के लिए अपना भुगतान पूरा करें। कई सुरक्षित भुगतान विधियों से चुनें।',
            stripe: {
                title: 'Stripe से भुगतान करें',
                description: 'क्रेडिट या डेबिट कार्ड से सुरक्षित भुगतान',
                metaTitle: 'Stripe से सुरक्षित भुगतान | किरिल मार्किन',
                metaDescription: 'क्रेडिट या डेबिट कार्ड के साथ Stripe के संरक्षित भुगतान प्रसंस्करण का उपयोग करके किरिल मार्किन की सेवाओं के लिए सुरक्षित भुगतान करें।'
            },
            stripePageTitle: 'STRIPE से भुगतान करें',
            formLoading: 'भुगतान फॉर्म लोड हो रहा है...'
        }
    },
} as const;

/**
 * Type for translation section keys
 */
export type TranslationSection = keyof typeof translations;

/**
 * Get translations for a specific section and language
 * @param section Section name (e.g. 'common', 'home', 'articles')
 * @param language Language code
 * @returns Translation object for the requested section, falling back to default language
 */
export function getTranslation<T extends TranslationSection>(section: T, language: string): typeof translations[T][typeof DEFAULT_LANGUAGE] {
    if (!translations[section]) {
        // If section doesn't exist, return empty object
        // Using explicit type casting with as unknown for safe conversion
        return {} as unknown as typeof translations[T][typeof DEFAULT_LANGUAGE];
    }

    const sectionTranslations = translations[section];
    return (sectionTranslations[language as keyof typeof sectionTranslations] ||
        sectionTranslations[DEFAULT_LANGUAGE]) as typeof translations[T][typeof DEFAULT_LANGUAGE];
} 
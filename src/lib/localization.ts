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
        'zh': 'zhishi',
        'ar': 'maqalat',
        'hi': 'gyan',
    },
    'services': {
        'en': 'services',
        'es': 'servicios',
        'zh': 'zixun',
        'ar': 'khadamat',
        'hi': 'sevaen',
    },
    'meet': {
        'en': 'meet',
        'es': 'reservar',
        'zh': 'yuyue',
        'ar': 'mawid',
        'hi': 'miliye',
    },
    'pay': {
        'en': 'pay',
        'es': 'pago',
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
            'es': 'breve',
            'zh': 'mianfei',
            'ar': 'majani',
            'hi': 'muft'
        },
        'all': {
            'en': 'all',
            'es': 'completo',
            'zh': 'quanbu',
            'ar': 'jamia',
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
            'zh': 'geren',
            'ar': 'afrad',
            'hi': 'vyakti'
        },
        'business': {
            'en': 'business',
            'es': 'empresas',
            'zh': 'qiye',
            'ar': 'sharikat',
            'hi': 'vyapar'
        },
        'journalists': {
            'en': 'journalists',
            'es': 'medios',
            'zh': 'meiti',
            'ar': 'sahafa',
            'hi': 'media'
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
    // Map language codes to specific regional locales for maximum SEO benefit
    // These locale codes improve search engine understanding and regional targeting
    const localeMap: Record<string, string> = {
        'en': 'en_US',
        'es': 'es_ES',
        'zh': 'zh_CN', // Simplified Chinese for mainland China
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
            siteName: 'Kirill Markin | AI Strategy Advisor',
            language: 'English',
            viewAllLink: 'View All',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
            aboutAuthor: 'About Author',
        },
        'es': {
            siteName: 'Kirill Markin | Asesor de Estrategia de IA',
            language: 'Español',
            viewAllLink: 'Ver Todo',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
            aboutAuthor: 'Sobre el Autor',
        },
        'zh': {
            siteName: 'Kirill Markin | 人工智能战略顾问',
            language: '中文',
            viewAllLink: '查看全部',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
            aboutAuthor: '关于作者',
        },
        'ar': {
            siteName: 'Kirill Markin | مستشار استراتيجية الذكاء الاصطناعي',
            language: 'العربية',
            viewAllLink: 'عرض الكل',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
            aboutAuthor: 'عن المؤلف',
        },
        'hi': {
            siteName: 'Kirill Markin | एआई रणनीति सलाहकार',
            language: 'हिन्दी',
            viewAllLink: 'सभी देखें',
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
            aboutAuthor: 'लेखक के बारे में',
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
            title: 'Kirill Markin - AI Strategy Advisor & Consultant',
            description: 'Expert in AI implementation strategy for businesses and enterprises. Learn about my artificial intelligence services, read articles on machine learning, data science, and tech innovation.',
        },
        'es': {
            title: 'Kirill Markin - Asesor y Consultor de Estrategia de IA',
            description: 'Experto en estrategia de implementación de inteligencia artificial para empresas. Conozca mis servicios, lea mis artículos sobre IA, aprendizaje automático y transformación digital.',
        },
        'zh': {
            title: 'Kirill Markin - 人工智能战略顾问与咨询师',
            description: '企业人工智能实施战略专家。了解我的AI服务，阅读关于机器学习、大数据分析、数字化转型和技术创新的文章。适合中国企业的人工智能解决方案。',
        },
        'ar': {
            title: 'كيريل ماركين - مستشار وخبير استراتيجية الذكاء الاصطناعي',
            description: 'خبير في استراتيجية تنفيذ الذكاء الاصطناعي للشركات والمؤسسات. تعرف على خدماتي في مجال الذكاء الاصطناعي، واقرأ مقالاتي عن التعلم الآلي وعلوم البيانات والابتكار التكنولوجي.',
        },
        'hi': {
            title: 'किरिल मार्किन - एआई रणनीति सलाहकार और परामर्शदाता',
            description: 'व्यवसायों और उद्यमों के लिए एआई कार्यान्वयन रणनीति में विशेषज्ञ। मेरी कृत्रिम बुद्धिमत्ता सेवाओं के बारे में जानें, मशीन लर्निंग, डेटा साइंस, और तकनीकी नवाचार पर मेरे लेख पढ़ें। भारतीय कंपनियों के लिए एआई समाधान।',
        },
    },
    articles: {
        'en': {
            title: 'Articles',
            description: 'Expert articles on artificial intelligence, technology, and business strategy',
            metaTitle: 'AI and Technology Articles | Kirill Markin | Machine Learning Expert',
            metaDescription: 'Expert articles on artificial intelligence, machine learning, data science and digital transformation. Insights on AI implementation, business strategy, and emerging technologies from an industry expert.',
            readTimeText: 'min read',
        },
        'es': {
            title: 'Artículos',
            description: 'Artículos especializados sobre inteligencia artificial, tecnología y estrategia empresarial',
            metaTitle: 'Artículos de IA y Tecnología | Kirill Markin | Experto en Inteligencia Artificial',
            metaDescription: 'Artículos especializados sobre inteligencia artificial, aprendizaje automático, ciencia de datos y transformación digital. Perspectivas sobre implementación de IA, estrategia empresarial y tecnologías emergentes en España y Latinoamérica.',
            readTimeText: 'min de lectura',
        },
        'zh': {
            title: '文章',
            description: '关于人工智能、技术和商业策略的专业文章',
            metaTitle: '人工智能与科技文章 | Kirill Markin | 机器学习专家',
            metaDescription: '关于人工智能、机器学习、大数据分析和数字化转型的专业文章。针对中国企业的AI实施见解、商业策略分析和新兴技术评估，提供中国市场特定的AI应用案例和解决方案。',
            readTimeText: '分钟阅读',
        },
        'ar': {
            title: 'المقالات',
            description: 'مقالات متخصصة في الذكاء الاصطناعي والتكنولوجيا واستراتيجية الأعمال',
            metaTitle: 'مقالات الذكاء الاصطناعي والتكنولوجيا | كيريل ماركين | خبير التعلم الآلي',
            metaDescription: 'مقالات متخصصة حول الذكاء الاصطناعي والتعلم الآلي وعلوم البيانات والتحول الرقمي. رؤى حول تنفيذ الذكاء الاصطناعي واستراتيجية الأعمال والتقنيات الناشئة في العالم العربي والشرق الأوسط.',
            readTimeText: 'دقيقة قراءة',
        },
        'hi': {
            title: 'लेख',
            description: 'कृत्रिम बुद्धिमत्ता, प्रौद्योगिकी, और व्यापार रणनीति पर विशेषज्ञ लेख',
            metaTitle: 'कृत्रिम बुद्धिमत्ता और प्रौद्योगिकी लेख | किरिल मार्किन | मशीन लर्निंग विशेषज्ञ',
            metaDescription: 'कृत्रिम बुद्धिमत्ता, मशीन लर्निंग, डेटा विज्ञान, और डिजिटल परिवर्तन पर विशेषज्ञ लेख। भारतीय व्यवसायों के लिए एआई कार्यान्वयन, व्यापारिक रणनीति, और उभरती तकनीकों पर अंतर्दृष्टि, भारतीय बाजार के लिए विशिष्ट समाधान।',
            readTimeText: 'मिनट पढ़ें',
        },
    },
    services: {
        'en': {
            title: 'Services',
            description: 'Specialized AI strategy and implementation services for individuals, businesses, and media professionals. From career guidance to enterprise AI transformation, I provide expert solutions tailored to your needs.',
            metaTitle: 'AI Strategy & Implementation Services | Kirill Markin | Digital Transformation Expert',
            metaDescription: 'Professional AI strategy consulting and implementation services for businesses and organizations. Expert guidance on integrating artificial intelligence, machine learning, and data science to drive growth, efficiency, and innovation.',
            serviceCategories: {
                all: 'All Services',
                people: 'For Individuals',
                business: 'For Businesses',
                journalists: 'For Media'
            },
            categoriesLabel: 'Service Categories',
        },
        'es': {
            title: 'Servicios',
            description: 'Servicios especializados de estrategia e implementación de IA para individuos, empresas y profesionales de los medios. Desde orientación profesional hasta transformación empresarial con IA, ofrezco soluciones expertas adaptadas a sus necesidades.',
            metaTitle: 'Servicios de Estrategia e Implementación de IA | Kirill Markin | Experto en Transformación Digital',
            metaDescription: 'Servicios profesionales de consultoría e implementación de estrategia de IA para empresas españolas y latinoamericanas. Asesoramiento experto en la integración de inteligencia artificial, aprendizaje automático y ciencia de datos para impulsar el crecimiento, la eficiencia y la innovación.',
            serviceCategories: {
                all: 'Todos los Servicios',
                people: 'Para Individuos',
                business: 'Para Empresas',
                journalists: 'Para Medios'
            },
            categoriesLabel: 'Categorías de Servicios',
        },
        'zh': {
            title: '服务',
            description: '为个人、企业和媒体专业人士提供专业人工智能战略和实施服务。从职业指导到企业AI转型，我提供量身定制的专家解决方案，满足您的需求。',
            metaTitle: '人工智能战略与实施服务 | Kirill Markin | 数字化转型专家',
            metaDescription: '为中国企业和组织提供专业人工智能战略咨询和实施服务。在人工智能、机器学习和大数据分析领域提供专家指导，帮助您提高业务增长、效率和创新能力。针对中国市场的本地化AI解决方案。',
            serviceCategories: {
                all: '所有服务',
                people: '个人服务',
                business: '企业服务',
                journalists: '媒体服务'
            },
            categoriesLabel: '服务类别',
        },
        'ar': {
            title: 'الخدمات',
            description: 'خدمات متخصصة في استراتيجية وتنفيذ الذكاء الاصطناعي للأفراد والشركات ومحترفي الإعلام. من التوجيه المهني إلى تحول الشركات باستخدام الذكاء الاصطناعي، أقدم حلولًا خبيرة مصممة لتلبية احتياجاتك.',
            metaTitle: 'خدمات استراتيجية وتنفيذ الذكاء الاصطناعي | كيريل ماركين | خبير التحول الرقمي',
            metaDescription: 'خدمات استشارية احترافية وتنفيذية لاستراتيجية الذكاء الاصطناعي للشركات والمؤسسات في العالم العربي. إرشادات خبيرة حول دمج الذكاء الاصطناعي والتعلم الآلي وعلوم البيانات لدفع النمو والكفاءة والابتكار. حلول مخصصة للسوق العربي.',
            serviceCategories: {
                all: 'جميع الخدمات',
                people: 'للأفراد',
                business: 'للشركات',
                journalists: 'للإعلام'
            },
            categoriesLabel: 'فئات الخدمات',
        },
        'hi': {
            title: 'सेवाएं',
            description: 'व्यक्तियों, व्यवसायों और मीडिया पेशेवरों के लिए विशेष एआई रणनीति और कार्यान्वयन सेवाएं। करियर मार्गदर्शन से लेकर एआई के साथ व्यापारिक परिवर्तन तक, मैं आपकी जरूरतों के अनुरूप विशेषज्ञ समाधान प्रदान करता हूं।',
            metaTitle: 'एआई रणनीति और कार्यान्वयन सेवाएं | किरिल मार्किन | डिजिटल परिवर्तन विशेषज्ञ',
            metaDescription: 'भारतीय व्यवसायों और संगठनों के लिए पेशेवर एआई रणनीति परामर्श और कार्यान्वयन सेवाएं। कृत्रिम बुद्धिमत्ता, मशीन लर्निंग और डेटा विज्ञान को एकीकृत करने पर विशेषज्ञ मार्गदर्शन, विकास, दक्षता और नवाचार को बढ़ावा देने के लिए। भारतीय बाजार के लिए स्थानीयकृत एआई समाधान।',
            serviceCategories: {
                all: 'सभी सेवाएं',
                people: 'व्यक्तियों के लिए',
                business: 'व्यवसायों के लिए',
                journalists: 'मीडिया के लिए'
            },
            categoriesLabel: 'सेवा श्रेणियां',
        },
    },
    meet: {
        'en': {
            title: 'Meeting Booking Options',
            description: 'Schedule a meeting with AI strategy expert Kirill Markin. Select your preferred meeting type:',
            metaTitle: 'Book a Consultation with AI Expert Kirill Markin | AI Strategy Consultation',
            metaDescription: 'Schedule a one-on-one meeting with artificial intelligence strategy expert Kirill Markin. Discuss AI implementation, digital transformation, and technology strategy for your business or personal project.',
            shortMeeting: {
                title: '15-Minute Welcome Meeting',
                description: 'Free introductory consultation to discuss your AI needs and explore potential collaboration opportunities',
                metaTitle: 'Free 15-Minute AI Strategy Consultation | Kirill Markin',
                metaDescription: 'Book a complimentary 15-minute introduction call with AI expert Kirill Markin. Discuss your artificial intelligence strategy needs, machine learning implementation, and explore potential collaboration opportunities.'
            },
            allMeetings: {
                title: 'All Consultation Options',
                description: 'View all available consultation durations and book a time that works for your schedule',
                metaTitle: 'AI Strategy Consultation Options | Kirill Markin',
                metaDescription: 'Browse all available meeting durations and consultation options with AI strategy expert Kirill Markin. Schedule a personalized session on artificial intelligence implementation, machine learning, and digital transformation.'
            },
            shortPageTitle: '15-MINUTE WELCOME MEETING',
            allPageTitle: 'ALL CONSULTATION OPTIONS',
            calendarLoading: 'Loading calendar...'
        },
        'es': {
            title: 'Opciones de Reserva de Reuniones',
            description: 'Programe una reunión con el experto en estrategia de IA Kirill Markin. Seleccione su tipo de reunión preferido:',
            metaTitle: 'Reserve una Consulta con el Experto en IA Kirill Markin | Asesoría Estratégica',
            metaDescription: 'Agende una reunión personalizada con el experto en estrategia de inteligencia artificial Kirill Markin. Analice implementación de IA, transformación digital y estrategia tecnológica para su empresa o proyecto personal en español.',
            shortMeeting: {
                title: 'Reunión de Bienvenida de 15 Minutos',
                description: 'Consulta introductoria gratuita para discutir sus necesidades de IA y explorar posibles oportunidades de colaboración',
                metaTitle: 'Consulta Gratuita de Estrategia de IA de 15 Minutos | Kirill Markin',
                metaDescription: 'Reserve una llamada de introducción gratuita de 15 minutos con el experto en IA Kirill Markin. Discuta sus necesidades de estrategia de inteligencia artificial, implementación de aprendizaje automático y explore oportunidades de colaboración potencial en español.'
            },
            allMeetings: {
                title: 'Todas las Opciones de Consulta',
                description: 'Vea todas las duraciones de consulta disponibles y reserve un horario que se adapte a su agenda',
                metaTitle: 'Opciones de Consulta de Estrategia de IA | Kirill Markin',
                metaDescription: 'Explore todas las duraciones de reuniones disponibles y opciones de consulta con el experto en estrategia de IA Kirill Markin. Programe una sesión personalizada sobre implementación de inteligencia artificial, aprendizaje automático y transformación digital en español.'
            },
            shortPageTitle: 'REUNIÓN DE BIENVENIDA DE 15 MINUTOS',
            allPageTitle: 'TODAS LAS OPCIONES DE CONSULTA',
            calendarLoading: 'Cargando calendario...'
        },
        'zh': {
            title: '会议预约选项',
            description: '与人工智能战略专家Kirill Markin安排会议。请选择您偏好的会议类型：',
            metaTitle: '预约人工智能专家Kirill Markin咨询 | AI战略顾问服务',
            metaDescription: '与人工智能战略专家Kirill Markin安排一对一会议。讨论人工智能实施、数字化转型以及适合您的企业或个人项目的技术战略。提供中文服务。',
            shortMeeting: {
                title: '15分钟欢迎会议',
                description: '免费介绍性咨询，讨论您的AI需求并探索潜在的合作机会',
                metaTitle: '15分钟免费AI战略咨询 | Kirill Markin',
                metaDescription: '预约与AI专家Kirill Markin的15分钟免费介绍电话。讨论您的人工智能战略需求、机器学习实施，并探索潜在的合作机会。支持中文交流。'
            },
            allMeetings: {
                title: '所有咨询选项',
                description: '查看所有可用的咨询时长，并预约适合您日程的时间',
                metaTitle: 'AI战略咨询选项 | Kirill Markin',
                metaDescription: '浏览与AI战略专家Kirill Markin的所有可用会议时长和咨询选项。预约关于人工智能实施、机器学习和数字化转型的个性化会议。支持中文服务。'
            },
            shortPageTitle: '15分钟欢迎会议',
            allPageTitle: '所有咨询选项',
            calendarLoading: '正在加载日历...'
        },
        'ar': {
            title: 'خيارات حجز الاجتماعات',
            description: 'جدولة اجتماع مع خبير استراتيجية الذكاء الاصطناعي كيريل ماركين. اختر نوع الاجتماع المفضل لديك:',
            metaTitle: 'احجز استشارة مع خبير الذكاء الاصطناعي كيريل ماركين | استشارات استراتيجية الذكاء الاصطناعي',
            metaDescription: 'جدولة اجتماع شخصي مع خبير استراتيجية الذكاء الاصطناعي كيريل ماركين. ناقش تنفيذ الذكاء الاصطناعي والتحول الرقمي واستراتيجية التكنولوجيا لعملك أو مشروعك الشخصي باللغة العربية.',
            shortMeeting: {
                title: 'اجتماع ترحيبي لمدة 15 دقيقة',
                description: 'استشارة تعريفية مجانية لمناقشة احتياجاتك من الذكاء الاصطناعي واستكشاف فرص التعاون المحتملة',
                metaTitle: 'استشارة مجانية لاستراتيجية الذكاء الاصطناعي لمدة 15 دقيقة | كيريل ماركين',
                metaDescription: 'احجز مكالمة تعريفية مجانية لمدة 15 دقيقة مع خبير الذكاء الاصطناعي كيريل ماركين. ناقش احتياجات استراتيجية الذكاء الاصطناعي وتنفيذ التعلم الآلي واستكشف فرص التعاون المحتملة باللغة العربية.'
            },
            allMeetings: {
                title: 'جميع خيارات الاستشارة',
                description: 'اطلع على جميع مدد الاستشارة المتاحة واحجز وقتًا يناسب جدولك',
                metaTitle: 'خيارات استشارة استراتيجية الذكاء الاصطناعي | كيريل ماركين',
                metaDescription: 'تصفح جميع مدد الاجتماعات المتاحة وخيارات الاستشارة مع خبير استراتيجية الذكاء الاصطناعي كيريل ماركين. جدولة جلسة مخصصة حول تنفيذ الذكاء الاصطناعي والتعلم الآلي والتحول الرقمي باللغة العربية.'
            },
            shortPageTitle: 'اجتماع ترحيبي لمدة 15 دقيقة',
            allPageTitle: 'جميع خيارات الاستشارة',
            calendarLoading: 'جاري تحميل التقويم...'
        },
        'hi': {
            title: 'मीटिंग बुकिंग विकल्प',
            description: 'एआई रणनीति विशेषज्ञ किरिल मार्किन के साथ मीटिंग शेड्यूल करें। अपना पसंदीदा मीटिंग प्रकार चुनें:',
            metaTitle: 'एआई विशेषज्ञ किरिल मार्किन के साथ परामर्श बुक करें | एआई रणनीति परामर्श',
            metaDescription: 'कृत्रिम बुद्धिमत्ता रणनीति विशेषज्ञ किरिल मार्किन के साथ व्यक्तिगत मीटिंग शेड्यूल करें। अपने व्यवसाय या व्यक्तिगत प्रोजेक्ट के लिए एआई कार्यान्वयन, डिजिटल परिवर्तन और प्रौद्योगिकी रणनीति पर चर्चा करें। हिंदी में उपलब्ध।',
            shortMeeting: {
                title: '15-मिनट का स्वागत मीटिंग',
                description: 'आपकी एआई आवश्यकताओं पर चर्चा करने और संभावित सहयोग के अवसरों का पता लगाने के लिए निःशुल्क परिचयात्मक परामर्श',
                metaTitle: '15-मिनट का निःशुल्क एआई रणनीति परामर्श | किरिल मार्किन',
                metaDescription: 'एआई विशेषज्ञ किरिल मार्किन के साथ 15-मिनट का निःशुल्क परिचय कॉल बुक करें। अपनी कृत्रिम बुद्धिमत्ता रणनीति आवश्यकताओं, मशीन लर्निंग कार्यान्वयन पर चर्चा करें और संभावित सहयोग के अवसरों का पता लगाएं। हिंदी में उपलब्ध।'
            },
            allMeetings: {
                title: 'सभी परामर्श विकल्प',
                description: 'सभी उपलब्ध परामर्श अवधियों को देखें और अपनी समय-सारिणी के अनुसार एक समय बुक करें',
                metaTitle: 'एआई रणनीति परामर्श विकल्प | किरिल मार्किन',
                metaDescription: 'एआई रणनीति विशेषज्ञ किरिल मार्किन के साथ सभी उपलब्ध मीटिंग अवधियों और परामर्श विकल्पों को ब्राउज़ करें। कृत्रिम बुद्धिमत्ता कार्यान्वयन, मशीन लर्निंग और डिजिटल परिवर्तन पर एक व्यक्तिगत सत्र शेड्यूल करें। हिंदी में उपलब्ध।'
            },
            shortPageTitle: '15-मिनट का स्वागत मीटिंग',
            allPageTitle: 'सभी परामर्श विकल्प',
            calendarLoading: 'कैलेंडर लोड हो रहा है...'
        }
    },
    pay: {
        'en': {
            title: 'PAYMENT OPTIONS',
            description: 'Secure payment methods for AI strategy consulting services. Please select your preferred payment option:',
            metaTitle: 'Secure Payment Options | AI Consulting Services | Kirill Markin',
            metaDescription: 'Secure and convenient payment methods for Kirill Markin\'s AI strategy and consulting services. Complete your transaction safely with multiple payment options for artificial intelligence consulting.',
            stripe: {
                title: 'Pay with Stripe',
                description: 'Fast and secure payment processing with credit or debit cards via Stripe',
                metaTitle: 'Secure Stripe Payment | AI Consulting Services | Kirill Markin',
                metaDescription: 'Make a secure payment for AI consulting services using Stripe\'s protected payment processing. Pay with credit card, debit card, or other supported payment methods in your local currency.'
            },
            stripePageTitle: 'SECURE PAYMENT WITH STRIPE',
            formLoading: 'Loading secure payment form...'
        },
        'es': {
            title: 'OPCIONES DE PAGO',
            description: 'Métodos de pago seguros para servicios de consultoría de estrategia de IA. Por favor, seleccione su método de pago preferido:',
            metaTitle: 'Opciones de Pago Seguro | Servicios de Consultoría de IA | Kirill Markin',
            metaDescription: 'Métodos de pago seguros y convenientes para los servicios de estrategia de IA y consultoría de Kirill Markin. Complete su transacción de forma segura con múltiples opciones de pago para consultoría de inteligencia artificial.',
            stripe: {
                title: 'Pagar con Stripe',
                description: 'Procesamiento de pago rápido y seguro con tarjetas de crédito o débito a través de Stripe',
                metaTitle: 'Pago Seguro con Stripe | Servicios de Consultoría de IA | Kirill Markin',
                metaDescription: 'Realice un pago seguro por los servicios de consultoría de IA utilizando el procesamiento de pagos protegido de Stripe. Pague con tarjeta de crédito, tarjeta de débito u otros métodos de pago compatibles en su moneda local.'
            },
            stripePageTitle: 'PAGO SEGURO CON STRIPE',
            formLoading: 'Cargando formulario de pago seguro...'
        },
        'zh': {
            title: '支付选项',
            description: 'AI战略咨询服务的安全支付方式。请选择您偏好的支付方式：',
            metaTitle: '安全支付选项 | 人工智能咨询服务 | Kirill Markin',
            metaDescription: 'Kirill Markin人工智能战略和咨询服务的安全便捷支付方式。通过多种支付选项安全完成人工智能咨询服务的交易。支持中国支付方式。',
            stripe: {
                title: '使用Stripe支付',
                description: '通过Stripe使用信用卡或借记卡进行快速安全的支付处理',
                metaTitle: 'Stripe安全支付 | 人工智能咨询服务 | Kirill Markin',
                metaDescription: '使用Stripe的受保护支付处理系统为AI咨询服务进行安全支付。可使用信用卡、借记卡或其他支持的支付方式以您的当地货币付款。'
            },
            stripePageTitle: '使用STRIPE安全支付',
            formLoading: '正在加载安全支付表单...'
        },
        'ar': {
            title: 'خيارات الدفع',
            description: 'طرق دفع آمنة لخدمات استشارات استراتيجية الذكاء الاصطناعي. يرجى اختيار طريقة الدفع المفضلة لديك:',
            metaTitle: 'خيارات الدفع الآمن | خدمات استشارات الذكاء الاصطناعي | كيريل ماركين',
            metaDescription: 'طرق دفع آمنة ومريحة لخدمات استراتيجية الذكاء الاصطناعي والاستشارات من كيريل ماركين. أكمل معاملتك بأمان مع خيارات دفع متعددة لاستشارات الذكاء الاصطناعي.',
            stripe: {
                title: 'الدفع باستخدام Stripe',
                description: 'معالجة دفع سريعة وآمنة باستخدام بطاقات الائتمان أو الخصم عبر Stripe',
                metaTitle: 'دفع آمن عبر Stripe | خدمات استشارات الذكاء الاصطناعي | كيريل ماركين',
                metaDescription: 'قم بإجراء دفع آمن مقابل خدمات استشارات الذكاء الاصطناعي باستخدام معالجة الدفع المحمية من Stripe. ادفع ببطاقة الائتمان أو بطاقة الخصم أو طرق الدفع الأخرى المدعومة بعملتك المحلية.'
            },
            stripePageTitle: 'دفع آمن باستخدام STRIPE',
            formLoading: 'جاري تحميل نموذج الدفع الآمن...'
        },
        'hi': {
            title: 'भुगतान विकल्प',
            description: 'एआई रणनीति परामर्श सेवाओं के लिए सुरक्षित भुगतान विधियां। कृपया अपनी पसंदीदा भुगतान विधि चुनें:',
            metaTitle: 'सुरक्षित भुगतान विकल्प | एआई परामर्श सेवाएं | किरिल मार्किन',
            metaDescription: 'किरिल मार्किन की एआई रणनीति और परामर्श सेवाओं के लिए सुरक्षित और सुविधाजनक भुगतान विधियां। कृत्रिम बुद्धिमत्ता परामर्श के लिए कई भुगतान विकल्पों के साथ अपना लेनदेन सुरक्षित रूप से पूरा करें। भारतीय भुगतान विधियों का समर्थन।',
            stripe: {
                title: 'Stripe से भुगतान करें',
                description: 'Stripe के माध्यम से क्रेडिट या डेबिट कार्ड से तेज़ और सुरक्षित भुगतान प्रक्रिया',
                metaTitle: 'Stripe से सुरक्षित भुगतान | एआई परामर्श सेवाएं | किरिल मार्किन',
                metaDescription: 'Stripe के संरक्षित भुगतान प्रसंस्करण का उपयोग करके एआई परामर्श सेवाओं के लिए सुरक्षित भुगतान करें। क्रेडिट कार्ड, डेबिट कार्ड या अन्य समर्थित भुगतान विधियों से अपनी स्थानीय मुद्रा में भुगतान करें।'
            },
            stripePageTitle: 'STRIPE से सुरक्षित भुगतान करें',
            formLoading: 'सुरक्षित भुगतान फॉर्म लोड हो रहा है...'
        }
    },
    notFound: {
        'en': {
            title: 'Page Not Found',
            message: 'The page you\'re looking for doesn\'t exist or has been moved. You might want to explore our articles on AI strategy or check our services instead.',
            backToHome: 'BACK TO HOME'
        },
        'es': {
            title: 'Página No Encontrada',
            message: 'La página que estás buscando no existe o ha sido movida. Tal vez quieras explorar nuestros artículos sobre estrategia de IA o consultar nuestros servicios.',
            backToHome: 'VOLVER AL INICIO'
        },
        'zh': {
            title: '页面未找到',
            message: '您正在寻找的页面不存在或已被移动。您可能想要浏览我们的人工智能战略文章或查看我们的服务。',
            backToHome: '返回主页'
        },
        'ar': {
            title: 'الصفحة غير موجودة',
            message: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها. قد ترغب في استكشاف مقالاتنا حول استراتيجية الذكاء الاصطناعي أو الاطلاع على خدماتنا بدلاً من ذلك.',
            backToHome: 'العودة إلى الصفحة الرئيسية'
        },
        'hi': {
            title: 'पृष्ठ नहीं मिला',
            message: 'आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है या स्थानांतरित कर दिया गया है। आप हमारे एआई रणनीति पर लेख या हमारी सेवाओं को देखना चाह सकते हैं।',
            backToHome: 'मुख्य पृष्ठ पर वापस जाएं'
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
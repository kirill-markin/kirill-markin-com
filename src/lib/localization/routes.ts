import { DEFAULT_LANGUAGE, isValidLanguage } from './languages';
import { PathSegmentsMap, SubPathSegmentsMap } from './types';

/**
 * Path segment mapping for URLs in different languages
 */
export const PATH_SEGMENTS: PathSegmentsMap = {
    articles: {
        en: 'articles',
        es: 'articulos',
        zh: 'zhishi',
        ar: 'maqalat',
        hi: 'gyan',
    },
    services: {
        en: 'services',
        es: 'servicios',
        zh: 'zixun',
        ar: 'khadamat',
        hi: 'sevaen',
    },
    meet: {
        en: 'meet',
        es: 'reservar',
        zh: 'yuyue',
        ar: 'mawid',
        hi: 'miliye',
    },
    pay: {
        en: 'pay',
        es: 'pago',
        zh: 'zhifu',
        ar: 'dafa',
        hi: 'bhugtan',
    },
};

/**
 * Sub-path segment mapping for URLs in different languages
 */
export const SUB_PATH_SEGMENTS: SubPathSegmentsMap = {
    meet: {
        short: {
            en: 'short',
            es: 'breve',
            zh: 'mianfei',
            ar: 'majani',
            hi: 'muft',
        },
        medium: {
            en: 'medium',
            es: 'medio',
            zh: 'zhong',
            ar: 'mutawassit',
            hi: 'madhyam',
        },
        long: {
            en: 'long',
            es: 'largo',
            zh: 'chang',
            ar: 'tawil',
            hi: 'lamba',
        },
        all: {
            en: 'all',
            es: 'completo',
            zh: 'quanbu',
            ar: 'jamia',
            hi: 'sabhi',
        },
    },
    pay: {
        stripe: {
            en: 'stripe',
            es: 'stripe',
            zh: 'stripe',
            ar: 'stripe',
            hi: 'stripe',
        },
    },
    services: {
        all: {
            en: 'all',
            es: 'todos',
            zh: 'quanbu',
            ar: 'jamia',
            hi: 'sabhi',
        },
        people: {
            en: 'people',
            es: 'personas',
            zh: 'geren',
            ar: 'afrad',
            hi: 'vyakti',
        },
        business: {
            en: 'business',
            es: 'empresas',
            zh: 'qiye',
            ar: 'sharikat',
            hi: 'vyapar',
        },
        journalists: {
            en: 'journalists',
            es: 'medios',
            zh: 'meiti',
            ar: 'sahafa',
            hi: 'media',
        },
        police: {
            en: 'police',
            es: 'policia',
            zh: 'jingcha',
            ar: 'shurta',
            hi: 'police',
        },
    },
    articles: {
        productivity: {
            en: 'productivity',
            es: 'productividad',
            zh: '生产效率',
            ar: 'الإنتاجية',
            hi: 'उत्पादकता',
        },
        'cursor-ide': {
            en: 'cursor-ide',
            es: 'cursor-ide',
            zh: 'cursor-ide',
            ar: 'كورسر-آيدي',
            hi: 'कर्सर-आईडीई',
        },
        ai: {
            en: 'ai',
            es: 'ia',
            zh: 'ai',
            ar: 'الذكاء-الاصطناعي',
            hi: 'एआई',
        },
        llm: {
            en: 'llm',
            es: 'llm',
            zh: '人工智能',
            ar: 'نماذج-اللغة-الكبيرة',
            hi: 'एलएलएम',
        },
        notion: {
            en: 'notion',
            es: 'notion',
            zh: 'notion',
            ar: 'نوشن',
            hi: 'नोशन',
        },
        'task-management': {
            en: 'task-management',
            es: 'gestion-tareas',
            zh: '任务管理',
            ar: 'ادارة-المهام',
            hi: 'कार्य-प्रबंधन',
        },
    },
};

export type PathSegmentKey = keyof typeof PATH_SEGMENTS;

export type SubPathSegmentGroupKey = keyof typeof SUB_PATH_SEGMENTS;

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
    if (language === DEFAULT_LANGUAGE || !PATH_SEGMENTS[segment] || !isValidLanguage(language)) {
        return segment;
    }

    return PATH_SEGMENTS[segment][language] || segment;
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
    if (
        language === DEFAULT_LANGUAGE ||
        !isValidLanguage(language) ||
        !SUB_PATH_SEGMENTS[mainSegment] ||
        !SUB_PATH_SEGMENTS[mainSegment][subSegment]
    ) {
        return subSegment;
    }

    return SUB_PATH_SEGMENTS[mainSegment][subSegment][language] || subSegment;
}

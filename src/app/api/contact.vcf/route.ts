import { NextResponse } from 'next/server';
import {
    PHONE_NUMBER,
    WHATSAPP_PHONE,
    TELEGRAM_USERNAME,
    EMAIL,
    SITE_URL,
    SOCIAL_URLS,
    VCARD_DATA,
} from '@/data/contacts';

/**
 * Generate vCard content from contacts constants
 */
function generateVCard(): string {
    // Format birthday as YYYYMMDD (vCard format)
    const birthday = VCARD_DATA.birthday.replace(/-/g, '');

    // Address components for ADR field
    const address = VCARD_DATA.address;

    // Escape colons in URLs for vCard format
    const escapeUrl = (url: string): string => url.replace(/:/g, '\\:');

    // ADR format per RFC 6350: PO Box;Extended;Street;Locality;Region;Postal Code;Country
    const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${VCARD_DATA.fullName}`,
        `N:${VCARD_DATA.lastName};${VCARD_DATA.firstName};;;`,
        `EMAIL;TYPE=INTERNET;TYPE=HOME:${EMAIL}`,
        `item1.TEL:${PHONE_NUMBER}`,
        'item1.X-ABLabel:main',
        `NOTE:${VCARD_DATA.note}`,
        `ADR;TYPE=HOME:;;;${address.city};;${address.postalCode};${address.country}`,
        `item2.ORG:${VCARD_DATA.organization}`,
        'item2.X-ABLabel:',
        `item3.TITLE:${VCARD_DATA.title}`,
        'item3.X-ABLabel:',
        `BDAY:${birthday}`,
        `item4.URL:${escapeUrl(SITE_URL)}`,
        'item4.X-ABLabel:homePage',
        `item5.URL:${escapeUrl(`https://${VCARD_DATA.organization}`)}`,
        `item5.X-ABLabel:${VCARD_DATA.organization}`,
        `item6.URL:${escapeUrl(SOCIAL_URLS.linkedin)}`,
        'item6.X-ABLabel:LinkedIn',
        `item7.URL:${escapeUrl(SOCIAL_URLS.instagram)}`,
        'item7.X-ABLabel:Instagram',
        `item8.URL:${escapeUrl(SOCIAL_URLS.facebook)}`,
        'item8.X-ABLabel:Facebook',
        `item9.URL:${escapeUrl(SOCIAL_URLS.twitter)}`,
        'item9.X-ABLabel:Twitter',
        `item10.URL:${escapeUrl(`https://t.me/${TELEGRAM_USERNAME}`)}`,
        'item10.X-ABLabel:Telegram',
        `item11.URL:${escapeUrl(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`)}`,
        'item11.X-ABLabel:WhatsApp',
        `PHOTO:${VCARD_DATA.photoUrl}`,
        'CATEGORIES:myContacts',
        'END:VCARD',
    ];

    return lines.join('\r\n') + '\r\n';
}

export async function GET(): Promise<NextResponse> {
    const vcardContent = generateVCard();

    return new NextResponse(vcardContent, {
        headers: {
            'Content-Type': 'text/vcard; charset=utf-8',
            'Content-Disposition': 'attachment; filename="kirill-markin.vcf"',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
    });
}

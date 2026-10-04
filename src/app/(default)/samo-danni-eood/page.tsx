import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';
import { samoDanniEood } from '@/data/samoDanniEood';
import { generateSamoDanniEoodPageMetadata } from '@/lib/metadata';
import styles from './page.module.css';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
    return generateSamoDanniEoodPageMetadata();
}

/** Serialize JSON-LD for an inline script; escaping `<` prevents `</script>` breakouts. */
const serializeJsonLd = (data: object): string => JSON.stringify(data).replace(/</g, '\\u003c');

const { address } = samoDanniEood;
const fullAddress = `${address.streetAddress}, ${address.addressLocality} ${address.postalCode}, ${address.countryName}`;

const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': samoDanniEood.organizationId,
            'name': samoDanniEood.name,
            'legalName': samoDanniEood.name,
            'alternateName': samoDanniEood.cyrillicName,
            'url': samoDanniEood.url,
            'logo': samoDanniEood.schemaLogoUrl,
            'vatID': samoDanniEood.vatId,
            'foundingDate': samoDanniEood.foundingDate,
            'email': samoDanniEood.email,
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': address.streetAddress,
                'addressLocality': address.addressLocality,
                'postalCode': address.postalCode,
                'addressCountry': address.countryCode
            },
            'founder': { '@id': `${SITE_URL}/#person` },
            'sameAs': samoDanniEood.sameAs
        },
        ...samoDanniEood.apps.map(app => ({
            '@type': 'SoftwareApplication',
            '@id': app.schemaId,
            'name': app.name,
            'url': app.url,
            'publisher': { '@id': samoDanniEood.organizationId }
        }))
    ]
};

export default function SamoDanniEoodPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
            />
            <div className={styles.page}>
                <header className={styles.header}>
                    <Image
                        src={samoDanniEood.logoPath}
                        alt={`${samoDanniEood.name} logo`}
                        width={96}
                        height={96}
                        className={styles.logo}
                    />
                    <h1 className={styles.title}>{samoDanniEood.name}</h1>
                </header>

                <p className={styles.intro}>
                    {samoDanniEood.name} is a Bulgarian software company that builds and operates open-source apps.
                </p>

                <h2 className={styles.sectionTitle}>Company details</h2>
                <dl className={styles.details}>
                    <dt>Legal name</dt>
                    <dd>{samoDanniEood.name} ({samoDanniEood.cyrillicName})</dd>
                    <dt>UIC (ЕИК)</dt>
                    <dd>{samoDanniEood.uic}</dd>
                    <dt>VAT number</dt>
                    <dd>{samoDanniEood.vatId}</dd>
                    <dt>Registered</dt>
                    <dd>{samoDanniEood.foundingDate}, Bulgarian Commercial Register</dd>
                    <dt>Registered address</dt>
                    <dd>{fullAddress}</dd>
                    <dt>Founder and manager</dt>
                    <dd><Link href="/">{VCARD_DATA.fullName}</Link></dd>
                    <dt>Email</dt>
                    <dd><a href={`mailto:${samoDanniEood.email}`}>{samoDanniEood.email}</a></dd>
                </dl>

                <h2 className={styles.sectionTitle}>Apps</h2>
                <ul className={styles.apps}>
                    {samoDanniEood.apps.map(app => (
                        <li key={app.url}>
                            <a href={app.url} target="_blank" rel="noopener">{app.name}</a>: {app.description}
                        </li>
                    ))}
                </ul>
            </div>
            <Footer
                language="en"
                currentPath={samoDanniEood.path}
                availableLanguages={['en']}
            />
        </>
    );
}

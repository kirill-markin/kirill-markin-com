'use client';

import { personalInfo } from '@/data/personalInfo';
import { servicesOtherData } from '@/data/servicesOther';
import { SITE_URL, SOCIAL_URLS, getTelegramUrl } from '@/data/contacts';
import { additionalFacts } from '@/data/additionalFacts';
import { getCompanyApp, samoDanniEood } from '@/data/samoDanniEood';
import { DEFAULT_LANGUAGE, getTranslation } from '@/lib/localization';

interface JsonLdSchemaProps {
  language?: string;
}

/**
 * Component that renders JSON-LD structured data for better SEO
 * This provides search engines with structured information about the website, person, 
 * and services
 */
export default function JsonLdSchema({ language = DEFAULT_LANGUAGE }: JsonLdSchemaProps) {
  // Get personal info translations
  const personalInfoTranslations = getTranslation('personalInfo', language);

  // sameAs lists external profile pages only, per Google guidance
  const sameAs = [...Object.values(SOCIAL_URLS), getTelegramUrl()];

  const personId = `${SITE_URL}/#person`;

  const foundedApps = additionalFacts.flatMap(fact => fact.kind === 'founder' ? fact.links : []);
  const siblings = additionalFacts.flatMap(fact => fact.kind === 'sibling' ? fact.links : []);
  const almaMaters = additionalFacts.flatMap(fact => fact.kind === 'alumni' ? fact.links : []);
  const memberships = additionalFacts.flatMap(fact =>
    fact.kind === 'jury' || fact.kind === 'judge' ? fact.links : []
  );

  // Create enhanced person schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    'name': personalInfo.name,
    'jobTitle': [
      personalInfoTranslations.jobTitle,
      personalInfoTranslations.secondaryTitle
    ].filter(Boolean).join(', '),
    'url': `${SITE_URL}/`,
    'email': personalInfo.email,
    'telephone': personalInfo.phone,
    'image': `${SITE_URL}/${personalInfo.image.startsWith('/') ? personalInfo.image.substring(1) : personalInfo.image}`,
    'sameAs': sameAs,
    'knowsAbout': [
      'AI Engineering',
      'Data Science',
      'Software Architecture',
      'Tech Consulting',
      'Analytics',
      'Low-code Development',
      'Startup Advisory'
    ],
    'alumniOf': almaMaters.map(school => ({
      '@type': 'CollegeOrUniversity',
      'name': school.name,
      ...(school.url ? { 'url': school.url } : {})
    })),
    'sibling': siblings.map(sibling => ({
      '@type': 'Person',
      'name': sibling.name,
      'url': sibling.url
    })),
    'memberOf': memberships.map(membership => ({
      '@type': 'OrganizationRole',
      'memberOf': {
        '@type': 'Organization',
        'name': membership.name,
        'url': membership.url
      },
      'roleName': membership.roleName,
      'startDate': membership.startDate
    }))
  };

  const foundedAppSchemas = foundedApps.map(app => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': getCompanyApp(app.url).schemaId,
    'name': app.name,
    'url': app.url,
    'creator': { '@id': personId },
    'publisher': {
      '@type': 'Organization',
      '@id': samoDanniEood.organizationId,
      'name': samoDanniEood.name,
      'url': samoDanniEood.url
    }
  }));

  // Create professional service schema with more details
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': `${personalInfo.name} - Professional Services`,
    'description': 'Professional services including AI consulting, analytics department audit, startup guidance, and more',
    'url': `${SITE_URL}/services/`,
    'logo': `${SITE_URL}/${personalInfo.image.startsWith('/') ? personalInfo.image.substring(1) : personalInfo.image}`,
    'email': personalInfo.email,
    'telephone': personalInfo.phone,
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'USA',
      'addressLocality': 'San Francisco',
      'addressRegion': 'CA'
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Services Offered',
      'itemListElement': servicesOtherData.map((service, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': service.name,
            'description': service.description.split('\n\n')[0], // Just first paragraph
            'url': service.buttonUrl.startsWith('http') ? service.buttonUrl : `${SITE_URL}${service.buttonUrl.startsWith('/') ? service.buttonUrl : '/' + service.buttonUrl}${!service.buttonUrl.endsWith('/') ? '/' : ''}`,
            'provider': {
              '@type': 'Person',
              'name': personalInfo.name
            },
            'serviceType': service.categoryId.replace('for_', '').charAt(0).toUpperCase() + service.categoryId.replace('for_', '').slice(1)
          }
        }
      }))
    }
  };

  // Enhanced website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': `${SITE_URL}/`,
    'name': `${personalInfo.name} - Official Website`,
    'description': `Professional services by ${personalInfo.name} - Software Architecture, Tech Consulting, and more`,
    'author': {
      '@type': 'Person',
      'name': personalInfo.name
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {foundedAppSchemas.map(appSchema => (
        <script
          key={appSchema.url}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
} 

'use client';

import { personalInfo } from '@/data/personalInfo';
import { socialLinks } from '@/data/socialLinks';
import { servicesOtherData } from '@/data/servicesOther';
import { SITE_URL } from '@/data/contacts';
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

  // Include all social media links for comprehensive coverage
  const sameAs = socialLinks.map(link => link.url);

  // Create enhanced person schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': personalInfo.name,
    'jobTitle': [
      personalInfoTranslations.jobTitle,
      personalInfoTranslations.secondaryTitle,
      personalInfoTranslations.tertiaryTitle
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
    ]
  };

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
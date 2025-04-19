'use client';

import { personalInfo } from '@/data/personalInfo';
import { socialLinks } from '@/data/socialLinks';
import { servicesData } from '@/data/services';

/**
 * Component that renders JSON-LD structured data for better SEO
 * This provides search engines with structured information about the website, person, 
 * and services
 */
export default function JsonLdSchema() {
  // Include all social media links for comprehensive coverage
  const sameAs = socialLinks.map(link => link.url);

  // Create enhanced person schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': personalInfo.name,
    'jobTitle': [personalInfo.jobTitle, personalInfo.secondaryTitle, personalInfo.tertiaryTitle].filter(Boolean).join(', '),
    'url': 'https://kirill-markin.com/',
    'email': personalInfo.email,
    'telephone': personalInfo.phone,
    'image': `https://kirill-markin.com/${personalInfo.image.startsWith('/') ? personalInfo.image.substring(1) : personalInfo.image}`,
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
    'url': 'https://kirill-markin.com/services/',
    'logo': `https://kirill-markin.com/${personalInfo.image.startsWith('/') ? personalInfo.image.substring(1) : personalInfo.image}`,
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
      'itemListElement': servicesData.map((service, index) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': service.name,
          'description': service.description.split('\n\n')[0], // Just first paragraph
          'url': service.buttonUrl.startsWith('http') ? service.buttonUrl : `https://kirill-markin.com${service.buttonUrl.startsWith('/') ? service.buttonUrl : '/' + service.buttonUrl}${!service.buttonUrl.endsWith('/') ? '/' : ''}`,
          'provider': {
            '@type': 'Person',
            'name': personalInfo.name
          },
          'serviceType': service.categoryId.replace('for_', '').charAt(0).toUpperCase() + service.categoryId.replace('for_', '').slice(1)
        },
        'position': index + 1
      }))
    }
  };

  // Enhanced website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': 'https://kirill-markin.com/',
    'name': `${personalInfo.name} - Official Website`,
    'description': 'Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more',
    'author': {
      '@type': 'Person',
      'name': personalInfo.name
    }
  };

  // Add breadcrumb schema for better navigation understanding
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://kirill-markin.com/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Services',
        'item': 'https://kirill-markin.com/services/'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Meeting Options',
        'item': 'https://kirill-markin.com/meet/'
      }
    ]
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
} 
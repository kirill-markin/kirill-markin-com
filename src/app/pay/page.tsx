import { PayPage } from '@/components/pages/pay';
import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';

export const metadata: Metadata = {
  title: 'Payment Options | Kirill Markin',
  description: 'Choose your preferred payment method for Kirill Markin\'s services.',
  openGraph: {
    title: 'Payment Options | Kirill Markin',
    description: 'Choose your preferred payment method for Kirill Markin\'s services.',
    url: 'https://kirill-markin.com/pay/',
    images: [
      {
        url: '/images/payment-options.webp',
        width: 1200,
        height: 630,
        alt: 'Payment options for Kirill Markin\'s services',
      }
    ],
    type: 'website',
    siteName: 'Kirill Markin',
    locale: 'en_US',
  },
  twitter: {
    title: 'Payment Options | Kirill Markin',
    description: 'Choose your preferred payment method for Kirill Markin\'s services.',
    images: ['/images/payment-options.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/pay/',
  },
};

interface PageProps {
  params: Promise<{ lang?: string }>;
}

export default async function Page({ params }: PageProps) {
  // Get language from params, default to English if not provided
  const { lang = DEFAULT_LANGUAGE } = await params || {};

  return <PayPage language={lang} />;
} 
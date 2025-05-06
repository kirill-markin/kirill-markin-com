import { StripePaymentPage } from '@/components/pages/pay';
import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';

export const metadata: Metadata = {
  title: 'Pay with Stripe | Kirill Markin',
  description: 'Secure payment with credit or debit card for Kirill Markin\'s services.',
  openGraph: {
    title: 'Pay with Stripe | Kirill Markin',
    description: 'Secure payment with credit or debit card for Kirill Markin\'s services.',
    url: 'https://kirill-markin.com/pay/stripe/',
    images: [
      {
        url: '/images/stripe-payment.webp',
        width: 1200,
        height: 630,
        alt: 'Pay with Stripe for Kirill Markin\'s services',
      }
    ],
    type: 'website',
    siteName: 'Kirill Markin',
    locale: 'en_US',
  },
  twitter: {
    title: 'Pay with Stripe | Kirill Markin',
    description: 'Secure payment with credit or debit card for Kirill Markin\'s services.',
    images: ['/images/stripe-payment.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/pay/stripe/',
  },
};

interface PageProps {
  params: Promise<{ lang?: string }>;
}

export default async function Page({ params }: PageProps) {
  // Get language from params, default to English if not provided
  const { lang = DEFAULT_LANGUAGE } = await params || {};

  return <StripePaymentPage language={lang} />;
} 
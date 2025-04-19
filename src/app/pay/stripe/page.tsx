import { Metadata } from 'next';
import StripePaymentClient from './stripe-client';

export const metadata: Metadata = {
  title: 'Stripe Payment | Kirill Markin',
  description: 'Secure payment via Stripe for Kirill Markin\'s professional services. Pay using credit card, Apple Pay, or Google Pay.',
  openGraph: {
    title: 'Stripe Payment | Kirill Markin',
    description: 'Secure payment via Stripe for Kirill Markin\'s professional services. Pay using credit card, Apple Pay, or Google Pay.',
    url: 'https://kirill-markin.com/pay/stripe/',
    images: [
      {
        url: '/images/stripe-payment.webp',
        width: 1200,
        height: 630,
        alt: 'Stripe payment for Kirill Markin\'s services',
      }
    ],
    type: 'website',
    siteName: 'Kirill Markin',
    locale: 'en_US',
  },
  twitter: {
    title: 'Stripe Payment | Kirill Markin',
    description: 'Secure payment via Stripe for Kirill Markin\'s professional services.',
    images: ['/images/stripe-payment.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/pay/stripe/',
  },
};

export default function StripePaymentPage() {
  return <StripePaymentClient />;
} 
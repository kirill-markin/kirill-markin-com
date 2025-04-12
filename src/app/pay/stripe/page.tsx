import { Metadata } from 'next';
import StripePaymentClient from './stripe-client';

export const metadata: Metadata = {
  title: 'Stripe Payment | Kirill Markin',
  description: 'Secure payment via Stripe for Kirill Markin\'s professional services. Pay using credit card, Apple Pay, or Google Pay.',
};

export default function StripePaymentPage() {
  return <StripePaymentClient />;
} 
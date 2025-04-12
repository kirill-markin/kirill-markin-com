import Link from 'next/link';
import styles from '../page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stripe Payment | Kirill Markin',
  description: 'Secure payment via Stripe for Kirill Markin\'s professional services. Pay using credit card, Apple Pay, or Google Pay.',
};

export default function StripePaymentPage() {
  return (
    <div className={styles.paymentOptionsContainer}>
      <h1>STRIPE PAYMENT</h1>
      <p>This is a placeholder for the Stripe payment interface.</p>
      <p>In a real implementation, this would integrate with Stripe to collect payment details securely.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <Link href="/pay" style={{ 
          color: 'var(--dark-gray)', 
          textDecoration: 'underline',
          fontWeight: 'bold' 
        }}>
          ← Back to payment options
        </Link>
      </div>
    </div>
  );
} 
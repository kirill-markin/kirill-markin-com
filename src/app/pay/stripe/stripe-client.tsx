'use client';

import styles from '../page.module.css';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

export default function StripePaymentClient() {
  const stripeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stripeContainerRef.current) {
      // Create custom Stripe pricing table element
      const stripePricingTable = document.createElement('stripe-pricing-table');
      stripePricingTable.setAttribute('pricing-table-id', 'prctbl_1Pb2neE3K3xV54NrGWDLabtL');
      stripePricingTable.setAttribute('publishable-key', 'pk_live_51KrGW6E3K3xV54NrjakiNdX4kKJ5YJiG1YaRjzafUba44oeVTvOZNQQTC25riOXZjUtKERJKXbbRxQCwKfh9J0x200wTzm77Ps');
      stripePricingTable.className = styles.stripePricingTable;
      
      // Clear and append
      stripeContainerRef.current.innerHTML = '';
      stripeContainerRef.current.appendChild(stripePricingTable);
    }
  }, []);

  return (
    <div className={styles.paymentOptionsContainer}>
      <h1>STRIPE PAYMENT</h1>
      
      <div className={styles.stripeContainer} ref={stripeContainerRef}>
        {/* Stripe pricing table will be rendered here */}
      </div>
      
      <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="afterInteractive" />
    </div>
  );
} 
import React from 'react';
import type { Metadata } from 'next';
import AlphaCarePage from './(public)/components/AlphaCarePage';

export const metadata: Metadata = {
  title: 'MedMitra - Your Personal Health Records, Simplified & Secure',
  description:
    'Get the right diagnosis from the world\'s top doctors. Access your health information anytime, anywhere with our secure platform. HIPAA compliant, trusted by 5000+ patients.',
  keywords: [
    'EMR',
    'EHR',
    'healthcare software',
    'medical records',
    'practice management',
    'telemedicine',
    'HIPAA compliant',
    'health records',
    'patient portal',
    'doctor appointment',
  ],
  openGraph: {
    title: 'MedMitra - Your Personal Health Records, Simplified & Secure',
    description:
      'Get the right diagnosis from the world\'s top doctors. Access your health information anytime, anywhere.',
    type: 'website',
    url: 'https://medmitra.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedMitra - Your Personal Health Records, Simplified & Secure',
    description:
      'Get the right diagnosis from the world\'s top doctors. Access your health information anytime, anywhere.',
  },
};

/**
 * Landing Page - Main public homepage
 * Redesigned to match Alpha Care reference design
 */
export default function Home() {
  return <AlphaCarePage />;
}
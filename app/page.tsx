import React from 'react';
import type { Metadata } from 'next';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import {
  Hero,
  ForDoctors,
  ForPatients,
  ForCoordinators,
  FeatureShowcase,
  Trust,
  CTA,
} from './(public)/components/sections';

export const metadata: Metadata = {
  title: 'MedMitra - Modern Healthcare EMR Solutions',
  description:
    'Transform your healthcare practice with AI-powered EMR solutions. Streamline workflows, enhance patient care, and unlock data-driven insights. HIPAA compliant, trusted by 10,000+ providers.',
  keywords: [
    'EMR',
    'EHR',
    'healthcare software',
    'medical records',
    'practice management',
    'telemedicine',
    'HIPAA compliant',
  ],
  openGraph: {
    title: 'MedMitra - Modern Healthcare EMR Solutions',
    description:
      'Transform your healthcare practice with AI-powered EMR solutions.',
    type: 'website',
    url: 'https://medmitra.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedMitra - Modern Healthcare EMR Solutions',
    description:
      'Transform your healthcare practice with AI-powered EMR solutions.',
  },
};

/**
 * Landing Page - Main public homepage
 */
export default function Home() {
  return (
    <div className="relative min-h-screen">
      <PublicNav />
      <main className="relative">
        <Hero />
        <ForDoctors />
        <ForPatients />
        <ForCoordinators />
        <FeatureShowcase />
        <Trust />
        <CTA />
      </main>
      <PublicFooter />
    </div>
  );
}
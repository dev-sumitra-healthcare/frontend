'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { GradientText } from '@/components/gradient/GradientText';
import { GradientMesh } from '@/components/gradient/GradientMesh';
import { GradientOrb } from '@/components/gradient/GradientOrb';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassButton } from '@/components/glass/GlassButton';
import { FadeIn } from '@/components/animation/FadeIn';
import { ScaleIn } from '@/components/animation/ScaleIn';

const benefits = [
  'No credit card required',
  'Full access to all features',
  'Setup in under 5 minutes',
  'Cancel anytime',
];

/**
 * CTA - Final call-to-action section with gradient canvas
 */
export const CTA: React.FC = () => {
  return (
    <section className="relative w-full py-20 overflow-hidden">
      {/* Background Elements Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Gradient Mesh Background */}
        <GradientMesh variant="hero" animated baseColor="#F8FAFC" />

        {/* Floating Gradient Orbs */}
        <GradientOrb
          size={400}
          gradient="sky"
          blur={100}
          opacity={0.3}
          floating
          position={{ top: "10%", right: "10%" }}
        />
        <GradientOrb
          size={350}
          gradient="teal"
          blur={90}
          opacity={0.25}
          floating
          floatDuration={7}
          position={{ bottom: "10%", left: "10%" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <ScaleIn spring className="w-full">
          <GlassCard
            variant="strong"
            padding="xl"
            rounded="3xl"
            className="w-full text-center"
          >
            {/* Badge */}
            <FadeIn delay={0.1} className="w-full flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-blue">
                <span className="w-2 h-2 rounded-full bg-gradient-primary animate-pulse-glow" />
                <span className="text-sm font-semibold text-sky-deep">
                  Limited Time Offer
                </span>
              </div>
            </FadeIn>

            {/* Headline */}
            <FadeIn delay={0.2} className="w-full flex justify-center mb-6">
              <GradientText
                as="h2"
                gradient="primary"
                animated
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-center"
              >
                Start Your Free Trial Today
              </GradientText>
            </FadeIn>

            {/* Subheadline */}
            <FadeIn delay={0.3} className="w-full flex justify-center mb-8">
              <p className="text-xl md:text-2xl text-ocean-mid/80 dark:text-white/80 max-w-3xl text-center">
                Join thousands of healthcare providers who trust MedMitra to
                streamline their practice and improve patient care.
              </p>
            </FadeIn>

            {/* Benefits Grid */}
            {/* <FadeIn delay={0.4} className="w-full flex justify-center mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full mx-auto">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 justify-center sm:justify-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-teal flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-ocean-deep dark:text-white font-medium whitespace-nowrap">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn> */}

            {/* CTA Buttons */}
            <FadeIn delay={0.5} className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 w-full">
                <Link href="/register">
                  <GlassButton
                    variant="gradient"
                    gradient="primary"
                    size="xl"
                    iconAfter={<ArrowRight className="w-5 h-5" />}
                    className="shadow-glow-blue min-w-[200px]"
                  >
                    Start Free Trial
                  </GlassButton>
                </Link>

                <Link href="/contact">
                  <GlassButton
                    variant="glass"
                    size="xl"
                    className="min-w-[200px]"
                  >
                    Talk to Sales
                  </GlassButton>
                </Link>
              </div>
            </FadeIn>

            {/* Trust Indicator */}
            <FadeIn delay={0.6} className="w-full text-center">
              <p className="text-sm text-ocean-mid/60 dark:text-white/60">
                Trusted by 10,000+ healthcare providers worldwide
              </p>
            </FadeIn>
          </GlassCard>
        </ScaleIn>

        {/* Bottom Trust Badges */}
        <FadeIn delay={0.7} className="w-full mt-12">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-ocean-mid/70 dark:text-white/70 w-full">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No Long-term Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>24/7 Support Included</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free Data Migration</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

CTA.displayName = 'CTA';
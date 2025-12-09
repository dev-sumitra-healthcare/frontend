'use client';

import React from 'react';
import { Brain, Lock, Zap, Globe, Smartphone, Database } from 'lucide-react';
import { GlassCard } from '@/components/glass/GlassCard';
import { GradientText } from '@/components/gradient/GradientText';
import { GradientMesh } from '@/components/gradient/GradientMesh';
import { FadeIn } from '@/components/animation/FadeIn';
import { ScaleIn } from '@/components/animation/ScaleIn';

/**
 * FeatureShowcase - Bento grid layout with varied panel sizes
 */
export const FeatureShowcase: React.FC = () => {
  return (
    <section id="features" className="relative py-20 overflow-hidden">
      {/* Background */}
      <GradientMesh variant="subtle" baseColor="#FFFFFF" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <GradientText
            as="h2"
            gradient="primary"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Everything You Need, Nothing You Don't
          </GradientText>
          <p className="text-xl text-ocean-mid/70 dark:text-white/70  mx-auto">
            Powerful features designed to transform your healthcare practice
          </p>
        </FadeIn>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Large Hero Panel - AI Intelligence */}
          <ScaleIn delay={0.1} className="md:col-span-2 lg:row-span-2">
            <GlassCard
              variant="strong"
              hover
              padding="xl"
              rounded="3xl"
              className="h-full min-h-[400px] relative overflow-hidden group"
            >
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-opacity" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow-blue">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gradient-primary mb-4">
                  AI-Powered Intelligence
                </h3>
                <p className="text-lg text-ocean-mid/70 dark:text-white/70 mb-6 flex-1">
                  Advanced machine learning algorithms analyze patterns, suggest
                  diagnoses, and automate clinical documentation. Reduce charting
                  time by up to 70%.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-gradient-primary mb-1">70%</div>
                    <div className="text-xs text-ocean-mid/70">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient-teal mb-1">95%</div>
                    <div className="text-xs text-ocean-mid/70">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient-lavender mb-1">24/7</div>
                    <div className="text-xs text-ocean-mid/70">Available</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </ScaleIn>

          {/* Medium Panel - Security */}
          <ScaleIn delay={0.2} className="md:col-span-1">
            <GlassCard
              variant="default"
              hover
              padding="lg"
              rounded="2xl"
              className="h-full min-h-[190px]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center mb-4 shadow-glow-teal">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-2">
                Bank-Level Security
              </h3>
              <p className="text-sm text-ocean-mid/70 dark:text-white/70">
                256-bit encryption, SOC 2 certified, HIPAA compliant
              </p>
            </GlassCard>
          </ScaleIn>

          {/* Medium Panel - Performance */}
          <ScaleIn delay={0.3} className="md:col-span-1">
            <GlassCard
              variant="default"
              hover
              padding="lg"
              rounded="2xl"
              className="h-full min-h-[190px]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-lavender flex items-center justify-center mb-4 shadow-glow-lavender">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-ocean-mid/70 dark:text-white/70">
                Sub-second load times, optimized for busy practices
              </p>
            </GlassCard>
          </ScaleIn>

          {/* Medium Panel - Global Access */}
          <ScaleIn delay={0.4} className="md:col-span-1">
            <GlassCard
              variant="default"
              hover
              padding="lg"
              rounded="2xl"
              className="h-full min-h-[190px]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow-blue">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-2">
                Access Anywhere
              </h3>
              <p className="text-sm text-ocean-mid/70 dark:text-white/70">
                Cloud-based, works on any device with internet
              </p>
            </GlassCard>
          </ScaleIn>

          {/* Medium Panel - Mobile */}
          <ScaleIn delay={0.5} className="md:col-span-1">
            <GlassCard
              variant="default"
              hover
              padding="lg"
              rounded="2xl"
              className="h-full min-h-[190px]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center mb-4 shadow-glow-teal">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-2">
                Mobile Ready
              </h3>
              <p className="text-sm text-ocean-mid/70 dark:text-white/70">
                Native iOS & Android apps for on-the-go access
              </p>
            </GlassCard>
          </ScaleIn>

          {/* Large Panel - Integration */}
          <ScaleIn delay={0.6} className="md:col-span-2">
            <GlassCard
              variant="strong"
              hover
              padding="lg"
              rounded="2xl"
              className="h-full min-h-[190px]"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-lavender flex items-center justify-center flex-shrink-0 shadow-glow-lavender">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-ocean-deep dark:text-white mb-3">
                    Seamless Integrations
                  </h3>
                  <p className="text-ocean-mid/70 dark:text-white/70 mb-4">
                    Connect with labs, pharmacies, imaging centers, and 100+ healthcare systems
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['HL7', 'FHIR', 'API', 'EHR', 'DICOM', 'X12'].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg glass-subtle text-sm font-medium text-ocean-deep dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </ScaleIn>
        </div>
      </div>
    </section>
  );
};

FeatureShowcase.displayName = 'FeatureShowcase';

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { GradientText } from "@/components/gradient/GradientText";
import { GradientOrb } from "@/components/gradient/GradientOrb";
import { GradientMesh } from "@/components/gradient/GradientMesh";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { FadeIn } from "@/components/animation/FadeIn";
import { ScaleIn } from "@/components/animation/ScaleIn";

/**
 * Hero Section - Landing page hero with animated gradient background
 */
export const Hero: React.FC = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Animated Mesh Gradient Background - set as absolute */}
      <div className="absolute inset-0 w-full h-full">
        <GradientMesh variant="hero" animated />
      </div>

      {/* Floating Gradient Orbs - ensure they're absolute positioned */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <GradientOrb
          size={500}
          gradient="sky"
          blur={120}
          opacity={0.4}
          mouseFollow
          position={{ top: "10%", left: "5%" }}
        />
        <GradientOrb
          size={400}
          gradient="teal"
          blur={100}
          opacity={0.3}
          floating
          floatDuration={8}
          position={{ top: "50%", right: "10%" }}
        />
        <GradientOrb
          size={350}
          gradient="lavender"
          blur={90}
          opacity={0.25}
          floating
          floatDuration={7}
          position={{ bottom: "15%", left: "15%" }}
        />
      </div>

      {/* Content Container - ensure full width and proper centering */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="w-full text-center">
          {/* Badge */}
          <FadeIn delay={0.1}>
            <div className="flex justify-center mb-8">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong"
                whileHover={{ scale: 1.05 }}
              >
                <span className="w-2 h-2 rounded-full bg-gradient-teal animate-pulse-glow" />
                <span className="text-sm font-medium text-ocean-deep dark:text-white">
                  Next-Generation Healthcare EMR
                </span>
              </motion.div>
            </div>
          </FadeIn>

          {/* Main Headline */}
          <FadeIn delay={0.2}>
            <div className="w-full flex justify-center">
              <GradientText
                as="h1"
                gradient="primary"
                animated
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Transform Healthcare Delivery
              </GradientText>
            </div>
          </FadeIn>

          {/* Sub-headline in Glass Card */}
          <FadeIn delay={0.3}>
            <div className="w-full max-w-4xl mx-auto mb-8">
              <GlassCard
                variant="default"
                padding="md"
                rounded="2xl"
                className="w-full"
              >
                <h2 className="text-xl md:text-2xl text-ocean-mid dark:text-white/90 leading-relaxed">
                  Empower your practice with intelligent EMR solutions.
                  Streamline workflows, enhance patient care, and unlock
                  data-driven insights.
                </h2>
              </GlassCard>
            </div>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full">
              {/* Primary CTA */}
              <Link href="/register">
                <GlassButton
                  variant="gradient"
                  gradient="primary"
                  size="xl"
                  iconAfter={<ArrowRight className="w-5 h-5" />}
                  className="shadow-glow-blue"
                >
                  Get Started Free
                </GlassButton>
              </Link>

              {/* Secondary CTA */}
              <Link href="#demo">
                <GlassButton
                  variant="glass"
                  size="xl"
                  iconBefore={<Play className="w-5 h-5" />}
                >
                  Watch Demo
                </GlassButton>
              </Link>
            </div>
          </FadeIn>

          {/* Trust Indicators */}
          <FadeIn delay={0.5}>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-ocean-mid/70 dark:text-white/70 w-full">
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
                <span>HIPAA Compliant</span>
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
                <span>SOC 2 Type II Certified</span>
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
                <span>99.9% Uptime SLA</span>
              </div>
            </div>
          </FadeIn>

          {/* Hero Visual (Glass Card with Stats) */}
          <ScaleIn
            delay={0.6}
            spring
            className="mt-16 w-full flex justify-center"
          >
            <GlassCard
              variant="strong"
              padding="lg"
              rounded="3xl"
              hover
              className="w-full max-w-4xl"
            >
              <div className="grid grid-cols-3 divide-x divide-white/20">
                <div className="px-6 py-4">
                  <div className="text-4xl font-bold text-gradient-primary mb-2">
                    10K+
                  </div>
                  <div className="text-sm text-ocean-mid/70 dark:text-white/70">
                    Active Doctors
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="text-4xl font-bold text-gradient-teal mb-2">
                    500K+
                  </div>
                  <div className="text-sm text-ocean-mid/70 dark:text-white/70">
                    Patient Records
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="text-4xl font-bold text-gradient-lavender mb-2">
                    99.9%
                  </div>
                  <div className="text-sm text-ocean-mid/70 dark:text-white/70">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </GlassCard>
          </ScaleIn>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ocean-mid/50 dark:text-white/50 hover:text-sky transition-colors cursor-pointer z-20"
        onClick={scrollToFeatures}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll to features"
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
};

Hero.displayName = "Hero";

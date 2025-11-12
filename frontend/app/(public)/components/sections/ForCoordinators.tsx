'use client';

import React from 'react';
import { Calendar, Users, Phone, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/glass/GlassCard';
import { GradientText } from '@/components/gradient/GradientText';
import { FadeIn } from '@/components/animation/FadeIn';
import { StaggerChildren } from '@/components/animation/StaggerChildren';

interface Module {
  icon: React.ReactNode;
  title: string;
  description: string;
  metrics: string;
}

const modules: Module[] = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Smart Scheduling',
    description: 'Optimize appointment slots with AI-powered scheduling.',
    metrics: '40% efficiency',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Patient Management',
    description: 'Track patient flow and manage wait times in real-time.',
    metrics: '500+ patients',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Communication Hub',
    description: 'Centralized messaging for staff and patient coordination.',
    metrics: '1000+ messages',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Wait Time Tracking',
    description: 'Monitor and reduce patient wait times automatically.',
    metrics: '60% reduction',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'Task Automation',
    description: 'Automate routine tasks like reminders and follow-ups.',
    metrics: '80% automated',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Performance Analytics',
    description: 'Track clinic efficiency with detailed reports.',
    metrics: '50+ KPIs',
  },
];

/**
 * ForCoordinators - Grid of interconnected glass modules
 */
export const ForCoordinators: React.FC = () => {
  return (
    <section id="coordinators" className="relative py-20 bg-gradient-sky-light">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full glass-lavender mb-4">
            <span className="text-sm font-semibold text-lavender-deep">For Coordinators</span>
          </div>
          <GradientText
            as="h2"
            gradient="lavender"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Streamline Clinic Operations
          </GradientText>
          <p className="text-xl text-ocean-mid/70 dark:text-white/70  mx-auto">
            Empower your coordination team with tools that simplify scheduling,
            patient management, and workflow automation.
          </p>
        </FadeIn>

        {/* Interconnected Grid */}
        <div className="relative">
          {/* Connection Lines (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            style={{ zIndex: 0 }}
          >
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#A5B4FC" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Horizontal connections */}
            <line x1="16.66%" y1="25%" x2="50%" y2="25%" stroke="url(#line-gradient)" strokeWidth="2" />
            <line x1="50%" y1="25%" x2="83.33%" y2="25%" stroke="url(#line-gradient)" strokeWidth="2" />
            <line x1="16.66%" y1="75%" x2="50%" y2="75%" stroke="url(#line-gradient)" strokeWidth="2" />
            <line x1="50%" y1="75%" x2="83.33%" y2="75%" stroke="url(#line-gradient)" strokeWidth="2" />
            {/* Vertical connections */}
            <line x1="16.66%" y1="25%" x2="16.66%" y2="75%" stroke="url(#line-gradient)" strokeWidth="2" />
            <line x1="50%" y1="25%" x2="50%" y2="75%" stroke="url(#line-gradient)" strokeWidth="2" />
            <line x1="83.33%" y1="25%" x2="83.33%" y2="75%" stroke="url(#line-gradient)" strokeWidth="2" />
          </svg>

          {/* Module Grid */}
          <StaggerChildren
            variant="scale"
            staggerDelay={0.1}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          >
            {modules.map((module, index) => (
              <GlassCard
                key={module.title}
                variant="strong"
                hover
                padding="lg"
                rounded="2xl"
                className="group relative"
              >
                {/* Pulse animation on connection points */}
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-lavender animate-pulse-glow hidden lg:block" />

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-lavender flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow-lavender">
                  {module.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-2">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-ocean-mid/70 dark:text-white/70 mb-4">
                  {module.description}
                </p>

                {/* Metrics Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass-lavender">
                  <TrendingUp className="w-4 h-4 text-lavender-deep" />
                  <span className="text-sm font-semibold text-lavender-deep">
                    {module.metrics}
                  </span>
                </div>
              </GlassCard>
            ))}
          </StaggerChildren>
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={0.7} className="text-center mt-12">
          <p className="text-ocean-mid/70 dark:text-white/70 mb-4">
            Join 500+ clinics optimizing their operations with MedMitra
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-lavender text-white font-semibold hover:opacity-90 transition-opacity shadow-glow-lavender"
          >
            Request a Demo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  );
};

ForCoordinators.displayName = 'ForCoordinators';

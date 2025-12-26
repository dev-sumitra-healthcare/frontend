'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { GlassCard } from '@/components/glass/GlassCard';
import { GradientText } from '@/components/gradient/GradientText';
import { FadeIn } from '@/components/animation/FadeIn';
import { StaggerChildren } from '@/components/animation/StaggerChildren';

interface Testimonial {
  name: string;
  role: string;
  clinic: string;
  quote: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Family Physician',
    clinic: 'Wellness Medical Center',
    quote: 'MedMitra transformed our practice. Documentation time reduced by 60%, and patient satisfaction scores are at an all-time high.',
    rating: 5,
    avatar: 'SJ',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Internal Medicine',
    clinic: 'Metro Health Clinic',
    quote: 'The AI-powered features are incredible. It\'s like having a medical assistant that never sleeps. Best EMR decision we\'ve made.',
    rating: 5,
    avatar: 'MC',
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Pediatrician',
    clinic: 'Children\'s Care Associates',
    quote: 'Finally, an EMR that understands pediatric workflows. The templates and integrations save us hours every day.',
    rating: 5,
    avatar: 'ER',
  },
];

const stats = [
  { value: '10,000+', label: 'Healthcare Providers' },
  { value: '500K+', label: 'Patient Records Managed' },
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '4.9/5', label: 'Customer Satisfaction' },
];

/**
 * Trust - Stats, testimonials section
 */
export const Trust: React.FC = () => {
  return (
    <section className="relative py-20 bg-pearl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Stats Section */}
        <FadeIn className="mb-20">
          <div className="text-center mb-12">
            <GradientText
              as="h2"
              gradient="primary"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Trusted by Healthcare Professionals
            </GradientText>
            <p className="text-lg text-ocean-mid/70 dark:text-white/70">
              Join thousands of providers delivering better care with MedMitra
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.1}>
                <GlassCard
                  variant="strong"
                  padding="lg"
                  rounded="2xl"
                  hover
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-ocean-mid/70 dark:text-white/70">
                    {stat.label}
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Testimonials Section */}
        <div>
          <FadeIn className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-ocean-deep dark:text-white mb-4">
              What Doctors Are Saying
            </h3>
          </FadeIn>

          <StaggerChildren
            variant="slide-up"
            staggerDelay={0.15}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial) => (
              <GlassCard
                key={testimonial.name}
                variant="default"
                hover
                padding="lg"
                rounded="2xl"
                className="flex flex-col"
              >
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-lg bg-gradient-primary/10 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-sky" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-teal text-teal" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-ocean-mid/80 dark:text-white/80 mb-6 flex-1 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-ocean-deep dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-ocean-mid/70 dark:text-white/70">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-ocean-mid/50 dark:text-white/50">
                      {testimonial.clinic}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </StaggerChildren>
        </div>

        {/* Trust Badges */}
        <FadeIn delay={0.5} className="mt-16">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { name: 'HIPAA Compliant', icon: '🔒' },
              { name: 'SOC 2 Type II', icon: '✓' },
              { name: 'ISO 27001', icon: '🛡️' },
              { name: 'GDPR Ready', icon: '🌍' },
            ].map((badge) => (
              <div
                key={badge.name}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-subtle"
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-sm font-medium text-ocean-mid dark:text-white">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

Trust.displayName = 'Trust';

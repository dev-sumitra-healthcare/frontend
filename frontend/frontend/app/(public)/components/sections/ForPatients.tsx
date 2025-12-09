'use client';

import React from 'react';
import { Heart, MessageSquare, FileCheck, Bell, Video, Download } from 'lucide-react';
import { GlassCard } from '@/components/glass/GlassCard';
import { GradientText } from '@/components/gradient/GradientText';
import { GradientMesh } from '@/components/gradient/GradientMesh';
import { FadeIn } from '@/components/animation/FadeIn';
import { SlideIn } from '@/components/animation/SlideIn';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Access Your Health Records',
    description: 'View test results, prescriptions, and medical history anytime, anywhere.',
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'Secure Messaging',
    description: 'Communicate directly with your healthcare provider through encrypted chat.',
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: 'Appointment Reminders',
    description: 'Never miss an appointment with automated SMS and email notifications.',
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: 'Telemedicine Ready',
    description: 'Connect with doctors via video consultation from the comfort of home.',
  },
];

/**
 * ForPatients - Features section with overlapping glass panels
 */
export const ForPatients: React.FC = () => {
  return (
    <section id="patients" className="relative py-20 overflow-hidden">
      {/* Gradient Mesh Background */}
      <GradientMesh variant="subtle" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <FadeIn>
              <div className="inline-block px-4 py-2 rounded-full glass-teal mb-4">
                <span className="text-sm font-semibold text-teal-deep">For Patients</span>
              </div>
              <GradientText
                as="h2"
                gradient="teal"
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Your Health, Your Control
              </GradientText>
              <p className="text-xl text-ocean-mid/70 dark:text-white/70 mb-8 leading-relaxed">
                Take charge of your healthcare journey with instant access to your
                medical information and seamless communication with your care team.
              </p>
            </FadeIn>

            {/* Feature List */}
            <div className="space-y-4">
              {features.slice(0, 2).map((feature, index) => (
                <SlideIn key={feature.title} direction="left" delay={index * 0.1 + 0.2}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center flex-shrink-0 shadow-glow-teal">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-ocean-deep dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-ocean-mid/70 dark:text-white/70">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </SlideIn>
              ))}
            </div>
          </div>

          {/* Right Side - Overlapping Glass Panels */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Background Panel */}
            <SlideIn direction="right" delay={0.2}>
              <GlassCard
                variant="subtle"
                padding="lg"
                rounded="3xl"
                className="absolute top-0 right-0 w-80 h-64 transform rotate-3"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck className="w-8 h-8 text-teal" />
                  <h4 className="text-lg font-bold text-ocean-deep dark:text-white">
                    Lab Results
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gradient-teal rounded-full w-full" />
                  <div className="h-2 bg-gradient-teal/60 rounded-full w-3/4" />
                  <div className="h-2 bg-gradient-teal/30 rounded-full w-1/2" />
                </div>
              </GlassCard>
            </SlideIn>

            {/* Middle Panel */}
            <SlideIn direction="right" delay={0.3}>
              <GlassCard
                variant="default"
                padding="lg"
                rounded="3xl"
                hover
                className="absolute top-20 right-16 w-80 h-64 transform -rotate-2 shadow-glass-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-8 h-8 text-lavender-deep" />
                  <h4 className="text-lg font-bold text-ocean-deep dark:text-white">
                    Upcoming Appointments
                  </h4>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass-subtle">
                      <div className="w-2 h-2 rounded-full bg-gradient-primary" />
                      <div className="flex-1">
                        <div className="h-2 bg-ocean-mid/20 rounded-full w-full mb-2" />
                        <div className="h-2 bg-ocean-mid/10 rounded-full w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </SlideIn>

            {/* Front Panel */}
            <SlideIn direction="right" delay={0.4}>
              <GlassCard
                variant="strong"
                padding="lg"
                rounded="3xl"
                hover
                className="absolute top-40 right-32 w-80 h-64 shadow-glass-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Video className="w-8 h-8 text-sky" />
                  <h4 className="text-lg font-bold text-ocean-deep dark:text-white">
                    Video Consultation
                  </h4>
                </div>
                <div className="aspect-video rounded-xl bg-gradient-primary/20 flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 rounded-lg glass-subtle" />
                  <div className="h-10 flex-1 rounded-lg glass-subtle" />
                </div>
              </GlassCard>
            </SlideIn>
          </div>
        </div>

        {/* Bottom Features (Mobile) */}
        <div className="grid sm:grid-cols-2 gap-6 mt-12 lg:hidden">
          {features.slice(2).map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1 + 0.4}>
              <GlassCard variant="default" padding="md" rounded="xl" hover>
                <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-ocean-deep dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-ocean-mid/70 dark:text-white/70">
                  {feature.description}
                </p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

ForPatients.displayName = 'ForPatients';

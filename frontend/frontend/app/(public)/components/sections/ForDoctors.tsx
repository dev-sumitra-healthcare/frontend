"use client";

import React from "react";
import {
  FileText,
  Calendar,
  Users,
  BarChart3,
  Clock,
  Shield,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GradientText } from "@/components/gradient/GradientText";
import { GradientWave } from "@/components/gradient/GradientWave";
import { FadeIn } from "@/components/animation/FadeIn";
import { StaggerChildren } from "@/components/animation/StaggerChildren";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "teal" | "lavender";
}

const features: Feature[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Smart Documentation",
    description:
      "AI-powered clinical notes with voice-to-text and template customization.",
    color: "blue",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Appointment Management",
    description:
      "Seamless scheduling with automated reminders and calendar sync.",
    color: "teal",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Patient Portal Integration",
    description:
      "Direct communication channel with secure messaging and file sharing.",
    color: "lavender",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Analytics Dashboard",
    description:
      "Real-time insights into practice performance and patient outcomes.",
    color: "blue",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Time-Saving Workflows",
    description:
      "Reduce documentation time by 40% with intelligent automation.",
    color: "teal",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "HIPAA Compliance",
    description:
      "Bank-level encryption and comprehensive audit trails included.",
    color: "lavender",
  },
];

/**
 * ForDoctors - Features section targeting doctors with floating glass cards
 */
export const ForDoctors: React.FC = () => {
  return (
    <section id="doctors" className="relative w-full py-20 overflow-hidden">
      {/* Background Gradient Waves - wrapped in absolute container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <GradientWave
          position="top"
          height={30}
          colors={{ start: "#DBEAFE", middle: "#BFDBFE", end: "#EFF6FF" }}
          animated
        />
        <GradientWave
          position="bottom"
          height={25}
          colors={{ start: "#EFF6FF", middle: "#DBEAFE", end: "#BFDBFE" }}
          animated
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="w-full flex flex-col items-center text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="px-4 py-2 rounded-full glass-blue">
              <span className="text-sm font-semibold text-sky-deep">
                For Doctors
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="w-full flex justify-center mb-4">
            <GradientText
              as="h2"
              gradient="primary"
              className="text-4xl md:text-5xl font-bold text-center"
            >
              Built for Modern Physicians
            </GradientText>
          </div>

          {/* Description */}
          <div className="w-full flex justify-center">
            <p className="text-xl text-ocean-mid/70 dark:text-white/70  text-center">
              Focus on patient care while we handle the paperwork. Our
              intelligent EMR adapts to your workflow.
            </p>
          </div>
        </FadeIn>

        {/* Feature Cards Grid */}
        <div className="w-full">
          <StaggerChildren
            variant="slide-up"
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {features.map((feature, index) => (
              <div key={feature.title} className="w-full">
                <GlassCard
                  variant="default"
                  hover
                  padding="lg"
                  rounded="2xl"
                  tint={feature.color}
                  className="group h-full"
                >
                  {/* Icon */}
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-blue">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-ocean-mid/70 dark:text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </div>
            ))}
          </StaggerChildren>
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={0.6} className="w-full flex justify-center mt-12">
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-glow-blue"
          >
            Start Your Free Trial
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  );
};

ForDoctors.displayName = "ForDoctors";

"use client";

import React from "react";
import { Target, Eye, Heart, Shield, Zap, Users2 } from "lucide-react";
import { GradientText } from "@/components/gradient/GradientText";
import { GradientMesh } from "@/components/gradient/GradientMesh";
import { GradientOrb } from "@/components/gradient/GradientOrb";
import { GlassCard } from "@/components/glass/GlassCard";
import { FadeIn } from "@/components/animation/FadeIn";
import { SlideIn } from "@/components/animation/SlideIn";
import { StaggerChildren } from "@/components/animation/StaggerChildren";

const values = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Patient-Centered",
    description:
      "Every decision we make prioritizes patient care and outcomes.",
    color: "teal",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Security First",
    description:
      "Bank-level encryption and HIPAA compliance are non-negotiable.",
    color: "blue",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Innovation",
    description:
      "Leveraging cutting-edge AI to revolutionize healthcare delivery.",
    color: "lavender",
  },
  {
    icon: <Users2 className="w-8 h-8" />,
    title: "Collaboration",
    description:
      "Building bridges between providers, patients, and healthcare teams.",
    color: "teal",
  },
];

const team = [
  {
    name: "Dr. Alex Thompson",
    role: "CEO & Co-Founder",
    bio: "Former ER physician with 15 years experience",
    initials: "AT",
  },
  {
    name: "Sarah Chen",
    role: "CTO & Co-Founder",
    bio: "MIT CS PhD, ex-Google Healthcare",
    initials: "SC",
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "Chief Medical Officer",
    bio: "Board-certified in Internal Medicine",
    initials: "MR",
  },
  {
    name: "Emily Watson",
    role: "Head of Product",
    bio: "Former product lead at Epic Systems",
    initials: "EW",
  },
];

/**
 * About Page - Company information and values
 */
export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden py-40">
        {/* Background Elements Container */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <GradientMesh variant="hero" animated />
          <GradientOrb
            size={400}
            gradient="sky"
            blur={100}
            opacity={0.3}
            floating
            position={{ top: "20%", right: "10%" }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-6 lg:px-8">
          <div className="w-full text-center">
            <FadeIn className="w-full flex justify-center mb-6">
              <div className="inline-block px-6 py-2 rounded-full glass-blue">
                <span className="text-sm font-semibold text-sky-deep ">
                  About MedMitra
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="w-full flex justify-center mb-6">
              <GradientText
                as="h1"
                gradient="primary"
                animated
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-center"
              >
                Transforming Healthcare, One Practice at a Time
              </GradientText>
            </FadeIn>

            <FadeIn delay={0.2} className="w-full flex justify-center">
              <GlassCard
                variant="default"
                padding="lg"
                rounded="2xl"
                className="w-full max-w-3xl"
              >
                <p className="text-xl text-ocean-mid/80 dark:text-white/80 leading-relaxed text-center">
                  We're on a mission to empower healthcare providers with
                  intelligent, intuitive tools that let them focus on what
                  matters most: patient care.
                </p>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full py-20 bg-pearl">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <SlideIn direction="left" className="w-full">
              <GlassCard
                variant="strong"
                hover
                padding="xl"
                rounded="3xl"
                className="h-full w-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow-blue">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gradient-primary mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-ocean-mid/70 dark:text-white/70 leading-relaxed">
                  To revolutionize healthcare delivery by providing physicians
                  with AI-powered tools that reduce administrative burden,
                  improve diagnostic accuracy, and enhance patient outcomes. We
                  believe technology should work for doctors, not the other way
                  around.
                </p>
              </GlassCard>
            </SlideIn>

            <SlideIn direction="right" delay={0.2} className="w-full">
              <GlassCard
                variant="strong"
                hover
                padding="xl"
                rounded="3xl"
                className="h-full w-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-teal flex items-center justify-center mb-6 shadow-glow-teal">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gradient-teal mb-4">
                  Our Vision
                </h2>
                <p className="text-lg text-ocean-mid/70 dark:text-white/70 leading-relaxed">
                  A world where every healthcare provider has access to
                  cutting-edge technology that amplifies their expertise, where
                  patient data flows seamlessly across care settings, and where
                  administrative tasks never stand between a doctor and their
                  patient.
                </p>
              </GlassCard>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative w-full py-20 overflow-hidden">
        {/* Background Container */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <GradientMesh variant="subtle" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <FadeIn className="w-full text-center mb-16">
            <div className="w-full flex justify-center mb-4">
              <GradientText
                as="h2"
                gradient="primary"
                className="text-4xl md:text-5xl font-bold text-center"
              >
                Our Core Values
              </GradientText>
            </div>
            <div className="w-full flex justify-center">
              <p className="text-xl text-ocean-mid/70 dark:text-white/70  text-center">
                Principles that guide every decision we make
              </p>
            </div>
          </FadeIn>

          <StaggerChildren
            variant="scale"
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {values.map((value) => (
              <div key={value.title} className="w-full">
                <GlassCard
                  variant="strong"
                  hover
                  padding="lg"
                  rounded="2xl"
                  tint={value.color as any}
                  className="text-center group h-full w-full"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-glow-blue">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-ocean-mid/70 dark:text-white/70">
                    {value.description}
                  </p>
                </GlassCard>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-20 bg-gradient-sky-light">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <FadeIn className="w-full text-center mb-16">
            <div className="w-full flex justify-center mb-4">
              <GradientText
                as="h2"
                gradient="lavender"
                className="text-4xl md:text-5xl font-bold text-center"
              >
                Meet Our Team
              </GradientText>
            </div>
            <div className="w-full flex justify-center">
              <p className="text-xl text-ocean-mid/70 dark:text-white/70  text-center">
                Healthcare veterans and tech innovators working together
              </p>
            </div>
          </FadeIn>

          <StaggerChildren
            variant="slide-up"
            staggerDelay={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {team.map((member) => (
              <div key={member.name} className="w-full">
                <GlassCard
                  variant="strong"
                  hover
                  padding="lg"
                  rounded="2xl"
                  className="text-center h-full w-full"
                >
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-glow-blue">
                    {member.initials}
                  </div>
                  {/* Name */}
                  <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-1">
                    {member.name}
                  </h3>
                  {/* Role */}
                  <p className="text-sm font-semibold text-sky mb-2">
                    {member.role}
                  </p>
                  {/* Bio */}
                  <p className="text-sm text-ocean-mid/70 dark:text-white/70">
                    {member.bio}
                  </p>
                </GlassCard>
              </div>
            ))}
          </StaggerChildren>

          {/* Join Us CTA */}
          <FadeIn delay={0.5} className="w-full text-center mt-12">
            <p className="text-ocean-mid/70 dark:text-white/70 mb-4">
              Want to join our mission?
            </p>
            <div className="w-full flex justify-center">
              <a
                href="/careers"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-lavender text-white font-semibold hover:opacity-90 transition-opacity shadow-glow-lavender"
              >
                View Open Positions
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
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

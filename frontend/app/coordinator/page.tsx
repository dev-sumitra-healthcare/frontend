"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Phone,
  Clock,
  CheckCircle2,
  TrendingUp,
  ClipboardList,
  ArrowRight,
  Star,
  Headphones,
} from "lucide-react";
import { PublicNav } from "@/components/layout/PublicNav";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { GlassCard } from "@/components/glass/GlassCard";
import { GradientText } from "@/components/gradient/GradientText";
import { GradientWave } from "@/components/gradient/GradientWave";
import { GradientMesh } from "@/components/gradient/GradientMesh";
import { FadeIn } from "@/components/animation/FadeIn";
import { StaggerChildren } from "@/components/animation/StaggerChildren";
import { GlassButton } from "@/components/glass/GlassButton";

const features = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Smart Scheduling",
    description:
      "Optimize appointment slots with AI-powered scheduling that maximizes efficiency.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Patient Management",
    description:
      "Track patient flow, manage check-ins, and reduce wait times in real-time.",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Communication Hub",
    description:
      "Centralized messaging for staff coordination and patient communication.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Wait Time Tracking",
    description:
      "Monitor and optimize patient wait times with automated alerts and insights.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "Task Automation",
    description:
      "Automate routine tasks like appointment reminders and follow-up scheduling.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Performance Analytics",
    description:
      "Track clinic efficiency with detailed reports and actionable insights.",
  },
];

const benefits = [
  "Reduce scheduling conflicts by 80%",
  "Decrease patient wait times by 60%",
  "Automate appointment reminders",
  "Real-time doctor availability",
  "Integrated triage management",
  "Comprehensive reporting tools",
];

const testimonials = [
  {
    name: "Meera Patel",
    role: "Clinic Coordinator",
    quote: "MedMitra has streamlined our entire scheduling process. We can now handle 50% more patients!",
    rating: 5,
  },
  {
    name: "Arjun Reddy",
    role: "Healthcare Administrator",
    quote: "The analytics dashboard helps us identify bottlenecks and improve our operations daily.",
    rating: 5,
  },
];

export default function CoordinatorPortalPage() {
  return (
    <>
      <PublicNav />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <GradientMesh variant="hero" baseColor="#EEF2FF" />
          <GradientWave
            position="bottom"
            height={30}
            colors={{ start: "#E0E7FF", middle: "#C7D2FE", end: "#EEF2FF" }}
            animated
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-lavender mb-6">
                <ClipboardList className="w-4 h-4 text-lavender-deep" />
                <span className="text-sm font-semibold text-lavender-deep">Coordinator Portal</span>
              </div>

              <GradientText
                as="h1"
                gradient="lavender"
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Orchestrate Care Seamlessly
              </GradientText>

              <p className="text-xl text-ocean-mid/80 dark:text-white/80 mb-8 leading-relaxed">
                Powerful tools to manage appointments, coordinate between doctors and patients, 
                and ensure smooth clinic operations every day.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/coordinator/login">
                  <GlassButton
                    variant="gradient"
                    gradient="lavender"
                    size="lg"
                    iconAfter={<ArrowRight className="w-5 h-5" />}
                    className="w-full sm:w-auto"
                  >
                    Sign In
                  </GlassButton>
                </Link>
                <Link href="/coordinator/register">
                  <GlassButton
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Create Account
                  </GlassButton>
                </Link>
              </div>
            </FadeIn>

            {/* Right - Stats Card */}
            <FadeIn delay={0.2}>
              <GlassCard variant="strong" padding="xl" rounded="3xl" className="shadow-glass-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-lavender mb-2">500+</div>
                    <p className="text-sm text-ocean-mid/70">Clinics Using</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-lavender mb-2">80%</div>
                    <p className="text-sm text-ocean-mid/70">Efficiency Gain</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-lavender mb-2">2K+</div>
                    <p className="text-sm text-ocean-mid/70">Active Coordinators</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-lavender mb-2">60%</div>
                    <p className="text-sm text-ocean-mid/70">Wait Time Reduced</p>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <FadeIn className="text-center mb-16 w-full">
            <GradientText
              as="h2"
              gradient="lavender"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Tools Built for Healthcare Coordination
            </GradientText>
            <p className="text-lg text-ocean-mid/70 dark:text-white/70 max-w-2xl mx-auto">
              Everything you need to manage clinic operations efficiently
            </p>
          </FadeIn>

          <StaggerChildren
            variant="slide-up"
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <div key={feature.title}>
                <GlassCard
                  variant="default"
                  hover
                  padding="lg"
                  rounded="2xl"
                  className="h-full group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-lavender flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow-lavender">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-ocean-deep dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-ocean-mid/70 dark:text-white/70">
                    {feature.description}
                  </p>
                </GlassCard>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 overflow-hidden">
        <GradientMesh variant="subtle" baseColor="#EEF2FF" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <GradientText
                as="h2"
                gradient="lavender"
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Why Coordinators Choose MedMitra
              </GradientText>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-lavender flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-ocean-mid dark:text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <GlassCard key={index} variant="default" padding="lg" rounded="2xl">
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-ocean-mid dark:text-white/90 mb-4 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div>
                      <p className="font-semibold text-ocean-deep dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-ocean-mid/70 dark:text-white/70">
                        {testimonial.role}
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <FadeIn className="w-full">
            <GradientText
              as="h2"
              gradient="lavender"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Streamline Your Clinic?
            </GradientText>
            <p className="text-lg text-ocean-mid/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
              Join 500+ clinics that have transformed their operations with MedMitra. 
              Get started today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/coordinator/register">
                <GlassButton
                  variant="gradient"
                  gradient="lavender"
                  size="lg"
                  iconAfter={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="outline" size="lg">
                  Request Demo
                </GlassButton>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}

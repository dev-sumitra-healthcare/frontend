"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  FileHeart,
  Bell,
  MessageCircle,
  Shield,
  Smartphone,
  Heart,
  ArrowRight,
  CheckCircle2,
  Star,
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
    icon: <CalendarCheck className="w-6 h-6" />,
    title: "Easy Appointment Booking",
    description:
      "Book, reschedule, or cancel appointments with just a few clicks. No more phone calls.",
  },
  {
    icon: <FileHeart className="w-6 h-6" />,
    title: "Health Records Access",
    description:
      "View your complete medical history, lab results, and prescriptions anytime, anywhere.",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Smart Reminders",
    description:
      "Never miss an appointment or medication with automated SMS and email reminders.",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Secure Messaging",
    description:
      "Communicate directly with your healthcare team through encrypted messaging.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Privacy Protected",
    description:
      "Your health data is secured with bank-level encryption and strict access controls.",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Mobile Access",
    description:
      "Access your health information on any device - desktop, tablet, or smartphone.",
  },
];

const benefits = [
  "Book appointments 24/7 online",
  "Access lab results instantly",
  "Track your health metrics",
  "Manage family members' health",
  "Get prescription refill reminders",
  "Video consultations available",
];

const testimonials = [
  {
    name: "Ananya Gupta",
    location: "Mumbai",
    quote: "I love how easy it is to book appointments and check my test results from my phone!",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    location: "Delhi",
    quote: "The reminder system is a lifesaver. I never miss my medications anymore.",
    rating: 5,
  },
];

export default function PatientPortalPage() {
  return (
    <>
      <PublicNav />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <GradientMesh variant="hero" baseColor="#ECFDF5" />
          <GradientWave
            position="bottom"
            height={30}
            colors={{ start: "#D1FAE5", middle: "#A7F3D0", end: "#ECFDF5" }}
            animated
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-teal mb-6">
                <Heart className="w-4 h-4 text-teal-deep" />
                <span className="text-sm font-semibold text-teal-deep">Patient Portal</span>
              </div>

              <GradientText
                as="h1"
                gradient="teal"
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Your Health, Your Control
              </GradientText>

              {/* <p className="text-xl text-ocean-mid/80 dark:text-white/80 mb-8 leading-relaxed">
                Access your health records, book appointments, and communicate with your 
                healthcare team - all from one secure platform designed around your needs.
              </p> */}

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/patient/login">
                  <GlassButton
                    variant="gradient"
                    gradient="teal"
                    size="lg"
                    iconAfter={<ArrowRight className="w-5 h-5" />}
                    className="w-full sm:w-auto"
                  >
                    Sign In
                  </GlassButton>
                </Link>
                <Link href="/patient/register">
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
                    <div className="text-4xl font-bold text-gradient-teal mb-2">1M+</div>
                    <p className="text-sm text-ocean-mid/70">Happy Patients</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-teal mb-2">500+</div>
                    <p className="text-sm text-ocean-mid/70">Partner Clinics</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-teal mb-2">4.9</div>
                    <p className="text-sm text-ocean-mid/70">User Rating</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-teal mb-2">24/7</div>
                    <p className="text-sm text-ocean-mid/70">Access</p>
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
              gradient="teal"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Everything You Need for Better Health
            </GradientText>
            {/* <p className="text-lg text-ocean-mid/70 dark:text-white/70 max-w-2xl mx-auto">
              Take control of your healthcare journey with our patient-centered tools
            </p> */}
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow-teal">
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
        <GradientMesh variant="subtle" baseColor="#ECFDF5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <GradientText
                as="h2"
                gradient="teal"
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Why Patients Love MedMitra
              </GradientText>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-teal flex items-center justify-center flex-shrink-0">
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
                        {testimonial.location}
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
              gradient="teal"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Take Control of Your Health Today
            </GradientText>
            {/* <p className="text-lg text-ocean-mid/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
              Join over a million patients who trust MedMitra for their healthcare needs. 
              Sign up in minutes and start managing your health better.
            </p> */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/patient/register">
                <GlassButton
                  variant="gradient"
                  gradient="teal"
                  size="lg"
                  iconAfter={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="outline" size="lg">
                  Learn More
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

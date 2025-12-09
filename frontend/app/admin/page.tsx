"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  Lock,
  Database,
  ArrowRight,
  CheckCircle2,
  Star,
  UserCog,
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
    icon: <Users className="w-6 h-6" />,
    title: "User Management",
    description:
      "Manage doctors, patients, and staff accounts with granular access controls.",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "System Configuration",
    description:
      "Configure system settings, workflows, and customize the platform to your needs.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Advanced Analytics",
    description:
      "Comprehensive dashboards with insights into system usage and performance.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Security Controls",
    description:
      "Manage security policies, audit logs, and compliance requirements.",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Data Management",
    description:
      "Backup, restore, and manage healthcare data with enterprise-grade tools.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Compliance Center",
    description:
      "Monitor HIPAA compliance, generate reports, and manage certifications.",
  },
];

const benefits = [
  "Complete system oversight",
  "Role-based access control",
  "Audit trail for all activities",
  "Automated backup systems",
  "Real-time system monitoring",
  "Priority technical support",
];

const testimonials = [
  {
    name: "Suresh Menon",
    role: "Hospital IT Director",
    quote: "MedMitra's admin panel gives us complete control over our healthcare IT infrastructure.",
    rating: 5,
  },
  {
    name: "Kavitha Nair",
    role: "Healthcare Administrator",
    quote: "The compliance reporting features have made our audits so much smoother.",
    rating: 5,
  },
];

export default function AdminPortalPage() {
  return (
    <>
      <PublicNav />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <GradientMesh variant="hero" baseColor="#F1F5F9" />
          <GradientWave
            position="bottom"
            height={30}
            colors={{ start: "#E2E8F0", middle: "#CBD5E1", end: "#F1F5F9" }}
            animated
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                <UserCog className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Admin Portal</span>
              </div>

              <GradientText
                as="h1"
                gradient="primary"
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Complete System Control
              </GradientText>

              <p className="text-xl text-ocean-mid/80 dark:text-white/80 mb-8 leading-relaxed">
                Enterprise-grade administration tools to manage users, monitor systems, 
                ensure compliance, and maintain the highest security standards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/admin/login">
                  <GlassButton
                    variant="gradient"
                    gradient="primary"
                    size="lg"
                    iconAfter={<ArrowRight className="w-5 h-5" />}
                    className="w-full sm:w-auto"
                  >
                    Admin Login
                  </GlassButton>
                </Link>
                <Link href="/contact">
                  <GlassButton
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Contact Support
                  </GlassButton>
                </Link>
              </div>
            </FadeIn>

            {/* Right - Stats Card */}
            <FadeIn delay={0.2}>
              <GlassCard variant="strong" padding="xl" rounded="3xl" className="shadow-glass-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-primary mb-2">100+</div>
                    <p className="text-sm text-ocean-mid/70">Healthcare Systems</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-primary mb-2">99.99%</div>
                    <p className="text-sm text-ocean-mid/70">Uptime SLA</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-primary mb-2">SOC 2</div>
                    <p className="text-sm text-ocean-mid/70">Certified</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-gradient-primary mb-2">24/7</div>
                    <p className="text-sm text-ocean-mid/70">Support</p>
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
              gradient="primary"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Enterprise Administration Features
            </GradientText>
            <p className="text-lg text-ocean-mid/70 dark:text-white/70 max-w-2xl mx-auto">
              Powerful tools for complete healthcare system management
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow-blue">
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
        <GradientMesh variant="subtle" baseColor="#F1F5F9" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <GradientText
                as="h2"
                gradient="primary"
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Why Choose MedMitra Admin
              </GradientText>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
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
              gradient="primary"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Need Administrative Access?
            </GradientText>
            <p className="text-lg text-ocean-mid/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
              Contact your system administrator or our support team to get admin access 
              to your organization&apos;s MedMitra platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin/login">
                <GlassButton
                  variant="gradient"
                  gradient="primary"
                  size="lg"
                  iconAfter={<ArrowRight className="w-5 h-5" />}
                >
                  Admin Login
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="outline" size="lg">
                  Contact Support
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

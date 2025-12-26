'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { GradientText } from '@/components/gradient/GradientText';
import { GradientMesh } from '@/components/gradient/GradientMesh';
import { GradientOrb } from '@/components/gradient/GradientOrb';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassButton } from '@/components/glass/GlassButton';
import { FadeIn } from '@/components/animation/FadeIn';
import { SlideIn } from '@/components/animation/SlideIn';

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email Us',
    value: 'contact@medmitra.com',
    link: 'mailto:contact@medmitra.com',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Call Us',
    value: '+1 (555) 123-4567',
    link: 'tel:+15551234567',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Visit Us',
    value: '123 Healthcare Ave, San Francisco, CA 94102',
    link: 'https://maps.google.com',
  },
];

/**
 * Contact Page - Get in touch with glass form
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="relative min-h-screen py-20">
      {/* Background */}
      <GradientMesh variant="subtle" animated />

      <GradientOrb
        size={500}
        gradient="sky"
        blur={120}
        opacity={0.3}
        floating
        position={{ top: '10%', right: '5%' }}
      />
      <GradientOrb
        size={400}
        gradient="teal"
        blur={100}
        opacity={0.25}
        floating
        floatDuration={7}
        position={{ bottom: '10%', left: '10%' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Page Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full glass-blue mb-6">
            <span className="text-sm font-semibold text-sky-deep">Get In Touch</span>
          </div>
          <GradientText
            as="h1"
            gradient="primary"
            animated
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            We'd Love to Hear From You
          </GradientText>
          <p className="text-xl text-ocean-mid/70 dark:text-white/70  mx-auto">
            Have questions about MedMitra? Our team is here to help you get started.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <SlideIn direction="left">
            <GlassCard variant="strong" padding="xl" rounded="3xl">
              <h2 className="text-2xl font-bold text-ocean-deep dark:text-white mb-6">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-teal flex items-center justify-center mx-auto mb-4 shadow-glow-teal">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gradient-teal mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-ocean-mid/70 dark:text-white/70">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <GlassInput
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

                  {/* Email */}
                  <GlassInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    iconBefore={<Mail className="w-5 h-5" />}
                  />

                  {/* Phone */}
                  <GlassInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    iconBefore={<Phone className="w-5 h-5" />}
                  />

                  {/* Subject */}
                  <GlassInput
                    label="Subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-ocean-deep dark:text-white pl-1">
                      Message
                    </label>
                    <div className="glass-default px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-sky/50 transition-all">
                      <textarea
                        name="message"
                        placeholder="Tell us more about your needs..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-transparent outline-none font-medium placeholder:text-ocean-mid/50 dark:placeholder:text-white/50 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <GlassButton
                    type="submit"
                    variant="gradient"
                    gradient="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    iconAfter={!isSubmitting ? <Send className="w-5 h-5" /> : undefined}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </GlassButton>
                </form>
              )}
            </GlassCard>
          </SlideIn>

          {/* Contact Information */}
          <div className="space-y-6">
            <SlideIn direction="right" delay={0.1}>
              <GlassCard variant="strong" padding="xl" rounded="3xl">
                <h2 className="text-2xl font-bold text-ocean-deep dark:text-white mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <a
                      key={info.title}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 rounded-xl glass-subtle hover:glass-default transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-glow-blue">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-ocean-deep dark:text-white mb-1">
                          {info.title}
                        </h3>
                        <p className="text-ocean-mid/70 dark:text-white/70">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </GlassCard>
            </SlideIn>

            <SlideIn direction="right" delay={0.2}>
              <GlassCard variant="default" padding="lg" rounded="2xl">
                <h3 className="font-bold text-ocean-deep dark:text-white mb-4">
                  Office Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ocean-mid/70 dark:text-white/70">Monday - Friday</span>
                    <span className="font-medium text-ocean-deep dark:text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-mid/70 dark:text-white/70">Saturday</span>
                    <span className="font-medium text-ocean-deep dark:text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-mid/70 dark:text-white/70">Sunday</span>
                    <span className="font-medium text-ocean-deep dark:text-white">Closed</span>
                  </div>
                </div>
              </GlassCard>
            </SlideIn>

            <SlideIn direction="right" delay={0.3}>
              <GlassCard variant="default" padding="lg" rounded="2xl" className="bg-gradient-primary/5">
                <h3 className="font-bold text-ocean-deep dark:text-white mb-3">
                  Need Immediate Support?
                </h3>
                <p className="text-sm text-ocean-mid/70 dark:text-white/70 mb-4">
                  Our customer success team is available 24/7 for urgent inquiries.
                </p>
                <a
                  href="/support"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Visit Support Center
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </GlassCard>
            </SlideIn>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Activity,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassButton } from '@/components/glass/GlassButton';
import { GradientMesh } from '@/components/gradient/GradientMesh';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/#features' },
      { name: 'For Doctors', href: '/#doctors' },
      { name: 'For Patients', href: '/#patients' },
      { name: 'For Coordinators', href: '/#coordinators' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Support Center', href: '/support' },
      { name: 'Community', href: '/community' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'HIPAA Compliance', href: '/hipaa' },
    ],
  },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
];

/**
 * PublicFooter - Multi-layer glass footer for public pages
 */
export const PublicFooter: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Gradient Mesh Background */}
      <GradientMesh variant="waves" baseColor="#F8FAFC" />

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section - Newsletter & Social */}
        <div className="glass-strong border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-gradient-primary mb-2">
                  Stay Updated
                </h3>
                <p className="text-ocean-mid dark:text-white/70 mb-4">
                  Get the latest healthcare technology updates delivered to
                  your inbox.
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <GlassInput
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="strong"
                    className="flex-1"
                    success={subscribed}
                    iconBefore={<Mail className="w-5 h-5" />}
                  />
                  <GlassButton
                    type="submit"
                    variant="gradient"
                    gradient="primary"
                    size="md"
                    iconAfter={<ArrowRight className="w-4 h-4" />}
                  >
                    Subscribe
                  </GlassButton>
                </form>
                {subscribed && (
                  <motion.p
                    className="text-sm text-teal mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Thanks for subscribing!
                  </motion.p>
                )}
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex items-center justify-start md:justify-end gap-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="p-3 rounded-xl glass-subtle hover:glass-default hover:scale-110 transition-all group"
                      aria-label={social.name}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-5 h-5 text-ocean-mid dark:text-white group-hover:text-sky" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="glass-opaque">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
              {/* Logo & Description */}
              <div className="col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-blue">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gradient-primary">
                    MedMitra
                  </span>
                </Link>
                <p className="text-sm text-ocean-mid/70 dark:text-white/70 mb-4 max-w-xs">
                  Empowering healthcare providers with innovative EMR
                  solutions. Streamline your practice, improve patient care.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-ocean-mid dark:text-white/70">
                    <Mail className="w-4 h-4" />
                    <span>contact@medmitra.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ocean-mid dark:text-white/70">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ocean-mid dark:text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              {footerSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h4 className="font-semibold text-ocean-deep dark:text-white mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-ocean-mid/70 dark:text-white/70 hover:text-sky dark:hover:text-sky transition-colors inline-flex items-center gap-1 group"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="glass-strong border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-ocean-mid/70 dark:text-white/70">
                © {new Date().getFullYear()} MedMitra. All rights reserved.
                HIPAA Compliant.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/accessibility"
                  className="text-sm text-ocean-mid/70 dark:text-white/70 hover:text-sky transition-colors"
                >
                  Accessibility
                </Link>
                <Link
                  href="/sitemap"
                  className="text-sm text-ocean-mid/70 dark:text-white/70 hover:text-sky transition-colors"
                >
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

PublicFooter.displayName = 'PublicFooter';

"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Activity,
  ChevronDown,
  User,
  Users,
  UserCog,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassNavPill } from "@/components/glass/GlassNavPill";
import { GlassButton } from "@/components/glass/GlassButton";

interface NavLink {
  name: string;
  href: string;
  scroll?: boolean;
}

interface PortalLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Features", href: "/#features", scroll: true },
  { name: "Contact", href: "/contact" },
];

const portalLinks: PortalLink[] = [
  {
    name: "Doctor Portal",
    href: "/doctor/login",
    icon: <User className="w-4 h-4" />,
    description: "Access your clinical dashboard",
  },
  {
    name: "Patient Portal",
    href: "/patient/login",
    icon: <Users className="w-4 h-4" />,
    description: "View your health records",
  },
  {
    name: "Coordinator Access",
    href: "/coordinator/login",
    icon: <UserCog className="w-4 h-4" />,
    description: "Manage appointments",
  },
  {
    name: "Admin Panel",
    href: "/admin/login",
    icon: <Shield className="w-4 h-4" />,
    description: "System administration",
  },
];

/**
 * PublicNav - Floating glass navigation bar for public pages
 */
export const PublicNav: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.9, 0.95]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setPortalDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "px-4 md:px-6 lg:px-8"
        )}
        style={{ opacity: navOpacity }}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto",
            "glass-opaque rounded-2xl",
            "transition-all duration-300",
            scrolled ? "mt-2 shadow-glass-lg" : "mt-5 shadow-glass-md"
          )}
        >
          <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-blue">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <span className="text-xl md:text-2xl font-bold text-gradient-primary">
                MedMitra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <GlassNavPill
                  key={link.href}
                  href={link.href}
                  active={pathname === link.href}
                >
                  {link.name}
                </GlassNavPill>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Portal Dropdown */}
              <div className="relative">
                <GlassButton
                  variant="outline"
                  size="md"
                  onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                  iconAfter={
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        portalDropdownOpen && "rotate-180"
                      )}
                    />
                  }
                >
                  Services
                </GlassButton>

                {/* Dropdown Menu - FIXED OPACITY */}
                {portalDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setPortalDropdownOpen(false)}
                    />
                    <motion.div
                      className={cn(
                        "absolute top-full right-0 mt-2 w-72 z-50",
                        "bg-white/95 dark:bg-gray-900/95", // More opaque background
                        "backdrop-blur-xl backdrop-saturate-150", // Stronger blur effect
                        "border border-gray-200/50 dark:border-gray-700/50", // Add border for definition
                        "rounded-2xl p-2 shadow-2xl" // Stronger shadow
                      )}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {portalLinks.map((portal, index) => (
                        <Link
                          key={portal.href}
                          href={portal.href}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl",
                            "hover:bg-gradient-primary/20 dark:hover:bg-gradient-primary/30", // Stronger hover effect
                            "transition-all duration-200",
                            "group"
                          )}
                        >
                          <div className="p-2 rounded-lg bg-gradient-primary text-white group-hover:scale-110 transition-transform shadow-sm">
                            {portal.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {portal.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {portal.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </div>

              {/* Get Started Button */}
              {/* <Link href="/doctor/register">
                <GlassButton
                  variant="gradient"
                  gradient="primary"
                  size="md"
                  className="animate-pulse-glow"
                >
                  Get Started
                </GlassButton>
              </Link> */}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl glass-subtle hover:glass-default transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-ocean-deep dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-ocean-deep dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - FIXED OPACITY */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div
            className={cn(
              "fixed top-24 left-4 right-4 z-50 lg:hidden",
              "bg-white/95 dark:bg-gray-900/95", // More opaque background
              "backdrop-blur-xl backdrop-saturate-150", // Stronger blur
              "border border-gray-200/50 dark:border-gray-700/50", // Add border
              "rounded-2xl p-6 shadow-2xl" // Stronger shadow
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-xl font-medium transition-all",
                    pathname === link.href
                      ? "bg-gradient-primary text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Portal Links */}
            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-4">
                Services
              </p>
              {portalLinks.map((portal) => (
                <Link
                  key={portal.href}
                  href={portal.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-primary/20 dark:hover:bg-gradient-primary/30 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gradient-primary text-white shadow-sm">
                    {portal.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {portal.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Get Started Button */}
            {/* <Link href="/doctor/register">
              <GlassButton
                variant="gradient"
                gradient="primary"
                size="lg"
                fullWidth
              >
                Get Started
              </GlassButton>
            </Link> */}
          </motion.div>
        </>
      )}
    </>
  );
};

PublicNav.displayName = "PublicNav";

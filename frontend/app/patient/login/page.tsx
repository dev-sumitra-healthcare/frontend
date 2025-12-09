"use client";

import { Metadata } from "next";
import PatientLoginForm from "@/components/patient/PatientLoginForm";
import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { GradientMesh } from "@/components/gradient/GradientMesh";
import { GradientOrb } from "@/components/gradient/GradientOrb";
import { GradientText } from "@/components/gradient/GradientText";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animation/FadeIn";

export default function PatientLoginPage() {
  return (
    <>
     
      <div className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <GradientMesh variant="hero" />

        {/* Fixed GradientOrb usage */}
        <GradientOrb
          gradient="lavender" // Changed from 'color' to 'gradient'
          size={400} // Changed from "lg" to number
          position={{ top: "10%", left: "10%" }} // Changed from "top-left" to object
          mouseFollow
          floating
        />
        <GradientOrb
          gradient="sky" // Changed from 'color="primary"' to valid gradient option
          size={300} // Changed from "md" to number
          position={{ bottom: "10%", right: "10%" }} // Changed from "bottom-right" to object
          floating
          floatDuration={8} // Used instead of 'delay' for timing variation
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex flex-col items-center">
              {/* Branding Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <GradientText
                    gradient="lavender"
                    className="text-4xl md:text-5xl font-bold mb-4"
                  >
                    Patient Portal
                  </GradientText>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-ocean-mid dark:text-gray-300 text-base"
                >
                  MedMitra Healthcare Management System
                </motion.p>
              </div>

              {/* Login Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <PatientLoginForm />
              </motion.div>

              {/* Register Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 text-center text-sm"
              >
                <span className="text-ocean-mid dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                </span>
                <Link
                  href="/patient/register"
                  className="font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors hover:underline"
                >
                  Register here
                </Link>
              </motion.div>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 text-center text-xs text-ocean-light dark:text-gray-500"
              >
                <p>For patients only</p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}

"use client";

import { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { PublicNav } from "@/components/layout/PublicNav";
import { GradientMesh } from "@/components/gradient/GradientMesh";
import { GradientOrb } from "@/components/gradient/GradientOrb";
import { GradientText } from "@/components/gradient/GradientText";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animation/FadeIn";

export default function DoctorLoginPage() {
  return (
    <>

      <div className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <GradientMesh variant="hero" />

        {/* Fixed GradientOrb usage */}
        <GradientOrb
          gradient="sky" // Changed from 'color' to 'gradient'
          size={400} // Adjusted size
          position={{ top: "10%", left: "10%" }} // Changed to object format
          mouseFollow
          floating
        />
        <GradientOrb
          gradient="teal" // Changed from 'color' to 'gradient'
          size={300} // Adjusted size
          position={{ bottom: "10%", right: "10%" }} // Changed to object format
          floating
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
                    gradient="primary"
                    className="text-4xl md:text-5xl font-bold mb-4"
                  >
                    Doctor Portal
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
                <LoginForm />
              </motion.div>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 text-center text-xs text-ocean-light dark:text-gray-500"
              >
                <p>For healthcare providers only</p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}

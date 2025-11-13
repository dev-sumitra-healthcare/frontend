"use client";

import { Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";
import { PublicNav } from "@/components/layout/PublicNav";
import { GradientMesh } from "@/components/gradient/GradientMesh";
import { GradientOrb } from "@/components/gradient/GradientOrb";
import { GradientText } from "@/components/gradient/GradientText";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animation/FadeIn";

export default function DoctorRegisterPage() {
  return (
    <>
    
      <div className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <GradientMesh variant="primary" />

        {/* Fixed GradientOrb usage */}
        <GradientOrb
          gradient="sky" // Changed from 'color="primary"' to 'gradient="sky"'
          size={400} // Changed from string "lg" to number
          position={{ top: "10%", left: "10%" }} // Changed from "top-left" to object
          mouseFollow
          floating
        />
        <GradientOrb
          gradient="teal" // Already correct, just keeping consistency
          size={300} // Changed from string "md" to number
          position={{ bottom: "10%", right: "10%" }} // Changed from "bottom-right" to object
          floating
          floatDuration={8} // Added instead of 'delay' for staggered animation
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
                    variant="primary"
                    className="text-4xl md:text-5xl font-bold mb-4"
                  >
                    Doctor Registration
                  </GradientText>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-ocean-mid dark:text-gray-300 text-base"
                >
                  Join MedMitra Healthcare Management System
                </motion.p>
              </div>

              {/* Register Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <RegisterForm />
              </motion.div>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 text-center text-xs text-ocean-light dark:text-gray-500"
              >
                <p>For healthcare providers only</p>
                <p className="mt-1">
                  Your account will be activated after admin verification
                </p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}

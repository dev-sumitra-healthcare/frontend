"use client";

import PatientLoginForm from "@/components/patient/PatientLoginForm";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PatientLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden patient-bg-gradient">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#9810fa]/20 to-[#f3e8ff]/30 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#155dfc]/15 to-[#9810fa]/20 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Branding Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-gradient-patient text-4xl md:text-5xl font-bold mb-4"
            >
              Patient Portal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="patient-body"
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
            <span className="patient-body-sm">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/patient/register"
              className="font-medium text-[#9810fa] hover:text-[#a855f7] transition-colors hover:underline"
            >
              Register here
            </Link>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-[#667085]">For patients only</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Alpha Care Home Page - Exact Figma Implementation
 * Node ID: 130-856
 * Design System Colors:
 * - Light Blue: #E6F6FE
 * - Dark Blue: #011632
 * - Mid Blue: #1376F8
 * - Sky Blue: #25B4F8
 * - Body Text: #3C4959
 * - White: #FFFFFF
 */
export default function AlphaCarePage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Digital Health Records Section */}
      <DigitalHealthSection />

      {/* Patient Portal Section */}
      <PatientPortalSection />

      {/* Care Coordination Section */}
      <CareCoordinationSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* ============================================
   NAVIGATION - Exact Figma Match
   ============================================ */
function Navigation() {
  const [servicesOpen, setServicesOpen] = React.useState(false);

  return (
    <nav className="absolute top-[40px] left-[80px] right-[80px] z-50">
      {/* Rounded rectangle background - matching Figma */}
      <div className="bg-[#E6F6FE] rounded-[10px] px-[40px] py-[20px] flex items-center justify-between">
        {/* Logo - Text based matching Figma */}
        <Link href="/" className="flex items-center gap-[10px]">
          <div className="w-[40px] h-[40px] rounded-lg bg-gradient-to-br from-[#1376F8] to-[#25B4F8] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span className="text-[28px] font-bold">
            <span className="text-[#1376F8]">Alpha</span>
            <span className="text-[#25B4F8]">Care</span>
          </span>
        </Link>

        {/* Nav Links - Centered */}
        <div className="flex items-center gap-[40px]">
          <Link 
            href="/" 
            className="text-[16px] font-medium text-[#011632] hover:text-[#1376F8] transition-colors"
          >
            Home
          </Link>
          
          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center gap-[8px] text-[16px] text-[#3C4959] hover:text-[#1376F8] transition-colors"
            >
              Services
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
                className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-[8px] w-[140px] bg-white rounded-[10px] shadow-xl border border-gray-100 py-[8px] overflow-hidden">
                <Link
                  href="/doctor"
                  className="block px-[16px] py-[10px] text-[14px] text-[#1376F8] hover:bg-[#E6F6FE] transition-colors font-medium"
                  onClick={() => setServicesOpen(false)}
                >
                  Doctor
                </Link>
                <Link
                  href="/patient"
                  className="block px-[16px] py-[10px] text-[14px] text-[#EC942C] hover:bg-[#E6F6FE] transition-colors font-medium"
                  onClick={() => setServicesOpen(false)}
                >
                  Patient
                </Link>
                <Link
                  href="/coordinator"
                  className="block px-[16px] py-[10px] text-[14px] text-[#34C759] hover:bg-[#E6F6FE] transition-colors font-medium"
                  onClick={() => setServicesOpen(false)}
                >
                  Coordinator
                </Link>
              </div>
            )}
          </div>

          <Link 
            href="/about" 
            className="text-[16px] text-[#3C4959] hover:text-[#1376F8] transition-colors"
          >
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-[24px]">
          <Link 
            href="/login" 
            className="text-[16px] text-[#3C4959] hover:text-[#1376F8] transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-[28px] py-[12px] bg-[#1376F8] text-white text-[16px] font-medium rounded-[8px] hover:bg-[#0d5bc7] transition-colors shadow-md"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ============================================
   HERO SECTION - Exact Figma Match
   ============================================ */
function HeroSection() {
  return (
    <section className="relative w-full min-h-[800px] bg-[#E6F6FE] pt-[120px] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#E0F4FD] to-transparent opacity-50" />
      
      <div className="max-w-[1440px] mx-auto px-[140px] flex items-start justify-between">
        {/* Left Content */}
        <div className="max-w-[550px] pt-[80px]">
          <h1 className="font-['Yeseva_One'] text-[56px] leading-[1.2] text-[#011632] mb-[24px]">
            Your Personal Health Records, Simplified & Secure
          </h1>
          <p className="text-[18px] leading-[1.6] text-[#3C4959] mb-[32px]">
            Get the right diagnosis & the best care from the world's top doctors. Maintain and access your health 
            information at any time.
          </p>
          <Link 
            href="/patient"
            className="inline-block px-[32px] py-[16px] bg-[#1376F8] text-white text-[18px] font-semibold rounded-[8px] hover:bg-[#0d5bc7] transition-colors shadow-lg shadow-[#1376F8]/30"
          >
            Get Started
          </Link>
        </div>

        {/* Right Image - Doctor with Dashboard Preview */}
        <div className="relative w-[600px] h-[600px]">
          {/* Main circular doctor image */}
          <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full overflow-hidden border-[8px] border-white shadow-2xl">
            <Image
              src="/images/home/rectangle-631.png"
              alt="Healthcare Professional"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Floating dashboard card */}
          <div className="absolute left-0 bottom-[100px] w-[280px] bg-white rounded-[16px] shadow-xl p-[20px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[40px] h-[40px] rounded-full bg-[#E6F6FE] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1376F8" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#011632]">Today's Appointments</p>
                <p className="text-[12px] text-[#3C4959]">12 Patients</p>
              </div>
            </div>
            <div className="w-full h-[4px] bg-[#E6F6FE] rounded-full">
              <div className="w-[75%] h-full bg-[#1376F8] rounded-full" />
            </div>
          </div>

          {/* Stats card */}
          <div className="absolute right-[50px] bottom-[50px] bg-white rounded-[12px] shadow-lg p-[16px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-full bg-[#34C759]/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#011632]">98%</p>
                <p className="text-[10px] text-[#3C4959]">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FEATURES SECTION - 3 Icons
   ============================================ */
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1376F8" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: "Secure",
      description: "Security and Encryption",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1376F8" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: "24/7 Access",
      description: "Access Anytime",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1376F8" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: "Family Care",
      description: "Add Family Members",
    },
  ];

  return (
    <section className="py-[80px] bg-white">
      <div className="max-w-[1440px] mx-auto px-[140px]">
        <div className="flex justify-center gap-[80px]">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] rounded-[20px] bg-[#E6F6FE] flex items-center justify-center mb-[20px]">
                {feature.icon}
              </div>
              <h3 className="text-[20px] font-bold text-[#011632] mb-[8px]">{feature.title}</h3>
              <p className="text-[16px] text-[#3C4959]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   DIGITAL HEALTH RECORDS SECTION
   ============================================ */
function DigitalHealthSection() {
  const features = [
    "One place for all your health data",
    "Easily access your current medications",
    "Get your lab results sent directly to your phone",
    "View your allergies, immunizations and more",
  ];

  return (
    <section className="py-[100px] bg-[#FAFAFA]">
      <div className="max-w-[1440px] mx-auto px-[140px]">
        <div className="flex items-center gap-[80px]">
          {/* Left Image */}
          <div className="relative w-[550px] h-[450px] rounded-[24px] overflow-hidden shadow-2xl">
            <Image
              src="/images/home/rectangle-632.png"
              alt="Doctor consulting patient"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1376F8] mb-[12px] uppercase tracking-wide">
              Better Care For You
            </p>
            <h2 className="font-['Yeseva_One'] text-[40px] leading-[1.2] text-[#011632] mb-[24px]">
              Everything You Need For Better Health Management
            </h2>

            {/* Digital Health Records Card */}
            <div className="bg-white rounded-[20px] p-[32px] shadow-lg">
              <div className="flex items-center gap-[16px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-[12px] bg-[#1376F8] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 className="text-[24px] font-bold text-[#011632]">Digital Health Records</h3>
              </div>

              <p className="text-[16px] text-[#3C4959] mb-[24px]">
                Our platform takes away the hassle to store, maintain or carry paper medical records.
              </p>

              <ul className="space-y-[16px]">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-[12px]">
                    <div className="w-[24px] h-[24px] rounded-full bg-[#34C759]/20 flex items-center justify-center flex-shrink-0 mt-[2px]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#3C4959]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/patient"
                className="inline-flex items-center gap-[8px] mt-[24px] px-[24px] py-[12px] bg-[#1376F8] text-white text-[16px] font-medium rounded-[8px] hover:bg-[#0d5bc7] transition-colors"
              >
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   PATIENT PORTAL SECTION
   ============================================ */
function PatientPortalSection() {
  const features = [
    { icon: "calendar", text: "Schedule appointments with doctors" },
    { icon: "file", text: "View your medical history and records" },
    { icon: "phone", text: "Receive updates and reminders" },
    { icon: "heart", text: "Track your health metrics" },
  ];

  return (
    <section className="py-[100px] bg-white">
      <div className="max-w-[1440px] mx-auto px-[140px]">
        <div className="flex items-center gap-[80px]">
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="font-['Yeseva_One'] text-[40px] leading-[1.2] text-[#1376F8] mb-[20px]">
              Patient Portal
            </h2>
            <p className="text-[18px] text-[#3C4959] mb-[32px]">
              Everything in one place for patients to view their health information, book appointments, 
              and communicate with their healthcare providers.
            </p>

            <div className="grid grid-cols-2 gap-[20px]">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-[12px] p-[16px] bg-[#F5F5F5] rounded-[12px]">
                  <div className="w-[40px] h-[40px] rounded-[10px] bg-[#E6F6FE] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1376F8" strokeWidth="2">
                      {feature.icon === "calendar" && <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
                      {feature.icon === "file" && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
                      {feature.icon === "phone" && <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>}
                      {feature.icon === "heart" && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>}
                    </svg>
                  </div>
                  <span className="text-[14px] font-medium text-[#011632]">{feature.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/patient"
              className="inline-flex items-center gap-[8px] mt-[32px] px-[28px] py-[14px] bg-gradient-to-r from-[#1376F8] to-[#25B4F8] text-white text-[16px] font-semibold rounded-[8px] hover:opacity-90 transition-opacity"
            >
              Explore Patient Portal
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative w-[500px] h-[400px] rounded-[24px] overflow-hidden shadow-2xl">
            <Image
              src="/images/home/image-4.png"
              alt="Patient using health app"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   CARE COORDINATION SECTION
   ============================================ */
function CareCoordinationSection() {
  const features = [
    "Seamless communication between care providers",
    "Real-time updates on patient status",
    "Integrated monitoring tools",
    "Collaborative care planning",
  ];

  return (
    <section className="py-[100px] bg-[#FAFAFA]">
      <div className="max-w-[1440px] mx-auto px-[140px]">
        <div className="flex items-center gap-[80px]">
          {/* Left Image */}
          <div className="relative w-[500px] h-[400px] rounded-[24px] overflow-hidden shadow-2xl">
            <Image
              src="/images/home/image-14.png"
              alt="Healthcare team coordination"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#34C759] mb-[12px] uppercase tracking-wide">
              For Healthcare Providers
            </p>
            <h2 className="font-['Yeseva_One'] text-[40px] leading-[1.2] text-[#011632] mb-[20px]">
              Care Coordination & Monitoring
            </h2>
            <p className="text-[18px] text-[#3C4959] mb-[32px]">
              Enable better collaboration between healthcare providers with our integrated 
              coordination and monitoring platform.
            </p>

            <ul className="space-y-[20px]">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-[12px]">
                  <div className="w-[24px] h-[24px] rounded-full bg-[#34C759]/20 flex items-center justify-center flex-shrink-0 mt-[2px]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-[16px] text-[#3C4959]">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/coordinator"
              className="inline-flex items-center gap-[8px] mt-[32px] px-[28px] py-[14px] bg-gradient-to-r from-[#34C759] to-[#25B4F8] text-white text-[16px] font-semibold rounded-[8px] hover:opacity-90 transition-opacity"
            >
              Coordinator Portal
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   HOW IT WORKS SECTION
   ============================================ */
function HowItWorksSection() {
  const steps = [
    { icon: "user-plus", title: "Create Account", description: "Sign up in minutes" },
    { icon: "edit", title: "Complete Profile", description: "Add your health info" },
    { icon: "search", title: "Search Specialist", description: "Find doctors nearby" },
    { icon: "check-circle", title: "Get Solution", description: "Receive care plans" },
  ];

  return (
    <section className="py-[100px] bg-white">
      <div className="max-w-[1440px] mx-auto px-[140px]">
        <div className="text-center mb-[60px]">
          <h2 className="font-['Yeseva_One'] text-[40px] text-[#011632] mb-[16px]">
            How Alpha Care Works
          </h2>
          <p className="text-[18px] text-[#3C4959]">
            Simple, secure, and effective healthcare management in 4 easy steps
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#1376F8] via-[#25B4F8] to-[#1376F8] opacity-30" />

          <div className="grid grid-cols-4 gap-[40px]">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Step number badge */}
                <div className="absolute -top-[10px] -right-[10px] w-[28px] h-[28px] bg-[#1376F8] text-white text-[14px] font-bold rounded-full flex items-center justify-center z-10">
                  {index + 1}
                </div>

                {/* Icon container */}
                <div className="w-[80px] h-[80px] rounded-[20px] bg-gradient-to-br from-[#1376F8] to-[#25B4F8] flex items-center justify-center mb-[20px] shadow-lg shadow-[#1376F8]/25">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    {step.icon === "user-plus" && <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>}
                    {step.icon === "edit" && <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>}
                    {step.icon === "search" && <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}
                    {step.icon === "check-circle" && <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
                  </svg>
                </div>

                <h3 className="text-[18px] font-bold text-[#011632] mb-[8px]">{step.title}</h3>
                <p className="text-[14px] text-[#3C4959]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-[48px]">
          <Link href="/patient" className="text-[16px] font-semibold text-[#1376F8] hover:underline">
            Ready to get started? Create your account →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   TESTIMONIALS SECTION
   ============================================ */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Samitha Rathnayake",
      role: "Cardiologist",
      text: "Alpha Care has transformed how I manage patient records. The seamless access to medical histories helps me provide better care.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Patient",
      text: "Finally, I can access all my health records in one place. Booking appointments has never been easier!",
      rating: 5,
    },
    {
      name: "Dr. Arun Mehta",
      role: "General Physician",
      text: "The coordination features have made it incredibly easy to collaborate with other specialists for my patients.",
      rating: 5,
    },
  ];

  return (
    <section className="py-[100px] bg-[#FAFAFA]">
      <div className="max-w-[1440px] mx-auto px-[140px]">
        <div className="text-center mb-[60px]">
          <h2 className="font-['Yeseva_One'] text-[40px] text-[#011632] mb-[16px]">
            Our Happy Clients
          </h2>
          <p className="text-[18px] text-[#3C4959]">
            See what doctors and patients are saying about Alpha Care
          </p>
        </div>

        <div className="grid grid-cols-3 gap-[32px]">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-[20px] p-[32px] shadow-lg">
              {/* Rating */}
              <div className="flex gap-[4px] mb-[20px]">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-[16px] text-[#3C4959] mb-[24px] leading-[1.6]">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#E6F6FE] to-[#BFDBFE] flex items-center justify-center">
                  <span className="text-[18px] font-bold text-[#1376F8]">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-[#011632]">{testimonial.name}</p>
                  <p className="text-[14px] text-[#3C4959]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   CTA SECTION
   ============================================ */
function CTASection() {
  return (
    <section className="relative py-[100px] bg-gradient-to-r from-[#1376F8] via-[#0d5bc7] to-[#25B4F8] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-[140px] text-center">
        <h2 className="font-['Yeseva_One'] text-[40px] text-white mb-[16px]">
          Are You a Doctor or Health Facility?
        </h2>
        <p className="text-[18px] text-white/80 mb-[40px] max-w-[600px] mx-auto">
          Join thousands of healthcare providers who trust Alpha Care to manage their practice efficiently.
        </p>

        <div className="flex justify-center gap-[20px]">
          <Link
            href="/doctor"
            className="px-[32px] py-[16px] bg-white text-[#1376F8] text-[16px] font-semibold rounded-[8px] hover:bg-gray-100 transition-colors"
          >
            Join as Doctor
          </Link>
          <Link
            href="/patient/book"
            className="px-[32px] py-[16px] bg-transparent text-white text-[16px] font-semibold rounded-[8px] border-2 border-white hover:bg-white/10 transition-colors"
          >
            Find a Doctor
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER
   ============================================ */
function Footer() {
  return (
    <footer className="bg-[#011632] text-white pt-[80px] pb-[40px]">
      <div className="max-w-[1440px] mx-auto px-[140px]">
        <div className="grid grid-cols-4 gap-[60px] mb-[60px]">
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center gap-[8px] mb-[20px]">
              <img src="/images/home/logo-icon.svg" alt="" className="w-[25px] h-[25px]" />
              <span className="font-['Yeseva_One'] text-[24px]">
                Alpha <span className="text-[#25B4F8]">Care</span>
              </span>
            </div>
            <p className="text-[14px] text-white/70 leading-[1.6]">
              Your trusted partner in digital healthcare. Simplifying health records and connecting 
              patients with providers.
            </p>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-[16px] font-semibold mb-[20px]">About</h4>
            <ul className="space-y-[12px]">
              <li><Link href="/about" className="text-[14px] text-white/70 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/about#team" className="text-[14px] text-white/70 hover:text-white transition-colors">Team</Link></li>
              <li><Link href="/careers" className="text-[14px] text-white/70 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-[16px] font-semibold mb-[20px]">Services</h4>
            <ul className="space-y-[12px]">
              <li><Link href="/patient" className="text-[14px] text-white/70 hover:text-white transition-colors">For Patients</Link></li>
              <li><Link href="/doctor" className="text-[14px] text-white/70 hover:text-white transition-colors">For Doctors</Link></li>
              <li><Link href="/coordinator" className="text-[14px] text-white/70 hover:text-white transition-colors">For Coordinators</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[16px] font-semibold mb-[20px]">Contact</h4>
            <ul className="space-y-[12px]">
              <li><Link href="/help" className="text-[14px] text-white/70 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-[14px] text-white/70 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-[14px] text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-[24px] text-center">
          <p className="text-[14px] text-white/50">
            © 2024 Alpha Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

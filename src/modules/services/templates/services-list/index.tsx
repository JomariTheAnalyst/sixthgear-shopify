"use client"

/**
 * Services List Template
 * Main services page showing all service categories with tilted landscape cards
 */

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ServiceCategory } from "@lib/services-data"
import CTABanner from "@modules/home/components/cta-banner"
import ServiceHero from "../service-hero"
import { TextRoll } from "components/ui/text-roll"
import BrandsWeService from "../../components/brands-we-service"

// Hardware-coded services for modern grid display
const HARDCODED_SERVICES = [
  {
    title: "Service & Preventive Maintenance",
    description: "Keep your motorcycle running at peak performance with comprehensive periodic maintenance and seasonal care.",
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.1 7.1a1 1 0 0 1-1.41 0l-1.42-1.41a1 1 0 0 1 0-1.42l7.1-7.1a6 6 0 0 1 9.36-7.94l-3.76 3.76z"></path></svg>
    ),
    slug: "preventive-maintenance"
  },
  {
    title: "Repairs & Diagnostics",
    description: "Advanced diagnostic equipment and expert technicians to identify and fix any issue with precision.",
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
    ),
    slug: "repairs-diagnostics"
  },
  {
    title: "Accessories & Custom Setup",
    description: "Transform your ride with professional accessory installation, lighting upgrades, and luggage systems.",
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M8 12h8"></path></svg>
    ),
    slug: "accessories-installation"
  },
  {
    title: "Wheels & Drivetrain",
    description: "Expert care for your wheels and drivetrain. Proper alignment and balanced wheels for the ultimate ride.",
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
    ),
    slug: "wheels-drivetrain"
  },
  {
    title: "Detailing & Protection",
    description: "Keep your motorcycle looking showroom-fresh with our professional detailing and ceramic coating.",
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    ),
    slug: "detailing-protection"
  },
  {
    title: "Performance Upgrades",
    description: "Unlock your motorcycle's full potential with performance upgrades, exhaust systems, and tuning.",
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    ),
    slug: "performance-upgrades"
  },
  {
    title: "Roadside Assistance & Recovery",
    description: "Stranded on the road? Our emergency recovery team is ready to help. Fast response times and professional handling of your motorcycle.",
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
    ),
    slug: "roadside-assistance"
  },
  {
    title: "Rider Support & Convenience",
    description: "Beyond repairs, we offer comprehensive rider support services. From pre-purchase inspections to warranty assistance, we've got you covered.",
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    ),
    slug: "rider-support"
  }
]


interface ServicesListTemplateProps {
  services: ServiceCategory[]
}

export default function ServicesListTemplate({
  services,
}: ServicesListTemplateProps) {
  const params = useParams()
  const countryCode = params?.countryCode as string

  return (
    <>
      {/* Hero Section */}
      <ServiceHero 
        service={{
          id: "services-main",
          slug: "services",
          title: "Our Services",
          shortTitle: "Services",
          description: "Complete motorcycle care from routine maintenance to performance upgrades. Expert technicians, quality parts, and attention to detail.",
          image: "/images/homepage/services/hero.png",
          heroImage: "/images/homepage/services/hero3.png",
          items: []
        }} 
      />

      {/* Expertise Stats Section */}
      <section className="bg-white py-20 md:py-32 w-full border-b border-[#EAEAEA]">
        <div className="w-full lg:max-w-[95%] xl:max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Content */}
            <div className="flex-1 w-full text-left">
              <h2 
                className="text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] text-[#111] leading-tight mb-8 font-semibold"
                style={{ 
                  fontFamily: "'Inter Display', sans-serif", 
                  letterSpacing: "normal"
                }}
              >
                Comprehensive Care for<br className="hidden sm:block" /> Premium Motorcycles
              </h2>
              
              <p 
                className="text-[#111]/80 text-base md:text-lg lg:text-xl leading-relaxed mb-10 font-normal lg:max-w-[90%]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                From routine maintenance to performance upgrades and emergency recovery, we provide end-to-end solutions. Our expert technicians combine advanced diagnostics with quality parts to keep your ride at its peak.
              </p>
              
              <Link 
                href={`/${countryCode}/contact`}
                className="inline-flex items-center justify-center px-8 py-3.5 lg:px-10 lg:py-4 border border-[#111] rounded-md bg-transparent text-[#111] font-medium text-sm md:text-base transition-colors hover:bg-[#111] hover:text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Book a Service
              </Link>
            </div>

            {/* Right Grid (2x2 ratio, pure black text, larger cards) */}
            <div className="w-full lg:w-[50%] grid grid-cols-2 gap-5 md:gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-[1.25rem] p-8 md:p-12 border border-[#EAEAEA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                <span 
                  className="text-[#111] text-[4rem] md:text-[5rem] leading-none font-bold mb-3 tracking-tighter"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  8
                </span>
                <span 
                  className="text-[#111] text-sm md:text-base font-medium leading-snug"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Core Service<br />Categories
                </span>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white rounded-[1.25rem] p-8 md:p-12 border border-[#EAEAEA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                <span 
                  className="text-[#111] text-[4rem] md:text-[5rem] leading-none font-bold mb-3 tracking-tighter"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  45+
                </span>
                <span 
                  className="text-[#111] text-sm md:text-base font-medium leading-snug"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Specialized<br />Procedures
                </span>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-[1.25rem] p-8 md:p-12 border border-[#EAEAEA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                <span 
                  className="text-[#111] text-[4rem] md:text-[5rem] leading-none font-bold mb-3 tracking-tighter"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  100%
                </span>
                <span 
                  className="text-[#111] text-sm md:text-base font-medium leading-snug"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Precision<br />& Quality
                </span>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-[1.25rem] p-8 md:p-12 border border-[#EAEAEA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                <span 
                  className="text-[#111] text-[4rem] md:text-[5rem] leading-none font-bold mb-3 tracking-tighter"
                  style={{ fontFamily: "'Inter Display', sans-serif" }}
                >
                  24/7
                </span>
                <span 
                  className="text-[#111] text-sm md:text-base font-medium leading-snug"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Roadside<br />Recovery
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <BrandsWeService />

      {/* Modern Services Grid Section */}
      <section className="bg-white py-24 md:py-32 w-full">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center md:text-left mb-16 md:mb-20">
            <h2 
              className="text-[2.5rem] md:text-5xl lg:text-6xl text-[#111] leading-[1.1] tracking-[-0.03em] font-semibold"
              style={{ fontFamily: "'Inter Display', sans-serif" }}
            >
              Complete care for your ride
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HARDCODED_SERVICES.map((service, index) => (
              <Link
                key={index}
                href={`/${countryCode}/services/${service.slug}`}
                className="group flex flex-col bg-[#F9F9F9] rounded-[1.5rem] p-8 lg:p-10 transition-colors duration-300 hover:bg-[#F2F2F2] h-full"
              >
                {/* Icon */}
                <div className="text-[#111] mb-8">
                  {service.icon}
                </div>
                
                {/* Title */}
                <h3 
                  className="text-xl md:text-[22px] text-[#111] leading-[1.2] font-semibold mb-4"
                  style={{ fontFamily: "'Inter Display', sans-serif", letterSpacing: "-0.01em" }}
                >
                  {service.title}
                </h3>
                
                {/* Description */}
                <p 
                  className="text-[#111]/70 text-[15px] md:text-base leading-relaxed mb-10 flex-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {service.description}
                </p>
                
                {/* Learn More TextRoll Button */}
                <div className="mt-auto flex items-center gap-2 text-[#111] font-medium text-sm md:text-base">
                  <TextRoll className="font-semibold" transition={{ duration: 0.3 }}>
                    Learn More
                  </TextRoll>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  )
}

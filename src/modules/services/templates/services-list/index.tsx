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
            <div className="flex-1 w-full text-left lg:pr-12">
              <h2 
                className="text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] text-[#111] leading-[1.1] mb-6 font-semibold"
                style={{ 
                  fontFamily: "'Inter Display', sans-serif", 
                  letterSpacing: "-0.03em"
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

      {/* Services List - Landscape Cards */}
      <section className="bg-[#FAFAFA] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-10 md:gap-14">
            {services.map((service, index) => {
              const rotation = index % 2 === 0 ? "-1.5deg" : "1.5deg"
              // Use heroImage if available, fallback to image
              const serviceImage = service.heroImage || service.image

              return (
                <Link
                  key={service.id}
                  href={`/${countryCode}/services/${service.slug}`}
                  className="group block"
                >
                  <div
                    className="relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out group-hover:shadow-2xl"
                    style={{
                      transform: `rotate(${rotation})`,
                      transition:
                        "transform 0.5s ease-out, box-shadow 0.5s ease-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "rotate(0deg) translateY(-4px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `rotate(${rotation})`
                    }}
                  >
                    {/* Card Layout - Responsive */}
                    <div className="flex flex-col md:flex-row">
                      {/* Content - Left Side */}
                      <div className="flex-1 p-6 md:p-8 lg:p-10 order-2 md:order-1">
                        {/* Title with accent word */}
                        <h3
                          className="text-xl md:text-2xl lg:text-3xl text-[#1a1a1a] uppercase leading-tight mb-4"
                          style={{ fontFamily: "Tanker, sans-serif" }}
                        >
                          {service.title.split(" ").map((word, i) => (
                            <span
                              key={i}
                              className={i === 0 ? "text-[#F16D34]" : ""}
                            >
                              {word}{" "}
                            </span>
                          ))}
                        </h3>

                        {/* Full Description */}
                        <p
                          className="text-gray-600 text-sm md:text-base leading-relaxed mb-6"
                          style={{ fontFamily: "Inter Display, sans-serif" }}
                        >
                          {service.description}
                        </p>

                        {/* Service Tags */}
                        <div className="mb-6">
                          <span
                            className="text-xs text-gray-400 uppercase tracking-wider mb-3 block"
                            style={{ fontFamily: "Inter Display, sans-serif" }}
                          >
                            Ideal For:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {service.items.slice(0, 6).map((item, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200"
                                style={{
                                  fontFamily: "Inter Display, sans-serif",
                                }}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Arrow Button */}
                        <div className="flex items-center justify-end">
                          <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center transition-all duration-300 group-hover:bg-[#F16D34]">
                            <svg
                              className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Image - Right Side (16:9 aspect ratio) */}
                      {serviceImage && (
                        <div className="relative w-full md:w-2/5 lg:w-[45%] aspect-video md:aspect-auto order-1 md:order-2">
                          <Image
                            src={serviceImage}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className="h-1.5 bg-[#F16D34]" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  )
}

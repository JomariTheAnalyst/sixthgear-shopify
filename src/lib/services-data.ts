/**
 * Services Data
 * Comprehensive motorcycle services offered by Sixthgear
 */

export interface ServiceItem {
  name: string
}

export interface ServiceFaqItem {
  question: string
  answer: string
}

export interface ServiceInternalLink {
  label: string
  href: string
}

export interface ServiceLocalContent {
  heading: string
  body: string
}

export interface ServiceCategory {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  image: string
  heroImage?: string // Landscape hero background
  detailImage?: string // Portrait detail image
  items: string[]
  seoTitle?: string
  seoDescription?: string
  socialImageUrl?: string
  localContent?: ServiceLocalContent[]
  internalLinks?: ServiceInternalLink[]
  faqItems?: ServiceFaqItem[]
}

export const SERVICE_IMAGE_BY_SLUG: Record<string, string> = {
  "preventive-maintenance": "/images/services/service1.png",
  "repairs-diagnostics": "/images/services/service2.png",
  "accessories-installation": "/images/services/service5.png",
  "wheels-drivetrain": "/images/services/service4.png",
  "detailing-protection": "/images/services/service3.png",
  "performance-upgrades": "/images/services/service6.png",
  "roadside-assistance": "/images/services/service7.png",
  "rider-support": "/images/services/services8.jpg",
}

export const SERVICE_SEO_BY_SLUG: Record<
  string,
  { title: string; description: string }
> = {
  "preventive-maintenance": {
    title: "Motorcycle PMS & Preventive Maintenance Makati | SixthGearMoto",
    description:
      "Motorcycle PMS, oil change, and preventive maintenance in Makati. Keep your big bike in top condition at SixthGearMoto service center, Metro Manila.",
  },
  "repairs-diagnostics": {
    title: "Motorcycle Repair & Diagnostics Makati | SixthGearMoto",
    description:
      "Motorcycle repair and diagnostics in Makati for engine, electrical, and general bike issues. Visit SixthGearMoto service center in Metro Manila.",
  },
  "accessories-installation": {
    title: "Accessories & Exhaust Installation Makati | SixthGearMoto",
    description:
      "Motorcycle accessories and exhaust installation in Makati, including Akrapovic, SC Project, Yoshimura, slip-on, and full system support at SixthGearMoto.",
  },
  "wheels-drivetrain": {
    title: "Motorcycle Wheels, Tires & Drivetrain Service Makati | SixthGearMoto",
    description:
      "Motorcycle tire, wheel, chain, drivetrain, and handling service in Makati. Visit SixthGearMoto service center in Metro Manila.",
  },
  "detailing-protection": {
    title: "Motorcycle Detailing & Ceramic Coating Makati | SixthGearMoto",
    description:
      "Motorcycle detailing, care, and ceramic coating in Makati. Protect and maintain your bike at SixthGearMoto in Metro Manila.",
  },
  "performance-upgrades": {
    title: "Motorcycle Performance Upgrades Makati | SixthGearMoto",
    description:
      "Motorcycle performance upgrades, exhaust support, and big bike improvement services in Makati at SixthGearMoto, Metro Manila.",
  },
  "roadside-assistance": {
    title: "Motorcycle Towing & Roadside Assistance Metro Manila | SixthGearMoto",
    description:
      "Motorcycle towing, roadside assistance, and recovery support in Metro Manila. Contact SixthGearMoto for rider support from Makati.",
  },
  "rider-support": {
    title: "Rider Support Services Makati | SixthGearMoto",
    description:
      "Rider support and convenience services at SixthGearMoto Makati, including gear guidance, service coordination, carwash, and coffee for riders.",
  },
}

export function getServiceImageBySlug(slug: string, fallback?: string) {
  return SERVICE_IMAGE_BY_SLUG[slug] || fallback || "/images/services/service1.png"
}

export const servicesData: ServiceCategory[] = [
  {
    id: "preventive-maintenance",
    slug: "preventive-maintenance",
    title: "Service & Preventive Maintenance",
    shortTitle: "Preventive Maintenance",
    description:
      "Keep your motorcycle running at peak performance with PMS, oil change, inspection, and preventive maintenance at our Makati service center for big bikes and daily riders.",
    image: getServiceImageBySlug("preventive-maintenance"),
    items: [
      "Periodic Maintenance Service (PMS)",
      "Oil Change & Fluid Replacement",
      "Scheduled Service (Minor / Major)",
      "Pre-Ride Safety Inspection",
      "Long-Ride / Touring Preparation",
      "Storage & Seasonal Maintenance",
      "Break-In Service (New Motorcycles)",
    ],
    localContent: [
      {
        heading: "Motorcycle PMS Makati",
        body:
          "SixthGearMoto supports riders looking for motorcycle PMS in Makati, from routine oil change and fluid checks to service inspections before daily use or long rides. The service is planned around the bike's condition, mileage, and visible maintenance needs.",
      },
      {
        heading: "Big Bike Service Center in Makati",
        body:
          "For big bike maintenance, the team checks practical service points such as fluids, brakes, drivetrain condition, fasteners, and ride-readiness. Riders can contact the Makati service center to confirm scope, parts, and booking details before visiting.",
      },
    ],
    internalLinks: [
      {
        label: "Repairs & Diagnostics",
        href: "/services/repairs-diagnostics",
      },
      {
        label: "Motorcycle parts and maintenance items",
        href: "/store",
      },
      {
        label: "Book motorcycle PMS Makati",
        href: "/contact",
      },
    ],
    faqItems: [
      {
        question: "What is included in motorcycle PMS?",
        answer:
          "Motorcycle PMS can include oil change, fluid checks, inspection, safety checks, and maintenance items based on the bike's condition and service needs.",
      },
      {
        question: "Do you offer big bike PMS in Makati?",
        answer:
          "Yes. SixthGearMoto supports big bike PMS and preventive maintenance from its Makati motorcycle service center.",
      },
      {
        question: "Can I book an oil change at SixthGearMoto?",
        answer:
          "Yes. Riders can contact SixthGearMoto to book an oil change and confirm any parts or service requirements before visiting.",
      },
      {
        question: "How do I know when my motorcycle needs preventive maintenance?",
        answer:
          "Check your service interval, recent mileage, fluid condition, ride feel, and any warning signs. SixthGearMoto can inspect the motorcycle and help plan the right maintenance scope.",
      },
    ],
  },
  {
    id: "repairs-diagnostics",
    slug: "repairs-diagnostics",
    title: "Repairs & Diagnostics",
    shortTitle: "Repairs & Diagnostics",
    description:
      "Advanced diagnostic equipment and expert technicians to identify and fix any issue. From brake systems to ECU diagnostics, we handle it all with precision.",
    image: getServiceImageBySlug("repairs-diagnostics"),
    items: [
      "Brake System Repair & Bleeding",
      "Clutch Adjustment & Replacement",
      "Engine Tune-Up & Performance Checks",
      "Electrical Diagnosis & Troubleshooting",
      "Charging System & Battery Testing",
      "Fuel System Cleaning & Calibration",
      "Cooling System Inspection & Repair",
      "Suspension Inspection & Adjustment",
      "ECU Scan & Error Code Diagnosis",
    ],
  },
  {
    id: "accessories-installation",
    slug: "accessories-installation",
    title: "Accessories & Custom Installation",
    shortTitle: "Custom Installation",
    description:
      "Transform your ride with professional motorcycle accessories and exhaust installation in Makati, including Akrapovic exhaust fitment, slip-on exhausts, full-system exhausts, and custom accessory work.",
    image: getServiceImageBySlug("accessories-installation"),
    items: [
      "Exhaust System Installation",
      "Akrapovic Exhaust Installation",
      "Slip-On Muffler Installation",
      "Full System Exhaust Installation",
      "Accessories Fitting & Custom Work",
      "Fitment Checking Before Installation",
      "Accessory Installation & Calibration",
      "Lighting Upgrades (Aux Lights, LEDs)",
      "Horn, Electrical & Safety Upgrades",
      "GPS, Phone Mount & Navigation Setup",
      "Communication Systems Installation",
      "Crash Guards, Skid Plates & Sliders",
      "Luggage Systems & Mounting",
      "Windscreen, Seats & Ergonomic Mods",
    ],
    localContent: [
      {
        heading: "Motorcycle Exhaust Installation in Makati",
        body:
          "SixthGearMoto handles motorcycle exhaust installation in Makati for riders who need proper fitment checks, mounting, alignment, and installation review before the bike leaves the shop. The service covers slip-on exhaust installation and full-system exhaust installation when the part and motorcycle application are suitable.",
      },
      {
        heading: "Akrapovic Exhaust Installation Makati",
        body:
          "For Akrapovic exhaust installation, riders can confirm fitment before installation and coordinate the work with the Makati service center. The team can also help with accessories fitting and custom work where the part, bike, and mounting points are compatible.",
      },
    ],
    internalLinks: [
      {
        label: "Akrapovic exhaust installation Makati",
        href: "/collections/akrapovic-exhaust",
      },
      {
        label: "Motorcycle exhaust installation in Makati",
        href: "/services/accessories-installation",
      },
      {
        label: "Contact the Makati service center",
        href: "/contact",
      },
    ],
    faqItems: [
      {
        question: "Do you install Akrapovic exhausts in Makati?",
        answer:
          "Yes. SixthGearMoto can support Akrapovic exhaust installation in Makati when the exhaust and motorcycle fitment are confirmed.",
      },
      {
        question: "Do you install slip-on and full-system exhausts?",
        answer:
          "Yes. The service covers slip-on exhaust installation and full-system exhaust installation when the parts are suitable for the motorcycle.",
      },
      {
        question: "Do I need to confirm fitment before installation?",
        answer:
          "Yes. Fitment should be confirmed before installation so the team can check compatibility, mounting requirements, and any needed supporting parts.",
      },
      {
        question: "Can I buy an Akrapovic exhaust and have it installed at SixthGearMoto?",
        answer:
          "Riders can browse the Akrapovic exhaust collection and contact SixthGearMoto to confirm fitment and installation support before booking.",
      },
    ],
  },
  {
    id: "wheels-drivetrain",
    slug: "wheels-drivetrain",
    title: "Wheels, Drivetrain & Handling",
    shortTitle: "Wheels & Drivetrain",
    description:
      "Expert care for your motorcycle's wheels and drivetrain. Proper alignment, balanced wheels, and smooth power delivery for the ultimate riding experience.",
    image: getServiceImageBySlug("wheels-drivetrain"),
    items: [
      "Tyre Replacement & Wheel Balancing",
      "Chain and Sprocket Replacement",
      "Wheel Alignment & Inspection",
      "Steering Head Bearing Inspection",
      "Swingarm & Linkage Service",
    ],
  },
  {
    id: "detailing-protection",
    slug: "detailing-protection",
    title: "Detailing, Care & Protection",
    shortTitle: "Detailing & Care",
    description:
      "Keep your motorcycle looking showroom-fresh with our professional detailing services. From basic wash to ceramic coating, we protect your investment.",
    image: getServiceImageBySlug("detailing-protection"),
    items: [
      "Bike Washing & Professional Detailing",
      "Paint, Plastic & Metal Restoration",
      "Ceramic Coating & Paint Protection",
      "Rust Prevention & Treatment",
      "Engine & Undercarriage Cleaning",
    ],
  },
  {
    id: "performance-upgrades",
    slug: "performance-upgrades",
    title: "Performance & Upgrade Services",
    shortTitle: "Performance Upgrades",
    description:
      "Unlock your motorcycle's full potential with performance upgrades. Expert installation of exhaust systems, intake upgrades, and tuning support.",
    image: getServiceImageBySlug("performance-upgrades"),
    items: [
      "Exhaust Installation (Slip-On / Full System)",
      "Intake & Air Filter Upgrades",
      "Performance Tuning Support",
      "Weight Reduction & Setup Advice",
    ],
  },
  {
    id: "roadside-assistance",
    slug: "roadside-assistance",
    title: "Roadside Assistance & Recovery",
    shortTitle: "Roadside Assistance",
    description:
      "Stranded on the road? Our emergency recovery team is ready to help. Fast response times and professional handling of your motorcycle.",
    image: getServiceImageBySlug("roadside-assistance"),
    items: [
      "Motorcycle Towing Service",
      "Emergency Bike Rescue & Recovery",
      "Breakdown Assistance Coordination",
      "Accident Recovery Support",
    ],
  },
  {
    id: "rider-support",
    slug: "rider-support",
    title: "Rider Support & Convenience",
    shortTitle: "Rider Support",
    description:
      "Beyond repairs, we offer comprehensive rider support services. From pre-purchase inspections to warranty assistance, we've got you covered.",
    image: getServiceImageBySlug("rider-support"),
    items: [
      "Pre-Purchase Motorcycle Inspection",
      "Troubleshooting & Consultation",
      "Warranty Support Assistance",
      "After-Service Check & Follow-Up",
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return servicesData.find((service) => service.slug === slug)
}

export function getAllServiceSlugs(): string[] {
  return servicesData.map((service) => service.slug)
}

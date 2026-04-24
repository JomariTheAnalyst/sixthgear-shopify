/**
 * Services Data
 * Comprehensive motorcycle services offered by Sixthgear
 */

export interface ServiceItem {
  name: string
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
      "Keep your motorcycle running at peak performance with our comprehensive preventive maintenance services. From routine PMS to seasonal care, we ensure your bike is always road-ready.",
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
      "Transform your ride with professional accessory installation. From lighting upgrades to luggage systems, we ensure perfect fitment and functionality.",
    image: getServiceImageBySlug("accessories-installation"),
    items: [
      "Accessory Installation & Calibration",
      "Lighting Upgrades (Aux Lights, LEDs)",
      "Horn, Electrical & Safety Upgrades",
      "GPS, Phone Mount & Navigation Setup",
      "Communication Systems Installation",
      "Crash Guards, Skid Plates & Sliders",
      "Luggage Systems & Mounting",
      "Windscreen, Seats & Ergonomic Mods",
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

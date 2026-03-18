/**
 * Home Page Content with Fallbacks (Strapi removed)
 *
 * Returns hardcoded fallback content directly. CMS fetch has been removed.
 * Will be replaced by Payload CMS in Phase 3.17-3.18.
 */

import { HeroContent, HomeContent } from "./home"
import { AboutContent } from "./about"
import { CoffeeShowcaseContent } from "./coffee"
import { MotoServicesContent } from "./services"

// ============================================================================
// HARDCODED FALLBACKS (Default Values)
// ============================================================================

const HERO_FALLBACKS: HeroContent = {
  trustBadge: "Trusted by 500+ Riders",
  title: "Best Bike\nRepair & Service",
  description:
    "Professional servicing, repairs, detailing & performance upgrades. Trusted by riders for precision and care.",
  primaryCta: {
    text: "More About Us",
    link: "/about",
  },
  secondaryCta: {
    text: "View Services",
    link: "/services",
  },
  backgroundImage: "/images/homepage/banner-img.png",
}

const ABOUT_FALLBACKS: AboutContent = {
  kicker: "About Us",
  title: "We Offer Complete Diagnostics for Your Motorcycle",
  description:
    "Sixth Gear Moto Supply Café + Lounge is a rider-built motorcycle hub combining professional workshop service, premium accessories, riding gear, detailing, performance upgrades, and a relaxed café experience powered by First Gear Coffee.",
  highlights: [
    "Motorcycle Service and Advanced Diagnostics",
    "Parts Accessories Luggage and Communications",
    "Helmets Riding Gear and Apparel",
    "Café Lounge and Rider Community",
  ],
  primaryCta: {
    text: "More About Us",
    link: "/about",
  },
  imageTop: "/images/homepage/about/about_bg.png",
  imageBottom: "/images/homepage/about/about-small.png",
  videoUrl: null,
}

const COFFEE_FALLBACKS: CoffeeShowcaseContent = {
  sectionHeading: "More Than Riding Gear\nWe Serve Great Coffee Too",
  coffeeIconUrl: null,
  descriptionText:
    "More than a pit stop it's where riders refuel, relax, and reconnect. Handcrafted brews served with passion, right here at Sixthgear.",
  buttonText: "View Full Menu",
  buttonLink: "/menu",
  coffeeItems: [
    {
      id: 1,
      name: "Iced Hazelnut Latte",
      description:
        "Smooth espresso blended with creamy hazelnut and chilled milk.",
      image: "/images/firstgear-coffee/hazelnut.png",
    },
    {
      id: 2,
      name: "Cold Brew Delight",
      description: "Slow-steeped coffee with a bold aroma and silky finish.",
      image: "/images/firstgear-coffee/coldbrew.png",
    },
    {
      id: 3,
      name: "Mocha Fusion",
      description:
        "Rich chocolate, fresh espresso, and whipped cream perfection.",
      image: "/images/firstgear-coffee/mochafusion.png",
    },
  ],
}

const SERVICES_FALLBACKS: MotoServicesContent = {
  sectionTitle: "Motorcycle Services",
  sectionDescription: "Bike Repair & Maintenance Services",
  services: [
    {
      id: 1,
      title: "Service & Preventive Maintenance",
      description:
        "Scheduled servicing, PMS, and inspections to keep your motorcycle reliable, safe, and ready for daily rides or long journeys.",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    },
    {
      id: 2,
      title: "Repairs & Diagnostics",
      description:
        "Accurate troubleshooting and professional repairs using proper tools, experience, and diagnostics for dependable motorcycle performance.",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    },
    {
      id: 3,
      title: "Accessories & Custom Installation",
      description:
        "Professional installation of accessories, electronics, protection, and touring upgrades, ensuring correct fitment, safety, and clean integration.",
      image:
        "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80",
    },
    {
      id: 4,
      title: "Wheels, Drivetrain & Handling",
      description:
        "Tyres, chains, sprockets, and handling components serviced and aligned for stability, control, and confident riding.",
      image:
        "https://images.unsplash.com/photo-1571293521801-fd3dbf02a4f2?w=800&q=80",
    },
    {
      id: 5,
      title: "Detailing, Care & Protection",
      description:
        "Thorough cleaning, detailing, and protective treatments to restore, preserve, and enhance your motorcycle's appearance and condition.",
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
    },
    {
      id: 6,
      title: "Performance & Upgrade Services",
      description:
        "Carefully selected performance upgrades and tuning support to improve power delivery, efficiency, and overall riding experience.",
      image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    },
    {
      id: 7,
      title: "Roadside Assistance & Recovery",
      description:
        "Emergency motorcycle towing, rescue, and recovery services to get you and your bike to safety when needed.",
      image:
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
    },
    {
      id: 8,
      title: "Rider Support & Convenience",
      description:
        "Consultation, inspections, and after-service support designed to help riders make informed decisions and ride with confidence.",
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    },
  ],
}

// ============================================================================
// GETTER FUNCTIONS — Return fallback data directly (no CMS fetch)
// ============================================================================

export async function getHeroWithFallbacks(
  _homeContent?: HomeContent | null
): Promise<HeroContent> {
  return HERO_FALLBACKS
}

export async function getAboutWithFallbacks(
  _homeContent?: HomeContent | null
): Promise<AboutContent> {
  return ABOUT_FALLBACKS
}

export async function getCoffeeWithFallbacks(
  _homeContent?: HomeContent | null
): Promise<CoffeeShowcaseContent> {
  return COFFEE_FALLBACKS
}

export async function getServicesWithFallbacks(
  _homeContent?: HomeContent | null
): Promise<MotoServicesContent> {
  return SERVICES_FALLBACKS
}

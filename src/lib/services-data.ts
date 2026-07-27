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
  shortDescription?: string
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
    title: "Preventive Motorcycle Maintenance",
    shortTitle: "PMS",
    description:
      "Scheduled preventive maintenance (PMS) for big bikes and motorcycles in Makati. Oil change, chain service, brake inspection, electrical check, and full safety assessment - keeping your ride safe and reliable on Philippine roads.",
    shortDescription:
      "Motorcycle PMS in Makati with oil change, chain service, brake checks, electrical inspection, and ride-readiness review.",
    image: getServiceImageBySlug("preventive-maintenance"),
    items: [
      "Engine Oil and Oil Filter Replacement",
      "Air Filter Inspection and Replacement",
      "Chain Cleaning, Lubrication, and Tension Adjustment",
      "Brake Pad and Brake Fluid Inspection",
      "Tire Pressure and Tread Depth Check",
      "Battery Health and Electrical Systems Check",
      "Coolant Level and Cooling System Inspection",
      "Spark Plug Inspection and Replacement",
      "Throttle and Clutch Cable Adjustment",
      "Wheel Bearing and Suspension Check",
      "All Lights and Indicators Inspection",
      "Fastener Torque and Frame Inspection",
      "Pre-Ride and Post-Long-Distance Safety Check",
      "Service Record Documentation",
    ],
    localContent: [
      {
        heading: "Motorcycle PMS in Makati City Philippines",
        body:
          "Preventive maintenance is the most important thing you can do to protect your motorcycle in the Philippines. Metro Manila's stop-and-go traffic, heat, humidity, and rainy season conditions accelerate wear on engines, chains, brakes, and electrical systems faster than typical riding conditions. Sixth Gear MotoSupply in Makati offers professional motorcycle PMS - preventive maintenance service - for all big bike brands sold in the Philippines, including BMW, Honda, Yamaha, Kawasaki, Triumph, Ducati, and Royal Enfield. Our technicians document what was checked, what was done, and any items flagged for future attention so you always know the true condition of your motorcycle.",
      },
      {
        heading: "Big Bike Maintenance Makati - What's Included",
        body:
          "Our preventive maintenance service covers your engine oil and filter, air filter, chain and drive system, brake pads and fluid, tire pressure and tread, battery, coolant, spark plugs, throttle and clutch cables, wheel bearings, all lights and indicators, and a full fastener torque check. For Metro Manila riding, we recommend a PMS visit every 5,000 km or every 6 months - whichever comes first. Riders who do daily highway commuting or long-distance touring should follow their manufacturer's recommended interval closely.",
      },
      {
        heading: "Motorcycle Oil Change and Service Center Makati",
        body:
          "Our Makati service center uses quality lubricants appropriate for your engine type and Philippine riding conditions. Philippine heat is particularly hard on engine oil - we make sure yours is always within service interval and at the right level. After service, you're welcome to relax at our rider cafe and lounge while our team takes care of your motorcycle. We serve riders from all areas of Metro Manila: BGC, Taguig, Mandaluyong, Pasig, Quezon City, Paranaque, and beyond.",
      },
    ],
    internalLinks: [
      {
        label: "Motorcycle services in Makati Philippines",
        href: "/services",
      },
      {
        label: "Book a PMS at our Makati service center",
        href: "https://cal.com/sixthgear-moto-supply-wvfnxi/pms",
      },
      {
        label: "Motorcycle repairs and diagnostics Makati",
        href: "/services/repairs-diagnostics",
      },
      {
        label: "Big bike parts and accessories Philippines",
        href: "/collections/parts-and-accessories",
      },
    ],
    faqItems: [
      {
        question: "How often should I service my big bike in the Philippines?",
        answer:
          "For typical Metro Manila riding, we recommend preventive maintenance every 5,000 km or every 6 months - whichever comes first. Daily highway commuters and touring riders should follow their manufacturer's recommended interval closely.",
      },
      {
        question: "Do you service all big bike brands?",
        answer:
          "Yes. We perform preventive maintenance for BMW, Honda, Yamaha, Kawasaki, Triumph, Royal Enfield, Ducati, Suzuki, and other big bike brands sold in the Philippines.",
      },
      {
        question: "Can I wait at your Makati shop during the service?",
        answer:
          "Yes. Our Makati shop has a rider lounge and cafe - grab a coffee while we take care of your motorcycle.",
      },
      {
        question: "Do you use OEM parts during maintenance?",
        answer:
          "We can use OEM or quality aftermarket parts based on your preference. We always inform you what will be used before proceeding - no surprise substitutions.",
      },
      {
        question: "Do you provide a service record or report?",
        answer:
          "Yes. We document every PMS visit - what was checked, what was serviced, and any items flagged for future attention. You leave with a clear record of your motorcycle's condition.",
      },
    ],
  },
  {
    id: "repairs-diagnostics",
    slug: "repairs-diagnostics",
    title: "Motorcycle Repairs & Diagnostics",
    shortTitle: "Repairs",
    description:
      "Accurate motorcycle diagnostics and expert repairs in Makati. ECU fault code reading, fuel injection service, engine diagnosis, electrical fault finding, and mechanical repairs for big bikes across Metro Manila Philippines.",
    shortDescription:
      "Motorcycle diagnostics and repairs in Makati for ECU faults, fuel injection, electrical issues, brakes, suspension, and engine concerns.",
    image: getServiceImageBySlug("repairs-diagnostics"),
    items: [
      "ECU Fault Code Reading and Interpretation",
      "Fuel Injection Cleaning and Diagnostics",
      "Engine Performance and Noise Diagnosis",
      "Electrical Fault Finding and Repair",
      "Brake System Repair - Calipers, Master Cylinder, Lines",
      "Fork Seal and Suspension Repair",
      "Clutch Replacement and Adjustment",
      "Valve Adjustment and Top-End Engine Work",
      "Gasket Replacement and Engine Sealing",
      "Starter Motor and Charging System Repair",
      "Wiring Harness Repair and Connector Replacement",
      "Fuel Pump and Fuel System Repair",
      "Regulator-Rectifier and Battery Replacement",
      "Post-Repair Test Ride and Verification",
    ],
    localContent: [
      {
        heading: "Motorcycle Diagnostic Service Makati Philippines",
        body:
          "When your motorcycle isn't running right, guessing is expensive. Sixth Gear MotoSupply in Makati uses proper diagnostic procedures to identify the root cause of any issue before we touch your bike. We use diagnostic tools to read ECU fault codes on fuel-injected motorcycles - if your check engine light is on, your bike is running rough, losing power, or behaving erratically, we'll pull the codes and translate them into an accurate repair plan. Our diagnostic approach covers fuel injection, engine performance, electrical systems, and mechanical condition - giving you a complete picture before any repair work begins.",
      },
      {
        heading: "Motorcycle Repair Shop Makati - What We Fix",
        body:
          "Our Makati repair shop handles engine repairs including valve adjustments, gasket replacements, clutch work, and top-end service. For electrical issues, we trace circuits, check grounds, and assess wiring condition to find the source of any fault - not just the symptom. Brake and suspension repairs include caliper rebuilds, master cylinder service, fork seal replacement, and shock absorber service. We fix fuel system issues including injector cleaning, fuel pump replacement, and throttle body service. All repairs are explained and approved before we proceed - no surprise bills.",
      },
      {
        heading: "Big Bike Repair Center Makati - Serving Metro Manila",
        body:
          "Riders from BGC, Taguig, Mandaluyong, Pasig, Quezon City, Paranaque, and other areas of Metro Manila bring their big bikes to our Makati repair center. We work on all major big bike brands - BMW, Honda, Yamaha, Kawasaki, Triumph, Ducati, Royal Enfield, and Suzuki. For complex or intermittent issues, we take the time to properly diagnose before recommending repairs - because fixing the wrong thing wastes your time and money.",
      },
    ],
    internalLinks: [
      {
        label: "Motorcycle services Makati Philippines",
        href: "/services",
      },
      {
        label: "Preventive maintenance Makati",
        href: "/services/preventive-maintenance",
      },
      {
        label: "Accessories installation Makati",
        href: "/services/accessories-installation",
      },
      {
        label: "Book a diagnostic at our Makati shop",
        href: "https://cal.com/sixthgear-moto-supply-wvfnxi/pms",
      },
    ],
    faqItems: [
      {
        question: "How long does a motorcycle diagnostic take in Makati?",
        answer:
          "Basic ECU fault code reading takes 30-60 minutes. A full diagnostic work-up for complex issues may take 2-4 hours. We give you a realistic timeline when you book.",
      },
      {
        question: "Do you charge a diagnostic fee?",
        answer:
          "Yes. Diagnostics are a professional service requiring time and expertise. The fee is communicated upfront and is separate from repair costs - you approve any repair before we proceed.",
      },
      {
        question: "Do you work on fuel-injected big bikes?",
        answer:
          "Yes. We have diagnostic tools for fuel-injected motorcycles from BMW, Honda, Yamaha, Kawasaki, Triumph, and other brands commonly sold in the Philippines.",
      },
      {
        question: "What if my bike needs parts you don't have in stock?",
        answer:
          "We source the correct parts and communicate lead times before proceeding. We don't substitute incompatible parts or proceed without your approval.",
      },
      {
        question: "Can you repair intermittent electrical faults?",
        answer:
          "Yes. Intermittent electrical faults are our specialty. We systematically trace circuits, check grounds, and assess wiring harness condition to identify the root cause - not just reset the warning light.",
      },
    ],
  },
  {
    id: "accessories-installation",
    slug: "accessories-installation",
    title: "Accessories & Exhaust Installation",
    shortTitle: "Installation",
    description:
      "Professional motorcycle accessories and exhaust installation in Makati. We fit Akrapovic, SC Project, Yoshimura, and other premium exhaust systems - plus GPS mounts, comms, lighting, luggage, and crash protection. Serving big bike riders across Metro Manila.",
    shortDescription:
      "Accessories and exhaust installation in Makati, including Akrapovic fitment, comms, GPS mounts, lighting, luggage, and crash protection.",
    image: getServiceImageBySlug("accessories-installation"),
    items: [
      "Akrapovic Exhaust Installation Makati",
      "SC Project & Yoshimura Exhaust Fitment",
      "Slip-On Muffler Installation",
      "Full System Exhaust Installation",
      "Exhaust Fitment & Compatibility Check",
      "Cardo & Sena Communication System Setup",
      "Quad Lock & GPS Navigation Mount Installation",
      "Auxiliary & LED Lighting Upgrades",
      "Crash Guards, Sliders & Skid Plate Fitting",
      "Luggage System & Rack Mounting",
      "Windscreen, Mirrors & Ergonomic Accessories",
      "Horn, Electrical & Safety Device Upgrades",
      "Bar-End Weights & Handlebar Accessories",
      "Tank Pad & Bodywork Protection Fitting",
    ],
    localContent: [
      {
        heading: "Akrapovic Exhaust Installation in Makati Philippines",
        body:
          "Sixth Gear MotoSupply is your trusted motorcycle exhaust installation shop in Makati City. We handle Akrapovic exhaust installation for all major big bike models sold in the Philippines - including the BMW R1300 GS, BMW R1250 GS, BMW S1000XR, Honda CB650R, Honda X-ADV, Yamaha MT-09, Kawasaki Z900, and more. Whether you're fitting a slip-on or a full exhaust system, our technicians follow proper torque specifications and heat shielding protocol on every installation. Bring your new exhaust and we'll have it fitted correctly and safely - no guesswork, no shortcuts.",
      },
      {
        heading: "Motorcycle Accessories Installation Makati",
        body:
          "Beyond exhaust systems, our Makati installation service covers every type of motorcycle accessory. We install Cardo and Sena communication systems, Quad Lock phone and GPS mounts, auxiliary LED lighting, crash protection, luggage racks and top cases, windscreens, mirrors, and more. Every accessory is fitted to manufacturer specifications with the correct hardware and checked before the bike leaves our shop. Riders from BGC, Taguig, Mandaluyong, Pasig, and Quezon City regularly visit our Makati service center for accessories installation.",
      },
      {
        heading: "Exhaust Installation for Big Bikes Philippines",
        body:
          "We install exhaust systems from Akrapovic, SC Project, Yoshimura, Arrow, Zard, and other premium brands. Our team confirms fitment compatibility before every installation - we won't fit an exhaust that doesn't properly suit your motorcycle. For exhaust installations, we recommend calling ahead to reserve a bay at our Makati shop. Walk-ins are welcome for minor accessories and quick fitment jobs.",
      },
    ],
    internalLinks: [
      {
        label: "Browse Akrapovic exhaust Philippines",
        href: "/collections/akrapovic-exhaust",
      },
      {
        label: "Akrapovic exhaust installation Makati",
        href: "/services/accessories-installation",
      },
      {
        label: "Motorcycle accessories Philippines",
        href: "/collections/parts-and-accessories",
      },
      {
        label: "Book a service at our Makati shop",
        href: "https://cal.com/sixthgear-moto-supply-wvfnxi/pms",
      },
    ],
    faqItems: [
      {
        question: "Do you install Akrapovic exhausts in Makati?",
        answer:
          "Yes. Sixth Gear MotoSupply handles Akrapovic exhaust installation in Makati for all compatible big bike models. We check fitment before installation and follow manufacturer torque specifications throughout.",
      },
      {
        question: "How long does an exhaust installation take?",
        answer:
          "A slip-on exhaust installation typically takes 1-2 hours. Full system replacements may take 3-4 hours depending on the motorcycle model. We give you an accurate time estimate when you book.",
      },
      {
        question: "Can you install an exhaust I bought from another shop?",
        answer:
          "Yes. We install customer-supplied exhaust systems and accessories as long as they are compatible with your motorcycle. We verify fitment before proceeding.",
      },
      {
        question: "Which exhaust brands do you install?",
        answer:
          "We install Akrapovic, SC Project, Yoshimura, Arrow, Zard, and other premium exhaust brands. Our Makati shop stocks Akrapovic slip-on and full systems for the most popular big bike models in the Philippines.",
      },
      {
        question: "Do you need an appointment for exhaust installation?",
        answer:
          "For exhaust installations, we recommend calling ahead to reserve a bay - especially on weekends. Walk-ins are welcome for minor accessories and quick fitment jobs.",
      },
    ],
  },
  {
    id: "wheels-drivetrain",
    slug: "wheels-drivetrain",
    title: "Wheels & Drivetrain Service",
    shortTitle: "Wheels & Drive",
    description:
      "Professional wheels and drivetrain service in Makati. Chain replacement and adjustment, sprocket inspection, wheel balancing, bearing checks, and tire mounting for big bikes and motorcycles across Metro Manila Philippines.",
    shortDescription:
      "Wheels and drivetrain service in Makati for chain care, sprockets, tire mounting, wheel balancing, bearings, and alignment checks.",
    image: getServiceImageBySlug("wheels-drivetrain"),
    items: [
      "Chain Inspection and Wear Measurement",
      "Chain Cleaning and Lubrication",
      "Chain Tension Adjustment",
      "Chain and Sprocket Set Replacement",
      "Front and Rear Sprocket Inspection",
      "Wheel Balancing - Big Bikes and Standard",
      "Wheel Bearing Inspection and Replacement",
      "Tire Mounting - Tubeless and Tube-Type",
      "Tire Pressure and Tread Depth Check",
      "Axle and Swing Arm Inspection",
      "Drive Belt Inspection (Belt-Drive Motorcycles)",
      "Wheel Alignment Check",
      "Spoke Tension Check (Spoke-Wheel Bikes)",
    ],
    localContent: [
      {
        heading: "Motorcycle Chain and Sprocket Service Makati Philippines",
        body:
          "Your motorcycle's drivetrain - the chain, sprockets, wheels, and bearings - takes constant punishment from Metro Manila road conditions: potholes, speed bumps, flooded roads, and stop-and-go traffic. Sixth Gear MotoSupply in Makati offers professional chain and drivetrain service for big bikes and standard motorcycles. We inspect chain wear accurately, measure stretch against specification, and recommend replacement when necessary - before a worn chain damages your sprockets or fails on the road. We carry quality chain sets for popular big bike models sold in the Philippines and always recommend replacing chains and sprockets together for maximum drivetrain life.",
      },
      {
        heading: "Wheel Balancing and Tire Mounting Makati",
        body:
          "Unbalanced wheels cause vibration at speed, uneven tire wear, and unstable handling - all of which get worse at highway speeds on Philippine expressways. Our Makati shop provides wheel balancing for big bikes and standard motorcycles. We also mount tires - bring your tires and we'll mount and balance them correctly. We handle tubeless and tube-type tires for all wheel sizes. After tire changes, we always recheck balance and pressure before the bike leaves.",
      },
      {
        heading: "Wheel Bearing Inspection and Replacement Makati",
        body:
          "Worn wheel bearings create play in the wheel, cause handling instability, and can become dangerous at highway speeds. We check wheel bearing condition as part of every drivetrain service and replace them when wear is detected. Riders from across Metro Manila - BGC, Taguig, Mandaluyong, Quezon City, and Paranaque - bring their big bikes to our Makati center for professional wheel and drivetrain service.",
      },
    ],
    internalLinks: [
      {
        label: "Motorcycle services Makati Philippines",
        href: "/services",
      },
      {
        label: "Preventive maintenance Makati",
        href: "/services/preventive-maintenance",
      },
      {
        label: "Motorcycle parts and accessories Philippines",
        href: "/collections/parts-and-accessories",
      },
      {
        label: "Book a drivetrain service in Makati",
        href: "https://cal.com/sixthgear-moto-supply-wvfnxi/pms",
      },
    ],
    faqItems: [
      {
        question: "When should I replace my motorcycle chain and sprockets?",
        answer:
          "Replace your chain when it has stretched beyond the adjustment range or shows tight links, rust, or side wear. Always replace the chain and both sprockets together - a new chain on worn sprockets wears out much faster.",
      },
      {
        question: "How often should I service my chain in Philippine conditions?",
        answer:
          "Inspect and lubricate your chain every 500 km in normal conditions. Clean and lube more frequently if you ride in rain or dusty conditions - both are common in the Philippines. Full chain and sprocket replacement is typically needed every 20,000-25,000 km.",
      },
      {
        question: "Can you mount tires I bought elsewhere?",
        answer:
          "Yes. We mount and balance customer-supplied tires for big bikes and standard motorcycles at our Makati shop.",
      },
      {
        question: "How do I know if my wheel bearings need replacement?",
        answer:
          "Signs include a rumbling or grinding sound from the wheel area, handling instability, or detectable play when you grab the wheel and push/pull laterally. Bring your bike in and we'll check bearing condition accurately.",
      },
    ],
  },
  {
    id: "detailing-protection",
    slug: "detailing-protection",
    title: "Motorcycle Detailing & Paint Protection",
    shortTitle: "Detailing",
    description:
      "Professional motorcycle detailing and paint protection in Makati. Deep cleaning, paint decontamination, surface protection, chrome polishing, and engine degreasing for big bikes and premium motorcycles in Metro Manila Philippines.",
    shortDescription:
      "Motorcycle detailing in Makati with deep wash, paint decontamination, surface protection, polishing, trim care, and coating consultation.",
    image: getServiceImageBySlug("detailing-protection"),
    items: [
      "Full Motorcycle Deep Wash and Rinse",
      "Paint Decontamination - Clay Bar Treatment",
      "Tar, Road Grime, and Bug Removal",
      "Light Paint Correction and Swirl Removal",
      "Paint Sealant and Surface Protection Application",
      "Chrome and Exhaust Header Polishing",
      "Alloy Wheel Cleaning and Polishing",
      "Engine Bay and Frame Degreasing",
      "Plastic and Rubber Trim Conditioning",
      "Windscreen and Visor Cleaning",
      "Seat and Upholstery Cleaning",
      "Chain and Underbody Cleaning",
      "Post-Detail Inspection and Wipe-Down",
      "Ceramic Coating Consultation",
    ],
    localContent: [
      {
        heading: "Motorcycle Detailing Service Makati Philippines",
        body:
          "The Philippine climate is one of the harshest environments for motorcycle paint and metal surfaces. Intense UV radiation, acid rain, humidity, salt air from coastal routes, and Metro Manila air pollution attack your motorcycle's finish daily. A proper detail isn't just about appearance - it removes corrosive contaminants, prevents paint oxidation, protects against rust, and maintains your motorcycle's resale value. Sixth Gear MotoSupply in Makati City provides professional motorcycle detailing for big bikes and premium motorcycles, using products and techniques appropriate for Philippine riding conditions.",
      },
      {
        heading: "Big Bike Paint Decontamination and Protection Makati",
        body:
          "Our detailing service starts with a thorough pH-safe wash followed by clay bar decontamination - removing bonded surface contaminants that regular washing can't touch. For bikes showing swirl marks, water spots, or minor paint defects, we offer light machine paint correction before applying a protective sealant layer. We pay particular attention to chrome exhaust headers, alloy wheels, engine covers, and exposed metal surfaces - all of which suffer accelerated corrosion in Philippine humidity. Matte and satin finish motorcycles require specific products and we adjust our approach accordingly - tell us your finish type when you book.",
      },
      {
        heading: "Motorcycle Detailing Near Me - Makati City",
        body:
          "Located in Makati City, our detailing service is accessible to riders from BGC, Taguig, Mandaluyong, Pasig, San Juan, Quezon City, and Paranaque. We recommend a full detail every 3-6 months given Philippine conditions. In between details, a thorough wash after every wet-weather ride is the single most effective way to protect your motorcycle's finish from the elements.",
      },
    ],
    internalLinks: [
      {
        label: "Motorcycle services Makati Philippines",
        href: "/services",
      },
      {
        label: "Performance upgrades Makati",
        href: "/services/performance-upgrades",
      },
      {
        label: "Preventive maintenance Makati",
        href: "/services/preventive-maintenance",
      },
      {
        label: "Book a motorcycle detail in Makati",
        href: "https://cal.com/sixthgear-moto-supply-wvfnxi/pms",
      },
    ],
    faqItems: [
      {
        question: "How long does a full motorcycle detail take?",
        answer:
          "A basic detail - wash, decontamination, and sealant - takes 3-5 hours. Full paint correction and protection treatments may require a full day. We give you a time estimate when we assess your bike's condition.",
      },
      {
        question: "Can you detail matte or satin finish motorcycles?",
        answer:
          "Yes, but matte and satin finishes require specific products and techniques. Regular wax or polish should never be used on matte finishes. Tell us your finish type when booking so we use the correct products.",
      },
      {
        question: "How often should I detail my big bike in the Philippines?",
        answer:
          "We recommend a full detail every 3-6 months given Philippine weather conditions. After every wet-weather ride, a proper rinse and dry prevents the worst corrosive effects from rain and road contamination.",
      },
      {
        question: "Do you offer ceramic coating for motorcycles?",
        answer:
          "We offer consultations on ceramic coating options appropriate for motorcycles. Speak to our team about your bike, riding frequency, and storage conditions to find the best protection level for your situation.",
      },
    ],
  },
  {
    id: "performance-upgrades",
    slug: "performance-upgrades",
    title: "Motorcycle Performance Upgrades",
    shortTitle: "Performance",
    description:
      "Unlock more power, better sound, and improved handling. Sixth Gear MotoSupply in Makati installs Akrapovic and SC Project exhaust systems, air filter upgrades, ECU tuning, and suspension setup for big bikes in the Philippines.",
    shortDescription:
      "Performance upgrades in Makati for Akrapovic and SC Project exhausts, air filters, ECU tuning consultation, and suspension setup.",
    image: getServiceImageBySlug("performance-upgrades"),
    items: [
      "Akrapovic Exhaust System Installation",
      "SC Project and Yoshimura Exhaust Fitment",
      "Slip-On and Full System Exhaust Upgrades",
      "High-Flow Air Filter Upgrade",
      "ECU Tuning and Fuel Mapping Consultation",
      "Power Commander and Fuel Controller Fitting",
      "Suspension Preload and Damping Setup",
      "Fork and Rear Shock Tuning",
      "Handlebar, Footpeg, and Ergonomics Setup",
      "LED Headlight and Auxiliary Lighting Upgrade",
      "Brake Line Upgrade - Stainless Steel Lines",
      "Quick Shifter Installation and Setup",
      "Lightweight Wheel and Brake Disc Upgrades",
      "Performance Upgrade Consultation and Planning",
    ],
    localContent: [
      {
        heading: "Motorcycle Performance Upgrades Makati Philippines",
        body:
          "Your motorcycle leaves the factory optimized for safety regulations, emissions standards, and broad market appeal - not maximum performance. Performance upgrades let you extract what the engine was always capable of, improve handling for your riding style, and transform how your bike sounds and feels. Sixth Gear MotoSupply in Makati advises on and installs performance upgrades for big bikes across all major brands sold in the Philippines. Our most popular service is Akrapovic and SC Project exhaust installation - the single most impactful upgrade most riders make, delivering weight reduction, improved exhaust flow, and the sound your bike deserves.",
      },
      {
        heading: "Akrapovic and SC Project Exhaust Upgrades Makati",
        body:
          "We supply and install Akrapovic, SC Project, Yoshimura, Arrow, and other premium exhaust systems at our Makati shop. Slip-on exhausts are our most common fitment - they deliver a noticeable improvement in sound and modest power gains with minimal installation complexity. Full system replacements deliver greater power gains and weight reduction but require more installation time. We handle exhaust installations for the BMW R1300 GS, BMW R1250 GS, BMW S1000XR, Honda CB650R, Honda X-ADV, Yamaha MT-09, Kawasaki Z900, and other popular big bike models in the Philippines. When you change your exhaust, we advise on ECU fueling recalibration to maximize the benefit and ensure your engine runs correctly with the new system.",
      },
      {
        heading: "Suspension Setup and Handling Upgrades - Big Bikes Philippines",
        body:
          "Stock suspension is set up for an average 70 kg rider. If you're heavier, carry luggage, or ride aggressively, your suspension is almost certainly not optimized for your situation. We assess and configure suspension preload, compression, and rebound damping to suit your weight, luggage load, and riding style - making an immediate and significant difference to how your bike handles. For riders doing long-distance touring in the Philippines, proper suspension setup is one of the most overlooked improvements available. Riders from BGC, Taguig, Mandaluyong, Pasig, and Quezon City visit our Makati shop for performance upgrades and exhaust installation.",
      },
    ],
    internalLinks: [
      {
        label: "Akrapovic exhaust Philippines",
        href: "/collections/akrapovic-exhaust",
      },
      {
        label: "Accessories installation Makati",
        href: "/services/accessories-installation",
      },
      {
        label: "Motorcycle repairs and diagnostics Makati",
        href: "/services/repairs-diagnostics",
      },
      {
        label: "Book a performance upgrade consultation",
        href: "https://cal.com/sixthgear-moto-supply-wvfnxi/pms",
      },
    ],
    faqItems: [
      {
        question: "What is the best first performance upgrade for a big bike?",
        answer:
          "For most riders, an aftermarket exhaust system is the best starting point. It delivers the most noticeable improvement in sound, reduces weight, and provides power gains - especially when paired with an air filter upgrade and ECU recalibration.",
      },
      {
        question: "Will an Akrapovic exhaust pass LTO inspection in the Philippines?",
        answer:
          "Street-legal homologated Akrapovic systems are designed to meet emissions and noise requirements. Race-spec systems are for closed-course use only. We'll help you choose the right system for street use in the Philippines.",
      },
      {
        question: "Do I need ECU tuning after fitting an aftermarket exhaust?",
        answer:
          "For most fuel-injected bikes, ECU recalibration after an exhaust change maximizes power gains and ensures correct fueling. Running a modified exhaust without fuel tuning can cause lean conditions on some models. We advise on the right approach for your specific bike.",
      },
      {
        question: "Can you do exhaust installation and suspension setup on the same visit?",
        answer:
          "Yes. We can combine multiple upgrades in a single visit to minimize your time at the shop. Contact us in advance so we can schedule the correct amount of time for your bike.",
      },
      {
        question: "Does an aftermarket exhaust void my motorcycle warranty?",
        answer:
          "This depends on your manufacturer's warranty terms. We recommend checking with your authorized dealer before modifying a bike under warranty. Once out of warranty, aftermarket upgrades are standard practice among big bike owners in the Philippines.",
      },
    ],
  },
  {
    id: "roadside-assistance",
    slug: "roadside-assistance",
    title: "Motorcycle Roadside Assistance",
    shortTitle: "Roadside Help",
    description:
      "Motorcycle roadside assistance and emergency support for Metro Manila riders. Flat tire, dead battery, fuel delivery, breakdown assessment, and towing coordination - contact Sixth Gear MotoSupply Makati when you need help on the road.",
    shortDescription:
      "Motorcycle roadside assistance for Metro Manila riders, including flat tire help, jump starts, fuel delivery, breakdown checks, and towing coordination.",
    image: getServiceImageBySlug("roadside-assistance"),
    items: [
      "Flat Tire Roadside Repair Assistance",
      "Dead Battery Jump Start Service",
      "Emergency Fuel Delivery to Your Location",
      "On-Site Mechanical Breakdown Assessment",
      "Towing Coordination to Makati Workshop",
      "Remote Troubleshooting via Phone or Chat",
      "Post-Breakdown Repair at Makati Service Center",
      "Route Advice and Nearest Resource Guidance",
      "Emergency Parts Sourcing Support",
    ],
    localContent: [
      {
        heading: "Motorcycle Roadside Assistance Metro Manila Philippines",
        body:
          "Every rider dreads it - but breakdowns happen. A flat tire on EDSA, a dead battery in Makati, running out of fuel on the way to Tagaytay, or a mechanical failure on a weekend ride. When it happens, knowing who to call makes all the difference. Sixth Gear MotoSupply in Makati City provides motorcycle roadside assistance and emergency support for riders in Metro Manila and surrounding areas. We're the motorcycle shop that goes the extra mile - because we know what it feels like to be stuck on the road.",
      },
      {
        heading: "Emergency Motorcycle Support - Flat Tire, Dead Battery, Breakdown",
        body:
          "Our roadside assistance covers the most common motorcycle emergencies: flat tire response and plug repair, dead battery jump start, emergency fuel delivery, and on-site mechanical assessment. For motorcycles that cannot be ridden safely, we help coordinate towing to our Makati workshop where our repair team will be ready. Our primary coverage area is Metro Manila, with support for common riding routes including Tagaytay Road, Batangas Road, SLEX, and the main Cavite and Laguna highways. For the fastest response, call our Makati shop directly with your location, motorcycle model, and a brief description of the issue.",
      },
      {
        heading: "Big Bike Emergency Service Makati - What to Do When Your Bike Breaks Down",
        body:
          "If your motorcycle breaks down on a Philippine road, the first priority is safety: move your bike completely off the road, activate your hazard lights, make yourself visible to other vehicles, and stay away from traffic. Then call Sixth Gear MotoSupply. We'll assess the situation over the phone, advise on immediate steps, and dispatch assistance or direct you to the nearest resources. Don't attempt repairs on a busy road - wait in a safe location and let our team handle the technical side.",
      },
    ],
    internalLinks: [
      {
        label: "Motorcycle repairs and diagnostics Makati",
        href: "/services/repairs-diagnostics",
      },
      {
        label: "Preventive maintenance Makati",
        href: "/services/preventive-maintenance",
      },
      {
        label: "Rider support services Makati",
        href: "/services/rider-support",
      },
      {
        label: "Contact our Makati service center",
        href: "/contact",
      },
    ],
    faqItems: [
      {
        question: "What areas does your roadside assistance cover?",
        answer:
          "Our primary roadside assistance coverage is Metro Manila. We also support common riding routes including Tagaytay Road, Batangas Road, SLEX, and the main Cavite and Laguna highways. Contact us for availability at your specific location.",
      },
      {
        question: "How quickly can you respond to a roadside breakdown in Metro Manila?",
        answer:
          "Response time depends on your location and Metro Manila traffic conditions. We give an honest estimate when you call - traffic is a real factor and we won't make promises we can't keep.",
      },
      {
        question: "What should I do first if my motorcycle breaks down on the road?",
        answer:
          "Move your bike off the road completely, activate your hazard lights, and stay in a safe location away from traffic. Then call us. Never attempt repairs on a busy road - safety is the priority.",
      },
      {
        question: "Do you charge for roadside assistance?",
        answer:
          "Yes. Service fees apply and are communicated upfront when you call. Basic jump starts and fuel delivery have a standard service call fee. Towing coordination has separate costs depending on distance.",
      },
      {
        question: "My bike broke down outside Metro Manila - can you still help?",
        answer:
          "Contact us regardless of location. We'll try to assist remotely, advise on nearest resources, or help coordinate transport to our Makati workshop if needed.",
      },
    ],
  },
  {
    id: "rider-support",
    slug: "rider-support",
    title: "Rider Support Services",
    shortTitle: "Rider Support",
    description:
      "Comprehensive rider support services in Makati. Pre-purchase motorcycle inspection, troubleshooting consultation, warranty assistance, gear advice, and after-service follow-up - your trusted big bike partner in Metro Manila Philippines.",
    shortDescription:
      "Rider support in Makati for pre-purchase inspection, troubleshooting consultation, warranty documentation, gear advice, and after-service follow-up.",
    image: getServiceImageBySlug("rider-support"),
    items: [
      "Pre-Purchase Motorcycle Inspection and Report",
      "Post-Purchase Condition Assessment",
      "Troubleshooting Consultation - Before Expensive Repairs",
      "Warranty Issue Documentation and Support",
      "New Owner Orientation - Your First Big Bike",
      "Honest Gear and Accessories Recommendations",
      "Long-Distance Ride Preparation Check",
      "After-Service Follow-Up and Satisfaction Check",
      "Rider Community Events and Group Rides",
      "Franchise and Partnership Inquiries",
    ],
    localContent: [
      {
        heading: "Pre-Purchase Motorcycle Inspection Makati Philippines",
        body:
          "Before buying a used big bike in the Philippines, get it properly inspected. A pre-purchase inspection by our Makati technicians can reveal hidden problems that aren't visible to the untrained eye - worn wheel bearings, previous accident damage, frame issues, engine problems, electrical faults, odometer irregularities, and undisclosed modifications. We inspect the motorcycle systematically and provide you with an honest written report on its true condition and estimated cost of any issues found. This service is available for any used big bike you're considering - whether from a private seller, a dealership, or an online listing on Facebook Marketplace, Carousell, or OLX Philippines. The inspection fee is a fraction of what a hidden problem can cost after purchase.",
      },
      {
        heading: "Motorcycle Troubleshooting Consultation Makati",
        body:
          "If your motorcycle is making a strange noise, vibrating differently, handling oddly, or showing a warning light - but not broken enough to justify a full diagnostic - come in for a consultation. Our team will listen carefully, ask the right questions, and give you an honest assessment of what's likely happening and what, if anything, needs immediate attention. Many riders waste money replacing parts that weren't actually the problem. A proper consultation before spending helps you fix the right thing the first time and avoid unnecessary expense. This service is available at our Makati shop - walk-ins welcome when our team is available, or book ahead for dedicated attention.",
      },
      {
        heading: "Big Bike Community and Rider Support - Sixth Gear Makati",
        body:
          "Sixth Gear MotoSupply is more than a motorcycle shop - it's a gathering point for Metro Manila's big bike community. Our rider cafe and lounge at our Makati City location is where riders unwind, swap stories, share route tips, and connect between rides and wrench sessions. Whether you're a new big bike owner needing guidance, a seasoned rider wanting a consultation, or just looking for a good place to stop between rides, our Makati shop is your base. Follow our Rider Stories for updates on the community, upcoming events, and motorcycle insights from our team.",
      },
    ],
    internalLinks: [
      {
        label: "Motorcycle services Makati Philippines",
        href: "/services",
      },
      {
        label: "Motorcycle repairs and diagnostics Makati",
        href: "/services/repairs-diagnostics",
      },
      {
        label: "Rider stories and motorcycle tips",
        href: "/rider-stories",
      },
      {
        label: "Contact our Makati team",
        href: "/contact",
      },
    ],
    faqItems: [
      {
        question: "How much does a pre-purchase motorcycle inspection cost?",
        answer:
          "Pre-purchase inspection fees are communicated upfront when you book. The fee reflects the time and expertise of a thorough, systematic inspection - and is a fraction of the cost of buying a motorcycle with undisclosed problems.",
      },
      {
        question: "Can you inspect a bike at a seller's location or does it need to come to your Makati shop?",
        answer:
          "For the most thorough inspection, we prefer to assess the bike at our Makati shop where we have full tools and a lift. Contact us to discuss your situation and we'll find the best approach.",
      },
      {
        question: "I just bought a used big bike and something feels off - can you help?",
        answer:
          "Yes. Bring the bike in for a post-purchase inspection and we'll give you an honest assessment of the issue and estimated cost to address it. Better to know early than to be surprised on the road.",
      },
      {
        question: "Do you offer advice for new big bike owners?",
        answer:
          "Yes. If you're new to big bikes or upgrading from a smaller displacement, our team is happy to discuss your motorcycle, your gear, your riding habits, and what to watch out for - over a coffee at our Makati cafe.",
      },
      {
        question: "Do you support warranty claims?",
        answer:
          "We help you document warranty-related issues accurately and advise on how to present your claim to your authorized dealer effectively. We don't process warranty claims directly but help ensure your case is well-prepared.",
      },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return servicesData.find((service) => service.slug === slug)
}

export function getAllServiceSlugs(): string[] {
  return servicesData.map((service) => service.slug)
}

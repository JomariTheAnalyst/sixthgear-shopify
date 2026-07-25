import OurServices from "@modules/home/components/our-services"
import OurTeam from "@modules/home/components/our-team"
import ClientTestimonials from "@modules/home/components/client-testimonials"
import {
  getHomepageServices,
  getOurTeamSection,
  getClientTestimonials,
} from "@lib/cms/client"
import { selectClientTestimonialsContent } from "@lib/cms/homepage-editorial"
import { selectHomepageServicesSource } from "@lib/cms/homepage-services"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"

export async function DeferredOurServicesSection() {
  const homepageServices = await getHomepageServices()
  const content = selectHomepageServicesSource(homepageServices)

  return (
    <SanityEditTarget
      documentId="homepage"
      documentType="homepage"
      path={content ? "services" : "services.useCustomServices"}
    >
      <OurServices data={content} />
    </SanityEditTarget>
  )
}

export async function DeferredOurTeamSection() {
  const ourTeamSection = await getOurTeamSection()

  return <OurTeam data={ourTeamSection} />
}

export async function DeferredClientTestimonialsSection() {
  const clientTestimonialsData = await getClientTestimonials()
  const content = selectClientTestimonialsContent(clientTestimonialsData)

  return (
    <SanityEditTarget
      documentId="homepage"
      documentType="homepage"
      path={content.source === "sanity" ? "clientTestimonials" : "clientTestimonials.useSanityContent"}
    >
    <ClientTestimonials
      sectionTitle={content.sectionTitle}
      sectionDescription={content.sectionDescription}
      testimonials={content.testimonials.map((testimonial) => ({
        id: testimonial.key,
        name: testimonial.name,
        role: testimonial.role,
        quote: testimonial.quote,
        avatar: testimonial.avatar,
      }))}
    />
    </SanityEditTarget>
  )
}

import OurServices from "@modules/home/components/our-services"
import ProjectsSection from "@modules/home/components/projects"
import OurTeam from "@modules/home/components/our-team"
import ClientTestimonials from "@modules/home/components/client-testimonials"
import {
  getHomepageServices,
  getSpaceExperiences,
  getOurTeamSection,
  getClientTestimonials,
} from "@lib/cms/client"

export async function DeferredOurServicesSection() {
  const homepageServices = await getHomepageServices()

  return <OurServices data={homepageServices} />
}

export async function DeferredProjectsSection() {
  const spaceExperiences = await getSpaceExperiences()

  return (
    <ProjectsSection
      sectionTitle={spaceExperiences?.sectionTitle ?? undefined}
      sectionDescription={spaceExperiences?.sectionDescription ?? undefined}
      items={
        spaceExperiences?.items
          ?.filter((item) => item.isEnabled)
          ?.map((item, index) => ({
            id: index + 1,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl ?? "/images/homepage/projects/coffee.jpg",
            isEnabled: item.isEnabled,
          })) ?? undefined
      }
    />
  )
}

export async function DeferredOurTeamSection() {
  const ourTeamSection = await getOurTeamSection()

  return (
    <OurTeam
      sectionTitle={ourTeamSection?.sectionTitle ?? undefined}
      sectionDescription={ourTeamSection?.sectionDescription ?? undefined}
      teamMembers={
        ourTeamSection?.teamMembers
          ?.map((member, index) => ({
            id: index + 1,
            name: member.name,
            role: member.role,
            title: member.title ?? "",
            description: member.description ?? "",
            image:
              member.photoUrl ??
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
            socialLinks: {
              facebook: member.socialLinks?.facebook ?? undefined,
              instagram: member.socialLinks?.instagram ?? undefined,
              tiktok: member.socialLinks?.tiktok ?? undefined,
            },
          })) ?? undefined
      }
    />
  )
}

export async function DeferredClientTestimonialsSection() {
  const clientTestimonialsData = await getClientTestimonials()

  return (
    <ClientTestimonials
      sectionTitle={clientTestimonialsData?.sectionTitle ?? undefined}
      sectionDescription={clientTestimonialsData?.sectionDescription ?? undefined}
      testimonials={
        clientTestimonialsData?.testimonials
          ?.map((testimonial, index) => ({
            id: index + 1,
            name: testimonial.name,
            role: testimonial.role ?? "Verified Rider",
            quote: testimonial.quote,
            avatar: "",
          })) ?? undefined
      }
    />
  )
}

import type {
  SanityOurTeamSectionQueryResult,
  SanityTeamMemberQueryResult,
} from './types'

export type OurTeamContent = {
  source: 'sanity' | 'fallback'
  sectionTitle: string
  sectionDescription: string
  teamMembers: Array<{
    key: string
    name: string
    role: string
    title: string
    description: string
    image: string
    imageAlt: string
  }>
}

export const FALLBACK_OUR_TEAM_CONTENT: OurTeamContent = {
  source: 'fallback',
  sectionTitle: 'Our  Team',
  sectionDescription:
    'Riders, Technicians, and Professionals Who Care About Your Bike',
  teamMembers: [
    {
      key: 'fallback-team-1',
      name: 'MARTIE',
      role: 'Lead Technician',
      title: 'Workshop Head',
      description:
        'Experienced motorcycle technician specializing in diagnostics, repairs, and performance upgrades for big bikes and premium motorcycles.',
      image: '/images/team/team1.png',
      imageAlt: 'MARTIE',
    },
    {
      key: 'fallback-team-2',
      name: 'JAMES',
      role: 'Senior Mechanic',
      title: 'Service & Installation Specialist',
      description:
        'Focused on PMS, mechanical repairs, and proper installation of accessories, electronics, and safety upgrades.',
      image: '/images/team/team2.png',
      imageAlt: 'JAMES',
    },
    {
      key: 'fallback-team-3',
      name: 'MARVIN',
      role: 'Service Advisor',
      title: 'Rider Support & Coordination',
      description:
        'Your point of contact for service consultations, job updates, and ensuring a smooth workshop experience from start to finish.',
      image: '/images/team/team3.png',
      imageAlt: 'MARVIN',
    },
    {
      key: 'fallback-team-4',
      name: 'JEVAN',
      role: 'Lead Barista',
      title: 'First Gear Coffee',
      description:
        'Expert barista crafting premium coffee beverages, ensuring riders have the perfect brew while they wait.',
      image: '/images/team/team4.png',
      imageAlt: 'JEVAN',
    },
  ],
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

type CompleteTeamMember = Omit<
  SanityTeamMemberQueryResult,
  '_key' | 'name' | 'role' | 'title' | 'description' | 'photoUrl' | 'imageAlt'
> & {
  _key: string
  name: string
  role: string
  title: string
  description: string
  photoUrl: string
  imageAlt: string
}

type CompleteOurTeam = Omit<
  SanityOurTeamSectionQueryResult,
  'useSanityContent' | 'sectionTitle' | 'sectionDescription' | 'teamMembers'
> & {
  useSanityContent: true
  sectionTitle: string
  sectionDescription: string
  teamMembers: CompleteTeamMember[]
}

function isCompleteTeamMember(
  member: SanityTeamMemberQueryResult | null
): member is CompleteTeamMember {
  return (
    Boolean(member) &&
    isNonEmptyString(member?._key) &&
    isNonEmptyString(member?.name) &&
    isNonEmptyString(member?.role) &&
    isNonEmptyString(member?.title) &&
    isNonEmptyString(member?.description) &&
    isNonEmptyString(member?.photoUrl) &&
    isNonEmptyString(member?.imageAlt)
  )
}

export function isCompleteSanityOurTeam(
  value: SanityOurTeamSectionQueryResult
): value is CompleteOurTeam {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.sectionTitle) &&
    isNonEmptyString(value.sectionDescription) &&
    Array.isArray(value.teamMembers) &&
    value.teamMembers.length > 0 &&
    value.teamMembers.every(isCompleteTeamMember)
  )
}

export function selectOurTeamContent(
  value: SanityOurTeamSectionQueryResult | null | undefined
): OurTeamContent {
  if (!value || !isCompleteSanityOurTeam(value)) {
    return FALLBACK_OUR_TEAM_CONTENT
  }

  return {
    source: 'sanity',
    sectionTitle: value.sectionTitle,
    sectionDescription: value.sectionDescription,
    teamMembers: value.teamMembers.map((member) => ({
      key: member._key,
      name: member.name,
      role: member.role,
      title: member.title,
      description: member.description,
      image: member.photoUrl,
      imageAlt: member.imageAlt,
    })),
  }
}

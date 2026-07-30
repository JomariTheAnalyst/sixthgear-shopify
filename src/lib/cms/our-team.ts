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
      role: 'Head Mechanic',
      description:
        'Experienced motorcycle technician specializing in diagnostics, repairs, and performance upgrades for big bikes and premium motorcycles.',
      image: '/images/team/team1.png',
      imageAlt: 'MARTIE',
    },
     {
      key: 'fallback-team-3',
      name: 'JAYSON',
      role: 'Service Advisor',
      description:
        'Your point of contact for service consultations, job updates, and ensuring a smooth workshop experience from start to finish.',
      image: '/images/team/team3.png',
      imageAlt: 'JAYSON',
    },
    {
      key: 'fallback-team-2',
      name: 'JAMES',
      role: 'Assistant Technician',
      description:
        'Focused on PMS, mechanical repairs, and proper installation of accessories, electronics, and safety upgrades.',
      image: '/images/team/team2.png',
      imageAlt: 'JAMES',
    },
       {
      key: 'fallback-team-4',
      name: 'SANDY',
      role: 'Senior Technician',
      description:
        'Focused on PMS, mechanical repairs, and proper installation of accessories, electronics, and safety upgrades.',
      image: '/images/team/team2.png',
      imageAlt: 'JAMES',
    },

    {
      key: 'fallback-team-5',
      name: 'CAMILLE  ',
      role: 'Supervisor',
      description:
        'Expert barista crafting premium coffee beverages, ensuring riders have the perfect brew while they wait.',
      image: '/images/team/team4.png',
      imageAlt: 'JEVAN',
    },
    {
      key: 'fallback-team-6',
      name: 'LIZA',
      role: 'Sales and marketing associate',
      description:
        'Expert barista crafting premium coffee beverages, ensuring riders have the perfect brew while they wait.',
      image: '/images/team/team4.png',
      imageAlt: 'LIZA',
    },
    {
      key: 'fallback-team-7',
      name: 'ALTHEA',
      role: 'sales and marketing associate',
      description:
        'Expert barista crafting premium coffee beverages, ensuring riders have the perfect brew while they wait.',
      image: '/images/team/team4.png',
      imageAlt: 'ALTHEA',
    },
    {
      key: 'fallback-team-9',
      name: 'JAKE',
      role: 'Marketing Strategist',
      description:
        'Expert barista crafting premium coffee beverages, ensuring riders have the perfect brew while they wait.',
      image: '/images/team/team4.png',
      imageAlt: 'JAKE',
    },
     {
      key: 'fallback-team-10',
      name: 'GINO',
      role: 'Marketing Associate',
      description:
        'Expert barista crafting premium coffee beverages, ensuring riders have the perfect brew while they wait.',
      image: '/images/team/team4.png',
      imageAlt: 'GINO',
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

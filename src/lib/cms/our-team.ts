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
    professionalImage: string
    wackyImage: string
    imageAlt: string
    instagramUrl?: string
    facebookUrl?: string
  }>
}

export const FALLBACK_OUR_TEAM_CONTENT: OurTeamContent = {
  source: 'fallback',
  sectionTitle: 'OUR TEAM',
  sectionDescription: 'MEET THE PEOPLE BEHIND SIXTHGEAR',
  teamMembers: [
    {
      key: 'fallback-team-1',
      name: 'MARTIE',
      role: 'Head Mechanic',
      description:
        'Keeps every motorcycle performing at its best through expert diagnostics and precision repairs.',
      professionalImage: '/images/team/team1.png',
      wackyImage: '/images/team/team1.png',
      imageAlt: 'Martie, Sixthgear head mechanic',
    },
    {
      key: 'fallback-team-2',
      name: 'JAYSON',
      role: 'Service Advisor',
      description:
        'Guides riders through service needs with clear advice and smooth workshop coordination.',
      professionalImage: '/images/team/team3.png',
      wackyImage: '/images/team/team3.png',
      imageAlt: 'Jayson, Sixthgear service advisor',
    },
    {
      key: 'fallback-team-3',
      name: 'JAMES',
      role: 'Assistant Technician',
      description:
        'Supports repairs, maintenance, and installations with care, consistency, and technical attention.',
      professionalImage: '/images/team/team2.png',
      wackyImage: '/images/team/team2.png',
      imageAlt: 'James, Sixthgear assistant technician',
    },
    {
      key: 'fallback-team-4',
      name: 'CAMILLE',
      role: 'Supervisor',
      description:
        'Keeps daily operations organized while helping the team deliver a smooth customer experience.',
      professionalImage: '/images/team/team4.png',
      wackyImage: '/images/team/team4.png',
      imageAlt: 'Camille, Sixthgear supervisor',
    },
    {
      key: 'fallback-team-5',
      name: 'LIZA',
      role: 'Sales and Marketing Associate',
      description:
        'Connects riders with the right products through thoughtful service and brand communication.',
      professionalImage: '/images/team/team4.png',
      wackyImage: '/images/team/team4.png',
      imageAlt: 'Liza, Sixthgear sales and marketing associate',
    },
    {
      key: 'fallback-team-6',
      name: 'ALTHEA',
      role: 'Sales and Marketing Associate',
      description:
        'Supports customer engagement and strengthens the brand through energetic, professional communication.',
      professionalImage: '/images/team/team4.png',
      wackyImage: '/images/team/team4.png',
      imageAlt: 'Althea, Sixthgear sales and marketing associate',
    },
    {
      key: 'fallback-team-7',
      name: 'JAKE',
      role: 'Marketing Strategist',
      description:
        'Shapes campaigns and content that strengthen brand presence and deepen customer connection.',
      professionalImage: '/images/team/team4.png',
      wackyImage: '/images/team/team4.png',
      imageAlt: 'Jake, Sixthgear marketing strategist',
    },
  ],
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

type CompleteTeamMember = Omit<
  SanityTeamMemberQueryResult,
  '_key' | 'name' | 'role' | 'description' | 'photoUrl' | 'imageAlt'
> & {
  _key: string
  name: string
  role: string
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
      description: member.description,
      professionalImage: member.photoUrl,
      wackyImage: member.wackyPhotoUrl || member.photoUrl,
      imageAlt: member.imageAlt,
      instagramUrl: isNonEmptyString(member.instagramUrl)
        ? member.instagramUrl
        : undefined,
      facebookUrl: isNonEmptyString(member.facebookUrl)
        ? member.facebookUrl
        : undefined,
    })),
  }
}

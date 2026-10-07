import type { SanityVideoFeatureSection } from './types'
import { cleanOptionalSanityString } from './visual-editing'

const FALLBACK_VIDEO_URL =
  'https://res.cloudinary.com/djn9ubf6a/video/upload/v1785828228/sixthgear-trailer_aqziuc.mp4'
const FALLBACK_POSTER_URL =
  'https://res.cloudinary.com/djn9ubf6a/video/upload/so_0,w_960,q_auto,f_auto/v1785828228/sixthgear-trailer_aqziuc.jpg'

type NativeVideoMedia = {
  kind: 'native'
  url: string
  posterUrl: string | null
}

type YouTubeVideoMedia = {
  kind: 'youtube'
  videoId: string
  embedUrl: string
  posterUrl: string | null
}

export type VideoFeatureMedia = NativeVideoMedia | YouTubeVideoMedia

export type VideoFeatureContent = {
  source: 'sanity' | 'fallback'
  enabled: boolean
  media: VideoFeatureMedia
  title: string
  description: string
  videoLabel: string
  startMuted: boolean
  loop: boolean
  ctaLabel: string | null
  ctaLink: string | null
}

const FALLBACK_CONTENT: VideoFeatureContent = {
  source: 'fallback',
  enabled: true,
  media: {
    kind: 'native',
    url: FALLBACK_VIDEO_URL,
    posterUrl: FALLBACK_POSTER_URL,
  },
  title: 'The SixthGear Experience',
  description: 'Built for riders, from the workshop to the road.',
  videoLabel: 'SixthGear Moto workshop and rider experience',
  startMuted: true,
  loop: false,
  ctaLabel: 'Explore our services',
  ctaLink: '/services',
}

function clean(value: string | null | undefined): string | null {
  return cleanOptionalSanityString(value)?.trim() || null
}

export function getYouTubeVideoId(value: string): string | null {
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    let videoId: string | null = null

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null
    } else if (
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com') ||
      hostname === 'youtube-nocookie.com' ||
      hostname.endsWith('.youtube-nocookie.com')
    ) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v')
      } else {
        const parts = url.pathname.split('/').filter(Boolean)
        if (['embed', 'shorts', 'live'].includes(parts[0] ?? '')) {
          videoId = parts[1] ?? null
        }
      }
    }

    return videoId && /^[A-Za-z0-9_-]{6,}$/.test(videoId) ? videoId : null
  } catch {
    return null
  }
}

export function isCloudinaryUrl(value: string) {
  try {
    return new URL(value).hostname.toLowerCase() === 'res.cloudinary.com'
  } catch {
    return false
  }
}

function selectMedia(
  url: string,
  posterUrl: string | null,
  loop: boolean
): VideoFeatureMedia {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return { kind: 'native', url, posterUrl }

  const params = new URLSearchParams({
    enablejsapi: '1',
    playsinline: '1',
    rel: '0',
    controls: '0',
    disablekb: '1',
    origin: 'https://sixthgearmoto.com',
  })
  if (loop) {
    params.set('loop', '1')
    params.set('playlist', videoId)
  }

  return {
    kind: 'youtube',
    videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`,
    posterUrl: posterUrl || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  }
}

export function selectVideoFeatureContent(
  section: SanityVideoFeatureSection | null | undefined
): VideoFeatureContent {
  if (section?.useSanityContent !== true) return FALLBACK_CONTENT

  const uploadedUrl = clean(section.uploadedVideoUrl)
  const externalUrl = clean(section.videoUrl)
  const videoUrl = section.sourceType === 'upload' ? uploadedUrl : externalUrl

  const hasAllowedMedia =
    Boolean(videoUrl) &&
    (section.sourceType === 'upload' ||
      isCloudinaryUrl(videoUrl!) ||
      Boolean(getYouTubeVideoId(videoUrl!)))

  if (!videoUrl || !hasAllowedMedia) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Featured Video is enabled but has no usable media. Rendering the built-in trailer fallback.'
      )
    }
    return FALLBACK_CONTENT
  }

  const loop = section.loop === true
  const ctaLabel = clean(section.ctaLabel)
  const ctaLink = clean(section.ctaLink)

  return {
    source: 'sanity',
    enabled: section.enabled !== false,
    media: selectMedia(videoUrl, clean(section.posterUrl), loop),
    title: clean(section.title) || FALLBACK_CONTENT.title,
    description: clean(section.description) || FALLBACK_CONTENT.description,
    videoLabel: clean(section.videoLabel) || FALLBACK_CONTENT.videoLabel,
    startMuted: section.startMuted !== false,
    loop,
    ctaLabel: ctaLabel && ctaLink ? ctaLabel : null,
    ctaLink: ctaLabel && ctaLink ? ctaLink : null,
  }
}

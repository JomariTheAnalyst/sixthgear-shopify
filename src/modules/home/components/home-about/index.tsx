import { outfit } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import AboutStage from "./about-stage"
import { HOME_ABOUT } from "./config"
import styles from "./home-about.module.css"

const HEADING_ID = "homepage-about-heading"

/**
 * Homepage About section: a gray card with moving text rows and two
 * interlocking photos, and a black card with the copy. Two columns from
 * 1024px, stacked below (gray card first). The animated parts live in
 * AboutStage; this server part renders the text card.
 * Content lives in ./config (moves to Sanity in the later Sanity task).
 */
export default function HomeAbout() {
  const { label, heading, paragraph, checklist, button } = HOME_ABOUT
  const words = heading.split(/\s+/)

  return (
    <AboutStage labelledBy={HEADING_ID} className={`${outfit.className} antialiased`}>
      <div className={`${styles.card} ${styles.blackCard}`}>
        <div className={styles.content}>
          <p className={styles.label}>{label}</p>

          {/* Words rise one by one on reveal. */}
          <h2 id={HEADING_ID} className={styles.title}>
            {words.map((word, i) => (
              <span key={i}>
                <span className={styles.word}>
                  <span style={{ transitionDelay: `${0.55 + i * 0.05}s` }}>
                    {word}
                  </span>
                </span>
                {i < words.length - 1 && " "}
              </span>
            ))}
          </h2>

          <p className={styles.para}>{paragraph}</p>

          <ul className={styles.list}>
            {checklist.map((item, i) => {
              const delay = 1.15 + i * 0.1
              return (
                <li key={item} style={{ transitionDelay: `${delay}s` }}>
                  <svg className={styles.check} viewBox="0 0 26 26" fill="none" aria-hidden="true">
                    <circle cx="13" cy="13" r="13" />
                    <path
                      d="M8 13.4l3.2 3.1L18 9.8"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transitionDelay: `${delay + 0.2}s` }}
                    />
                  </svg>
                  {item}
                </li>
              )
            })}
          </ul>

          <LocalizedClientLink href={button.href} className={styles.btn}>
            {button.label}
          </LocalizedClientLink>
        </div>
      </div>
    </AboutStage>
  )
}

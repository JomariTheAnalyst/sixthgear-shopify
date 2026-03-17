"use client"

/**
 * Satisfied Customers Section
 * Polaroid marquee with alternating row directions
 * Paper cut design top/bottom
 */

import PolaroidCard from "./PolaroidCard"
import styles from "./polaroid.module.css"
import { lato } from "@lib/fonts"

interface CustomerItem {
  id: number
  name: string
  imageUrl: string
}

interface SatisfiedCustomersProps {
  sectionTitle?: string | null
  row1?: CustomerItem[] | null
  row2?: CustomerItem[] | null
}

const defaultRow1: CustomerItem[] = [
  { id: 1, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/002.jpg" },
  { id: 2, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/002fg.jpg" },
  { id: 3, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/003.jpg" },
  { id: 4, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/004.jpg" },
  { id: 5, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/004fg.jpg" },
  { id: 6, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/005.jpg" },
  { id: 7, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/007.jpg" },
  { id: 8, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/009.jpg" },
  { id: 9, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/010fg.jpg" },
]

const defaultRow2: CustomerItem[] = [
  { id: 10, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/011fg.jpg" },
  { id: 11, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/012.jpg" },
  { id: 12, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/012fg.jpg" },
  { id: 13, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/013.jpg" },
  { id: 14, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/014.jpg" },
  { id: 15, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/015.jpg" },
  { id: 16, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/016.jpg" },
  { id: 17, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/018.jpg" },
  { id: 18, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/019.jpg" },
  { id: 19, name: "Sixth Gear Rider", imageUrl: "/images/polaroid-marquee/satisfied-customers/111.jpg" },
]

// Generate random rotation for each card (-3 to 3 degrees)
const getRotation = (index: number) => {
  const rotations = [-3, -1.5, 0, 1.5, 3, -2, 2, -1, 1]
  return rotations[index % rotations.length]
}

export default function SatisfiedCustomers({
  sectionTitle,
  row1,
  row2,
}: SatisfiedCustomersProps) {
  const activeTitle = sectionTitle || "Sixthgear Satisfied Customers"
  const activeRow1 = row1 && row1.length > 0 ? row1 : defaultRow1
  const activeRow2 = row2 && row2.length > 0 ? row2 : defaultRow2

  const rows = [
    {
      direction: "left" as const,
      speedSec: 45,
      items: activeRow1,
    },
    {
      direction: "right" as const,
      speedSec: 50,
      items: activeRow2,
    },
  ]

  return (
    <section className="relative">
      {/* Top Paper Cut */}
      <div className="w-full -mb-1">
        <img
          src="/images/polaroid-marquee/top.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Main Section */}
      <div className="bg-[#0A0A0A] relative overflow-hidden">
        <div className="py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 px-4">
            <h2
              className={`${lato.className} text-4xl md:text-6xl lg:text-7xl tracking-[0.04em] text-white`}
            >
              {activeTitle}
            </h2>
          </div>

          {/* Marquee Rows */}
          <div className="space-y-6 md:space-y-8">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="overflow-hidden">
                <div
                  className={`
                    flex gap-4 md:gap-6 w-max
                    ${
                      row.direction === "left"
                        ? styles.marqueeLeft
                        : styles.marqueeRight
                    }
                    ${styles.marqueeTrack}
                  `}
                  style={
                    { "--duration": `${row.speedSec}s` } as React.CSSProperties
                  }
                >
                  {/* Original items */}
                  {row.items.map((item, itemIndex) => (
                    <PolaroidCard
                      key={`original-${item.id}-${itemIndex}`}
                      item={{ image: item.imageUrl, label: item.name }}
                      rotation={getRotation(itemIndex)}
                    />
                  ))}
                  {/* Duplicated items for seamless loop */}
                  {row.items.map((item, itemIndex) => (
                    <PolaroidCard
                      key={`duplicate-${item.id}-${itemIndex}`}
                      item={{ image: item.imageUrl, label: item.name }}
                      rotation={getRotation(itemIndex)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Paper Cut */}
      <div className="w-full -mt-1">
        <img
          src="/images/polaroid-marquee/bottom.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>
    </section>
  )
}

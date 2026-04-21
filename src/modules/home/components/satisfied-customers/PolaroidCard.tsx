import Image from "next/image"
import { CustomerItem } from "./rows.data"
import { handwritten } from "@lib/fonts"
import styles from "./polaroid.module.css"

interface PolaroidCardProps {
  item: CustomerItem
  rotation?: number
}

export default function PolaroidCard({
  item,
  rotation = 0,
}: PolaroidCardProps) {
  return (
    <div
      className={`
        relative flex-shrink-0 w-[240px] md:w-[300px] lg:w-[340px]
        bg-[#F5F5F0] rounded-sm shadow-xl
        transition-transform duration-300 hover:scale-105 hover:z-10
        ${styles.paperGrain}
      `}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Photo area */}
      <div className="p-2 md:p-3 pb-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
          <Image
            src={item.image}
            alt={item.label}
            fill
            sizes="(max-width: 767px) 240px, (max-width: 1023px) 300px, 340px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Label area - larger bottom like classic polaroid */}
      <div className="px-2 md:px-3 py-4 md:py-5 text-center">
        <span
          className={`${handwritten.className} text-gray-700 text-sm md:text-base`}
          style={{
            fontSize: "1.1rem",
          }}
        >
          {item.label}
        </span>
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { cn } from "@lib/utils"

interface TextRollProps {
  children: string
  className?: string
  transition?: any
  center?: boolean
}

export function TextRoll({
  children,
  className,
  transition = { duration: 0.4 },
  center = false,
}: TextRollProps) {
  const letters = children.split("")

  return (
    <div
      className={cn(
        "relative overflow-hidden inline-flex",
        center ? "justify-center" : "justify-start",
        className
      )}
    >
      <motion.div
        className="flex"
        initial="initial"
        whileHover="hover"
      >
        <span className="sr-only">{children}</span>
        {letters.map((l, i) => (
          <div key={i} className="relative inline-block overflow-hidden" aria-hidden="true">
            <motion.span
              variants={{
                initial: { y: 0 },
                hover: { y: "-100%" },
              }}
              transition={{ ...transition, delay: i * 0.03 }}
              className="inline-block"
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
            <motion.span
              variants={{
                initial: { y: "100%" },
                hover: { y: 0 },
              }}
              transition={{ ...transition, delay: i * 0.03 }}
              className="absolute left-0 top-0 inline-block"
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

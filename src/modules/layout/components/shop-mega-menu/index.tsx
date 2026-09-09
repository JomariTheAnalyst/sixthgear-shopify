"use client"

import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SHOP_MENU_ITEMS, type ShopMenuItem } from "./data"

type ShopMegaMenuProps = {
  onNavigate: () => void
}

function ShopMegaMenuCard({
  item,
  onNavigate,
}: {
  item: ShopMenuItem
  onNavigate: () => void
}) {
  const usesLightTitle = item.titleTone === "light"

  return (
    <LocalizedClientLink
      href={item.href}
      onClick={onNavigate}
      data-shop-menu-card
      className="group relative aspect-[366/436] min-w-0 overflow-hidden rounded-[14px] bg-[#f3f3f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]"
      aria-label={`Shop ${item.title}`}
    >
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 1279px) 16vw, (max-width: 2239px) 16vw, 366px"
        className={`transition-transform duration-300 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02] ${
          item.imageFit === "cover"
            ? "object-cover"
            : "object-contain p-[8%] pt-[14%]"
        }`}
      />

      {usesLightTitle ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
      ) : null}

      <h3
        className={`pointer-events-none absolute left-3 top-3 z-10 max-w-[90%] text-[clamp(0.82rem,1.45vw,1.65rem)] font-bold leading-[1.02] tracking-[-0.035em] xl:left-4 xl:top-4 ${
          usesLightTitle ? "text-white" : "text-[#111111]"
        }`}
      >
        {item.title}
      </h3>
    </LocalizedClientLink>
  )
}

export default function ShopMegaMenu({ onNavigate }: ShopMegaMenuProps) {
  return (
    <div className="w-full bg-white" aria-label="Shop categories">
      <div className="mx-auto grid w-full grid-cols-6 gap-2 px-2 py-2 xl:px-3 xl:py-3 2xl:grid-cols-[repeat(6,minmax(0,366px))] 2xl:justify-center">
        {SHOP_MENU_ITEMS.map((item) => (
          <ShopMegaMenuCard
            key={item.href}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  )
}

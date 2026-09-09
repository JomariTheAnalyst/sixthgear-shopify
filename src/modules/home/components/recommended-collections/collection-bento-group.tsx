import CollectionBentoTile from "./collection-bento-tile"
import type { HomeCollectionItem } from "./data"

/**
 * Renders one bento group of up to three collections.
 *
 * A full group is one large tile plus two stacked small tiles. Consecutive
 * groups alternate which side the large tile sits on so a 4-6 item list does
 * not read as the same block repeated.
 *
 * Responsive ladder:
 * - base (<512px)      single column stack
 * - xsmall (512px+)    large tile full width, two small tiles side by side
 * - small (1024px+)    true bento, large tile spanning both rows
 */
export type BentoGroupVariant = "large-left" | "large-right"

const GRID =
  "grid grid-cols-1 gap-4 xsmall:grid-cols-2 small:gap-5 small:h-[620px] medium:h-[700px] large:h-[760px]"

/** Slightly wider large column, mirroring the reference composition. */
const FULL_GROUP_GRID = "small:grid-cols-[1.12fr_1fr] small:grid-rows-2"

const PLACEMENT: Record<
  BentoGroupVariant,
  { large: string; first: string; second: string }
> = {
  "large-left": {
    large:
      "xsmall:col-span-2 small:col-span-1 small:col-start-1 small:row-start-1 small:row-span-2",
    first: "small:col-start-2 small:row-start-1",
    second: "small:col-start-2 small:row-start-2",
  },
  "large-right": {
    large:
      "xsmall:col-span-2 small:col-span-1 small:col-start-2 small:row-start-1 small:row-span-2",
    first: "small:col-start-1 small:row-start-1",
    second: "small:col-start-1 small:row-start-2",
  },
}

type CollectionBentoGroupProps = {
  items: HomeCollectionItem[]
  variant: BentoGroupVariant
}

export default function CollectionBentoGroup({
  items,
  variant,
}: CollectionBentoGroupProps) {
  if (items.length === 0) {
    return null
  }

  // Partial trailing group: keep it clean rather than forcing a hole into the
  // bento. Equal-size tiles on one row read as intentional; a gap does not.
  if (items.length < 3) {
    return (
      <div className={`${GRID} small:grid-rows-1`}>
        {items.map((item) => (
          <CollectionBentoTile
            key={item.key}
            item={item}
            size="large"
            className={items.length === 1 ? "xsmall:col-span-2" : ""}
          />
        ))}
      </div>
    )
  }

  const [large, first, second] = items
  const placement = PLACEMENT[variant]

  return (
    <div className={`${GRID} ${FULL_GROUP_GRID}`}>
      <CollectionBentoTile
        item={large}
        size="large"
        className={placement.large}
      />
      <CollectionBentoTile
        item={first}
        size="small"
        className={placement.first}
      />
      <CollectionBentoTile
        item={second}
        size="small"
        className={placement.second}
      />
    </div>
  )
}

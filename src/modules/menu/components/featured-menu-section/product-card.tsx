import type { FeaturedMenuProduct } from "./types"

type ProductCardProps = {
  item: FeaturedMenuProduct
  onAddClick: (item: FeaturedMenuProduct) => void
}

const ProductCard = ({ item, onAddClick }: ProductCardProps) => {
  return (
    <article className="flex w-[238px] flex-none flex-col sm:w-[266px] md:w-[280px] lg:w-[calc(33.333%-16px)]">
      <div className="relative h-[356px] overflow-hidden rounded-[10px] bg-white shadow-[0_14px_28px_rgba(17,17,17,0.055)] sm:h-[382px]">
        <div className="relative z-10 px-4 pt-5 text-center sm:pt-6">
          <p
            className="mb-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#111]/70 sm:text-[10px]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            First Gear Coffee
          </p>
          <h3
            className="mx-auto min-h-[40px] max-w-[220px] text-[22px] font-black uppercase leading-[0.92] tracking-[-0.06em] text-[#111] sm:text-[25px]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {item.name}
          </h3>
        </div>

        <div className="absolute inset-x-0 bottom-[58px] top-[86px] flex items-center justify-center overflow-visible px-2 sm:bottom-[62px] sm:top-[94px]">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full scale-[1.42] object-contain object-center sm:scale-[1.5]"
          />
        </div>

        <p className="sr-only">{item.description}</p>

        <div className="absolute inset-x-0 bottom-0 grid grid-cols-[auto_1fr] items-end">
          <div className="rounded-tr-[12px] bg-[#f5f1e8] pr-1.5 pt-1.5">
            <button
              type="button"
              onClick={() => onAddClick(item)}
              className="rounded-[6px] bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.11em] text-[#111] shadow-[0_6px_16px_rgba(17,17,17,0.055)] transition-colors hover:bg-[#111] hover:text-white sm:px-3.5 sm:text-[12px]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Add to cart
            </button>
          </div>
          <div className="flex h-[44px] items-center justify-end gap-2 rounded-tl-[12px] bg-white px-3 sm:h-[48px] sm:px-4">
            {item.isOnSale && item.compareAtPrice && (
              <span
                className="whitespace-nowrap text-[15px] font-black tracking-[-0.05em] text-[#111]/45 line-through sm:text-[17px]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {item.compareAtPrice}
              </span>
            )}
            <span
              className={`whitespace-nowrap text-[20px] font-black tracking-[-0.06em] sm:text-[22px] ${
                item.isOnSale ? "text-[#e62020]" : "text-[#111]"
              }`}
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {item.price}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard

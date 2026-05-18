"use client"

import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import {
  getVariantImageForOptionValue,
  isOptionValueAvailable,
} from "@lib/util/variant-helpers"

type VisualOptionSelectorProps = {
  option: HttpTypes.StoreProductOption
  variants: HttpTypes.StoreProductVariant[] | undefined
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  currentSelections: Record<string, string | undefined>
  disabled?: boolean
  inventoryMap?: Record<string, number>
}

export default function VisualOptionSelector({
  option,
  variants,
  current,
  updateOption,
  currentSelections,
  disabled,
  inventoryMap,
}: VisualOptionSelectorProps) {
  const optionValues = (option.values ?? []).map((value) => value.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-semibold text-gray-900">
        {option.title}{" "}
        {current && (
          <span className="font-normal text-gray-500">{current}</span>
        )}
      </span>
      <div
        className="flex flex-wrap gap-3"
        role="radiogroup"
        aria-label={`Select ${option.title}`}
      >
        {optionValues.map((value) => {
          const isSelected = value === current
          const isAvailable = isOptionValueAvailable(
            variants,
            option.id,
            value,
            currentSelections,
            inventoryMap
          )
          const variantImage = getVariantImageForOptionValue(
            variants,
            option.id,
            value
          )

          return (
            <button
              key={value}
              type="button"
              onClick={() => updateOption(option.id, value)}
              disabled={disabled || !isAvailable}
              className={`
                group flex w-20 flex-col items-center gap-2 transition-all duration-200
                focus:outline-none
                ${
                  !isAvailable
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer hover:-translate-y-0.5"
                }
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
              `}
              aria-label={`${value}${!isAvailable ? " (unavailable)" : ""}`}
              aria-checked={isSelected}
              role="radio"
              title={value}
              data-testid="visual-option-button"
            >
              <span
                className={`
                  relative h-16 w-16 overflow-hidden rounded-lg border bg-gray-50 transition-all duration-200
                  ${
                    isSelected
                      ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                      : "border-gray-200 group-hover:border-gray-900"
                  }
                `}
              >
                {variantImage?.url ? (
                  <Image
                    src={variantImage.url}
                    alt={variantImage.altText || value}
                    fill
                    sizes="64px"
                    className="object-contain p-1.5"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] font-semibold uppercase leading-tight text-gray-500">
                    {value}
                  </span>
                )}

                {!isAvailable && (
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="h-0.5 w-full rotate-45 bg-gray-500/80" />
                  </span>
                )}
              </span>
              <span
                className={`max-w-full text-center text-xs leading-tight ${
                  isSelected ? "font-semibold text-gray-900" : "text-gray-500"
                }`}
              >
                {value}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

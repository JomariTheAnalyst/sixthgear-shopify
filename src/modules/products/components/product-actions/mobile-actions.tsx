"use client"

import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment, useEffect, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"
import { isColorOption, isSizeOption } from "@lib/util/variant-helpers"
import ColorSwatch from "./color-swatch"
import SizeSelector from "./size-selector"
import GenericOptionSelector from "./generic-option-selector"
import { cn } from "@lib/util/cn"
import { ShoppingCart, ChevronDown } from "lucide-react"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (optionId: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  useEffect(() => {
    if (show) {
      document.body.setAttribute("data-pdp-mobile-actions", "true")
    } else {
      document.body.removeAttribute("data-pdp-mobile-actions")
    }

    return () => {
      document.body.removeAttribute("data-pdp-mobile-actions")
    }
  }, [show])

  // Render the appropriate selector based on option type
  const renderOptionSelector = (option: HttpTypes.StoreProductOption) => {
    const commonProps = {
      option,
      variants: product.variants ?? undefined,
      current: options[option.id],
      updateOption: updateOptions,
      currentSelections: options,
      disabled: optionsDisabled,
    }

    if (isColorOption(option)) {
      return <ColorSwatch key={option.id} {...commonProps} />
    }

    if (isSizeOption(option)) {
      return <SizeSelector key={option.id} {...commonProps} />
    }

    return <GenericOptionSelector key={option.id} {...commonProps} />
  }

  if (!show) return null

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg lg:hidden"
        role="region"
        aria-label="Add to cart"
      >
        <div className="max-w-[1440px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate text-sm">
                {product.title}
              </p>
              {selectedPrice && (
                <p className="text-lg font-bold text-slate-900">
                  {selectedPrice.calculated_price}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Options button (if multi-variant) */}
              {!isSimple && (
                <button
                  onClick={open}
                  className="flex items-center gap-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  data-testid="mobile-actions-button"
                >
                  <span>
                    {variant
                      ? Object.values(options).filter(Boolean).join(" / ")
                      : "Options"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock || !variant}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                data-testid="mobile-cart-button"
              >
                {isAdding ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                    <span className="hidden sm:inline">
                      {!variant
                        ? "Select"
                        : !inStock
                        ? "Sold Out"
                        : "Add to Cart"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-slate-900 flex justify-center items-center shadow-lg"
                      data-testid="close-modal-button"
                      aria-label="Close options"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-8 rounded-t-2xl max-h-[70vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">
                      Select Options
                    </h3>
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) =>
                          renderOptionSelector(option)
                        )}
                      </div>
                    )}

                    {/* Selected summary */}
                    {Object.values(options).some(Boolean) && (
                      <div className="mt-6 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600">
                          Selected:{" "}
                          <span className="font-medium text-slate-900">
                            {Object.values(options).filter(Boolean).join(" • ")}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Done button */}
                    <div className="mt-6">
                      <button
                        onClick={close}
                        className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions

import Image from "next/image"

/**
 * BIR Registration Seal Badge (BIR RMC 38-2026). Served unoptimized and never
 * cropped so the QR code stays sharp and scannable.
 */
export default function BirSealBadge() {
  return (
    <Image
      src="/images/bir/bir-seal.jpg"
      alt="BIR Registration Seal Badge with QR code for verifying Sixthgear's registration with the Bureau of Internal Revenue"
      width={982}
      height={607}
      unoptimized
      className="w-full max-w-[720px] h-auto"
    />
  )
}

import Image from "next/image"

type LogoProps = {
  variant?: "navbar" | "text"
}

const Logo = ({ variant = "text" }: LogoProps) => {
  if (variant === "navbar") {
    return (
      <Image
        src="/images/logo/SIXTHGEAR MOTO - plain text.png"
        alt="SixthGear Moto"
        width={11492}
        height={803}
        priority
        sizes="(max-width: 639px) 148px, (max-width: 767px) 190px, (max-width: 1023px) 240px, (max-width: 1279px) 280px, 320px"
        className="h-auto w-[148px] max-w-[40vw] object-contain sm:w-[190px] sm:max-w-none md:w-[240px] lg:w-[280px] xl:w-[320px]"
      />
    )
  }

  return (
    <div className="whitespace-nowrap font-sans text-base font-black uppercase leading-none tracking-tighter sm:text-xl md:text-2xl">
      SIXTHGEAR MOTO
    </div>
  )
}

export default Logo


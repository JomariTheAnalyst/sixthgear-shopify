import Image from "next/image"

type LogoProps = {
  variant?: "navbar" | "navbarCompact" | "text"
}

const Logo = ({ variant = "text" }: LogoProps) => {
  if (variant === "navbar" || variant === "navbarCompact") {
    return (
      <Image
        src="/images/logo/SIXTHGEAR MOTO - plain text.png"
        alt="SixthGear Moto"
        width={11492}
        height={803}
        priority
        sizes={
          variant === "navbarCompact"
            ? "(max-width: 1279px) 208px, (max-width: 1535px) 268px, 300px"
            : "(max-width: 639px) 148px, (max-width: 767px) 190px, (max-width: 1023px) 240px, (max-width: 1279px) 280px, 320px"
        }
        className={
          variant === "navbarCompact"
            ? "h-auto w-[208px] scale-y-[1.08] object-contain xl:w-[268px] 2xl:w-[300px]"
            : "h-auto w-[148px] max-w-[40vw] object-contain sm:w-[190px] sm:max-w-none md:w-[240px] lg:w-[280px] xl:w-[320px]"
        }
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


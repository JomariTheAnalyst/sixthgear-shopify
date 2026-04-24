import Image from "next/image"
import Link from "next/link"

import { inter } from "@lib/fonts"

type NotFoundPageProps = {
  homeHref: string
}

export default function NotFoundPage({ homeHref }: NotFoundPageProps) {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f48141]">
      <div className="relative flex min-h-screen flex-col justify-between px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-6 lg:px-8 lg:pb-8">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          <div className="relative hidden w-full max-w-[1720px] md:block">
            <img
              src="/images/404/follow.art-0.svg"
              alt="Page not found"
              className="block h-auto w-full select-none"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-[34vw] w-[34vw] max-h-[360px] max-w-[360px] min-h-[190px] min-w-[190px] translate-y-[4%]">
                <Image
                  src="/images/404/title-decoration.png"
                  alt=""
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-[420px] md:hidden">
            <img
              src="/images/404/follow.art-1.svg"
              alt="Page not found"
              className="block h-auto w-full select-none"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-[128px] w-[128px] translate-y-[-4%]">
                <Image
                  src="/images/404/title-decoration.png"
                  alt=""
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href={homeHref}
            className="flex w-full max-w-[300px] items-end justify-between bg-black px-4 py-4 text-white transition-transform duration-300 hover:translate-y-[-2px] md:max-w-[320px] md:px-5 md:py-5"
          >
            <span
              className={`${inter.className} text-base font-medium leading-none md:text-[18px]`}
            >
              Go to homepage
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/55 text-sm">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

import type { ReactNode } from 'react'

interface LeftRightSectionProps {
  imageOnLeft?: boolean
  image: ReactNode
  children: ReactNode
  className?: string
  beforeRow?: ReactNode
  afterRow?: ReactNode
}

export default function LeftRightSection({
  imageOnLeft = false,
  image,
  children,
  className = 'bg-white',
  beforeRow,
  afterRow,
}: LeftRightSectionProps) {
  return (
    <section className={`${className} py-[80px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[120px] 2xl:px-[273px]`}>
      {beforeRow}
      <div className="mx-auto flex flex-col items-center gap-[60px] md:flex-row md:items-center md:justify-center max-w-[1440px]">
        {imageOnLeft && <div className="w-full max-w-[490px]">{image}</div>}
        <div className="flex flex-col gap-[23px] items-start w-full max-w-[490px]">{children}</div>
        {!imageOnLeft && <div className="w-full max-w-[490px]">{image}</div>}
      </div>
      {afterRow}
    </section>
  )
}

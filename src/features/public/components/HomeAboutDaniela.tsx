import { ArrowRight } from 'lucide-react'
import strengthImage from '../../../assets/home-strength.png'
import { container, eyebrow, textCta } from './styles'

export default function HomeAboutDaniela() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-8 bg-[#e7ebe4]">
      <div className={`${container} grid !px-0 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-16 md:!px-10 md:py-20 lg:!px-20 lg:py-28`}>
        <div className="relative h-[430px] overflow-hidden sm:h-[560px] md:h-full md:min-h-[650px]">
          <img src={strengthImage} alt="Portrait of a woman holding a dumbbell, looking ahead in a sunlit studio" loading="lazy" width={1536} height={1024} className="absolute left-0 top-0 h-full w-full scale-[3] object-cover object-[74%_center] origin-[75%_12%]" />
        </div>
        <div className="px-6 py-12 sm:px-10 md:px-0 md:py-0">
          <p className={`${eyebrow} !text-[9px]`}>The philosophy behind the movement</p>
          <h2 id="about-title" className="mt-7 text-[40px] font-semibold leading-[1.04] tracking-[-0.05em] sm:text-[52px] md:text-[clamp(44px,5.2vw,74px)]">Strong for<span className="hidden md:inline"><br /></span><span className="md:hidden"> </span>today.<br /><span className="text-primary-dark">Ready for tomorrow.</span></h2>
          <div className="mt-8 space-y-5 text-[16px] leading-[1.8] text-muted-foreground md:mt-10 md:text-[14px] lg:text-[15px]"><p>This is a space for women who want to feel stronger, move with confidence and invest in their future selves.</p><p>From your first session to your next milestone, the focus is simple: build strength that supports the life you want to live.</p></div>
          <a href="#approach" className={`${textCta} mt-8 md:mt-10`}>My approach <ArrowRight size={16} aria-hidden="true" /></a>
          <p className="mt-9 text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:mt-12">Daniela Brito</p>
        </div>
      </div>
    </section>
  )
}

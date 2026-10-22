import { ArrowRight } from 'lucide-react'
import strengthImage from '../../../assets/home-strength.png'
import { container, eyebrow, primaryCta, textCta } from './styles'

export default function HomeHero() {
  return (
    <section aria-labelledby="home-title" className={`${container} grid !px-0 md:relative md:min-h-[700px] md:!px-10 lg:min-h-[820px] lg:!px-20`}>
      <div className="relative h-[440px] overflow-hidden sm:h-[580px] md:absolute md:inset-y-0 md:right-10 md:h-auto md:w-[36%] lg:right-20">
        <img src={strengthImage} alt="A woman holding a dumbbell in a deep squat, photographed in a sunlit studio" fetchPriority="high" width={1536} height={1024} className="h-full w-full object-cover object-[72%_center]" />
        <p className="absolute right-5 top-[34%] text-[8px] uppercase leading-relaxed tracking-[0.2em] md:bottom-5 md:left-5 md:right-auto md:top-auto">Discipline<span className="block">builds</span>freedom<span className="mt-3 block w-6 border-t border-primary-dark md:hidden" /></p>
      </div>
      <div className="relative px-6 pb-10 pt-10 sm:px-10 md:px-0 md:pb-14 md:pt-20 lg:pt-24">
        <p className={eyebrow}>Stronger. Healthier. More capable.</p>
        <h1 id="home-title" className="relative mt-8 text-[clamp(43px,10.8vw,72px)] font-semibold leading-[0.99] tracking-[-0.055em] md:mt-16 md:text-[clamp(76px,9.1vw,132px)]">
          A STRONGER<br />YOU FOR<br /><span className="text-primary-dark">WHAT’S<span className="md:hidden"><br /></span><span className="hidden md:inline"> </span>NEXT.</span>
        </h1>
        <div className="mt-8 md:mt-16 md:grid md:w-[59%] md:grid-cols-[1.6fr_1fr] md:items-start md:gap-8 lg:gap-14">
          <p className="max-w-lg text-[16px] leading-[1.75] text-muted-foreground md:text-[13px] lg:text-[15px]">Science-backed training, real-life strategies and personalized support for women in their 40s, 50s and beyond — so you can feel strong, confident and independent for decades to come.</p>
          <div className="mt-8 md:mt-1">
            <a href="#programs" className={`${primaryCta} w-full`}>Explore programs <ArrowRight size={16} className="shrink-0" aria-hidden="true" /></a>
            <a href="#about" className={`${textCta} mt-4 border-transparent`}>Meet Daniela <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

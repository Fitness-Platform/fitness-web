import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import editorialImage from '../../../assets/home-editorial.png'
import strengthImage from '../../../assets/home-strength.png'
import { container, eyebrow } from './styles'

const programs = [
  { number: '01', duration: '6 WEEKS', title: 'Strength & Structure', description: 'Build strength, improve body composition and feel stronger in everyday life.', image: editorialImage, imageClass: 'h-full w-[200%] max-w-none object-cover object-top', alt: 'A woman practicing a dumbbell curl in a warm studio' },
  { number: '02', duration: '12 WEEKS', title: 'Rebalance', description: 'A thoughtful approach to strength, energy and the changes that come with midlife.', image: strengthImage, imageClass: 'h-full w-full object-cover object-[73%_center]', alt: 'A woman practicing a weighted squat' },
  { number: '03', duration: '4 WEEKS', title: 'Mobility & Longevity', description: 'Move better, feel better and build the freedom to keep doing what you love.', image: editorialImage, imageClass: 'h-full w-[200%] max-w-none -translate-x-1/2 object-cover', alt: 'A woman walking along a sunlit garden path' },
]

export default function HomePrograms() {
  return (
    <section id="programs" aria-labelledby="programs-title" className={`${container} scroll-mt-8 pb-16 md:pb-28`}>
      <div className="border-t border-border pt-12 md:flex md:items-end md:justify-between md:gap-16 md:pt-16">
        <div><p className={eyebrow}>Your next chapter starts here</p><h2 id="programs-title" className="mt-6 max-w-[540px] text-[42px] font-semibold leading-[1.04] tracking-[-0.05em] sm:text-[54px] md:text-[clamp(54px,6vw,84px)]">Find your<br />strength.</h2></div>
        <p className="mt-5 max-w-sm text-[16px] leading-[1.8] text-muted-foreground md:max-w-[270px] md:pb-2 md:text-[14px]">Thoughtful programs. Lasting foundations. A place to begin.</p>
      </div>
      <div className="mt-9 grid gap-8 md:mt-12 md:grid-cols-[1.18fr_1fr] md:gap-x-12 md:gap-y-10">
        {programs.map((program, index) => <article key={program.number} className={index === 0 ? 'border-b border-border pb-6 md:row-span-2 md:self-start' : 'grid grid-cols-[0.8fr_1.2fr] gap-5 border-b border-border pb-6 md:block'}>
          <Link to="/register" aria-label={`Get started with ${program.title}`} className={`relative block overflow-hidden ${index === 0 ? 'aspect-[1.1]' : 'min-h-44 md:aspect-[2.2] md:min-h-0'}`}>
            <img src={program.image} alt={program.alt} loading="lazy" width={1536} height={1024} className={program.imageClass} />
            {index === 0 && <span className="absolute left-5 top-5 bg-background px-4 py-3 text-[10px] font-medium uppercase tracking-[0.12em]">Strength</span>}
          </Link>
          <div className={index === 0 ? 'pt-6' : 'md:pt-5'}>
            <p className={`${eyebrow} !text-[9px]`}>{program.number} · {program.duration}</p>
            <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.04em] lg:text-[30px]"><Link to="/register" className="group flex min-h-11 items-start justify-between gap-3 hover:text-primary-dark">{program.title}<ArrowRight size={21} className="mt-1 shrink-0" aria-hidden="true" /></Link></h3>
            <p className="mt-2 text-[14px] leading-[1.8] text-muted-foreground md:text-[13px] lg:text-[14px]">{program.description}</p>
          </div>
        </article>)}
      </div>
    </section>
  )
}

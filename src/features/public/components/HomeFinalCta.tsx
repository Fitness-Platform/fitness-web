import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { container, eyebrow, primaryCta } from './styles'

export default function HomeFinalCta() {
  return (
    <section id="work-with-me" aria-labelledby="journey-title" className={`${container} scroll-mt-8 py-16 md:py-28 lg:py-32`}>
      <p className={eyebrow}>Your strength. Your next chapter.</p>
      <h2 id="journey-title" className="mt-7 text-[clamp(49px,12vw,80px)] font-semibold leading-[1.02] tracking-[-0.055em] md:mt-10 md:text-[clamp(90px,12.5vw,180px)]">Let’s build<br /><span className="text-primary-dark">what’s next.</span></h2>
      <div className="mt-8 md:mt-14 md:flex md:items-center md:justify-between md:gap-10 md:border-t md:border-border md:pt-10">
        <p className="max-w-[400px] text-[16px] leading-[1.8] text-muted-foreground md:text-[15px]">You don’t have to have it all figured out. Just a place to start.</p>
        <div className="mt-8 md:mt-0 md:w-[280px]"><Link to="/register" className={`${primaryCta} w-full`}>Start your journey <ArrowRight size={16} aria-hidden="true" /></Link><p className="mt-5 text-[13px] text-muted-foreground">Already a member? <Link to="/login" className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4">Sign in</Link></p></div>
      </div>
    </section>
  )
}

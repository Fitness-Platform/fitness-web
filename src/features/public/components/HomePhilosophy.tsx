import { container, eyebrow } from './styles'

export default function HomePhilosophy() {
  return (
    <section id="approach" aria-labelledby="approach-title" className={`${container} scroll-mt-8 py-14 md:py-24 lg:py-32`}>
      <p className={eyebrow}>Built around your life</p>
      <div className="mt-6 grid gap-8 md:grid-cols-[1.3fr_1fr] md:gap-16 lg:gap-28">
        <h2 id="approach-title" className="text-[clamp(38px,9.5vw,56px)] font-semibold leading-[1.04] tracking-[-0.05em] md:text-[clamp(50px,6.3vw,90px)]">More than<span className="hidden md:inline"><br /></span><span className="md:hidden"> </span>a workout.<span className="text-primary-dark"><span className="hidden md:inline"><br /></span><span className="md:hidden"> </span>A stronger<span className="hidden md:inline"><br /></span><span className="md:hidden"> </span>way forward.</span></h2>
        <div className="md:pt-7">
          <p className="text-[16px] leading-[1.8] text-muted-foreground md:text-[14px] lg:text-[15px]">Your body changes. Your strength can keep growing. A balanced approach to training, movement and wellbeing helps you feel capable in every chapter.</p>
          <ol className="mt-8 border-t border-border md:mt-12">{['Purposeful strength training', 'Sustainable, everyday habits', 'Progress at your own pace'].map((principle, index) => <li key={principle} className="flex min-h-16 items-center justify-between gap-5 border-b border-border py-4 text-[16px] leading-snug"><span className="md:max-w-[210px]">{principle}</span><span aria-hidden="true" className="hidden text-[10px] tracking-[0.15em] text-primary-dark md:inline">{['I', 'II', 'III'][index]}</span></li>)}</ol>
        </div>
      </div>
    </section>
  )
}

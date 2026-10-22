import { container } from './styles'

export default function HomePrinciples() {
  return (
    <div className={container}>
      <ol aria-label="Our principles" className="grid border-y border-border md:grid-cols-3">
        {['Science-backed.', 'Real-life focused.', 'Long-term results.'].map((principle, index) => <li key={principle} className="flex items-center gap-5 border-b border-border py-5 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:py-9 md:first:pl-0 md:last:border-r-0 lg:gap-6 lg:px-10"><span className="text-[9px] tracking-[0.25em] text-primary-dark">0{index + 1}</span><span className="text-[18px] font-medium tracking-[-0.025em] lg:text-[21px]">{principle}</span></li>)}
      </ol>
    </div>
  )
}

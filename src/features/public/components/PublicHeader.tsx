import { useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { container, textCta } from './styles'

export default function PublicHeader() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  function closeMenu() { setOpen(false) }

  return (
    <header className="border-b border-border">
      <div className={`${container} flex min-h-24 flex-wrap items-center justify-between gap-x-6 py-6 lg:min-h-28`} onKeyDown={event => {
        if (event.key === 'Escape' && open) { closeMenu(); toggle.current?.focus() }
      }}>
        <Link to="/" onClick={closeMenu} aria-label="Daniela Brito home" className="shrink-0 text-[16px] font-medium tracking-[0.28em] sm:text-[19px]">
          DANIELA BRITO
          <span className="mt-2 block text-[7px] tracking-[0.28em] text-primary-dark sm:text-[8px]">STRENGTH FOR WHAT’S NEXT</span>
        </Link>
        <button ref={toggle} type="button" className="-mr-3 flex size-12 items-center justify-center md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="public-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
        <nav id="public-navigation" aria-label="Main navigation" className={`${open ? 'flex' : 'hidden'} order-3 w-full flex-col gap-1 border-t border-border pt-5 md:order-none md:flex md:w-auto md:flex-row md:items-center md:gap-5 md:border-0 md:pt-0 lg:gap-10`}>
          {[['PROGRAMS', '#programs'], ['MY APPROACH', '#approach'], ['ABOUT', '#about']].map(([label, href]) => <a key={href} href={href} onClick={closeMenu} className="flex min-h-11 items-center text-[10px] tracking-[0.16em] hover:text-primary-dark">{label}</a>)}
          <Link to="/login" onClick={closeMenu} className="flex min-h-11 items-center text-[10px] tracking-[0.16em] hover:text-primary-dark">MEMBER LOGIN</Link>
          <a href="#work-with-me" onClick={closeMenu} className={`${textCta} mt-2 w-fit md:hidden`}>WORK WITH ME <ArrowRight size={15} aria-hidden="true" /></a>
        </nav>
        <div className="hidden md:block"><a href="#work-with-me" className={textCta}>WORK WITH ME <ArrowRight size={15} aria-hidden="true" /></a></div>
      </div>
    </header>
  )
}

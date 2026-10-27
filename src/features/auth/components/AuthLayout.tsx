import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { authLink } from './authStyles'

type AuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
  alternative: string
  linkText: string
  linkTo: string
}

export default function AuthLayout({ title, description, children, alternative, linkText, linkTo }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-7 sm:px-12 sm:py-9 lg:px-24">
        <Link to="/" aria-label="Daniela Brito home" className="block">
          <span className="font-[Georgia,serif] text-xl tracking-[0.2em] sm:text-[26px]">DANIELA BRITO</span>
          <span className="mt-1.5 block text-[7px] tracking-[0.4em] sm:text-[9px]">STRENGTH FOR WHAT’S NEXT</span>
        </Link>
        <Link to="/" className="inline-flex min-h-11 items-center gap-3 text-xs hover:text-primary-dark sm:text-sm">
          <ArrowLeft size={16} aria-hidden="true" /> Back to website
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-10 pt-5 sm:px-12 sm:py-12">
        <section aria-labelledby="auth-title" className="relative w-full max-w-[720px] lg:before:absolute lg:before:bottom-36 lg:before:left-0 lg:before:top-20 lg:before:w-px lg:before:bg-border lg:after:absolute lg:after:bottom-36 lg:after:right-0 lg:after:top-20 lg:after:w-px lg:after:bg-border">
          <div aria-hidden="true" className="mx-auto mb-9 flex max-w-[340px] items-center gap-6 sm:mb-11">
            <span className="h-px flex-1 bg-border" /><span className="size-3.5 rotate-45 bg-primary" /><span className="h-px flex-1 bg-border" />
          </div>
          <h1 id="auth-title" className="text-center font-[Georgia,serif] text-[36px] leading-[1.15] tracking-[-0.035em] sm:text-[50px]">{title}</h1>
          <p className="mt-4 text-center text-sm leading-6 sm:text-lg">{description}</p>
          <div className="mx-auto mt-9 w-full max-w-[480px] sm:mt-11">
            {children}
            <div className="my-7 flex items-center gap-5 text-xs sm:my-8"><span aria-hidden="true" className="h-px flex-1 bg-border" />OR<span aria-hidden="true" className="h-px flex-1 bg-border" /></div>
            <p className="flex flex-wrap items-center justify-center gap-x-2 text-sm">{alternative} <Link to={linkTo} className={authLink}>{linkText}<ArrowRight size={17} aria-hidden="true" /></Link></p>
          </div>
        </section>
      </main>
    </div>
  )
}

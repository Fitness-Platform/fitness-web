import PublicHeader from '../components/PublicHeader'
import HomeHero from '../components/HomeHero'
import HomePrinciples from '../components/HomePrinciples'
import HomePhilosophy from '../components/HomePhilosophy'
import HomePrograms from '../components/HomePrograms'
import HomeAboutDaniela from '../components/HomeAboutDaniela'
import HomeFinalCta from '../components/HomeFinalCta'
import PublicFooter from '../components/PublicFooter'

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4">Skip to content</a>
      <PublicHeader />
      <main id="main-content">
        <HomeHero />
        <HomePrinciples />
        <HomePhilosophy />
        <HomePrograms />
        <HomeAboutDaniela />
        <HomeFinalCta />
      </main>
      <PublicFooter />
    </div>
  )
}

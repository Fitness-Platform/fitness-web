import { useState } from 'react'
import { ArrowDown, ArrowRight, Check, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import strengthImage from '../assets/home-strength.png'
import editorialImage from '../assets/home-editorial.png'
import './home.css'

const programs = [
  { title: 'Strength & Structure', category: 'STRENGTH', duration: '6 WEEKS', description: 'Build strength, improve body composition and feel stronger in everyday life.', photo: 'strength' },
  { title: 'Rebalance', category: 'WELLBEING', duration: '12 WEEKS', description: 'A thoughtful approach to strength, energy and the changes that come with midlife.', photo: 'squat' },
  { title: 'Mobility & Longevity', category: 'MOVEMENT', duration: '4 WEEKS', description: 'Move better, feel better and build the freedom to keep doing what you love.', photo: 'outdoors' },
]

function RootPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="home-page">
      <header className="home-header">
        <Link to="/" className="home-brand" aria-label="Daniela Brito home">DANIELA BRITO<span>STRENGTH FOR WHAT’S NEXT</span></Link>
        <nav id="home-navigation" className={`home-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#programs" onClick={() => setMenuOpen(false)}>Programs</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>My approach</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <Link to="/login">Member login <ArrowRight size={13} /></Link>
        </nav>
        <a href="#work-with-me" className="home-button header-cta">Work with me <ArrowRight size={14} /></a>
        <button className="home-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="home-navigation" aria-expanded={menuOpen} onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false) }} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="home-hero" aria-labelledby="hero-title">
          <img src={strengthImage} alt="A woman practicing a weighted squat in a sunlit studio" className="home-hero-image" fetchPriority="high" />
          <div className="home-hero-content">
            <p className="home-eyebrow">Stronger. Healthier. More capable.</p>
            <h1 id="hero-title">A STRONGER<br />YOU FOR<br /><span>WHAT’S NEXT.</span></h1>
            <p className="home-hero-description">Science-backed training, real-life strategies and personalized support for women in their 40s, 50s and beyond — so you can feel strong, confident and independent for decades to come.</p>
            <a href="#programs" className="home-button">Explore programs <ArrowRight size={17} /></a>
            <a href="#approach" className="home-hero-discover"><span><ArrowDown size={14} /></span> Strength that goes beyond the gym</a>
          </div>
          <p className="home-hero-note">DISCIPLINE<br />BUILDS<br />FREEDOM<span /></p>
          <span className="home-photo-caption">01 / STRENGTH FOR EVERY CHAPTER</span>
        </section>

        <div className="home-values"><span>Science-backed.</span><span>Real-life focused.</span><span>Long-term results.</span></div>

        <section id="approach" className="home-approach home-section">
          <p className="home-eyebrow">Built around your life</p>
          <h2>More than a workout.<br /><span>A stronger way forward.</span></h2>
          <p>Your body changes. Your strength can keep growing. A balanced approach to training, movement and wellbeing helps you feel capable in every chapter.</p>
          <div className="home-pillars"><span><Check size={16} /> Purposeful strength training</span><span><Check size={16} /> Sustainable, everyday habits</span><span><Check size={16} /> Progress at your own pace</span></div>
        </section>

        <section id="programs" className="home-programs home-section">
          <div className="home-section-heading"><div><p className="home-eyebrow">Your next chapter starts here</p><h2>Find your strength.</h2><p>Thoughtful programs. Lasting foundations. A place to begin.</p></div><Link to="/register" className="home-text-link">Get started <ArrowRight size={17} /></Link></div>
          <div className="home-program-grid">{programs.map(program => (
            <article className="home-program" key={program.title}>
              <Link to="/register" className="home-program-image-link" aria-label={`Get started with ${program.title}`}>
                {program.photo === 'squat' ? <img src={strengthImage} alt="Weighted squat strength exercise" loading="lazy" className="home-program-squat" /> : <div role="img" aria-label={program.photo === 'outdoors' ? 'Woman walking along a sunlit garden path' : 'Woman training with dumbbells'} className={`home-editorial-image ${program.photo}`} style={{ backgroundImage: `url(${editorialImage})` }} />}
                <span className="home-program-category">{program.category}</span>
              </Link>
              <div className="home-program-details"><p className="home-eyebrow">{program.duration}</p><h3>{program.title}</h3><p>{program.description}</p><Link to="/register" className="home-program-arrow" aria-label={`Explore ${program.title}`}><ArrowRight size={17} /></Link></div>
            </article>
          ))}</div>
        </section>

        <section id="about" className="home-about">
          <div className="home-about-photo home-editorial-image strength" role="img" aria-label="Fitness editorial of a woman holding a dumbbell" style={{ backgroundImage: `url(${editorialImage})` }} />
          <div className="home-about-content"><p className="home-eyebrow">The philosophy behind the movement</p><h2>Strong for today.<br /><span>Ready for tomorrow.</span></h2><p>This is a space for women who want to feel stronger, move with confidence and invest in their future selves.</p><p>From your first session to your next milestone, the focus is simple: build strength that supports the life you want to live.</p><a href="#work-with-me" className="home-text-link">Let’s take the next step <ArrowRight size={17} /></a><span className="home-about-signature">Daniela Brito</span></div>
        </section>

        <section id="work-with-me" className="home-contact home-section"><p className="home-eyebrow">Your strength. Your next chapter.</p><h2>Let’s build what’s next.</h2><p>You don’t have to have it all figured out. Just a place to start.</p><Link to="/register" className="home-button">Start your journey <ArrowRight size={17} /></Link><Link to="/login" className="home-contact-login">Already a member? Sign in</Link></section>
      </main>
      <footer className="home-footer"><Link to="/" className="home-brand">DANIELA BRITO<span>STRENGTH FOR WHAT’S NEXT</span></Link><p>Stronger. Healthier. More capable.</p><span>© {new Date().getFullYear()} Daniela Brito</span></footer>
    </div>
  )
}
export default RootPage

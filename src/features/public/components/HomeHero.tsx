import heroImage from '../../../assets/home/hero-daniela-dumbbells.jpg';
import { eyebrow, primaryCta } from './styles';

/**
 * To swap the hero asset later, edit only this object.
 * blend: true  -> white studio backdrop is multiplied into the ivory page.
 * blend: false -> use for photos with their own background / transparent cut-outs.
 */
const HERO_IMAGE = {
  src: heroImage,
  alt: 'Daniela Brito standing with two dumbbells',
  position: 'object-[50%_10%]',
  blend: true,
};

const outlineCta =
  'inline-flex h-12 items-center justify-center rounded-[2px] border border-[#202424] px-7 text-xs font-semibold uppercase tracking-[0.14em] text-[#202424] transition-colors hover:bg-[#202424] hover:text-[#F7F5F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#202424]';

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative overflow-hidden bg-[#F7F5F0] text-[#202424]"
    >
      <div className="mx-auto grid w-full max-w-[90rem] lg:min-h-[46rem] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:grid-rows-[1fr_auto] xl:min-h-[50rem]">
        <div className="relative z-10 px-6 pt-10 sm:px-10 lg:col-start-1 lg:row-start-1 lg:-mr-16 lg:pl-20 lg:pr-0 lg:pt-24">
          <p className={eyebrow}>Stronger. Healthier. More capable.</p>
          <h1
            id="home-hero-title"
            className="mt-6 text-[3.5rem] font-bold leading-[0.98] tracking-[-0.035em] sm:text-[5rem] lg:mt-8 lg:text-[clamp(4rem,7.4vw,8rem)]"
          >
            Stronger
            <br />
            for what’s
            <br />
            <span className="text-[#607A6D]">next.</span>
          </h1>
        </div>

        <figure className="relative mt-8 aspect-[4/5] sm:aspect-[5/4] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:aspect-auto">
          <img
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${HERO_IMAGE.position} ${
              HERO_IMAGE.blend ? 'mix-blend-multiply' : ''
            }`}
          />
          <figcaption
            aria-hidden="true"
            className="absolute right-10 top-12 hidden text-right text-[11px] font-medium uppercase leading-[1.9] tracking-[0.18em] text-[#686B68] lg:block"
          >
            Discipline
            <br />
            builds
            <br />
            freedom
            <span className="ml-auto mt-3 block h-px w-8 bg-[#607A6D]" />
          </figcaption>
        </figure>

        <div className="relative z-10 px-6 pb-14 pt-8 sm:px-10 lg:col-start-1 lg:row-start-2 lg:pb-24 lg:pl-20 lg:pr-0 lg:pt-12">
          <p className="max-w-[34rem] text-base leading-[1.65] text-[#686B68] sm:text-lg">
            Science-backed strength training and real-life strategies for women
            in their 40s, 50s and beyond — so you can feel strong, confident and
            independent for decades to come.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mt-10">
            <a href="#programs" className={`${primaryCta} sm:min-w-[12rem]`}>
              Explore programs
            </a>
            <a href="#about" className={`${outlineCta} sm:min-w-[12rem]`}>
              Meet Daniela
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
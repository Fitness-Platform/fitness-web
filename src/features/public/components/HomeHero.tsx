import hero from "../../../assets/home/daniela-dumbbells-fullbody.jpg";
import { container, eyebrow, primaryCta, textCta } from "./styles";

export default function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-border">
      <div
        className={`${container} grid items-center gap-5 pt-6 md:grid-cols-[0.95fr_1.05fr] md:gap-5 md:pt-0`}
      >
        <div className="py-3 md:py-7">
          <p className={eyebrow}>STRONGER. HEALTHIER. MORE CAPABLE.</p>
          <h1
            id="hero-title"
            className="mt-3 text-[clamp(3.25rem,5.5vw,5.25rem)] font-semibold leading-[0.96] tracking-[-0.06em]"
          >
            Stronger
            <br />
            for what's
            <br />
            <span className="text-primary-dark">next.</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            A 6-week dumbbell strength program for women 40+ designed to help
            you build strength, move better and feel more capable — at home or
            in the gym.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#programs"
              className={`${primaryCta} h-auto min-h-12 py-3 text-center`}
            >
              EXPLORE THE 6-WEEK PROGRAM
            </a>
            <a
              href="#about"
              className={`${textCta} inline-flex border border-foreground px-6`}
            >
              MEET DANIELA
            </a>
          </div>
        </div>
        <figure className="relative w-full self-stretch overflow-hidden h-[27rem] md:h-[31rem] lg:h-[33rem]">
          <img
            src={hero}
            width="927"
            height="1224"
            alt="Daniela standing with dumbbells, ready for strength training"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-y-0 -left-[2%] h-full w-[104%] max-w-none object-cover object-top"
          />
          <figcaption className="absolute right-3 top-5 hidden text-right text-[9px] leading-loose tracking-[0.12em] text-muted-foreground lg:block">
            DISCIPLINE
            <br />
            BUILDS
            <br />
            FREEDOM
            <span className="ml-auto mt-2 block w-6 border-t border-primary-dark" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

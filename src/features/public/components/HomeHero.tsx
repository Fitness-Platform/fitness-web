import hero from "../../../assets/home/daniela-dumbbells-fullbody.jpg";
import { container, eyebrow, primaryCta, textCta } from "./styles";

export default function HomeHero({
  programHref = "#programs",
}: {
  programHref?: string;
}) {
  return (
    <section aria-labelledby="hero-title" className="border-b border-border">
      <div
        className={`${container} grid items-center gap-3 pt-3 md:grid-cols-[0.95fr_1.05fr] md:gap-5 md:pt-0`}
      >
        <div className="py-2 md:py-7">
          <p className={eyebrow}>STRONGER. HEALTHIER. MORE CAPABLE.</p>
          <h1
            id="hero-title"
            className="mt-2 text-5xl md:mt-3 md:text-[clamp(3.25rem,5.5vw,5.25rem)] font-semibold leading-[0.96] tracking-[-0.06em]"
          >
            Stronger
            <br />
            for what's
            <br />
            <span className="text-primary-dark">next.</span>
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed md:mt-4 md:text-base text-muted-foreground">
            A 6-week dumbbell strength program for women 40+ designed to help
            you build strength, move better and feel more capable — at home or
            in the gym.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 md:mt-5 md:gap-3">
            <a
              href={programHref}
              className={`${primaryCta} h-auto min-h-12 py-3 text-center`}
            >
              EXPLORE THE 6-WEEK PROGRAM
            </a>
            <a
              href="#about"
              className={`${textCta} inline-flex px-1 md:border md:border-foreground md:px-6`}
            >
              MEET DANIELA
            </a>
          </div>
        </div>
        <figure className="relative w-full self-stretch overflow-hidden bg-[#F0EFEA] h-[27rem] md:h-[31rem] lg:h-[33rem]">
          <img
            src={hero}
            width="927"
            height="1224"
            alt="Daniela standing with dumbbells, ready for strength training"
            fetchPriority="high"
            decoding="async"
            className="mx-auto h-full w-auto max-w-full object-contain object-bottom [clip-path:inset(0_2px)]"
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

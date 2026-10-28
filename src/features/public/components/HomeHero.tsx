import hero from "../../../assets/home/daniela-dumbbells-fullbody.jpg";
import { container, eyebrow, primaryCta, textCta } from "./styles";

export default function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-border">
      <div
        className={`${container} grid items-center gap-8 pt-10 md:grid-cols-2 md:gap-6 md:pt-0`}
      >
        <div className="py-4 md:py-14">
          <p className={eyebrow}>Stronger. Healthier. More capable.</p>
          <h1
            id="hero-title"
            className="mt-5 text-[clamp(3.5rem,6.5vw,6.5rem)] font-semibold leading-[0.96] tracking-[-0.06em]"
          >
            Stronger
            <br />
            for what’s
            <br />
            <span className="text-primary-dark">next.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            A 6-week dumbbell strength program for women 40+. Build strength,
            move better and feel more confident — with sustainable training that
            fits real life.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#programs"
              className={`${primaryCta} h-auto min-h-12 py-3 text-center`}
            >
              Explore the 6-week program
            </a>
            <a
              href="#about"
              className={`${textCta} inline-flex border border-foreground px-6`}
            >
              Meet Daniela
            </a>
          </div>
        </div>
        <figure className="relative mx-auto w-full max-w-[30rem] self-end">
          <img
            src={hero}
            width="927"
            height="1224"
            alt="Daniela standing with dumbbells, ready for strength training"
            fetchPriority="high"
            decoding="async"
            className="max-h-[42rem] w-full object-contain object-bottom"
          />
        </figure>
      </div>
    </section>
  );
}

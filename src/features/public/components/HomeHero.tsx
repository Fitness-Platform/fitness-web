import { ArrowRight } from "lucide-react";

import heroImage from "../../../assets/daniela-hero-dumbbells.png";
import {
  container,
  eyebrow,
  primaryCta,
  textCta,
} from "./styles";

export default function HomeHero() {
  return (
    <section
      aria-labelledby="home-title"
      className={`${container} overflow-hidden`}
    >
      <div className="grid md:grid-cols-[53%_47%]">
        <div className="flex min-h-[650px] flex-col justify-center py-14 md:min-h-[720px] md:pr-8 lg:pr-12">
          <p className={eyebrow}>
            Stronger. Healthier. More capable.
          </p>

          <h1
            id="home-title"
            className="mt-8 max-w-[650px] text-[clamp(58px,6.6vw,108px)] font-semibold leading-[0.87] tracking-[-0.065em] text-foreground"
          >
            Stronger
            <br />
            for what&apos;s
            <br />

            <span className="text-primary-dark">
              next.
            </span>
          </h1>

          <div className="mt-10 md:hidden">
            <div className="relative aspect-[4/5] overflow-hidden bg-white">
              <img
                src={heroImage}
                alt="Daniela Brito training with dumbbells"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full scale-[1.18] object-cover object-[50%_47%]"
              />
            </div>
          </div>

          <div className="mt-10 max-w-[520px] lg:mt-12">
            <p className="text-[15px] leading-[1.75] text-muted-foreground">
              Science-backed strength training
              and real-life strategies for women
              in their 40s, 50s and beyond — so
              you can feel strong, confident and
              independent for decades to come.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#programs"
                className={`${primaryCta} sm:min-w-[210px]`}
              >
                Explore programs

                <ArrowRight
                  size={16}
                  className="shrink-0"
                  aria-hidden="true"
                />
              </a>

              <a
                href="#about"
                className={`${textCta} sm:min-w-[170px]`}
              >
                Meet Daniela

                <ArrowRight
                  size={15}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[720px] overflow-hidden bg-white md:block">
          <img
            src={heroImage}
            alt="Daniela Brito training with dumbbells"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full scale-[1.18] object-cover object-[50%_47%]"
          />
        </div>
      </div>
    </section>
  );
}
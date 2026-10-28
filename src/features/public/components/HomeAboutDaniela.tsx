import { Check } from "lucide-react";
import portrait from "../../../assets/home/meet-daniela-portrait.jpg";
import { container, eyebrow, primaryCta } from "./styles";
export default function HomeAboutDaniela() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={`${container} scroll-mt-6 py-6 md:py-8`}
    >
      <div className="grid items-center gap-5 md:grid-cols-2 md:gap-7">
        <img
          src={portrait}
          width="734"
          height="1036"
          alt="Daniela smiling with her arms resting above her head"
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover object-[50%_22%] md:aspect-[5/4]"
        />
        <div>
          <p className={eyebrow}>Meet Daniela</p>
          <h2
            id="about-title"
            className="mt-3 max-w-lg text-3xl font-semibold leading-[1.08] tracking-[-0.045em] lg:text-4xl"
          >
            Strength is a practice, not a performance.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            I’m Daniela. I help women in their 40s, 50s and beyond build
            sustainable strength, move with confidence and feel more capable in
            their bodies — with practical training and real-life strategies.
          </p>
          <a href="#approach" className={`${primaryCta} mt-4`}>
            My approach
          </a>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {[
              "Strength that supports everyday life",
              "Consistent training that fits real schedules",
              "Confidence, capability and independence",
            ].map((point) => (
              <li key={point} className="flex items-center gap-3">
                <Check
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.4}
                  className="shrink-0 text-primary-dark"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

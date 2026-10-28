import { Check } from "lucide-react";
import portrait from "../../../assets/home/meet-daniela-portrait.jpg";
import { container, eyebrow, primaryCta } from "./styles";
export default function HomeAboutDaniela() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={`${container} scroll-mt-6 py-10 md:py-14`}
    >
      <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
        <img
          src={portrait}
          width="734"
          height="1036"
          alt="Daniela smiling with her arms resting above her head"
          loading="lazy"
          decoding="async"
          className="mx-auto max-h-[36rem] w-full object-contain"
        />
        <div>
          <p className={eyebrow}>Meet Daniela</p>
          <h2
            id="about-title"
            className="mt-4 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.045em] lg:text-5xl"
          >
            Strength is a practice, not a performance.
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
            I’m Daniela. I help women in their 40s, 50s and beyond build
            sustainable strength, move with confidence and feel more capable in
            their bodies — with practical training and real-life strategies.
          </p>
          <a href="#approach" className={`${primaryCta} mt-6`}>
            My approach
          </a>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
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

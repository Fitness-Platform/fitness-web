import { CalendarDays, Dumbbell, House, CirclePlay } from "lucide-react";
import photo from "../../../assets/home/daniela-kettlebell-row-close.jpg";
import { container, eyebrow, primaryCta } from "./styles";
const features = [
  { icon: House, text: "At home or in the gym" },
  { icon: Dumbbell, text: "Dumbbell workouts" },
  { icon: CalendarDays, text: "6-week structured plan" },
  { icon: CirclePlay, text: "On-demand video workouts" },
];
export default function HomePrograms() {
  return (
    <section
      id="programs"
      aria-labelledby="program-title"
      className={`${container} scroll-mt-6 py-5 md:py-8`}
    >
      <div className="grid items-center gap-4 md:grid-cols-[0.95fr_1.05fr] md:gap-7">
        <div>
          <p className={eyebrow}>FEATURED PROGRAM</p>
          <h2
            id="program-title"
            className="mt-2 max-w-xl text-[1.75rem] md:mt-3 md:text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.045em] lg:text-[2.5rem]"
          >
            The 6-Week Dumbbell Strength Program for Women 40+
          </h2>
          <p className="mt-2 max-w-lg md:mt-3 text-sm leading-relaxed text-muted-foreground">
            A structured, progressive program to help you get stronger, move
            better and feel more capable — using dumbbells. You can do it at
            home or in the gym.
          </p>
          <a href="#approach" className={`${primaryCta} mt-3 md:mt-4`}>
            LEARN MORE &amp; ENROLL — $89
          </a>
          <ul className="mt-4 grid grid-cols-2 gap-y-3 md:mt-5 md:gap-y-4 lg:grid-cols-4">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="border-l border-border px-3 text-center text-xs leading-relaxed text-muted-foreground"
              >
                <Icon
                  aria-hidden="true"
                  className="mx-auto mb-1 text-foreground md:mb-2"
                  size={22}
                  strokeWidth={1.3}
                />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <img
            src={photo}
            width="1764"
            height="1158"
            alt="Daniela performing a kettlebell row with one hand supported on a bench"
            loading="lazy"
            decoding="async"
            className="w-full object-cover aspect-[3/2]"
          />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This program is about sustainable strength, confidence and long-term
            capability — training that supports how you want to live, not just
            how you want to look.
          </p>
        </div>
      </div>
    </section>
  );
}

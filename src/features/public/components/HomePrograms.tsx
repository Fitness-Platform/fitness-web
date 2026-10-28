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
      className={`${container} scroll-mt-6 py-6 md:py-8`}
    >
      <div className="grid items-center gap-6 md:grid-cols-[0.95fr_1.05fr] md:gap-7">
        <div>
          <p className={eyebrow}>Featured program</p>
          <h2
            id="program-title"
            className="mt-3 max-w-xl text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.045em] lg:text-[2.5rem]"
          >
            The 6-Week Dumbbell Strength Program for Women 40+
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            A structured, progressive plan to help you get stronger, move better
            and feel more capable — using dumbbells, at home or in the gym.
          </p>
          <a href="#approach" className={`${primaryCta} mt-4`}>
            Learn more — $89
          </a>
          <ul className="mt-5 grid grid-cols-2 gap-y-4 lg:grid-cols-4">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="border-l border-border px-3 text-center text-xs leading-relaxed text-muted-foreground"
              >
                <Icon
                  aria-hidden="true"
                  className="mx-auto mb-2 text-foreground"
                  size={22}
                  strokeWidth={1.3}
                />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={photo}
          width="1764"
          height="1158"
          alt="Daniela performing a kettlebell row with one hand supported on a bench"
          loading="lazy"
          decoding="async"
          className="w-full object-cover aspect-[3/2]"
        />
      </div>
    </section>
  );
}

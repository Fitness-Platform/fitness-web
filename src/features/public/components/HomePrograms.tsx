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
      className={`${container} scroll-mt-6 py-10 md:py-14`}
    >
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className={eyebrow}>Featured program</p>
          <h2
            id="program-title"
            className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] xl:text-5xl"
          >
            The 6-Week Dumbbell Strength Program for Women 40+
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
            A structured, progressive plan to help you get stronger, move better
            and feel more capable — using dumbbells, at home or in the gym.
          </p>
          <a href="#approach" className={`${primaryCta} mt-6`}>
            Learn more — $89
          </a>
          <ul className="mt-8 grid grid-cols-2 gap-y-6 sm:grid-cols-4">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="border-l border-border px-3 text-center text-xs leading-relaxed text-muted-foreground"
              >
                <Icon
                  aria-hidden="true"
                  className="mx-auto mb-2 text-foreground"
                  size={25}
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
          className="w-full object-contain"
        />
      </div>
    </section>
  );
}

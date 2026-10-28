import closeRow from "../../../assets/home/daniela-kettlebell-row-close.jpg";
import wideRow from "../../../assets/home/daniela-kettlebell-row-wide.jpg";
import portrait from "../../../assets/home/daniela-smiling-portrait.jpg";
import { CalendarDays, Dumbbell, CirclePlay, House } from "lucide-react";
import { container, eyebrow } from "./styles";

const title =
  "text-3xl font-semibold leading-[1.1] tracking-[-0.04em] lg:text-4xl";
const body = "text-sm leading-relaxed text-muted-foreground sm:text-base";
const inclusions = [
  {
    icon: CalendarDays,
    title: "6-week structured plan",
    copy: "A structured, progressive plan to follow from week one to week six.",
  },
  {
    icon: Dumbbell,
    title: "Dumbbell workouts",
    copy: "Strength sessions built around dumbbells.",
  },
  {
    icon: CirclePlay,
    title: "On-demand workouts",
    copy: "Video workouts you can open whenever it suits your day.",
  },
  {
    icon: House,
    title: "At home or in the gym",
    copy: "Train where it works for your life.",
  },
];
export default function ProgramSalesContent() {
  return (
    <>
      <section
        id="inside"
        aria-labelledby="overview-title"
        className={`${container} scroll-mt-6 py-8 md:py-12`}
      >
        <div className="grid items-center gap-6 md:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <img
            src={closeRow}
            width="1764"
            height="1158"
            alt="Daniela performing a close kettlebell row on a bench"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover"
          />
          <div>
            <p className={eyebrow}>The program</p>
            <h2 id="overview-title" className={`${title} mt-3`}>
              Structured strength
              <br className="hidden lg:block" /> for real life.
            </h2>
            <p className={`${body} mt-4`}>
              A structured, progressive program to help you get stronger, move
              better and feel more capable — using dumbbells. You can do it at
              home or in the gym.
            </p>
            <p className={`${body} mt-3`}>
              This program is about sustainable strength, confidence and
              long-term capability — training that supports how you want to
              live, not just how you want to look.
            </p>
            <dl className="mt-6 divide-y divide-border">
              {[
                ["Structured", "Six weeks, laid out in order."],
                ["Progressive", "Build strength through consistent training."],
                ["Strength focused", "Dumbbell training for real life."],
                ["For women 40+", "Women in their 40s, 50s and beyond."],
              ].map(([label, copy], i) => (
                <div
                  key={label}
                  className="grid grid-cols-[1.5rem_1fr] gap-x-3 py-3 sm:grid-cols-[1.5rem_1fr_1.4fr]"
                >
                  <span
                    aria-hidden="true"
                    className="pt-0.5 text-[10px] text-primary-dark"
                  >
                    0{i + 1}
                  </span>
                  <dt className="text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </dt>
                  <dd className="col-start-2 mt-1 text-xs leading-relaxed text-muted-foreground sm:col-start-auto sm:mt-0">
                    {copy}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="included-title"
        className="border-y border-border"
      >
        <div className={`${container} py-8 md:py-12`}>
          <p className={eyebrow}>What you'll get</p>
          <h2 id="included-title" className={`${title} mt-3`}>
            Everything you need to get stronger.
          </h2>
          <ul className="mt-7 grid grid-cols-2 gap-y-7 lg:grid-cols-4">
            {inclusions.map(({ icon: Icon, title, copy }, i) => (
              <li
                key={title}
                className={`pr-4 ${i % 2 ? "border-l border-border pl-4" : ""} ${i === 2 ? "lg:border-l lg:border-border lg:pl-4" : ""}`}
              >
                <Icon size={27} strokeWidth={1.3} aria-hidden="true" />
                <h3 className="mt-3 text-xs font-semibold uppercase leading-relaxed tracking-wide">
                  {title}
                </h3>
                <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
                  {copy}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-9 grid gap-6 border-t border-border pt-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className={eyebrow}>How it works</p>
              <h2 className={`${title} mt-3`}>Three steps to start.</h2>
              <p className={`${body} mt-3`}>
                Anyone can read about the program.
                <br />
                An account is needed to enroll.
              </p>
            </div>
            <ol className="divide-y divide-border">
              {[
                [
                  "Create your account",
                  "Create or sign in to your Daniela Brito account.",
                ],
                [
                  "Enroll in the program",
                  "Complete your purchase through secure checkout.",
                ],
                [
                  "Start training",
                  "Access the program from your member area once access is confirmed.",
                ],
              ].map(([label, copy], i) => (
                <li
                  key={label}
                  className="grid grid-cols-[1.5rem_1fr] gap-3 py-4"
                >
                  <span
                    className="text-xs text-primary-dark"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="philosophy-title"
        className={`${container} py-8 md:py-12`}
      >
        <div className="grid items-center gap-6 md:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div>
            <p className={eyebrow}>A stronger way forward</p>
            <h2 id="philosophy-title" className={`${title} mt-3`}>
              Strength that supports how you want to live.
            </h2>
            <p className={`${body} mt-4`}>
              Increase muscle, support bone health and protect your
              independence.
            </p>
            <p className={`${body} mt-3`}>
              Move better, reduce stiffness and feel more capable in daily life.
              Develop physical and mental strength that carries into everything
              you do.
            </p>
          </div>
          <img
            src={wideRow}
            width="1760"
            height="1159"
            alt="Daniela training with a kettlebell beside a bench"
            loading="lazy"
            decoding="async"
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
        <div className="mt-8 grid gap-4 border-t border-border pt-7 md:grid-cols-2">
          <div>
            <p className={eyebrow}>Who it's for</p>
            <h2 className={`${title} mt-3`}>Women 40+. Real life focused.</h2>
          </div>
          <p className={`${body} self-center`}>
            For women in their 40s, 50s and beyond who want to build strength,
            improve movement and feel confident in their bodies — with
            practical, evidence-based training and real-life strategies.
          </p>
        </div>
      </section>
      <section
        aria-labelledby="trainer-title"
        className="border-t border-border"
      >
        <div
          className={`${container} grid items-center gap-6 py-8 md:grid-cols-[0.7fr_1.3fr] md:gap-10 md:py-12`}
        >
          <img
            src={portrait}
            width="661"
            height="994"
            alt="Daniela smiling with her arms raised above her head"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover object-[50%_20%] md:aspect-square"
          />
          <div>
            <p className={eyebrow}>Meet Daniela</p>
            <h2 id="trainer-title" className={`${title} mt-3`}>
              Strength is a practice,
              <br className="hidden lg:block" /> not a performance.
            </h2>
            <p className={`${body} mt-4`}>
              I'm Daniela, a certified personal trainer and menopause coach. I
              help women in their 40s, 50s and beyond build strength, improve
              movement and feel confident in their bodies — with practical,
              evidence-based training and real-life strategies.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li>Certified Personal Trainer</li>
              <li>Certified Menopause Coach</li>
              <li>Evidence-based, real-life focused</li>
              <li>Helping women feel strong, confident and independent</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

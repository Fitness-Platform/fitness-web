import closeRow from "../../../assets/home/daniela-kettlebell-row-close.jpg";
import portrait from "../../../assets/home/daniela-smiling-portrait.jpg";
import { container, eyebrow } from "./styles";

const title =
  "text-3xl font-semibold leading-[1.1] tracking-[-0.04em] lg:text-4xl";
const body = "text-sm leading-relaxed text-muted-foreground sm:text-base";
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
        aria-labelledby="steps-title"
        className="border-y border-border bg-[#F0EEE8]"
      >
        <div className={`${container} py-8 md:py-12`}>
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className={eyebrow}>How it works</p>
              <h2 id="steps-title" className={`${title} mt-3`}>
                Three steps to start.
              </h2>
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
      <section aria-labelledby="philosophy-title" className="bg-[#EFF1ED]">
        <div className={`${container} py-8 md:py-12`}>
          <div className="grid items-start gap-6 md:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="border-l-2 border-[#607A6D] pl-5 md:border-l-4 md:pl-7">
              <p className={eyebrow}>A stronger way forward</p>
              <h2 id="philosophy-title" className={`${title} mt-3`}>
                Strength that supports how you want to live.
              </h2>
            </div>
            <div className="space-y-5 border-t border-border pt-5 md:border-t-0 md:pt-1">
              <p className="max-w-lg text-xl font-medium leading-relaxed tracking-[-0.02em] lg:text-2xl">
                Increase muscle, support bone health and protect your
                independence.
              </p>
              <p className={`${body} max-w-lg`}>
                Move better, reduce stiffness and feel more capable in daily
                life. Develop physical and mental strength that carries into
                everything you do.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="audience-title"
        className="border-t border-border bg-[#F7F5F0]"
      >
        <div className={`${container} grid gap-4 py-7 md:grid-cols-2 md:py-10`}>
          <div>
            <p className={eyebrow}>Who it's for</p>
            <h2 id="audience-title" className={`${title} mt-3`}>
              Women 40+. Real life focused.
            </h2>
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

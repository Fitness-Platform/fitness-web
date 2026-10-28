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
        className="scroll-mt-6 bg-[#789486] text-[#F7F5F0]"
      >
        <div
          className={`${container} grid gap-7 py-10 md:grid-cols-[1.05fr_1fr] md:gap-12 md:py-16`}
        >
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em]">
              <span
                aria-hidden="true"
                className="h-4 w-8 shrink-0 border-y border-[#F7F5F0]/70 before:mt-[7px] before:block before:border-t before:border-[#F7F5F0]/70"
              />
              The program
            </p>
            <h2
              id="overview-title"
              className="mt-4 max-w-[16ch] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] lg:text-5xl"
            >
              Structured strength for real life.
            </h2>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-[#F7F5F0]/95 sm:text-base">
              A structured, progressive program to help you get stronger, move
              better and feel more capable — using dumbbells. You can do it at
              home or in the gym.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#F7F5F0]/95 sm:text-base">
              This program is about sustainable strength, confidence and
              long-term capability — training that supports how you want to
              live, not just how you want to look.
            </p>
            <dl className="mt-6 divide-y divide-[#F7F5F0]/40 border-t border-[#F7F5F0]/30">
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
                    className="pt-0.5 text-[10px] text-[#F7F5F0]/85"
                  >
                    0{i + 1}
                  </span>
                  <dt className="text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </dt>
                  <dd className="col-start-2 mt-1 text-xs leading-relaxed text-[#F7F5F0]/85 sm:col-start-auto sm:mt-0">
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
        className="border-t border-border bg-[#F7F5F0]"
      >
        <div className={`${container} py-12 md:py-16`}>
          <div className="grid gap-8">
            <div className="grid gap-4 md:grid-cols-[1.6fr_1fr] md:items-end">
              <div>
                <p className={eyebrow}>How it works</p>
                <h2
                  id="steps-title"
                  className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] lg:text-5xl"
                >
                  Three steps to start.
                </h2>
              </div>
              <p className={`${body} mt-3`}>
                Anyone can read about the program.
                <br />
                An account is needed to enroll.
              </p>
            </div>
            <ol className="grid md:grid-cols-3 md:gap-8">
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
                  className="grid grid-cols-[1.5rem_1fr] gap-4 border-t border-border py-6 md:block"
                >
                  <span
                    className="block text-xs tracking-[0.15em] text-primary-dark md:mb-6"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{label}</h3>
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
        className="bg-[#496658] text-[#F7F5F0]"
      >
        <div className={`${container} py-14 md:py-20 lg:py-24`}>
          <p className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#F7F5F0]/90">
            <span aria-hidden="true" className="h-px w-8 bg-[#F7F5F0]/50" />A
            stronger way forward
          </p>
          <h2
            id="philosophy-title"
            className="mt-8 max-w-[20ch] text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.05em] md:text-6xl lg:text-[5.5rem]"
          >
            Strength that supports <br className="hidden md:block" />
            how you want to live.
          </h2>
          <div className="mt-9 grid gap-6 border-t border-[#F7F5F0]/35 pt-7 md:mt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-8">
            <p className="max-w-lg text-xl font-medium leading-snug tracking-[-0.02em] lg:text-3xl">
              Increase muscle, support bone health and protect your
              independence.
            </p>
            <p className="max-w-lg text-sm leading-relaxed text-[#F7F5F0]/90 lg:text-base">
              Move better, reduce stiffness and feel more capable in daily life.
              Develop physical and mental strength that carries into everything
              you do.
            </p>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="audience-title"
        className="bg-[#F7F5F0] text-center"
      >
        <div className={`${container} py-14 md:py-20 lg:py-24`}>
          <p className={eyebrow}>Who it's for</p>
          <h2
            id="audience-title"
            className="mx-auto mt-5 max-w-[22ch] text-3xl font-semibold leading-[1.1] tracking-[-0.04em] md:max-w-none md:text-4xl lg:text-5xl"
          >
            Women 40+. Real life focused.
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto my-7 block h-px w-8 bg-[#607A6D] md:my-9"
          />
          <p className={`${body} mx-auto max-w-[65ch]`}>
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

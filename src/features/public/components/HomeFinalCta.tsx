import photo from "../../../assets/home/daniela-waterfront-portrait.jpg";
import { container, primaryCta } from "./styles";

export default function HomeFinalCta() {
  return (
    <section
      aria-labelledby="final-title"
      className="relative mt-5 isolate overflow-hidden bg-[#202424] text-[#F7F5F0] md:mt-7"
    >
      <img
        src={photo}
        width="1264"
        height="1115"
        alt="Daniela by the waterfront with the city skyline behind her"
        loading="lazy"
        decoding="async"
        className="absolute right-0 top-0 -z-20 h-[24rem] w-full object-cover object-top md:h-full md:w-[62%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#202424_35%,transparent_75%)] md:bg-[linear-gradient(to_right,#202424_38%,rgba(32,36,36,0.85)_45%,transparent_70%)]"
      />
      <div
        className={`${container} flex min-h-[39rem] items-end py-8 md:min-h-[27rem] md:items-center md:py-10`}
      >
        <div className="max-w-sm md:max-w-[43%]">
          <p className="text-[11px] uppercase tracking-[0.18em]">START HERE</p>
          <h2
            id="final-title"
            className="mt-3 text-5xl font-semibold leading-none tracking-[-0.05em] lg:text-6xl"
          >
            Let's build
            <br />
            what's next.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Join the 6-week dumbbell strength program and start training with a
            plan built for real life.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#programs" className={primaryCta}>
              EXPLORE THE PROGRAM — $89
            </a>
            <button
              type="button"
              disabled
              title="Preview is not available yet"
              className="inline-flex min-h-12 cursor-not-allowed items-center justify-center border border-white/60 px-7 text-white/70"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                WATCH PREVIEW
              </span>
              <span className="sr-only"> — not available yet</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

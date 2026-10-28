import photo from "../../../assets/home/daniela-waterfront-portrait.jpg";
import { container, primaryCta } from "./styles";

export default function HomeFinalCta({
  programHref = "#programs",
  price,
}: {
  programHref?: string;
  price: string | null;
}) {
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
        className="absolute right-0 top-0 -z-20 h-full w-full object-cover object-top md:h-full md:w-[62%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(32,36,36,0.97),rgba(32,36,36,0.8)_35%,rgba(32,36,36,0.25)_65%,transparent)] md:bg-[linear-gradient(to_right,#202424_38%,rgba(32,36,36,0.85)_45%,transparent_70%)]"
      />
      <div
        className={`${container} flex min-h-[35rem] items-end py-6 md:min-h-[27rem] md:items-center md:py-10`}
      >
        <div className="max-w-sm md:max-w-[43%]">
          <p className="text-[11px] uppercase tracking-[0.18em]">START HERE</p>
          <h2
            id="final-title"
            className="mt-2 text-[2.75rem] md:mt-3 md:text-5xl font-semibold leading-none tracking-[-0.05em] lg:text-6xl"
          >
            Let's build
            <br />
            what's next.
          </h2>
          <p className="mt-3 max-w-sm md:mt-4 text-sm leading-relaxed">
            Join the 6-week dumbbell strength program and start training with a
            plan built for real life.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-5 md:gap-3">
            <a href={programHref} className={primaryCta}>
              EXPLORE THE PROGRAM{price ? ` — ${price}` : ""}
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

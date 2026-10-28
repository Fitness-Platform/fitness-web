import { Link } from "react-router-dom";
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
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_0%] md:w-[125%] md:max-w-none md:object-top"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.85),rgba(0,0,0,0.15)_65%,transparent)] md:bg-[linear-gradient(to_right,rgba(0,0,0,0.8),rgba(0,0,0,0.4)_42%,transparent_70%)]"
      />
      <div
        className={`${container} flex min-h-[37rem] items-end py-8 md:min-h-[25rem] md:items-center md:py-10`}
      >
        <div className="max-w-sm md:max-w-[43%]">
          <p className="text-[11px] uppercase tracking-[0.18em]">Start here</p>
          <h2
            id="final-title"
            className="mt-3 text-5xl font-semibold leading-none tracking-[-0.05em] lg:text-6xl"
          >
            Let’s build
            <br />
            what’s next.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Join the 6-week dumbbell strength program and start training with a
            plan built for real life.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#programs" className={primaryCta}>
              Explore the program
            </a>
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center border border-current px-7 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Join now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import photo from "../../../assets/home/daniela-waterfront-portrait.jpg";
import { container, primaryCta } from "./styles";
export default function HomeFinalCta() {
  return (
    <section
      aria-labelledby="final-title"
      className="relative mt-8 bg-[#202424] text-[#F7F5F0] md:mt-14"
    >
      <div className="grid md:grid-cols-2">
        <div
          className={`${container} relative z-10 flex flex-col justify-center py-12 md:col-start-1 md:row-start-1 md:px-10 lg:py-20 lg:pl-20`}
        >
          <p className="text-[11px] uppercase tracking-[0.18em]">Start here</p>
          <h2
            id="final-title"
            className="mt-4 text-5xl font-semibold leading-none tracking-[-0.05em] lg:text-7xl"
          >
            Let’s build
            <br />
            what’s next.
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed">
            Join the 6-week dumbbell strength program and start training with a
            plan built for real life.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
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
        <img
          src={photo}
          width="1264"
          height="1115"
          alt="Daniela by the waterfront with the city skyline behind her"
          loading="lazy"
          decoding="async"
          className="h-full max-h-[38rem] min-h-72 w-full object-cover object-[50%_30%] md:col-start-2 md:row-start-1"
        />
      </div>
    </section>
  );
}

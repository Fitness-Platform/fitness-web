import { container } from "./styles";
const stories = [
  {
    title: "IMPROVE MOBILITY",
    copy: "Move better, reduce stiffness and feel more capable in daily life.",
  },
  {
    title: "FEEL CONFIDENT",
    copy: "Develop physical and mental strength that carries into everything you do.",
  },
  {
    title: "BUILD STRENGTH",
    copy: "Increase muscle, support bone health and protect your independence.",
  },
];
export default function HomePhilosophy() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="my-5 scroll-mt-6 bg-[#496658] text-[#F7F5F0] md:my-8"
    >
      <div
        className={`${container} py-10 md:py-16 lg:grid lg:grid-cols-[1.6fr_3fr] lg:items-center lg:gap-10 lg:py-24`}
      >
        <div>
          <span
            aria-hidden="true"
            className="mb-7 block h-px w-14 bg-[#F7F5F0]/80 lg:mb-10"
          />
          <h2
            id="approach-title"
            className="max-w-[11ch] text-[2.5rem] font-normal leading-[1.05] tracking-[-0.045em] md:text-5xl lg:text-[clamp(3rem,4.7vw,4.25rem)]"
          >
            A stronger way forward.
          </h2>
        </div>
        <div className="mt-8 grid md:grid-cols-3 lg:mt-8">
          {stories.map((story) => (
            <article
              key={story.title}
              className="border-t border-[#F7F5F0]/40 py-5 md:border-l md:border-t-0 md:px-5 md:py-6 lg:px-7"
            >
              <span
                aria-hidden="true"
                className="mb-5 hidden h-px w-8 bg-[#F7F5F0]/80 md:block"
              />
              <h3 className="text-sm font-semibold uppercase leading-6 tracking-[0.12em]">
                {story.title}
              </h3>
              <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-[#F7F5F0]/90 lg:text-base">
                {story.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

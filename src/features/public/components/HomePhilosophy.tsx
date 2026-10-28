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
      className="my-5 scroll-mt-6 bg-[#EFF1ED] text-[#202424] md:my-8"
    >
      <div className={`${container} py-8 md:py-12`}>
        <h2
          id="approach-title"
          className="text-[1.75rem] font-semibold leading-tight tracking-[-0.045em] md:text-3xl lg:text-4xl"
        >
          A stronger way forward.
        </h2>
        <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-3 md:gap-8">
          {stories.map((story, index) => (
            <article
              key={story.title}
              className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-t border-[#607A6D]/30 pt-5 md:block md:pt-6"
            >
              <span
                aria-hidden="true"
                className="text-[40px] font-light leading-none tracking-[-0.06em] text-[#607A6D]/55 md:text-[64px]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base font-semibold uppercase leading-6 tracking-[0.04em] md:mt-4">
                  {story.title}
                </h3>
                <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-muted-foreground">
                  {story.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

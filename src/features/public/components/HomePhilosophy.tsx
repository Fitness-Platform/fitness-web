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
      className="my-5 scroll-mt-6 bg-[#607A6D] text-white md:my-8"
    >
      <div className={`${container} py-8 md:py-10`}>
        <h2
          id="approach-title"
          className="text-[1.75rem] font-semibold leading-tight tracking-[-0.045em] text-[#F7F5F0] md:text-3xl lg:text-4xl"
        >
          A stronger way forward.
        </h2>
        <div className="mt-6 grid divide-white/25 md:mt-8 md:grid-cols-3 md:divide-x">
          {stories.map((story, index) => (
            <article
              key={story.title}
              className="py-5 first:pt-0 last:pb-0 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0"
            >
              <div aria-hidden="true" className="flex items-center gap-3">
                <span className="text-[10px] font-medium tracking-[0.16em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 border-t border-white/30" />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold uppercase leading-5 tracking-[0.04em]">
                {story.title}
              </h3>
              <p className="mt-2 max-w-[32ch] text-sm leading-relaxed">
                {story.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

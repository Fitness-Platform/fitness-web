import mobility from "../../../assets/home/daniela-sunset-profile.jpg";
import confidence from "../../../assets/home/daniela-partner-squat.jpg";
import strength from "../../../assets/home/daniela-kettlebell-row-wide.jpg";
import { container } from "./styles";
const stories = [
  {
    title: "IMPROVE MOBILITY",
    image: mobility,
    width: 1106,
    height: 1119,
    alt: "Daniela outdoors in the warm evening light",
    copy: "Move better, reduce stiffness and feel more capable in daily life.",
    position: "50% 40%",
  },
  {
    title: "FEEL CONFIDENT",
    image: confidence,
    width: 1118,
    height: 1214,
    alt: "Daniela and a training partner practicing a supported squat",
    copy: "Develop physical and mental strength that carries into everything you do.",
    position: "50% 35%",
  },
  {
    title: "BUILD STRENGTH",
    image: strength,
    width: 1760,
    height: 1159,
    alt: "Daniela lifting a kettlebell beside a workout bench",
    copy: "Increase muscle, support bone health and protect your independence.",
    position: "50% 50%",
  },
];
export default function HomePhilosophy() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className={`${container} scroll-mt-6 py-5 md:py-8`}
    >
      <div className="mb-2.5 md:mb-3">
        <h2
          id="approach-title"
          className="text-[1.75rem] font-semibold md:text-3xl leading-tight tracking-[-0.045em] lg:text-4xl"
        >
          A stronger way forward.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stories.map((story, index) => (
          <article key={story.title}>
            <img
              src={story.image}
              width={story.width}
              height={story.height}
              alt={story.alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: story.position }}
              className="aspect-[3/2] w-full object-cover md:aspect-[4/3]"
            />
            <div className="pt-3">
              <div aria-hidden="true" className="flex items-center gap-3 text-[#607A6D]">
                <span className="shrink-0 text-[10px] font-medium leading-4 tracking-[0.14em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 border-t border-[#607A6D]/40" />
              </div>
              <h3 className="mt-2 text-[15px] font-bold uppercase leading-5 tracking-[0.04em]">
                {story.title}
              </h3>
              <p className="mt-1.5 max-w-[32ch] text-sm leading-relaxed text-muted-foreground">
                {story.copy}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

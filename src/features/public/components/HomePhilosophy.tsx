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
      className={`${container} scroll-mt-6 py-6 md:py-8`}
    >
      <div className="mb-4 grid items-end gap-3 md:grid-cols-2">
        <h2
          id="approach-title"
          className="text-3xl font-semibold leading-tight tracking-[-0.045em] lg:text-4xl"
        >
          A stronger way forward.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:ml-auto">
          This program is about sustainable strength, confidence and long-term
          capability — training that supports how you want to live, not just how
          you want to look.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 md:gap-4">
        {stories.map((story) => (
          <article key={story.title}>
            <img
              src={story.image}
              width={story.width}
              height={story.height}
              alt={story.alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: story.position }}
              className="aspect-[4/3] w-full object-cover"
            />
            <h3 className="mt-2 text-sm font-semibold uppercase tracking-wide">
              {story.title}
            </h3>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {story.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

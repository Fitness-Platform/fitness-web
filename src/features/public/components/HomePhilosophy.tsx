import mobility from "../../../assets/home/daniela-sunset-profile.jpg";
import confidence from "../../../assets/home/daniela-smiling-portrait.jpg";
import strength from "../../../assets/home/daniela-kettlebell-row-wide.jpg";
import { container } from "./styles";
const stories = [
  {
    title: "Move better",
    image: mobility,
    width: 1106,
    height: 1119,
    alt: "Daniela outdoors in the warm evening light",
    copy: "Improve mobility, reduce stiffness and feel more capable in everyday life.",
    position: "50% 40%",
  },
  {
    title: "Feel confident",
    image: confidence,
    width: 661,
    height: 994,
    alt: "Daniela smiling with her arms raised above her head",
    copy: "Build physical and mental confidence through consistent training.",
    position: "50% 20%",
  },
  {
    title: "Build strength",
    image: strength,
    width: 1760,
    height: 1159,
    alt: "Daniela lifting a kettlebell beside a workout bench",
    copy: "Build muscle, support bone health and protect your independence.",
    position: "50% 50%",
  },
];
export default function HomePhilosophy() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className={`${container} scroll-mt-6 py-10 md:py-14`}
    >
      <div className="mb-7 grid items-end gap-5 md:grid-cols-2">
        <h2
          id="approach-title"
          className="text-4xl font-semibold leading-tight tracking-[-0.045em] lg:text-5xl"
        >
          A stronger way forward.
        </h2>
        <p className="max-w-md leading-relaxed text-muted-foreground md:ml-auto">
          Sustainable strength, confidence and long-term capability — training
          that supports how you want to live.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3 md:gap-6">
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
              className={`w-full object-cover ${story.title === "Build strength" ? "aspect-[3/2] md:aspect-square" : "aspect-square"}`}
            />
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide">
              {story.title}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {story.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

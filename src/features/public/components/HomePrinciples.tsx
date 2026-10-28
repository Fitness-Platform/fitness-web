import { Dumbbell, Footprints, Leaf, Heart } from "lucide-react";
import { container } from "./styles";
const principles = [
  {
    icon: Dumbbell,
    title: "BUILD STRENGTH",
    copy: "Increase muscle and bone health for a stronger, more independent you.",
  },
  {
    icon: Footprints,
    title: "MOVE BETTER",
    copy: "Improve mobility, stability and balance for everyday life and the activities you love.",
  },
  {
    icon: Leaf,
    title: "SUPPORT LONGEVITY",
    copy: "Train for the life you want to live.",
  },
  {
    icon: Heart,
    title: "REAL LIFE FOCUSED",
    copy: "Practical, effective and sustainable — no extremes, no perfection.",
  },
];
export default function HomePrinciples() {
  return (
    <section
      aria-label="Our training principles"
      className={`${container} py-5 md:py-6`}
    >
      <div className="grid grid-cols-2 gap-y-5 lg:grid-cols-4">
        {principles.map(({ icon: Icon, title, copy }, index) => (
          <div
            key={title}
            className={`px-4 text-center sm:px-5 ${index % 2 ? "border-l border-border" : ""} ${index === 2 ? "lg:border-l lg:border-border" : ""}`}
          >
            <Icon
              aria-hidden="true"
              size={25}
              strokeWidth={1.3}
              className="mx-auto"
            />
            <h2 className="mt-2 text-xs font-semibold uppercase tracking-wide">
              {title}
            </h2>
            <p className="mx-auto mt-1 max-w-56 text-sm leading-relaxed text-muted-foreground">
              {copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

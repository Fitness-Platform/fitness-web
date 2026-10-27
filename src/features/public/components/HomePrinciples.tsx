import { container, eyebrow } from './styles';

const PRINCIPLES = [
  {
    title: 'Science-backed',
    text: 'Training grounded in research, not trends.',
  },
  {
    title: 'Real-life focused',
    text: 'Strength that fits the life you already have.',
  },
  {
    title: 'Long-term results',
    text: 'Progress designed to last for decades.',
  },
];

export function HomePrinciples() {
  return (
    <section
      aria-label="Our principles"
      className="border-t border-[#D8D6CF] bg-[#F7F5F0]"
    >
      <div className={container}>
        <ul
          className="
            grid
            divide-y
            divide-[#D8D6CF]
            md:grid-cols-3
            md:divide-x
            md:divide-y-0
          "
        >
          {PRINCIPLES.map((item) => (
            <li
              key={item.title}
              className="
                py-8
                md:px-10
                md:py-12
                md:first:pl-0
                md:last:pr-0
              "
            >
              <p className={eyebrow}>
                {item.title}
              </p>

              <p className="mt-3 text-base text-[#202424]">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default HomePrinciples;
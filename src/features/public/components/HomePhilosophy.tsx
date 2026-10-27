import { container, eyebrow } from './styles';

const STATEMENTS = [
  'Purposeful training, not punishment',
  'Strength that carries into daily life',
  'Consistency you can sustain',
];

export function HomePhilosophy() {
  return (
    <section className="border-t border-[#D8D6CF] bg-[#F7F5F0] py-20 lg:py-32">
      <div
        className={`${container} grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-24`}
      >
        <div>
          <p className={eyebrow}>Built around your life</p>

          <h2 className="mt-6 text-[2.5rem] font-bold leading-[1.04] tracking-[-0.03em] text-[#202424] sm:text-6xl lg:mt-7 lg:text-[4.75rem]">
            More than a workout. A stronger way forward.
          </h2>
        </div>

        <div className="lg:pt-11">
          <p className="text-base leading-[1.7] text-[#686B68] sm:text-lg">
            Daniela’s approach is about sustainable strength, confidence and
            long-term capability — training that supports how you want to live,
            not just how you want to look.
          </p>

          <ul className="mt-9 border-t border-[#D8D6CF]">
            {STATEMENTS.map((statement) => (
              <li
                key={statement}
                className="border-b border-[#D8D6CF] py-[18px] text-base font-semibold text-[#202424]"
              >
                {statement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default HomePhilosophy;
import { Link } from 'react-router-dom';

import kettlebellRowBench from '../../../assets/home/daniela-kettlebell-row-bench.jpg';
import partnerSquat from '../../../assets/home/daniela-partner-squat.jpg';
import heroDumbbells from '../../../assets/home/hero-daniela-dumbbells.jpg';
import kettlebellBenchStance from '../../../assets/home/daniela-kettlebell-bench-stance.jpg';

import { container, eyebrow, textCta } from './styles';

const PROGRAMS_PAGE = '/programs';

interface ProgramTeaser {
  title: string;
  duration: string;
  description: string;
  image: string;
  alt: string;
  position: string;
}

const PROGRAMS: ProgramTeaser[] = [
  {
    title: 'Strength & Structure',
    duration: '6 weeks',
    description:
      'Build strength, improve body composition and feel stronger in everyday life.',
    image: kettlebellRowBench,
    alt: 'Daniela Brito performing a kettlebell row supported on a bench',
    position: 'object-[50%_40%]',
  },
  {
    title: 'Rebalance',
    duration: '12 weeks',
    description:
      'A complete program for menopause and beyond — strength, mobility and lifestyle.',
    image: partnerSquat,
    alt: 'Daniela Brito training with another woman in a supported squat',
    position: 'object-[50%_50%]',
  },
  {
    title: 'Dumbbell Strong',
    duration: '6 weeks',
    description:
      'Effective full-body training you can do anywhere with just dumbbells.',
    image: heroDumbbells,
    alt: 'Daniela Brito standing and training with dumbbells',
    position: 'object-[50%_20%]',
  },
  {
    title: 'Mobility & Longevity',
    duration: '4 weeks',
    description:
      'Move better, feel better and stay independent for decades to come.',
    image: kettlebellBenchStance,
    alt: 'Daniela Brito performing a kettlebell exercise supported on a bench',
    position: 'object-[50%_45%]',
  },
];

export function HomePrograms() {
  return (
    <section
      id="programs"
      className="
        scroll-mt-24
        border-t
        border-[#D8D6CF]
        bg-[#F7F5F0]
        py-16
        lg:py-24
      "
    >
      <div className={container}>
        <div
          className="
            flex
            flex-col
            gap-6
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p className={eyebrow}>
              Programs
            </p>

            <h2
              className="
                mt-5
                text-[2.5rem]
                font-bold
                leading-[1.05]
                tracking-[-0.03em]
                text-[#202424]
                sm:text-5xl
                lg:text-[3.5rem]
              "
            >
              Find your program.
            </h2>
          </div>

          <Link
            to={PROGRAMS_PAGE}
            className={`${textCta} hidden sm:inline-flex`}
          >
            View all programs →
          </Link>
        </div>

        <ul
          className="
            mt-10
            grid
            gap-x-6
            gap-y-10
            sm:grid-cols-2
            lg:mt-14
            lg:grid-cols-4
          "
        >
          {PROGRAMS.map((program) => (
            <li key={program.title}>
              <Link
                to={PROGRAMS_PAGE}
                className="group block"
              >
                <img
                  src={program.image}
                  alt={program.alt}
                  loading="lazy"
                  decoding="async"
                  className={`
                    aspect-[4/3]
                    w-full
                    object-cover
                    sm:aspect-[3/4]
                    ${program.position}
                  `}
                />

                <p className={`${eyebrow} mt-5`}>
                  {program.duration}
                </p>

                <h3
                  className="
                    mt-2
                    text-xl
                    font-semibold
                    tracking-[-0.01em]
                    text-[#202424]
                  "
                >
                  {program.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-[1.65]
                    text-[#686B68]
                  "
                >
                  {program.description}
                </p>

                <span
                  className={`${textCta} mt-2 inline-flex`}
                >
                  Explore →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to={PROGRAMS_PAGE}
          className={`${textCta} mt-10 inline-flex sm:hidden`}
        >
          View all programs →
        </Link>
      </div>
    </section>
  );
}

export default HomePrograms;
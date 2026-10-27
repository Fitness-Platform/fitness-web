import { Link } from 'react-router-dom';
import portrait from '../../../assets/home/meet-daniela-portrait.jpg';
import { container, eyebrow, textCta } from './styles';

// Assumed route for the full About page — adjust if yours differs.
const ABOUT_PAGE = '/about';

const BELIEFS = [
  {
    title: 'Who she helps',
    text: 'Women who want to feel strong, confident and independent.',
  },
  {
    title: 'What she believes',
    text: 'Strength supports every part of life, at every stage.',
  },
  {
    title: 'How it fits',
    text: 'Programs designed around real schedules, not perfect ones.',
  },
];

export function HomeAboutDaniela() {
  return (
    <section
      id="about"
      className="
        scroll-mt-24
        border-t
        border-[#D8D6CF]
        bg-[#F7F5F0]
        py-16
        lg:py-24
      "
    >
      <div
        className={`
          ${container}
          grid
          items-center
          gap-10
          lg:grid-cols-[minmax(0,32.5rem)_1fr]
          lg:gap-24
        `}
      >
        <figure>
          <img
            src={portrait}
            alt="Portrait of Daniela Brito smiling with her arms raised"
            loading="lazy"
            decoding="async"
            className="
              aspect-[4/5]
              w-full
              object-cover
              object-[50%_20%]
              lg:aspect-[13/18]
            "
          />
        </figure>

        <div className="max-w-xl">
          <p className={eyebrow}>
            Meet Daniela
          </p>

          <h2
            className="
              mt-6
              text-[2.25rem]
              font-bold
              leading-[1.06]
              tracking-[-0.03em]
              text-[#202424]
              sm:text-5xl
              lg:text-[3.75rem]
            "
          >
            Strength is a practice, not a performance.
          </h2>

          <p
            className="
              mt-7
              text-base
              leading-[1.7]
              text-[#686B68]
              sm:text-[17px]
            "
          >
            Daniela helps women in their 40s, 50s and beyond build strength they
            can feel in everyday life — with training that is thoughtful,
            structured and realistic about the life around it.
          </p>

          <dl className="mt-9 border-t border-[#D8D6CF]">
            {BELIEFS.map((belief) => (
              <div
                key={belief.title}
                className="border-b border-[#D8D6CF] py-[18px]"
              >
                <dt className="text-base font-semibold text-[#202424]">
                  {belief.title}
                </dt>

                <dd className="mt-1 text-sm text-[#686B68]">
                  {belief.text}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            to={ABOUT_PAGE}
            className={`${textCta} mt-6 inline-flex`}
          >
            Meet Daniela →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeAboutDaniela;
import { Link } from 'react-router-dom';

import approachImage from '../../../assets/home/daniela-kettlebell-row-bench.jpg';

import { eyebrow, textCta } from './styles';

const APPROACH_PAGE = '/about';

export function HomeApproach() {
  return (
    <section
      className="
        border-t
        border-[#D8D6CF]
        bg-[#F7F5F0]
      "
    >
      <div
        className="
          grid
          lg:min-h-[34rem]
          lg:grid-cols-[40%_60%]
        "
      >
        {/* TEXT */}
        <div
          className="
            flex
            flex-col
            justify-center
            px-6
            py-16

            sm:px-10

            lg:px-16
            lg:py-20

            xl:pl-[max(5rem,calc((100vw-90rem)/2+5rem))]
            xl:pr-20
          "
        >
          <p className={eyebrow}>
            The approach
          </p>

          <h2
            className="
              mt-6
              max-w-[28rem]
              text-[2.75rem]
              font-bold
              leading-[1.02]
              tracking-[-0.035em]
              text-[#202424]

              sm:text-5xl

              lg:text-[3.75rem]
            "
          >
            Strength that
            <br />
            supports the
            <br />
            life you want to
            <br />
            live.
          </h2>

          <p
            className="
              mt-7
              max-w-[27rem]
              text-base
              leading-[1.7]
              text-[#686B68]
            "
          >
            Every session has a purpose. Training is built to improve how you
            move, how you recover and how capable you feel — today and for the
            decades ahead.
          </p>

          <Link
            to={APPROACH_PAGE}
            className={`${textCta} mt-7 inline-flex w-fit`}
          >
            My approach →
          </Link>
        </div>

        {/* IMAGE */}
        <figure
          className="
            relative
            min-h-[24rem]
            overflow-hidden

            sm:min-h-[32rem]

            lg:min-h-0
          "
        >
          <img
            src={approachImage}
            alt="Daniela Brito performing a kettlebell row supported on a bench"
            loading="lazy"
            decoding="async"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-[50%_45%]
            "
          />
        </figure>
      </div>
    </section>
  );
}

export default HomeApproach;
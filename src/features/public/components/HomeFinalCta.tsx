import { Link } from 'react-router-dom';

const REGISTER_PAGE = '/register';
const LOGIN_PAGE = '/login';

const onGreenPrimary =
  'inline-flex h-12 items-center justify-center rounded-[2px] ' +
  'border border-[#F7F5F0] bg-[#F7F5F0] px-7 ' +
  'text-xs font-semibold uppercase tracking-[0.14em] text-[#202424] ' +
  'transition-colors hover:bg-white ' +
  'focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-[#F7F5F0]';

const onGreenOutline =
  'inline-flex h-12 items-center justify-center rounded-[2px] ' +
  'border border-[#F7F5F0] px-7 ' +
  'text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F5F0] ' +
  'transition-colors hover:bg-[#F7F5F0] hover:text-[#202424] ' +
  'focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-[#F7F5F0]';

export function HomeFinalCta() {
  return (
    <section
      aria-labelledby="home-final-cta"
      className="bg-[#607A6D] text-[#F7F5F0]"
    >
      <div
        className="
          mx-auto
          flex
          max-w-[90rem]
          flex-col
          justify-between
          gap-16
          px-6
          py-16
          sm:px-10
          lg:min-h-[47rem]
          lg:px-20
          lg:py-24
        "
      >
        <div>
          <p
            className="
              text-[11px]
              font-medium
              uppercase
              tracking-[0.18em]
            "
          >
            Start here
          </p>

          <h2
            id="home-final-cta"
            className="
              mt-6
              text-[3.25rem]
              font-bold
              leading-[0.97]
              tracking-[-0.04em]
              sm:text-[6rem]
              lg:mt-8
              lg:text-[clamp(6rem,12vw,11rem)]
            "
          >
            Let&apos;s build
            <br />
            what&apos;s next.
          </h2>
        </div>

        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <p className="max-w-md text-base leading-[1.65] sm:text-lg">
            Choose a program, create your account and train with a plan built
            for real life.
          </p>

          <div className="flex flex-col gap-4 lg:items-end">
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:gap-4
              "
            >
              <a
                href="#programs"
                className={`${onGreenPrimary} sm:min-w-[12rem]`}
              >
                Explore programs
              </a>

              <Link
                to={REGISTER_PAGE}
                className={`${onGreenOutline} sm:min-w-[12rem]`}
              >
                Start your journey
              </Link>
            </div>

            <Link
              to={LOGIN_PAGE}
              className="
                inline-flex
                min-h-11
                items-center
                text-xs
                font-semibold
                uppercase
                tracking-[0.14em]
                underline-offset-4
                hover:underline
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#F7F5F0]
              "
            >
              Already a member? Sign in →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeFinalCta;
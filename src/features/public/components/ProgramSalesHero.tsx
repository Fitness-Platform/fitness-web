import {
  CalendarDays,
  Dumbbell,
  House,
  CirclePlay,
  ArrowDown,
} from "lucide-react";
import hero from "../../../assets/home/daniela-dumbbells-fullbody.jpg";
import { container, eyebrow, textCta } from "./styles";
import type { PublicProgram } from "../api/getPublicProgram";
import ProgramEnrollmentButton from "./ProgramEnrollmentButton";

const programFacts = [
  { icon: CalendarDays, title: "6 weeks", description: "Structured plan" },
  { icon: Dumbbell, title: "Dumbbells", description: "Strength focused" },
  { icon: House, title: "Home or gym", description: "Train where you are" },
  { icon: CirclePlay, title: "On-demand", description: "Workouts anytime" },
];
type Props = {
  program: PublicProgram;
  price: string | null;
  unavailable: boolean;
  onEnroll: () => void;
  busy: boolean;
  checking: boolean;
  authenticated: boolean;
  message: string | null;
};
export default function ProgramSalesHero(props: Props) {
  const audience = props.program.name.match(/^(.*?)(Women 40\+\.?)$/);
  return (
    <section aria-labelledby="sales-title" className="border-b border-border">
      <div className={`${container} grid md:grid-cols-[1fr_0.9fr] md:gap-6`}>
        <div className="order-2 min-w-0 py-7 md:order-1 md:py-12 lg:py-16">
          <p className={eyebrow}>6-week program · Women 40+</p>
          <h1
            id="sales-title"
            className="mt-4 max-w-xl break-words text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.045em] lg:text-[3.5rem]"
          >
            {audience ? (
              <>
                {audience[1]}
                <span className="text-primary-dark">{audience[2]}</span>
              </>
            ) : (
              props.program.name
            )}
          </h1>
          <p className="mt-5 max-w-lg break-words text-sm leading-relaxed text-muted-foreground sm:text-base">
            {props.program.description}
          </p>
          <p className="mt-6 text-3xl font-semibold tracking-tight">
            {props.price ?? "Enrollment unavailable"}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
            <ProgramEnrollmentButton
              onEnroll={props.onEnroll}
              busy={props.busy}
              checking={props.checking}
              unavailable={props.unavailable}
            />
            <a
              href="#inside"
              className={`${textCta} inline-flex justify-center gap-2`}
            >
              See what's inside <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {props.authenticated
              ? "Review the current price on Stripe before paying."
              : "You'll sign in or create an account before secure checkout."}
          </p>
          {props.message && (
            <p role="alert" className="mt-4 max-w-lg text-sm text-red-700">
              {props.message}
            </p>
          )}
          <ul
            aria-label="Program at a glance"
            className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-border pt-5"
          >
            {programFacts.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <Icon
                  size={22}
                  strokeWidth={1.3}
                  aria-hidden="true"
                  className="shrink-0"
                />
                <div>
                  <p className="text-xs font-semibold">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative order-1 -mx-6 h-64 overflow-hidden sm:-mx-10 sm:h-80 md:order-2 md:mx-0 md:h-auto md:min-h-[38rem]">
          <img
            src={hero}
            width="927"
            height="1224"
            fetchPriority="high"
            decoding="async"
            alt="Daniela standing alone holding dumbbells"
            className="absolute inset-y-0 -left-[2%] h-full w-[104%] max-w-none object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}

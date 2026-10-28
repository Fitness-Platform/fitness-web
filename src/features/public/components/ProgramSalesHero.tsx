import { ArrowDown } from "lucide-react";
import hero from "../../../assets/home/daniela-dumbbells-fullbody.jpg";
import { container, eyebrow, textCta } from "./styles";
import type { PublicProgram } from "../api/getPublicProgram";
import ProgramEnrollmentButton from "./ProgramEnrollmentButton";

const programFacts = [
  { title: "6 weeks", description: "Structured plan" },
  { title: "Dumbbells", description: "Strength focused" },
  { title: "Home or gym", description: "Train where you are" },
  { title: "On-demand", description: "Workouts anytime" },
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
      <div
        className={`${container} grid md:grid-cols-[1.15fr_0.85fr] md:grid-rows-[auto_1fr] md:gap-x-6`}
      >
        <div className="min-w-0 pt-8 md:pt-12 lg:pt-16">
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
              price={props.price}
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
        </div>
        <div className="mt-6 h-[28rem] min-w-0 sm:h-[34rem] md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:h-full md:min-h-[36rem]">
          <img
            src={hero}
            width="927"
            height="1224"
            fetchPriority="high"
            decoding="async"
            alt="Daniela standing alone holding dumbbells"
            className="h-full w-full object-contain object-bottom [clip-path:inset(0_2px)]"
          />
        </div>
        <ul
          aria-label="Program at a glance"
          className="mb-8 grid self-start grid-cols-2 gap-y-5 border-t border-border pt-5 md:col-start-1 md:row-start-2 md:mt-8 md:mb-12 lg:grid-cols-4 lg:mb-16"
        >
          {programFacts.map(({ title, description }, index) => (
            <li
              key={title}
              className={`min-w-0 pr-4 ${index % 2 === 1 ? "border-l border-border pl-4" : "pl-0"} ${index > 0 ? "lg:border-l lg:border-border lg:pl-4" : ""}`}
            >
              <span
                aria-hidden="true"
                className="text-[10px] tracking-widest text-primary-dark"
              >
                0{index + 1}
              </span>
              <p className="mt-2 text-xs font-semibold uppercase">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

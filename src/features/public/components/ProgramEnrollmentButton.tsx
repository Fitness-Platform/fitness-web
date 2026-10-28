import { programEnrollmentLabel } from "../utils/programPrice";
import { primaryCta } from "./styles";

type Props = {
  price: string | null;
  onEnroll: () => void;
  busy: boolean;
  checking: boolean;
  unavailable?: boolean;
};
export default function ProgramEnrollmentButton({
  price,
  onEnroll,
  busy,
  checking,
  unavailable = false,
}: Props) {
  return (
    <button
      type="button"
      onClick={onEnroll}
      disabled={busy || checking || unavailable || !price}
      className={`${primaryCta} min-h-12 h-auto py-3 disabled:cursor-wait disabled:opacity-60`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.14em]">
        {busy
          ? "Opening secure checkout…"
          : checking
            ? "Checking session…"
            : unavailable
              ? "Enrollment unavailable"
              : programEnrollmentLabel(price)}
      </span>
    </button>
  );
}

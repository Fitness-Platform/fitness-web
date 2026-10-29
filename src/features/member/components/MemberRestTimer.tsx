import { formatRestCountdown } from "../utils/restTimer";

export default function MemberRestTimer({
  remaining,
  exerciseName,
  onDismiss,
}: {
  remaining: number;
  exerciseName: string;
  onDismiss: () => void;
}) {
  const complete = remaining === 0;
  return (
    <section
      aria-label="Rest timer"
      className="mt-4 flex items-center justify-between gap-4 border border-border border-l-2 border-l-primary-dark bg-background px-4 py-3"
    >
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Rest
        </p>
        {complete ? (
          <p className="mt-1 text-sm font-semibold text-primary-dark">
            Rest complete
          </p>
        ) : (
          <p
            role="timer"
            aria-live="off"
            aria-label={`Rest remaining for ${exerciseName}`}
            className="mt-1 text-lg font-semibold tabular-nums text-primary-dark"
          >
            {formatRestCountdown(remaining)}
          </p>
        )}
        <p className="mt-1 break-words text-xs text-muted-foreground">
          {exerciseName}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="min-h-11 shrink-0 px-2 text-sm text-primary-dark underline underline-offset-4 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-dark"
      >
        {complete ? "Dismiss rest" : "Skip rest"}
      </button>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {complete ? `Rest complete for ${exerciseName}.` : ""}
      </p>
    </section>
  );
}

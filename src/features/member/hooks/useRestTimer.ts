import { useEffect, useState } from "react";
import {
  createRestTimer,
  remainingRestSeconds,
  type RestTimerState,
} from "../utils/restTimer";

// The current exercise card owns this timer. Changing exercises/workout routes
// unmounts it, clearing both the interval and local state.
export function useRestTimer() {
  const [rest, setRest] = useState<RestTimerState | null>(null);
  const deadline = rest?.deadline;
  const complete = rest?.remaining === 0;

  useEffect(() => {
    if (deadline == null || complete) return;
    function update() {
      setRest((current) => {
        if (!current || current.deadline !== deadline) return current;
        const remaining = remainingRestSeconds(current.deadline, Date.now());
        return remaining === current.remaining
          ? current
          : { ...current, remaining };
      });
    }
    const interval = window.setInterval(update, 250);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, [deadline, complete]);

  return {
    rest,
    start: (seconds: number | null | undefined) =>
      setRest(createRestTimer(seconds, Date.now())),
    dismiss: () => setRest(null),
  };
}

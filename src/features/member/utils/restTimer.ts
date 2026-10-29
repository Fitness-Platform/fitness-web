export type RestTimerState = { deadline: number; remaining: number };

export function createRestTimer(
  seconds: number | null | undefined,
  now: number,
): RestTimerState | null {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null;
  const duration = Math.ceil(seconds);
  return { deadline: now + duration * 1000, remaining: duration };
}

export function remainingRestSeconds(deadline: number, now: number) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function formatRestCountdown(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

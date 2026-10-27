import { useEffect, useState } from "react";

// Re-evaluate time-derived statuses while the screen remains open.
export function useAccessClock() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

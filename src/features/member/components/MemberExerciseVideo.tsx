import { useState } from "react";
import { safeExternalUrl } from "../../../utils/safeExternalUrl";

export default function MemberExerciseVideo({
  url,
  name,
}: {
  url: string | null;
  name: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = url ? safeExternalUrl(url) : null;
  if (!src || failed)
    return (
      <div
        role="status"
        className="flex h-40 items-center justify-center bg-border/70 px-5 text-center text-xs text-muted-foreground sm:h-52"
      >
        {failed
          ? "Video demonstration could not be loaded."
          : "Video demonstration unavailable"}
      </div>
    );
  return (
    <video
      controls
      playsInline
      preload="metadata"
      src={src}
      onError={() => setFailed(true)}
      aria-label={`Demonstration of ${name}`}
      className="h-40 w-full bg-foreground object-contain sm:h-52"
    >
      Your browser does not support video playback.
    </video>
  );
}

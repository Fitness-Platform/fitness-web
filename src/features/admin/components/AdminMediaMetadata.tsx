import type { UploadedMedia } from "../types/adminMedia";
import { formatMediaSize } from "../utils/mediaInput";

export default function AdminMediaMetadata({
  media,
}: {
  media: UploadedMedia;
}) {
  return (
    <div className="mt-2 min-w-0 text-sm text-muted-foreground">
      <p className="font-medium text-foreground [overflow-wrap:anywhere]">
        {media.originalFilename}
      </p>
      <p className="mt-1 text-xs">
        {media.contentType} · {formatMediaSize(media.sizeBytes)} · Uploaded file
      </p>
    </div>
  );
}

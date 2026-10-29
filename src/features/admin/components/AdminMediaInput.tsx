import { useId, useRef, useState } from "react";
import type { MediaPurpose } from "../types/adminMedia";
import type { AdminMediaInputState } from "../hooks/useAdminMediaInput";
import { formatMediaSize, mediaRules } from "../utils/mediaInput";
import {
  structureCancel,
  structureInput,
  structureLabel,
} from "./programStructureStyles";

export default function AdminMediaInput({
  purpose,
  input,
  disabled = false,
}: {
  purpose: MediaPurpose;
  input: AdminMediaInputState;
  disabled?: boolean;
}) {
  const id = useId();
  const [multipleError, setMultipleError] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const rule = mediaRules[purpose];
  const video = purpose === "EXERCISE_VIDEO";
  const label = video ? "Video" : "Resource file";
  const filename = input.file?.name ?? input.media?.originalFilename;
  const size = input.file?.size ?? input.media?.sizeBytes;
  const contentType = input.file?.type ?? input.media?.contentType;
  const status =
    input.state === "authorizing"
      ? "Authorizing upload…"
      : input.state === "uploading"
        ? `Uploading…${input.progress === null ? "" : ` ${input.progress}%`}`
        : input.state === "verifying"
          ? "Verifying upload…"
          : input.state === "ready"
            ? "Ready to save"
            : input.state === "selected"
              ? "Selected · Upload and verify before saving"
              : "";
  return (
    <fieldset disabled={disabled} className="min-w-0 space-y-3">
      <legend className={structureLabel}>
        {label}
        {input.required ? " *" : " (optional)"}
      </legend>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {(["upload", "external"] as const).map((source) => (
          <label
            key={source}
            className="flex min-h-11 items-center gap-2 text-sm"
          >
            <input
              type="radio"
              name={`${id}-source`}
              value={source}
              checked={input.source === source}
              onChange={() => input.setSource(source)}
              className="accent-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
            />
            {source === "upload" ? "Upload file" : "External URL"}
          </label>
        ))}
      </div>
      {input.source === "external" ? (
        <div>
          <label className={structureLabel} htmlFor={`${id}-url`}>
            {video ? "Video URL" : "URL"}
            {input.required ? " *" : ""}
          </label>
          <input
            id={`${id}-url`}
            type="text"
            inputMode="url"
            value={input.url}
            onChange={(event) => input.setUrl(event.target.value)}
            placeholder="https://..."
            className={structureInput}
            aria-invalid={Boolean(input.urlError)}
            aria-describedby={`${id}-url-help`}
          />
          <p
            id={`${id}-url-help`}
            className={`mt-2 text-xs leading-5 ${input.urlError ? "text-red-700" : "text-muted-foreground"}`}
          >
            {input.urlError ??
              (video
                ? "Use an HTTP(S) link to a browser-compatible video."
                : "Use an HTTP(S) link to the resource.")}
          </p>
        </div>
      ) : (
        <div>
          <div
            className={`min-w-0 border px-4 py-5 ${dragging ? "border-primary-dark bg-primary/10" : "border-border"}`}
            onDragEnter={(event) => {
              event.preventDefault();
              if (!disabled) {
                dragDepth.current++;
                setDragging(true);
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = disabled ? "none" : "copy";
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              dragDepth.current--;
              if (dragDepth.current <= 0) {
                dragDepth.current = 0;
                setDragging(false);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              dragDepth.current = 0;
              setDragging(false);
              if (disabled) return;
              if (event.dataTransfer.files.length === 1) {
                setMultipleError(false);
                input.selectFile(event.dataTransfer.files[0]);
              } else if (event.dataTransfer.files.length > 1)
                setMultipleError(true);
            }}
          >
            <p className="text-sm font-medium">Drop your file here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              or choose from your computer
            </p>
            <input
              ref={fileInput}
              id={`${id}-file`}
              type="file"
              tabIndex={-1}
              accept={rule.accept}
              className="sr-only"
              aria-label={`Choose ${video ? "video" : "resource"} file`}
              aria-describedby={`${id}-rules`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setMultipleError(false);
                  input.selectFile(file);
                }
                event.target.value = "";
              }}
            />
            <button
              type="button"
              className={
                structureCancel +
                " mt-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
              }
              onClick={() => fileInput.current?.click()}
            >
              {filename ? "Replace file" : "Choose file"}
            </button>
            <p
              id={`${id}-rules`}
              className="mt-3 text-xs leading-5 text-muted-foreground"
            >
              {rule.label}. One file at a time.
            </p>
          </div>
          {filename && (
            <div className="mt-3 min-w-0">
              <p className="text-sm font-medium [overflow-wrap:anywhere]">
                {filename}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {contentType} · {formatMediaSize(size ?? 0)}
              </p>
            </div>
          )}
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-2 text-xs text-primary-dark"
          >
            {input.state === "uploading" ? "Uploading…" : status}
          </p>
          {input.state === "uploading" && (
            <div className="mt-2">
              <p aria-hidden="true" className="text-xs text-muted-foreground">
                {input.progress === null
                  ? "Transfer in progress"
                  : `${input.progress}%`}
              </p>
              <progress
                aria-label="File upload progress"
                max={100}
                value={input.progress ?? undefined}
                className="mt-1 h-1 w-full accent-primary-dark"
              />
            </div>
          )}
          {input.file && !input.busy && input.state !== "ready" && (
            <button
              type="button"
              onClick={input.upload}
              className={structureCancel + " mt-3"}
            >
              {input.state === "failed"
                ? "Retry upload"
                : "Upload file and verify"}
            </button>
          )}
          {(input.file || input.error) && (
            <button
              type="button"
              onClick={() => {
                setMultipleError(false);
                input.clearSelection();
              }}
              className="mt-2 block min-h-11 text-xs text-primary-dark underline underline-offset-4"
            >
              {input.initialMedia ? "Keep current file" : "Clear selection"}
            </button>
          )}
        </div>
      )}
      {multipleError && (
        <p role="alert" className="text-xs text-red-700">
          Choose one file at a time.
        </p>
      )}
      {input.error && (
        <p role="alert" className="text-sm text-red-700">
          {input.error}
        </p>
      )}
      {video && (input.media || input.file || input.url) && (
        <button
          type="button"
          onClick={input.remove}
          className="min-h-11 text-xs text-red-700 underline underline-offset-4"
        >
          Remove video
        </button>
      )}
      <p className="text-xs leading-5 text-muted-foreground">
        {video
          ? "Changes to the video apply when you save the exercise."
          : "The selected source applies when you save the resource."}
      </p>
    </fieldset>
  );
}

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authSessionQueryKey } from "../../auth/hooks/useAuthSession";
import { authorizeAdminMedia, completeAdminMedia } from "../api/adminMedia";
import type {
  MediaPurpose,
  MediaUploadPhase,
  UploadedMedia,
} from "../types/adminMedia";
import {
  adminMediaErrorMessage,
  mediaSourceFields,
  validateMediaFile,
} from "../utils/mediaInput";
import {
  MediaTransferError,
  putPresignedFile,
  uploadMediaFile,
} from "../utils/mediaUpload";
import { safeExternalUrl } from "../../../utils/safeExternalUrl";

type InitialMedia = {
  url?: string | null;
  uploadedMedia?: UploadedMedia | null;
};
type State = "idle" | "selected" | MediaUploadPhase | "ready" | "failed";
export function useAdminMediaInput(
  purpose: MediaPurpose,
  initial: InitialMedia = {},
) {
  const client = useQueryClient();
  const [baseline, setBaseline] = useState(initial);
  const [source, setSourceState] = useState<"upload" | "external">(
    initial.uploadedMedia ? "upload" : initial.url ? "external" : "upload",
  );
  const [url, setUrl] = useState(initial.url ?? "");
  const [media, setMedia] = useState<UploadedMedia | null>(
    initial.uploadedMedia ?? null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<State>(
    initial.uploadedMedia ? "ready" : "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const active = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const required = purpose === "PROGRAM_RESOURCE";
  const busy =
    state === "authorizing" || state === "uploading" || state === "verifying";
  const validUrl =
    (!url.trim() && !required) ||
    (url.trim().length <= 2048 && safeExternalUrl(url) !== null);
  const canSubmit =
    source === "external"
      ? validUrl
      : !busy &&
        state !== "selected" &&
        state !== "failed" &&
        (Boolean(media) || !required);
  function cancel() {
    generation.current++;
    active.current?.abort();
    active.current = null;
  }
  useEffect(
    () => () => {
      generation.current++;
      active.current?.abort();
    },
    [],
  );
  function reset(value: InitialMedia = baseline) {
    cancel();
    setBaseline(value);
    setSourceState(
      value.uploadedMedia ? "upload" : value.url ? "external" : "upload",
    );
    setUrl(value.url ?? "");
    setMedia(value.uploadedMedia ?? null);
    setFile(null);
    setState(value.uploadedMedia ? "ready" : "idle");
    setError(null);
    setProgress(null);
  }
  function setSource(value: "upload" | "external") {
    if (value === source) return;
    cancel();
    setSourceState(value);
    setFile(null);
    setMedia(baseline.uploadedMedia ?? null);
    setState(baseline.uploadedMedia ? "ready" : "idle");
    setError(null);
    setProgress(null);
  }
  function selectFile(value: File) {
    cancel();
    const invalid = validateMediaFile(value, purpose);
    setFile(invalid ? null : value);
    setMedia(null);
    setProgress(null);
    setError(invalid);
    setState(invalid ? "failed" : "selected");
  }
  function clearSelection() {
    cancel();
    setFile(null);
    setMedia(baseline.uploadedMedia ?? null);
    setState(baseline.uploadedMedia ? "ready" : "idle");
    setError(null);
    setProgress(null);
  }
  function remove() {
    cancel();
    setFile(null);
    setMedia(null);
    setUrl("");
    setSourceState("upload");
    setState("idle");
    setError(null);
    setProgress(null);
  }
  function handleRequestError(value: unknown) {
    if (
      typeof value === "object" &&
      value !== null &&
      "status" in value &&
      value.status === 401
    ) {
      client.setQueryData(authSessionQueryKey, null);
      client.removeQueries({ queryKey: ["member"] });
    }
  }
  async function upload() {
    if (!file || active.current) return;
    cancel();
    const controller = new AbortController();
    active.current = controller;
    const run = generation.current;
    setError(null);
    setProgress(null);
    try {
      const result = await uploadMediaFile(
        file,
        purpose,
        controller.signal,
        {
          authorize: authorizeAdminMedia,
          put: putPresignedFile,
          complete: completeAdminMedia,
        },
        (value) => {
          if (generation.current === run) setState(value);
        },
        (value) => {
          if (generation.current === run) setProgress(value);
        },
      );
      if (generation.current === run) {
        setMedia(result);
        setState("ready");
      }
    } catch (value) {
      if (generation.current === run && !controller.signal.aborted) {
        handleRequestError(value);
        setState("failed");
        setError(
          value instanceof MediaTransferError
            ? value.message
            : adminMediaErrorMessage(value),
        );
      }
    } finally {
      if (generation.current === run) active.current = null;
    }
  }
  return {
    source,
    setSource,
    url,
    setUrl,
    media,
    file,
    state,
    busy,
    canSubmit,
    error,
    progress,
    required,
    selectFile,
    clearSelection,
    remove,
    reset,
    upload,
    handleRequestError,
    fields: mediaSourceFields(source, url, media),
    initialMedia: baseline.uploadedMedia,
    urlError: validUrl
      ? null
      : "Enter a valid URL starting with http:// or https:// (maximum 2048 characters).",
  };
}
export type AdminMediaInputState = ReturnType<typeof useAdminMediaInput>;

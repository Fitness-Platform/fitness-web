import test from "node:test";
import assert from "node:assert/strict";
import {
  validateMediaFile,
  mediaSourceFields,
  adminMediaErrorMessage,
} from "../src/features/admin/utils/mediaInput.ts";
import {
  uploadMediaFile,
  putPresignedFile,
  MediaTransferError,
} from "../src/features/admin/utils/mediaUpload.ts";

const video = () => new File(["video"], "lesson.mp4", { type: "video/mp4" });
const grant = () => ({
  uploadId: "00000000-0000-4000-8000-000000000001",
  uploadUrl: "https://storage.example.test/signed",
  requiredHeaders: {
    "Content-Type": "video/mp4",
    "x-amz-meta-upload-id": "reference",
  },
  expiresAt: new Date(Date.now() + 300000).toISOString(),
});
const metadata = (file) => ({
  id: grant().uploadId,
  sourceType: "UPLOADED",
  originalFilename: file.name,
  contentType: file.type,
  sizeBytes: file.size,
});

test("media validation accepts exact backend MIME/size boundaries and rejects disallowed, empty and oversized files", () => {
  for (const [type, name, purpose, max] of [
    ["video/mp4", "x.mp4", "EXERCISE_VIDEO", 104857600],
    ["video/webm", "x.webm", "EXERCISE_VIDEO", 104857600],
    ["application/pdf", "x.pdf", "PROGRAM_RESOURCE", 20971520],
    ["image/jpeg", "x.jpeg", "PROGRAM_RESOURCE", 20971520],
    ["image/png", "x.png", "PROGRAM_RESOURCE", 20971520],
    ["image/webp", "x.webp", "PROGRAM_RESOURCE", 20971520],
  ]) {
    assert.equal(validateMediaFile({ name, type, size: max }, purpose), null);
    assert(validateMediaFile({ name, type, size: max + 1 }, purpose));
    assert(validateMediaFile({ name, type, size: 0 }, purpose));
  }
  for (const file of [
    { name: "movie.mov", type: "video/quicktime", size: 1 },
    { name: "movie.mov", type: "video/mp4", size: 1 },
    { name: "x.mp4", type: "text/html", size: 1 },
    { name: "x".repeat(256) + ".mp4", type: "video/mp4", size: 1 },
    { name: "x\n.mp4", type: "video/mp4", size: 1 },
  ])
    assert(validateMediaFile(file, "EXERCISE_VIDEO"));
});

test("source payload never submits both external URL and uploaded ID; empty video removal is explicit", () => {
  const media = metadata(video());
  assert.deepEqual(
    mediaSourceFields("upload", "https://external.test", media),
    { url: null, mediaId: media.id },
  );
  assert.deepEqual(
    mediaSourceFields("external", " https://external.test ", media),
    { url: "https://external.test", mediaId: null },
  );
  assert.deepEqual(mediaSourceFields("upload", "", null), {
    url: null,
    mediaId: null,
  });
});

test("upload workflow authorizes metadata, PUTs, then verifies; only verified metadata becomes ready", async () => {
  const file = video(),
    auth = grant(),
    calls = [],
    phases = [];
  const result = await uploadMediaFile(
    file,
    "EXERCISE_VIDEO",
    new AbortController().signal,
    {
      authorize: async (request) => {
        calls.push("authorize");
        assert.deepEqual(request, {
          purpose: "EXERCISE_VIDEO",
          originalFilename: file.name,
          contentType: file.type,
          sizeBytes: file.size,
        });
        return auth;
      },
      put: async (a, f, s, progress) => {
        calls.push("put");
        assert.equal(a, auth);
        assert.equal(f, file);
        assert.equal(s.aborted, false);
        progress(63);
      },
      complete: async (id) => {
        calls.push("complete");
        assert.equal(id, auth.uploadId);
        return metadata(file);
      },
    },
    (p) => phases.push(p),
    (p) => assert.equal(p, 63),
  );
  assert.deepEqual(calls, ["authorize", "put", "complete"]);
  assert.deepEqual(phases, ["authorizing", "uploading", "verifying"]);
  assert.deepEqual(result, metadata(file));
});

test("invalid selection never authorizes and expired authorization never PUTs", async () => {
  let authorizations = 0,
    puts = 0;
  const deps = {
    authorize: async () => {
      authorizations++;
      return { ...grant(), expiresAt: new Date(0).toISOString() };
    },
    put: async () => {
      puts++;
    },
    complete: async () => metadata(video()),
  };
  await assert.rejects(
    uploadMediaFile(
      { name: "x.mov", type: "video/quicktime", size: 1 },
      "EXERCISE_VIDEO",
      new AbortController().signal,
      deps,
      () => {},
      () => {},
    ),
    MediaTransferError,
  );
  assert.equal(authorizations, 0);
  await assert.rejects(
    uploadMediaFile(
      video(),
      "EXERCISE_VIDEO",
      new AbortController().signal,
      deps,
      () => {},
      () => {},
    ),
    /expired/,
  );
  assert.equal(authorizations, 1);
  assert.equal(puts, 0);
});

test("PUT and verification failures cannot return a usable reference and never retry automatically", async () => {
  for (const failure of ["put", "complete"]) {
    let puts = 0,
      completions = 0;
    await assert.rejects(
      uploadMediaFile(
        video(),
        "EXERCISE_VIDEO",
        new AbortController().signal,
        {
          authorize: async () => grant(),
          put: async () => {
            puts++;
            if (failure === "put") throw new MediaTransferError();
          },
          complete: async () => {
            completions++;
            throw { status: 400, payload: { code: "VERIFICATION_FAILED" } };
          },
        },
        () => {},
        () => {},
      ),
    );
    assert.equal(puts, 1);
    assert.equal(completions, failure === "put" ? 0 : 1);
  }
});

test("mismatched verification response fails closed and cancellation prevents completion", async () => {
  const controller = new AbortController();
  await assert.rejects(
    uploadMediaFile(
      video(),
      "EXERCISE_VIDEO",
      controller.signal,
      {
        authorize: async () => grant(),
        put: async () => {},
        complete: async () => ({ ...metadata(video()), sizeBytes: 999 }),
      },
      () => {},
      () => {},
    ),
    /verified/,
  );
  let completed = false;
  await assert.rejects(
    uploadMediaFile(
      video(),
      "EXERCISE_VIDEO",
      controller.signal,
      {
        authorize: async () => grant(),
        put: async () => {
          controller.abort();
        },
        complete: async () => {
          completed = true;
          return metadata(video());
        },
      },
      () => {},
      () => {},
    ),
    { name: "AbortError" },
  );
  assert.equal(completed, false);
});

function xhrDouble(status = 200) {
  return {
    status,
    withCredentials: true,
    upload: {},
    headers: {},
    open(method, url) {
      this.method = method;
      this.url = url;
    },
    setRequestHeader(key, value) {
      this.headers[key] = value;
    },
    send(body) {
      this.body = body;
      queueMicrotask(() => {
        this.upload.onprogress?.({
          lengthComputable: true,
          loaded: 2,
          total: 4,
        });
        this.onload?.();
      });
    },
    abort() {
      this.onabort?.();
    },
  };
}

test("direct XHR PUT sends only required headers, omits credentials and reports actual progress", async () => {
  const xhr = xhrDouble(),
    file = video(),
    authorization = grant(),
    progress = [];
  await putPresignedFile(
    authorization,
    file,
    new AbortController().signal,
    (p) => progress.push(p),
    () => xhr,
  );
  assert.equal(xhr.method, "PUT");
  assert.equal(xhr.url, authorization.uploadUrl);
  assert.equal(xhr.withCredentials, false);
  assert.equal(xhr.body, file);
  assert.deepEqual(xhr.headers, authorization.requiredHeaders);
  assert.deepEqual(progress, [50]);
});

test("direct PUT rejects transfer errors and insecure URLs without exposing provider response text", async () => {
  for (const status of [403, 500])
    await assert.rejects(
      putPresignedFile(
        grant(),
        video(),
        new AbortController().signal,
        () => {},
        () => xhrDouble(status),
      ),
      /Upload failed/,
    );
  await assert.rejects(
    putPresignedFile(
      { ...grant(), uploadUrl: "http://unsafe.test" },
      video(),
      new AbortController().signal,
      () => {},
      () => xhrDouble(),
    ),
    /Upload failed/,
  );
});

test("safe error mapping handles session, permission, storage, expiration and verification without raw strings", () => {
  for (const [error, match] of [
    [{ status: 401 }, /session/],
    [{ status: 403 }, /permission/],
    [{ status: 503 }, /temporarily/],
    [{ status: 409, payload: { code: "EXPIRED" } }, /expired/],
    [{ status: 400, payload: { code: "VERIFICATION_FAILED" } }, /verified/],
  ])
    assert.match(
      adminMediaErrorMessage({ ...error, message: "secret-provider-url" }),
      match,
    );
  assert(
    !adminMediaErrorMessage(new Error("secret-provider-url")).includes(
      "secret-provider-url",
    ),
  );
});

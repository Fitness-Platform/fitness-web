/* Optional browser regression: run with Vite on ADMIN_MEDIA_BASE_URL (default 5174).
   No real API/R2 required. PLAYWRIGHT_MODULE and CHROMIUM_PATH may select local tooling. */
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.ADMIN_MEDIA_BASE_URL || "http://localhost:5174";
const now = new Date().toISOString();
const videoFile = (name) => ({
  name,
  mimeType: "video/mp4",
  buffer: Buffer.from("video-fixture"),
});
const pdfFile = (name) => ({
  name,
  mimeType: "application/pdf",
  buffer: Buffer.from("pdf-fixture"),
});

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [],
    calls = [],
    entityWrites = [],
    transfers = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let authStatus = 201,
    putStatus = 200,
    completionStatus = 200,
    entityStatus = 200;
  let delayComplete = false,
    releaseComplete,
    signed = true;
  let nextId = 1;
  const uploads = new Map();
  let exercise = {
    id: "ex1",
    name: "Goblet Squat",
    equipment: "Dumbbells",
    instructions: "Controlled movement",
    videoUrl: "https://external.test/original.mp4",
    uploadedMedia: null,
    createdAt: now,
    updatedAt: now,
  };
  let resources = [];
  const program = {
    id: "p1",
    name: "Program test",
    description: "Structured strength",
    status: "DRAFT",
    priceCents: 4900,
    currency: "USD",
    createdAt: now,
    updatedAt: now,
  };
  await context.addCookies([
    { name: "XSRF-TOKEN", value: "media-csrf", url: base },
  ]);
  await page.route("**/*", async (route) => {
    const request = route.request(),
      url = new URL(request.url()),
      path = url.pathname,
      method = request.method();
    if (!path.startsWith("/api/") && url.hostname !== "private-r2.example.test")
      return route.continue();
    const headers = {
      "Access-Control-Allow-Origin": base,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type,X-XSRF-TOKEN,x-amz-meta-upload-id",
    };
    const reply = (data, status = 200) =>
      route.fulfill({ json: data, status, headers });
    if (method === "OPTIONS") return route.fulfill({ status: 204, headers });
    if (url.hostname === "private-r2.example.test") {
      assert.equal(method, "PUT");
      assert.equal(request.headers()["x-xsrf-token"], undefined);
      assert.equal(request.headers().cookie, undefined);
      assert.equal(request.headers().authorization, undefined);
      const upload = uploads.get(path.slice(1));
      assert(upload);
      assert.equal(request.headers()["content-type"], upload.contentType);
      assert.equal(request.headers()["x-amz-meta-upload-id"], upload.id);
      transfers.push(request.postDataBuffer().length);
      calls.push("PUT");
      return route.fulfill({
        status: putStatus,
        body: putStatus === 200 ? "" : "PROVIDER_SECRET_MUST_NOT_APPEAR",
        headers,
      });
    }
    if (path === "/api/auth/me")
      return signed
        ? reply({ id: "admin", email: "admin@example.test", role: "ADMIN" })
        : reply({}, 401);
    if (path === "/api/auth/csrf")
      return reply({
        token: "media-csrf",
        headerName: "X-XSRF-TOKEN",
        parameterName: "_csrf",
      });
    if (method !== "GET")
      assert.equal(request.headers()["x-xsrf-token"], "media-csrf");
    if (path === "/api/admin/media/uploads") {
      calls.push("authorize");
      if (authStatus !== 201) {
        if (authStatus === 401) signed = false;
        return reply({ detail: "PROVIDER_SECRET_MUST_NOT_APPEAR" }, authStatus);
      }
      const data = request.postDataJSON();
      assert.deepEqual(Object.keys(data).sort(), [
        "contentType",
        "originalFilename",
        "purpose",
        "sizeBytes",
      ]);
      const id = `00000000-0000-4000-8000-${String(nextId++).padStart(12, "0")}`;
      uploads.set(id, {
        id,
        sourceType: "UPLOADED",
        originalFilename: data.originalFilename,
        contentType: data.contentType,
        sizeBytes: data.sizeBytes,
      });
      return reply(
        {
          uploadId: id,
          uploadUrl: `https://private-r2.example.test/${id}?signature=private`,
          requiredHeaders: {
            "Content-Type": data.contentType,
            "x-amz-meta-upload-id": id,
          },
          expiresAt: new Date(Date.now() + 300000).toISOString(),
        },
        201,
      );
    }
    if (path.endsWith("/complete")) {
      calls.push("complete");
      if (delayComplete)
        await new Promise((resolve) => {
          releaseComplete = resolve;
        });
      return completionStatus === 200
        ? reply(uploads.get(path.split("/").at(-2)))
        : reply(
            {
              code: "VERIFICATION_FAILED",
              detail: "PROVIDER_SECRET_MUST_NOT_APPEAR",
            },
            completionStatus,
          );
    }
    if (
      (path === "/api/admin/exercises" && method === "POST") ||
      (path === "/api/admin/exercises/ex1" && method === "PUT")
    ) {
      calls.push("entity");
      const data = request.postDataJSON();
      entityWrites.push(data);
      assert(!(data.videoUrl && data.videoMediaId));
      if (entityStatus !== 200)
        return reply(
          { detail: "PROVIDER_SECRET_MUST_NOT_APPEAR" },
          entityStatus,
        );
      exercise = {
        ...exercise,
        ...data,
        uploadedMedia: data.videoMediaId
          ? uploads.get(data.videoMediaId)
          : null,
      };
      return reply(exercise, method === "POST" ? 201 : 200);
    }
    if (
      path.startsWith("/api/admin/programs/p1/resources") &&
      method !== "GET"
    ) {
      calls.push("entity");
      const data = request.postDataJSON();
      entityWrites.push(data);
      assert(!(data.url && data.mediaId));
      assert(data.url || data.mediaId);
      const resource = {
        id: "r1",
        programId: "p1",
        createdAt: now,
        updatedAt: now,
        ...data,
        uploadedMedia: data.mediaId ? uploads.get(data.mediaId) : null,
      };
      resources = [resource];
      return reply(resource, method === "POST" ? 201 : 200);
    }
    if (path === "/api/admin/exercises") return reply([exercise]);
    if (path === "/api/admin/exercises/ex1") return reply(exercise);
    if (path === "/api/admin/programs/p1") return reply(program);
    if (path === "/api/admin/programs") return reply([program]);
    if (path === "/api/admin/programs/p1/resources") return reply(resources);
    if (
      path === "/api/admin/programs/p1/weeks" ||
      path === "/api/admin/workouts"
    )
      return reply([]);
    throw Error(`Unexpected mocked request ${method} ${path}`);
  });
  const go = async (path) => {
    await page.goto(base + path);
    await page.locator("main h1").waitFor();
  };
  const create = async () => {
    await go("/admin/exercises");
    await page.getByRole("button", { name: /Create Exercise/ }).click();
    return page.getByRole("dialog");
  };
  const choose = async (dialog, file) =>
    dialog.locator("input[type=file]").setInputFiles(file);
  const verify = async (dialog) => {
    await dialog
      .getByRole("button", { name: /Upload file and verify|Retry upload/ })
      .click();
    await dialog.getByText("Ready to save", { exact: true }).waitFor();
  };
  const edit = async () => {
    await go("/admin/exercises/ex1");
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    return page.locator("form").first();
  };
  const addResource = async () => {
    await go("/admin/programs/p1");
    await page
      .getByRole("button", { name: "Add Resource", exact: true })
      .click();
    return page.getByRole("dialog");
  };
  const editResource = async () => {
    await go("/admin/programs/p1");
    await page
      .getByRole("button", { name: "Edit resource Guide", exact: true })
      .click();
    return page.getByRole("dialog");
  };

  let dialog = await create();
  await dialog.getByLabel("Exercise Name *").fill("Goblet Squat");
  let authorizations = calls.filter((x) => x === "authorize").length;
  await choose(dialog, {
    name: "bad.mov",
    mimeType: "video/quicktime",
    buffer: Buffer.from("x"),
  });
  await dialog
    .getByRole("alert")
    .filter({ hasText: "Choose an MP4 or WebM video." })
    .waitFor();
  assert.equal(calls.filter((x) => x === "authorize").length, authorizations);
  assert(
    await dialog
      .getByRole("button", { name: "Create Exercise", exact: true })
      .isDisabled(),
  );
  await choose(dialog, videoFile("lesson.mp4"));
  assert(
    await dialog
      .getByRole("button", { name: "Create Exercise", exact: true })
      .isDisabled(),
  );
  delayComplete = true;
  await dialog
    .getByRole("button", { name: "Upload file and verify", exact: true })
    .click();
  await dialog.getByText("Verifying upload…", { exact: true }).waitFor();
  assert(
    await dialog
      .getByRole("button", { name: "Create Exercise", exact: true })
      .isDisabled(),
  );
  assert.equal(entityWrites.length, 0);
  delayComplete = false;
  releaseComplete();
  await dialog.getByText("Ready to save", { exact: true }).waitFor();
  await dialog
    .getByRole("button", { name: "Create Exercise", exact: true })
    .click();
  await dialog.waitFor({ state: "hidden" });
  assert.deepEqual(calls.slice(-4), ["authorize", "PUT", "complete", "entity"]);
  assert(entityWrites.at(-1).videoMediaId);
  assert.equal(entityWrites.at(-1).videoUrl, null);
  console.log(
    "PASS selection, invalid type, progress/verification gate, CSRF, credential-free PUT, uploaded Exercise create",
  );

  dialog = await edit();
  assert(
    await dialog
      .getByRole("radio", { name: "Upload file", exact: true })
      .isChecked(),
  );
  await dialog.getByText("lesson.mp4", { exact: true }).waitFor();
  await choose(dialog, videoFile("replacement.mp4"));
  await verify(dialog);
  const newId = [...uploads.keys()].at(-1);
  await dialog
    .getByRole("button", { name: "Save Changes", exact: true })
    .click();
  await page.getByRole("button", { name: "Edit", exact: true }).waitFor();
  await page.getByText("replacement.mp4", { exact: true }).waitFor();
  assert.equal(entityWrites.at(-1).videoMediaId, newId);
  dialog = await edit();
  await dialog
    .getByRole("radio", { name: "External URL", exact: true })
    .check();
  await dialog
    .getByLabel("Video URL", { exact: true })
    .fill("http://external.test/new.mp4");
  await dialog
    .getByRole("button", { name: "Save Changes", exact: true })
    .click();
  await page.getByRole("link", { name: "View Video →", exact: true }).waitFor();
  assert.equal(entityWrites.at(-1).videoMediaId, null);
  assert.equal(entityWrites.at(-1).videoUrl, "http://external.test/new.mp4");
  dialog = await edit();
  await page.waitForFunction(
    () => document.querySelector("input[type=radio][value=external]")?.checked,
  );
  assert(
    await dialog
      .getByRole("radio", { name: "External URL", exact: true })
      .isChecked(),
  );
  await dialog.getByRole("radio", { name: "Upload file", exact: true }).check();
  await choose(dialog, videoFile("again.mp4"));
  await verify(dialog);
  await dialog
    .getByRole("button", { name: "Save Changes", exact: true })
    .click();
  await page.getByRole("button", { name: "Edit", exact: true }).waitFor();
  await page.getByText("again.mp4", { exact: true }).waitFor();
  dialog = await edit();
  await dialog
    .getByRole("button", { name: "Remove video", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Save Changes", exact: true })
    .click();
  await page.getByText("No video available.", { exact: true }).waitFor();
  assert.equal(entityWrites.at(-1).videoMediaId, null);
  assert.equal(entityWrites.at(-1).videoUrl, null);
  console.log(
    "PASS uploaded replacement, uploaded/external transitions, and video removal",
  );

  dialog = await addResource();
  await dialog.getByLabel("Title *", { exact: true }).fill("Guide");
  assert(
    await dialog
      .getByRole("button", { name: "Add Resource", exact: true })
      .isDisabled(),
  );
  const transfer = await page.evaluateHandle(() => {
    const dt = new DataTransfer();
    dt.items.add(
      new File(["pdf-fixture"], "guide.pdf", { type: "application/pdf" }),
    );
    return dt;
  });
  await dialog
    .getByText("Drop your file here", { exact: true })
    .dispatchEvent("drop", { dataTransfer: transfer });
  await transfer.dispose();
  await verify(dialog);
  await dialog
    .getByRole("button", { name: "Add Resource", exact: true })
    .click();
  await dialog.waitFor({ state: "hidden" });
  assert(entityWrites.at(-1).mediaId);
  assert.equal(entityWrites.at(-1).url, null);
  dialog = await editResource();
  assert(
    await dialog
      .getByRole("radio", { name: "Upload file", exact: true })
      .isChecked(),
  );
  await choose(dialog, pdfFile("updated.pdf"));
  await verify(dialog);
  await dialog
    .getByRole("button", { name: "Save Changes", exact: true })
    .click();
  await page.getByText("updated.pdf", { exact: true }).waitFor();
  dialog = await editResource();
  await dialog
    .getByRole("radio", { name: "External URL", exact: true })
    .check();
  await dialog
    .getByLabel("URL *", { exact: true })
    .fill("https://external.test/guide.pdf");
  await dialog
    .getByRole("button", { name: "Save Changes", exact: true })
    .click();
  await dialog.waitFor({ state: "hidden" });
  assert.equal(entityWrites.at(-1).url, "https://external.test/guide.pdf");
  assert.equal(entityWrites.at(-1).mediaId, null);
  dialog = await editResource();
  await dialog.getByRole("radio", { name: "Upload file", exact: true }).check();
  await choose(dialog, pdfFile("final.pdf"));
  await verify(dialog);
  await dialog
    .getByRole("button", { name: "Save Changes", exact: true })
    .click();
  await dialog.waitFor({ state: "hidden" });
  console.log(
    "PASS resource drag/drop, create, replacement, external/uploaded source transitions",
  );

  dialog = await create();
  await choose(dialog, videoFile("retry.mp4"));
  putStatus = 403;
  await dialog
    .getByRole("button", { name: "Upload file and verify", exact: true })
    .click();
  await dialog
    .getByRole("alert")
    .filter({ hasText: "Upload failed." })
    .waitFor();
  assert(!(await dialog.innerText()).includes("PROVIDER_SECRET"));
  assert(
    await dialog
      .getByRole("button", { name: "Create Exercise", exact: true })
      .isDisabled(),
  );
  putStatus = 200;
  completionStatus = 400;
  await dialog
    .getByRole("button", { name: "Retry upload", exact: true })
    .click();
  await dialog
    .getByRole("alert")
    .filter({ hasText: "could not be verified" })
    .waitFor();
  assert(
    await dialog
      .getByRole("button", { name: "Create Exercise", exact: true })
      .isDisabled(),
  );
  completionStatus = 200;
  await verify(dialog);
  await dialog.getByLabel("Exercise Name *").fill("Failure stays open");
  entityStatus = 500;
  await dialog
    .getByRole("button", { name: "Create Exercise", exact: true })
    .click();
  await dialog
    .getByRole("alert")
    .filter({ hasText: "Unable to save this media." })
    .waitFor();
  assert(await dialog.isVisible());
  entityStatus = 200;
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  for (const status of [403, 503]) {
    authStatus = status;
    dialog = await create();
    await choose(dialog, videoFile("denied.mp4"));
    await dialog
      .getByRole("button", { name: "Upload file and verify", exact: true })
      .click();
    await dialog.getByRole("alert").waitFor();
    assert(!(await dialog.innerText()).includes("PROVIDER_SECRET"));
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  }
  authStatus = 201;
  console.log(
    "PASS PUT failure, completion failure, manual retry, entity failure, 403 and 503 safe errors",
  );

  const longName = "very-long-daniela-training-file-".repeat(7) + "demo.mp4";
  for (const width of [1440, 1024, 768, 430, 393, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const kind of [
      "create-exercise",
      "edit-exercise",
      "create-resource",
      "edit-resource",
    ]) {
      dialog =
        kind === "create-exercise"
          ? await create()
          : kind === "edit-exercise"
            ? await edit()
            : kind === "create-resource"
              ? await addResource()
              : await editResource();
      if (kind === "edit-exercise")
        await dialog
          .getByRole("radio", { name: "Upload file", exact: true })
          .check();
      await choose(
        dialog,
        kind.includes("resource")
          ? pdfFile(longName.replace(".mp4", ".pdf"))
          : videoFile(longName),
      );
      await page.keyboard.press("Tab");
      await dialog
        .getByRole("button", { name: "Replace file", exact: true })
        .focus();
      assert(
        await dialog
          .getByRole("button", { name: "Replace file", exact: true })
          .evaluate((e) => getComputedStyle(e).outlineStyle !== "none"),
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        kind + " " + width + " page overflow",
      );
      assert(
        await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth),
        kind + " " + width + " form overflow",
      );
      if (width === 375 || width === 1440)
        await page.screenshot({
          path: `/tmp/media-${kind}-${width}.png`,
          fullPage: true,
        });
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    }
    console.log(
      "PASS four forms, focus, long filenames and no horizontal overflow at",
      width,
    );
  }
  dialog = await create();
  await dialog
    .getByRole("button", { name: "Choose file", exact: true })
    .focus();
  const chooser = page.waitForEvent("filechooser");
  await page.keyboard.press("Enter");
  await (await chooser).setFiles(videoFile("keyboard.mp4"));
  await dialog.getByText("keyboard.mp4", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  authStatus = 401;
  dialog = await create();
  await choose(dialog, videoFile("expired.mp4"));
  await dialog
    .getByRole("button", { name: "Upload file and verify", exact: true })
    .click();
  await page.waitForURL("**/login");
  assert.equal(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
    0,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS keyboard file chooser, Escape, 401 session expiry and no storage persistence",
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

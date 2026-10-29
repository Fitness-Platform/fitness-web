/* Optional contract-based browser regression. See docs/member-final-audit.md. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.MEMBER_BASE_URL || "http://localhost:5174";
const ids = {
  p: "11111111-1111-4111-8111-111111111111",
  p2: "22222222-2222-4222-8222-222222222222",
  w: "33333333-3333-4333-8333-333333333333",
  locked: "33333333-3333-4333-8333-333333333334",
  a: "44444444-4444-4444-8444-444444444444",
  b: "55555555-5555-4555-8555-555555555555",
  e: "66666666-6666-4666-8666-666666666666",
  e2: "77777777-7777-4777-8777-777777777777",
};
const programPath = `/app/programs/${ids.p}`,
  weekPath = `${programPath}/weeks/${ids.w}`,
  workoutPath = `${weekPath}/workouts/${ids.a}`;
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
  });
  try {
    const context = await browser.newContext({ timezoneId: "America/Cuiaba" }),
      page = await context.newPage();
    const now = "2026-10-29T16:00:00Z";
    let signed = true,
      role = "USER",
      user = "member@example.com",
      listMode = "multiple",
      levelError = null,
      saveError = 0,
      completeError = 0,
      videoMode = "absent",
      delay = 0,
      emptyWeek = false,
      emptyWorkout = false,
      longNames = false,
      restSeconds = 90,
      prescribedSets = 2;
    const writes = [],
      pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    const attempts = new Map();
    const attempt = (id) => {
      if (!attempts.has(id)) attempts.set(id, { sets: {}, completedAt: null });
      return attempts.get(id);
    };
    const summary = (id) => ({
      programId: id,
      name: longNames
        ? "StrengthTraining".repeat(12)
        : user === "second@example.com"
          ? "Second account program"
          : id === ids.p
            ? "Strength Program"
            : "Second Program",
      description: "A progressive training program.",
      accessStartsAt: "2026-01-01T00:00:00Z",
      accessExpiresAt: null,
    });
    const exercises = (id) =>
      [ids.e, ids.e2].map((eid, i) => ({
        workoutExerciseId: eid,
        exerciseId: eid,
        name: longNames
          ? "GobletSquat".repeat(15)
          : i
            ? "Dumbbell Row"
            : "Goblet Squat",
        instructions: "Keep a controlled tempo.",
        equipment: "Dumbbell",
        videoUrl:
          i || videoMode === "absent"
            ? null
            : videoMode === "invalid"
              ? "javascript:alert(1)"
              : `https://media.example.test/${videoMode}.webm`,
        sets: prescribedSets,
        reps: "8–10",
        suggestedWeightLb: 12.5,
        currentWeightLb: i ? null : 15,
        restSeconds: i ? 45 : restSeconds,
        notes: "Maintain a stable torso.",
        position: i + 1,
        completedSets: Object.values(attempt(id).sets).filter(
          (s) => s.workoutExerciseId === eid,
        ),
        previousSets: [{ setNumber: 1, reps: 8, weightLb: 10 }],
      }));
    await context.addCookies([
      { name: "XSRF-TOKEN", value: "member-csrf", url: base },
      {
        name: "AUTH_TOKEN",
        value: "session-cookie",
        url: base,
        httpOnly: true,
      },
    ]);
    await page.route("https://media.example.test/**", (r) =>
      r.fulfill(
        process.env.MEMBER_VIDEO_FIXTURE &&
          r.request().url().endsWith("/valid.webm")
          ? {
              status: 200,
              contentType: "video/webm",
              body: fs.readFileSync(process.env.MEMBER_VIDEO_FIXTURE),
            }
          : { status: 404, body: "" },
      ),
    );
    await page.route("**/api/**", async (route) => {
      const req = route.request(),
        path = new URL(req.url()).pathname,
        method = req.method();
      if (!path.startsWith("/api/")) return route.continue();
      const reply = (json, status = 200) => route.fulfill({ json, status });
      if (path === "/api/auth/me")
        return signed ? reply({ id: user, email: user, role }) : reply({}, 401);
      if (path === "/api/auth/csrf")
        return reply({
          token: "member-csrf",
          headerName: "X-XSRF-TOKEN",
          parameterName: "_csrf",
        });
      if (path === "/api/auth/login") {
        assert.equal(req.headers()["x-xsrf-token"], "member-csrf");
        signed = true;
        user = req.postDataJSON().email;
        return route.fulfill({ status: 204, body: "" });
      }
      if (path === "/api/auth/logout") {
        assert.equal(req.headers()["x-xsrf-token"], "member-csrf");
        signed = false;
        return route.fulfill({ status: 204, body: "" });
      }
      if (path.startsWith("/api/admin/")) return reply([]);
      if (path.startsWith("/api/programs")) return reply({}, 404);
      assert(path.startsWith("/api/me/programs"), "Unexpected API " + path);
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      const parts = path.split("/");
      const level =
        parts.length === 4
          ? "list"
          : parts.length === 5
            ? "program"
            : parts.length === 7
              ? "week"
              : "workout";
      if (levelError && levelError.level === level && method === "GET")
        return reply(
          {
            detail: "Internal identifier 12345678-1234-1234-1234-123456789abc",
          },
          levelError.status,
        );
      if (method !== "GET") {
        assert.equal(req.headers()["x-xsrf-token"], "member-csrf");
        assert(
          (req.headers().cookie || "").includes("AUTH_TOKEN=session-cookie"),
        );
        writes.push({ path, method, body: req.postDataJSON() });
        const state = attempt(parts[8]);
        if (path.endsWith("/complete")) {
          if (completeError) return reply({}, completeError);
          if (Object.keys(state.sets).length < 4) return reply({}, 409);
          state.completedAt = now;
          return reply({
            programAccessWorkoutId: "attempt",
            programWeekWorkoutId: parts[8],
            startedAt: now,
            completedAt: now,
          });
        }
        if (saveError) {
          if (saveError === 401) signed = false;
          return reply({}, saveError);
        }
        const match = path.match(/\/exercises\/([^/]+)\/sets\/(\d+)$/);
        assert(match);
        const body = req.postDataJSON();
        assert.deepEqual(Object.keys(body).sort(), ["reps", "weightLb"]);
        const saved = {
          id: match[1] + match[2],
          workoutExerciseId: match[1],
          setNumber: Number(match[2]),
          ...body,
          completedAt: now,
        };
        state.sets[saved.id] = saved;
        return reply(saved);
      }
      if (level === "list")
        return reply(
          listMode === "none"
            ? []
            : listMode === "single"
              ? [summary(ids.p)]
              : [summary(ids.p), summary(ids.p2)],
        );
      if (parts[4] !== ids.p) return reply({}, 403);
      if (level === "program")
        return reply({
          ...summary(ids.p),
          resources: [
            {
              resourceId: "resource",
              title: longNames ? "TrainingGuide".repeat(15) : "Training Guide",
              description: "Your guide",
              url: "https://example.com/guide",
              position: 1,
            },
            {
              resourceId: "unsafe",
              title: "Unavailable resource",
              description: null,
              url: "javascript:alert(1)",
              position: 2,
            },
          ],
          weeks: [
            {
              weekId: ids.w,
              title: longNames ? "WeekTitle".repeat(15) : "Week One",
              description: "Build a foundation.",
              position: 1,
              unlocked: true,
              unlocksAt: now,
            },
            {
              weekId: ids.locked,
              title: "Week Two",
              description: "Next phase.",
              position: 2,
              unlocked: false,
              unlocksAt: "2027-01-01T00:00:00Z",
            },
          ],
        });
      if (parts[6] === ids.locked) return reply({}, 403);
      if (level === "week")
        return reply({
          weekId: ids.w,
          title: longNames ? "WeekTitle".repeat(15) : "Week One",
          description: "Build a foundation.",
          position: 1,
          workouts: emptyWeek
            ? []
            : [
                {
                  programWeekWorkoutId: ids.a,
                  name: "Session One",
                  description: "Strength practice",
                  position: 1,
                },
                {
                  programWeekWorkoutId: ids.b,
                  name: "Session Two",
                  description: "Repeat practice",
                  position: 2,
                },
              ],
        });
      return reply({
        programWeekWorkoutId: parts[8],
        workoutId: "workout",
        name: longNames
          ? "WorkoutTitle".repeat(15)
          : parts[8] === ids.a
            ? "Session One"
            : "Session Two",
        description: "Strength practice",
        position: 1,
        startedAt: Object.keys(attempt(parts[8]).sets).length ? now : null,
        completedAt: attempt(parts[8]).completedAt,
        exercises: emptyWorkout ? [] : exercises(parts[8]),
      });
    });
    async function go(path) {
      await page.goto(base + path);
    }
    async function noOverflow() {
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "horizontal overflow at " + page.url(),
      );
    }
    async function save(reps = "8", weight = "15.25") {
      await page.getByLabel("Reps", { exact: true }).fill(reps);
      await page.getByLabel("Weight (lb)", { exact: true }).fill(weight);
      await page
        .getByRole("button", { name: /^(Complete Set|Update Set)$/ })
        .click();
      await page
        .getByText(/sets saved$/)
        .filter({ hasText: /[12] of 2/ })
        .waitFor();
    }
    for (const width of [1440, 1024, 768, 430, 393, 375]) {
      await page.setViewportSize({ width, height: 1000 });
      longNames = true;
      for (const path of [
        "/app",
        "/app/programs",
        programPath,
        weekPath,
        workoutPath,
      ]) {
        await go(path);
        await page.locator("main h1").waitFor();
        if (path === workoutPath)
          await page
            .getByRole("heading", { name: "Set tracking", exact: true })
            .waitFor();
        await noOverflow();
        assert.equal(
          await page.locator('a[href*="/groups"],a[href*="/coaching"]').count(),
          0,
        );
        assert(
          !(await page.locator("main").innerText()).includes(
            "Photo placeholder",
          ),
        );
      }
      await page.getByRole("button", { name: "Next →", exact: true }).click();
      await page.getByText("Exercise 2 of 2", { exact: true }).waitFor();
      assert.equal(
        await page.evaluate(() => document.activeElement?.tagName),
        "H2",
      );
      await noOverflow();
      longNames = false;
      console.log(
        "PASS responsive journey / long names / MVP navigation",
        width,
      );
    }
    await go("/app");
    await page
      .getByRole("link", { name: "View my programs", exact: true })
      .click();
    await page.waitForURL("**/app/programs");
    await page.getByRole("link", { name: /Strength Program/ }).click();
    await page.waitForURL("**" + programPath);
    assert.equal(
      await page.getByRole("link", { name: /Open week 2/ }).count(),
      0,
    );
    assert.equal(
      await page
        .getByRole("link", {
          name: "Training Guide (opens in a new tab)",
          exact: true,
        })
        .getAttribute("href"),
      "https://example.com/guide",
    );
    assert.equal(await page.locator('a[href^="javascript:"]').count(), 0);
    await page.getByRole("link", { name: /Open week 1/ }).click();
    await page.getByRole("link", { name: /Open workout 1/ }).click();
    await page
      .getByRole("heading", { name: "Goblet Squat", exact: true })
      .waitFor();
    assert(
      await page
        .getByRole("button", { name: "Complete Workout", exact: true })
        .isDisabled(),
    );
    await page.getByText("1 min 30 sec", { exact: true }).waitFor();
    await page.getByText("Current load", { exact: true }).waitFor();
    await page.getByText("8 reps · 10 lb", { exact: true }).waitFor();
    assert.equal(await page.locator("video").count(), 0);
    await page.getByLabel("Reps", { exact: true }).fill("8");
    await page.getByLabel("Weight (lb)", { exact: true }).fill("12.345");
    assert(
      await page
        .getByRole("button", { name: "Complete Set", exact: true })
        .isDisabled(),
    );
    saveError = 500;
    await page.getByLabel("Weight (lb)", { exact: true }).fill("15.25");
    await page
      .getByRole("button", { name: "Complete Set", exact: true })
      .click();
    await page
      .getByText("We couldn't save this set. Check the values and try again.", {
        exact: true,
      })
      .waitFor();
    assert.equal(Object.keys(attempt(ids.a).sets).length, 0);
    saveError = 0;
    await save();
    await page
      .getByRole("button", { name: "Edit set 1", exact: true })
      .waitFor();
    await page.getByRole("button", { name: "Edit set 1", exact: true }).click();
    assert(
      await page
        .getByRole("button", { name: "Next →", exact: true })
        .isDisabled(),
    );
    await page.getByLabel("Reps", { exact: true }).fill("11");
    const before = writes.length;
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.equal(writes.length, before);
    await page.getByRole("button", { name: "Edit set 1", exact: true }).click();
    await save("9", "17.5");
    await page.getByText("9 reps · 17.5 lb", { exact: true }).waitFor();
    await page.reload();
    await page.getByText("9 reps · 17.5 lb", { exact: true }).waitFor();
    await save("10", "17.5");
    await page.getByText("All sets completed", { exact: true }).waitFor();
    assert(
      await page
        .getByRole("button", { name: "Complete Workout", exact: true })
        .isDisabled(),
    );
    await page.getByRole("button", { name: "Next →", exact: true }).click();
    await page.getByText("Exercise 2 of 2", { exact: true }).waitFor();
    await save("8", "12.5");
    await page
      .getByRole("button", { name: "Edit set 1", exact: true })
      .waitFor();
    await save("8", "12.5");
    await page.getByText("All sets completed", { exact: true }).waitFor();
    assert(
      await page
        .getByRole("button", { name: "Complete Workout", exact: true })
        .isEnabled(),
    );
    completeError = 500;
    await page
      .getByRole("button", { name: "Complete Workout", exact: true })
      .click();
    await page
      .getByText(
        "We couldn't complete this workout. Make sure every set is saved and try again.",
        { exact: true },
      )
      .waitFor();
    completeError = 0;
    await page
      .getByRole("button", { name: "Complete Workout", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Workout completed", exact: true })
      .waitFor();
    await page.reload();
    await page
      .getByRole("heading", { name: "Workout completed", exact: true })
      .waitFor();
    await page.getByText("Review completed exercises", { exact: true }).click();
    assert.equal(
      await page
        .getByRole("region", { name: "Rest timer", exact: true })
        .count(),
      0,
    );
    assert.equal(
      await page.getByRole("button", { name: /Edit set/ }).count(),
      0,
    );
    await page
      .getByRole("link", { name: "Back to week overview", exact: true })
      .click();
    await page.getByRole("link", { name: /Open workout 2/ }).click();
    await page.getByText("0 of 2 sets saved", { exact: true }).waitFor();
    console.log(
      "PASS save/edit/cancel, validation, refresh, errors, completion and read-only review; attempt isolation",
    );
    for (const mode of ["invalid", "broken", "valid"]) {
      videoMode = mode;
      await go(workoutPath.replace(ids.a, ids.b));
      if (mode === "invalid") {
        await page
          .getByText("Video demonstration unavailable", { exact: true })
          .waitFor();
        assert.equal(await page.locator("video").count(), 0);
      } else if (mode === "broken" || !process.env.MEMBER_VIDEO_FIXTURE) {
        await page
          .getByText("Video demonstration could not be loaded.", {
            exact: true,
          })
          .waitFor();
      } else {
        const video = page.getByLabel("Demonstration of Goblet Squat", {
          exact: true,
        });
        assert(await video.evaluate((v) => v.controls && v.playsInline));
        await video.evaluate((v) => v.play());
        await page.waitForTimeout(200);
        assert(await video.evaluate((v) => v.currentTime > 0));
        await video.evaluate((v) => v.pause());
      }
      await noOverflow();
    }
    videoMode = "absent";
    console.log(
      "PASS video absent/invalid/broken states" +
        (process.env.MEMBER_VIDEO_FIXTURE
          ? " and real fixture playback"
          : " (playback skipped: no fixture)"),
    );
    for (const mode of ["single", "none"]) {
      listMode = mode;
      await go("/app/programs");
      if (mode === "none")
        await page
          .getByText("No programs available yet.", { exact: true })
          .waitFor();
      else {
        await page.getByRole("link", { name: /Strength Program/ }).waitFor();
        assert.equal(
          await page.locator('main a[href^="/app/programs/"]').count(),
          1,
        );
      }
    }
    listMode = "multiple";
    emptyWeek = true;
    await go(weekPath);
    await page
      .getByText("No workouts available yet.", { exact: true })
      .waitFor();
    emptyWeek = false;
    emptyWorkout = true;
    await go(workoutPath.replace(ids.a, ids.b));
    await page
      .getByText("No exercises available yet.", { exact: true })
      .waitFor();
    emptyWorkout = false;
    for (const [level, path] of [
      ["list", "/app"],
      ["list", "/app/programs"],
      ["program", programPath],
      ["week", weekPath],
      ["workout", workoutPath],
    ]) {
      delay = 250;
      await go(path);
      await page.getByText(/^Loading /).waitFor();
      await page.locator("main h1").waitFor();
      await page.waitForTimeout(300);
      delay = 0;
      for (const status of [403, 404, 500]) {
        levelError = { level, status };
        await go(path);
        await page
          .getByRole("alert")
          .or(
            page.getByText(
              /don't have access|isn't currently available|isn't available/,
            ),
          )
          .first()
          .waitFor();
        assert(
          !(await page.locator("main").innerText()).includes("12345678-1234"),
        );
        if (status === 500) {
          levelError = null;
          await page
            .getByRole("button", { name: "Try again", exact: true })
            .click();
          await page.waitForTimeout(200);
        }
      }
      levelError = null;
    }
    for (const path of ["/app/groups", "/app/coaching", "/app/not-real"]) {
      await go(path);
      await page
        .getByRole("heading", { name: "Page not found", exact: true })
        .waitFor();
    }
    await go("/app");
    await page.locator("main h1").waitFor();
    await page
      .getByRole("button", { name: "Open account menu", exact: true })
      .click();
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .getByRole("button", { name: "Open account menu", exact: true })
        .getAttribute("aria-expanded"),
      "false",
    );
    await page
      .getByRole("button", { name: "Open account menu", exact: true })
      .click();
    await page.getByRole("menuitem", { name: "Sign out", exact: true }).click();
    await page.waitForURL("**/login");
    await go(workoutPath);
    await page.waitForURL("**/login");
    await page.getByLabel("Email", { exact: true }).fill("second@example.com");
    await page.getByLabel("Password", { exact: true }).fill("Testing123!");
    delay = 400;
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL("**/app");
    assert.equal(
      await page
        .getByRole("heading", { name: "Strength Program", exact: true })
        .count(),
      0,
    );
    await page
      .getByRole("heading", { name: "Second account program", exact: true })
      .first()
      .waitFor();
    delay = 0;
    await page.locator("main h1").waitFor();
    await page.reload();
    await page.locator("main h1").waitFor();
    role = "ADMIN";
    await go("/app");
    await page.locator("main h1").waitFor();
    role = "USER";
    await go(workoutPath.replace(ids.a, ids.b));
    await page
      .getByRole("heading", { name: "Goblet Squat", exact: true })
      .waitFor();
    levelError = { level: "workout", status: 403 };
    saveError = 403;
    await page.getByLabel("Reps", { exact: true }).fill("8");
    await page
      .getByRole("button", { name: "Complete Set", exact: true })
      .click();
    await page
      .getByText("This workout isn't available.", { exact: true })
      .waitFor();
    assert.equal(
      await page
        .getByRole("heading", { name: "Goblet Squat", exact: true })
        .count(),
      0,
    );
    levelError = null;
    saveError = 0;
    levelError = { level: "workout", status: 401 };
    await go(workoutPath);
    await page.waitForURL("**/login");
    levelError = null;
    signed = true;
    await go(workoutPath.replace(ids.a, ids.b));
    await page
      .getByRole("heading", { name: "Goblet Squat", exact: true })
      .waitFor();
    saveError = 401;
    await page.getByLabel("Reps", { exact: true }).fill("8");
    await page
      .getByRole("button", { name: "Complete Set", exact: true })
      .click();
    await page.waitForURL("**/login");
    assert.equal(await page.evaluate(() => localStorage.length), 0);
    console.log(
      "PASS loading/empty/error/denied/missing states, removed routes, cookie sessions, refresh, logout, USER/ADMIN and expired-session redirect",
    );
    // Timer regressions use the real component with a browser-controlled clock.
    signed = true;
    role = "USER";
    saveError = 0;
    attempts.clear();
    prescribedSets = 4;
    restSeconds = 30;
    await page.clock.install({ time: new Date(now) });
    await go(workoutPath);
    await page
      .getByRole("heading", { name: "Set tracking", exact: true })
      .waitFor();
    const restRegion = () =>
      page.getByRole("region", { name: "Rest timer", exact: true });
    async function savePending(number) {
      await page.getByLabel("Reps", { exact: true }).fill("8");
      await page.getByLabel("Weight (lb)", { exact: true }).fill("15");
      await page
        .getByRole("button", { name: "Complete Set", exact: true })
        .click();
      await page
        .getByRole("button", { name: `Edit set ${number}`, exact: true })
        .waitFor();
    }
    saveError = 500;
    await page.getByLabel("Reps", { exact: true }).fill("8");
    await page
      .getByRole("button", { name: "Complete Set", exact: true })
      .click();
    await page
      .getByText("We couldn't save this set. Check the values and try again.", {
        exact: true,
      })
      .waitFor();
    assert.equal(await restRegion().count(), 0);
    saveError = 0;
    await savePending(1);
    await restRegion()
      .getByRole("timer")
      .getByText("00:30", { exact: true })
      .waitFor();
    assert.equal(
      await restRegion().getByRole("timer").getAttribute("aria-live"),
      "off",
    );
    await restRegion()
      .getByRole("button", { name: "Skip rest", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    assert.equal(await restRegion().count(), 0);
    await page.getByRole("button", { name: "Edit set 1", exact: true }).click();
    await page.getByLabel("Reps", { exact: true }).fill("9");
    await page.getByRole("button", { name: "Update Set", exact: true }).click();
    await page.getByText("9 reps · 15 lb", { exact: true }).waitFor();
    assert.equal(await restRegion().count(), 0);
    await page.getByRole("button", { name: "Edit set 1", exact: true }).click();
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.equal(await restRegion().count(), 0);
    await savePending(2);
    await restRegion().getByText("00:30", { exact: true }).waitFor();
    await page.clock.fastForward(1000);
    await restRegion().getByText("00:29", { exact: true }).waitFor();
    await page.getByLabel("Reps", { exact: true }).fill("8");
    assert(
      await page
        .getByRole("button", { name: "Complete Set", exact: true })
        .isEnabled(),
    );
    await savePending(3);
    await restRegion().getByText("00:30", { exact: true }).waitFor();
    assert.equal(await restRegion().count(), 1);
    await page.clock.fastForward(30000);
    await restRegion().getByText("Rest complete", { exact: true }).waitFor();
    await restRegion()
      .getByRole("status")
      .getByText("Rest complete for Goblet Squat.", { exact: true })
      .waitFor();
    await restRegion()
      .getByRole("button", { name: "Dismiss rest", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    assert.equal(await restRegion().count(), 0);
    await savePending(4);
    await restRegion().getByText("00:30", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Next →", exact: true }).click();
    await page.getByText("Exercise 2 of 2", { exact: true }).waitFor();
    assert.equal(await restRegion().count(), 0);
    await savePending(1);
    await restRegion().getByText("00:45", { exact: true }).waitFor();
    await page.getByRole("button", { name: "← Previous", exact: true }).click();
    await page.getByText("Exercise 1 of 2", { exact: true }).waitFor();
    assert.equal(await restRegion().count(), 0);
    await page.getByRole("button", { name: "Next →", exact: true }).click();
    await page.getByText("Exercise 2 of 2", { exact: true }).waitFor();
    assert.equal(await restRegion().count(), 0);
    await savePending(2);
    await restRegion().getByText("00:45", { exact: true }).waitFor();
    await page.reload();
    await page
      .getByRole("heading", { name: "Set tracking", exact: true })
      .waitFor();
    assert.equal(await restRegion().count(), 0);
    for (const seconds of [null, 0, undefined]) {
      restSeconds = seconds;
      attempts.clear();
      await go(workoutPath);
      await page
        .getByRole("heading", { name: "Set tracking", exact: true })
        .waitFor();
      await savePending(1);
      assert.equal(await restRegion().count(), 0);
      assert(!(await page.locator("main").innerText()).includes("NaN"));
    }
    restSeconds = 45;
    prescribedSets = 2;
    for (const width of [1440, 1024, 768, 430, 393, 375]) {
      attempts.clear();
      await page.setViewportSize({ width, height: 1000 });
      await go(workoutPath);
      await page
        .getByRole("heading", { name: "Set tracking", exact: true })
        .waitFor();
      await savePending(1);
      await restRegion().getByText("00:45", { exact: true }).waitFor();
      await noOverflow();
      if (width === 1440 || width === 375)
        await restRegion().screenshot({
          path: `/tmp/member-rest-${width}.png`,
        });
      await page.getByRole("button", { name: "Next →", exact: true }).click();
      await page.getByText("Exercise 2 of 2", { exact: true }).waitFor();
      assert.equal(await restRegion().count(), 0);
    }
    assert.equal(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
      0,
    );
    console.log(
      "PASS rest timer: successful new saves only, failed/edit/cancel/absent exclusions, restart, completion, keyboard skip/dismiss, navigation cleanup and no refresh/storage persistence",
    );

    assert.deepEqual(pageErrors, []);
    console.log(
      "All Member audit browser checks passed. API responses were mocked.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

# F-MEMBER.1 — Member Final Audit

Based on `origin/main` at `4e8cce8`. Backend inspected read-only; no backend changes.

## Scope and findings

- MVP routes: `/app`, `/app/programs`, `/app/programs/:programId`, program week and workout routes. Exercises remain within the workout route. Removed Groups/Coaching links and placeholder pages/routes; unknown Member paths have a friendly not-found page.
- Removed the temporary labeled photo placeholders from Home, Program Overview and workout cards. No replacement photography or production content was invented.
- Normal USER login now lands on `/app`. ADMIN priority and the existing allowlisted public program return destination remain intact. Member query data is cleared at login/logout to avoid showing another account's cached training data.
- Queries stop retrying invalid/missing/denied/session requests. Missing routes and request failures use user-facing messages. A Member 401 expires the cached session and returns to Login. A forbidden training mutation refetches authoritative workout access.
- Set validation matches the existing backend request constraints: nonnegative 32-bit integer reps and nonnegative weight with six integer digits/two decimal places. Zero remains valid. Saving and completing continue to use the existing CSRF APIs and query invalidation.
- Workout UI state resets across distinct route/attempt IDs, including when library exercises are reused. Exercise navigation focuses the new heading and respects reduced-motion preference. Account-menu Escape closes and restores focus.
- Videos use existing HTTP(S) URLs only, native controls, inline playback and fixed responsive dimensions. Missing/invalid/broken sources have a neutral, non-playable state. No upload/storage or provider-specific embed behavior was added.
- Long Member content wraps without changing the approved visual system. Loading states announce status changes.

## Existing contract/product gaps (not silently implemented)

- **Week workout completion indicators:** `MemberProgramWorkoutSummaryResponse` exposes only `programWeekWorkoutId`, `name`, `description`, `position`. Completion is authoritative in workout detail (`startedAt`, `completedAt`), not week summaries. No fake pending/completed badges or extra fan-out queries were introduced.
- **Access history:** `findMyPrograms` returns active accesses to published programs only. Expired/revoked records are omitted, not distinguishable list entries. Direct denied reads remain protected by the backend and do not show cached training content.
- `videoUrl` is a URL field. Native playback requires a browser-supported media URL; arbitrary watch-page/provider URLs cannot be assumed to be playable files. They fall back on media failure.

## Validation and repeatability

`npm test`, `npm run lint`, `npm run build`.

`tests/member-audit.test.mjs` covers backend numeric boundaries and invalid set drafts. `tests/member-rest-timer.test.mjs` covers rest-duration validation, elapsed/background time, restart behavior and countdown formatting.

`tests/member-audit.browser.cjs` is an optional Playwright regression against a running Vite server. All auth and Member API responses are intercepted mocks matching the inspected contracts; it is not a live-backend certification. It covers the full journey, 1440/1024/768/430/393/375 widths, removed navigation, long text, set save/edit/cancel/failures, refresh, completion gating/review, videos, loading/empty/denied/missing/error states and cookie-session/logout behavior.

Example in the cloud workspace (no new application dependencies):

```bash
npm run dev -- --host 0.0.0.0 --port 5174 --strictPort
# In another terminal:
PLAYWRIGHT_MODULE=/opt/codex/cua_node/lib/node_modules/playwright-core \
  node tests/member-audit.browser.cjs
```

Outside this workspace provide `PLAYWRIGHT_MODULE` for an installed Playwright module and optionally `CHROMIUM_PATH`, `MEMBER_BASE_URL`. To include actual playback, set `MEMBER_VIDEO_FIXTURE` to a small valid WebM test fixture. Without it, playback is explicitly skipped and the failure fallback is tested. Test fixtures are not production assets.

Audit playback fixture used during validation:

```bash
ffmpeg -f lavfi -i color=c=gray:s=320x180:d=3 -c:v libvpx -an /tmp/member-audit-demo.webm
PLAYWRIGHT_MODULE=/opt/codex/cua_node/lib/node_modules/playwright-core \
  MEMBER_VIDEO_FIXTURE=/tmp/member-audit-demo.webm node tests/member-audit.browser.cjs
```

Backend responses and session state were simulated; no real account, access, purchase or training record was modified.

Physical iOS/Android playback and a live authenticated backend journey still require local validation with real accounts/data.

## Frontend rest timer follow-up

- Starts only after a successful new pending-set save with positive, finite `restSeconds`. Editing, cancelling, failed saves and completed-workout review do not start a timer.
- The compact set-tracking panel shows the exercise, countdown, Skip rest and a Rest complete / Dismiss rest state. Saving subsequent new sets restarts the full current prescription without blocking training.
- A single exercise-local deadline is checked against elapsed wall-clock time. Returning from background updates the remaining time; no second-by-second live announcements are made. Completion is announced politely.
- Changing exercise/workout routes unmounts the timer and cleans its interval/listener. Refresh does not restore it. There is no storage or backend persistence.
- The Member browser regression additionally checks start/failure/edit/cancel/missing/zero duration cases, restart, completed state, keyboard skip/dismiss, navigation cleanup, refresh behavior and active-timer overflow at all six widths.
- Week completion-summary and active-only access-list contract limitations above remain unchanged.
## Exact file manifest

```text
M	src/app/router/router.tsx
M	src/features/auth/components/LoginForm.tsx
M	src/features/auth/hooks/useLoginMutation.ts
M	src/features/auth/hooks/useLogoutMutation.ts
M	src/features/member/components/MemberExerciseCard.tsx
M	src/features/member/components/MemberHeader.tsx
M	src/features/member/components/MemberNavigation.tsx
D	src/features/member/components/MemberPhotoPlaceholder.tsx
M	src/features/member/components/MemberWorkoutCard.tsx
M	src/features/member/hooks/useCompleteMyWorkoutMutation.ts
M	src/features/member/hooks/useMyProgramQuery.ts
M	src/features/member/hooks/useMyProgramWeekQuery.ts
M	src/features/member/hooks/useMyProgramWorkoutQuery.ts
M	src/features/member/hooks/useMyProgramsQuery.ts
M	src/features/member/hooks/useSaveMyWorkoutSetMutation.ts
M	src/features/member/layouts/MemberLayout.tsx
D	src/features/member/pages/MemberCoachingPage.tsx
D	src/features/member/pages/MemberGroupsPage.tsx
M	src/features/member/pages/MemberHomePage.tsx
M	src/features/member/pages/MemberProgramOverviewPage.tsx
M	src/features/member/pages/MemberProgramsPage.tsx
M	src/features/member/pages/MemberWeekOverviewPage.tsx
M	src/features/member/pages/MemberWorkoutPage.tsx
M	src/features/member/types/memberProgram.ts
M	src/features/member/types/memberProgramWorkoutDetail.ts
A	docs/member-final-audit.md
A	src/features/member/components/MemberExerciseVideo.tsx
A	src/features/member/components/MemberRequestError.tsx
A	src/features/member/components/MemberRestTimer.tsx
A	src/features/member/hooks/useRestTimer.ts
A	src/features/member/pages/MemberNotFoundPage.tsx
A	src/features/member/utils/memberQueryRetry.ts
A	src/features/member/utils/restTimer.ts
A	src/features/member/utils/setDraft.ts
A	tests/member-audit.browser.cjs
A	tests/member-audit.test.mjs
A	tests/member-rest-timer.test.mjs
```

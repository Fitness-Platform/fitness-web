import test from "node:test";
import assert from "node:assert/strict";
import {
  createRestTimer,
  remainingRestSeconds,
  formatRestCountdown,
} from "../src/features/member/utils/restTimer.ts";

test("rest starts only for a usable positive duration", () => {
  for (const seconds of [null, undefined, 0, -1, NaN, Infinity])
    assert.equal(createRestTimer(seconds, 1000), null);
  assert.deepEqual(createRestTimer(45, 1000), {
    deadline: 46000,
    remaining: 45,
  });
});
test("countdown uses elapsed time, including delayed/background ticks, and stops at zero", () => {
  assert.equal(remainingRestSeconds(46000, 1000), 45);
  assert.equal(remainingRestSeconds(46000, 1500), 45);
  assert.equal(remainingRestSeconds(46000, 2000), 44);
  assert.equal(remainingRestSeconds(46000, 46000), 0);
  assert.equal(remainingRestSeconds(46000, 99000), 0);
});
test("another successful new set restarts the full prescribed interval", () => {
  const first = createRestTimer(45, 1000),
    restarted = createRestTimer(45, 11000);
  assert.equal(remainingRestSeconds(first.deadline, 11000), 35);
  assert.equal(remainingRestSeconds(restarted.deadline, 11000), 45);
});
test("countdown labels use readable minutes and seconds", () => {
  assert.equal(formatRestCountdown(45), "00:45");
  assert.equal(formatRestCountdown(90), "01:30");
  assert.equal(formatRestCountdown(0), "00:00");
});

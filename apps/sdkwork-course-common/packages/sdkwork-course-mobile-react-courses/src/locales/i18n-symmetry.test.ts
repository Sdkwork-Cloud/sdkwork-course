import assert from "node:assert/strict";
import test from "node:test";

import zhCourse from "../locales/zh/course.json";
import enCourse from "../locales/en/course.json";

test("course locale bundles stay symmetric across languages", () => {
  const zhKeys = Object.keys(zhCourse).sort();
  const enKeys = Object.keys(enCourse).sort();

  assert.deepEqual(
    zhKeys.filter((key) => !enKeys.includes(key)),
    [],
    "zh-only keys must have an en translation",
  );
  assert.deepEqual(
    enKeys.filter((key) => !zhKeys.includes(key)),
    [],
    "en-only keys must have a zh translation",
  );
  assert.equal(zhKeys.length, enKeys.length);
});

test("course locale bundles carry no empty or template-fragment values", () => {
  for (const [locale, bundle] of [
    ["zh", zhCourse],
    ["en", enCourse],
  ] as const) {
    for (const [key, value] of Object.entries(bundle)) {
      assert.ok(
        typeof value === "string" && value.trim().length > 0,
        `${locale}.${key} must be a non-empty string`,
      );
    }
  }
});

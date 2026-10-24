import test from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../src/detector.ts";

test("flags urgent credential and payment phishing as high risk", () => {
  const result = analyze(
    "URGENT: Your bank account will be suspended. Share your OTP and pay a processing fee at https://bad.example",
  );
  assert.equal(result.level, "High");
  assert.equal(result.category, "Credential theft");
  assert.ok(result.indicators.includes("Credential or OTP request"));
  assert.ok(result.indicators.includes("Suspicious link"));
});

test("keeps a normal conversational message low risk", () => {
  const result = analyze("Hi, I sent the notes from class. See you tomorrow!");
  assert.equal(result.level, "Low");
  assert.equal(result.risk, 0);
  assert.equal(result.indicators.length, 0);
});

test("marks empty content uncertain", () => {
  const result = analyze("");
  assert.equal(result.level, "Uncertain");
  assert.equal(result.risk, 0);
});

test("labels possible prize lures as medium risk", () => {
  const result = analyze(
    "You won a prize! Pay a processing fee to claim your reward.",
  );
  assert.equal(result.category, "Fake reward");
  assert.equal(result.level, "Medium");
});

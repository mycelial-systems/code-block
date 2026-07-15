# Demo Accessibility Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Make the example page structurally accessible and ensure its
syntax-highlighted code meets normal-text contrast expectations.

**Architecture:** Keep Prism's generated stylesheet unchanged. Add
demo-owned custom properties and token overrides in `example/style.css`,
then use semantic `main` and one descriptive `h1` in `example/index.html`.
Exercise the result in Chromium through the existing tapout test harness.

**Tech Stack:** HTML, CSS custom properties, TypeScript, Chromium, tapout.

---

### Task 1: Add failing browser coverage

**Files:**

- Modify: `test/index.ts`
- Test: `test/index.ts`

**Steps:**

1. Import the demo stylesheet as text.
2. Add a Chromium test that asserts one `main`, one `h1`, and the demo's
   CSS variables/token overrides.
3. Add narrow-container assertions for no horizontal page overflow.
4. Run the targeted test and verify it fails because the demo is unchanged.

### Task 2: Implement semantic structure and contrast styling

**Files:**

- Modify: `example/index.html`
- Modify: `example/style.css`

**Steps:**

1. Wrap the demo content in a `main` landmark and add a single descriptive
   `h1` before the explanatory paragraphs.
2. Define all demo-owned colors as root custom properties.
3. Apply the variables to page text, links, code background, code text,
   selection, and copy-button focus styles.
4. Override Prism token colors with accessible values using the variables.
5. Keep the generated Prism file and its formatting unchanged.

### Task 3: Verify and close the story

**Files:**

- Modify: `progress.log`
- Modify: `specs/prd.json`

**Steps:**

1. Run the targeted browser test and confirm it passes.
2. Run `npm run lint` and fix any findings.
3. Run `npm test` as the final gate.
4. Mark US-007 as passing and append the required progress entry.
5. Commit with a descriptive US-007 message.

# Progressive Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep plain-text and SSR-rendered code visible before the custom
element is defined or JavaScript finishes loading.

**Architecture:** Remove the CSS-only visibility gate from the public
`code-block` host. The existing semantic HTML remains the fallback: plain
text stays in the host before upgrade, and SSR markup remains in normal
document flow before hydration. Add a browser regression test that creates an
undefined host and asserts its text is present and not hidden by the shipped
stylesheet.

**Tech Stack:** TypeScript, native custom elements, CSS nesting, esbuild,
Chromium via tapout, ESLint, TypeScript.

---

### Task 1: Preserve the pre-upgrade fallback

**Files:**
- Modify: `src/index.css`
- Test: `test/index.ts`
- Modify: `specs/prd.json`
- Modify: `progress.log`

**Step 1: Write the failing browser test**

Add a test that creates a `code-block` element without defining the custom
element, inserts plain code text, appends it to the document, and verifies the
text remains readable. Include an SSR-rendered child fixture and verify its
`pre` remains in the document before the custom element is upgraded.

**Step 2: Run the focused test to verify it fails**

Run: `npm test`

Expected: the new visibility assertion fails because `src/index.css` applies
`visibility: hidden` to `code-block:not(:defined)`.

**Step 3: Write the minimal implementation**

Remove only the `code-block:not(:defined)` visibility rule from
`src/index.css`. Keep the host as `display: block` and leave the SSR/client
rendering behavior unchanged.

**Step 4: Run the focused test to verify it passes**

Run: `npm test`

Expected: all browser tests pass, including the pre-upgrade visibility test.

**Step 5: Run required quality checks**

Run: `npm run lint`, `npm run build`, and `npm test`.

Expected: each command exits successfully with no lint, typecheck, build, or
browser-test failures.

**Step 6: Record the completed task**

Append the dated US-004 entry to `progress.log`, add a reusable pattern to
the top section only if one was discovered, and set `passes` to `true` for
US-004 in `specs/prd.json`.

**Step 7: Commit**

Run:

```sh
git add src/index.css test/index.ts specs/prd.json progress.log
git commit -m "FEATURE: US-004 - preserve progressive enhancement"
```

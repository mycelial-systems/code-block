# CI Audit Checks Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use
> superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make CI repeatably check project CSS, TypeScript, package exports,
and the demo page's WCAG AA accessibility.

**Architecture:** Keep the existing tapout browser harness and add a focused
`test/a11y.ts` entry point that loads the shipped demo markup and styles, then
runs tapout's Axe helper. Expose the checks as package scripts and call them
from the existing Node CI workflow. Add `package-lock.json` so CI can use
`npm ci` with reproducible dependency resolution.

**Tech Stack:** npm scripts, GitHub Actions, TypeScript, esbuild, tapout,
Playwright/Chromium, axe-core, and stylelint.

## Design

The browser accessibility check will scan the demo document at WCAG AA using
`assertWCAGCompliance` from `@substrate-system/tapout/axe.js`. It will use the
same demo HTML, package CSS, and demo CSS that are shipped to users, and will
include SSR-rendered code-block markup so the copy control is covered.

The CI workflow will install with `npm ci`, build the package, run ESLint,
project-owned stylelint, TypeScript no-emit checking, the package-export smoke
check, the dedicated accessibility test, and the existing full browser test.
Vendored Prism output remains outside the stylelint glob because it is not
project-owned source.

## Implementation Plan

### Task 1: Add a focused demo accessibility test

**Files:**
- Create: `test/a11y.ts`

Write a browser test that loads `example/index.html` content, appends SSR code
block markup, loads `example/style.css` and `src/index.css`, runs WCAG AA Axe
checks, and marks the browser test complete.

Run it through the existing esbuild and tapout commands. It should pass before
moving on to CI wiring.

### Task 2: Expose repeatable local quality scripts

**Files:**
- Modify: `package.json`
- Create: `package-lock.json`

Add scripts for project-owned stylelint, TypeScript no-emit checking, the
focused accessibility bundle/test, and package-export smoke checking. Use
`npm install --package-lock-only` to create the lockfile, then verify the
scripts locally.

### Task 3: Wire all checks into GitHub Actions

**Files:**
- Modify: `.github/workflows/nodejs.yml`

Switch CI installation to `npm ci`, install Playwright browser dependencies,
and run the quality scripts and browser tests as separate named steps.

### Task 4: Verify and document

Run targeted accessibility tests after each change, then run `npm run lint`,
the project-owned stylelint command, typecheck, package-export smoke check,
the full test suite, and the production example build. Append the result to
`progress.log`, set US-008 to `passes: true`, inspect modified directories for
reusable `AGENTS.md` guidance, and commit the completed story.


# Minified CommonJS Exports Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build every minified CommonJS entry point advertised by the package
exports map and verify that each one can be required successfully.

**Architecture:** Reuse the existing esbuild CJS entry-point pattern and add a
minification variant that writes `.min.cjs` files beside the ESM minified
files. Add a small Node smoke script that reads the package export targets,
resolves their concrete files, and requires each JavaScript target after a
build.

**Tech Stack:** npm scripts, esbuild, Node.js, TypeScript package sources.

---

### Task 1: Add the failing package export smoke test

**Files:**
- Create: `test/package-exports.cjs`
- Modify: `package.json`

**Step 1: Write the failing test**

Create a Node script that checks the package root and each concrete minified
JavaScript entry point advertised by `exports["./min/*"].require`. Require
the generated files and fail with a useful message when a target is absent or
cannot load. Add an npm script named `test:package-exports`.

**Step 2: Run test to verify it fails**

Run: `npm run test:package-exports`

Expected: FAIL because `dist/index.min.cjs` is not currently generated.

**Step 3: Commit**

```bash
git add package.json test/package-exports.cjs
git commit -m "TEST: US-002 - check minified CommonJS exports"
```

### Task 2: Build minified CommonJS outputs

**Files:**
- Modify: `package.json`

**Step 1: Write minimal implementation**

Add a `build-cjs:min` script using esbuild with the existing CJS format,
build tsconfig, bundling, minification, and `.min.cjs` output extension.
Include it in the main `build` pipeline after the regular CJS build.

**Step 2: Run targeted verification**

Run: `npm run build-cjs:min && npm run test:package-exports`

Expected: PASS and `dist/index.min.cjs` exists.

### Task 3: Run project gates and mark US-002 complete

**Files:**
- Modify: `specs/prd.json`
- Modify: `progress.log`

**Step 1: Run final checks**

Run: `npm run lint`

Run: `npm test`

Run: `npm run build && npm run test:package-exports`

Expected: all commands pass and all advertised minified CommonJS files load.

**Step 2: Update task state and progress**

Set US-002 `passes` to `true` and append the required dated progress entry,
including the export-map and build-pipeline pattern for future work.

**Step 3: Commit**

```bash
git add package.json test/package-exports.cjs specs/prd.json progress.log
git commit -m "FEATURE: US-002 - build minified CommonJS exports"
```
